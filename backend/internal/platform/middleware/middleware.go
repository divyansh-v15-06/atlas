package middleware

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/institute-portal/backend/internal/platform/httperr"
	"github.com/institute-portal/backend/internal/platform/logger"
	"github.com/institute-portal/backend/internal/platform/response"
)

type contextKey string

const (
	AuthUserKey contextKey = "auth_user"
)

type AuthUser struct {
	UserID           string   `json:"user_id"`
	Email            string   `json:"email"`
	Roles            []string `json:"roles"`
	DepartmentScopes []string `json:"department_scopes"`
}

func (u *AuthUser) HasRole(roles ...string) bool {
	for _, targetRole := range roles {
		for _, userRole := range u.Roles {
			if strings.EqualFold(userRole, targetRole) {
				return true
			}
		}
	}
	return false
}

func (u *AuthUser) HasDepartmentScope(deptID string) bool {
	if u.HasRole("INSTITUTE_ADMIN", "RESEARCH_OFFICE") {
		return true
	}
	for _, scopedDept := range u.DepartmentScopes {
		if strings.EqualFold(scopedDept, deptID) {
			return true
		}
	}
	return false
}

func RequestID(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		reqID := r.Header.Get("X-Request-ID")
		if reqID == "" {
			reqID = uuid.New().String()
		}
		w.Header().Set("X-Request-ID", reqID)
		ctx := context.WithValue(r.Context(), logger.RequestIDKey, reqID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

type statusResponseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (rw *statusResponseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

func StructuredLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		srw := &statusResponseWriter{ResponseWriter: w, statusCode: http.StatusOK}

		next.ServeHTTP(srw, r)

		latency := time.Since(start)
		log := logger.FromContext(r.Context())
		log.Info("HTTP Request",
			"method", r.Method,
			"path", r.URL.Path,
			"status", srw.statusCode,
			"latency_ms", latency.Milliseconds(),
			"client_ip", r.RemoteAddr,
		)
	})
}

func Recoverer(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if rec := recover(); rec != nil {
				log := logger.FromContext(r.Context())
				log.Error("Panic recovered", "panic", rec)
				response.Error(w, r, httperr.Internal("Internal server error"))
			}
		}()
		next.ServeHTTP(w, r)
	})
}

func Authenticate(jwtSecret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				response.Error(w, r, httperr.Unauthorized("Missing Authorization header"))
				return
			}

			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
				response.Error(w, r, httperr.Unauthorized("Invalid Authorization header format. Expected Bearer <token>"))
				return
			}

			tokenStr := parts[1]
			token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (any, error) {
				if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, httperr.Unauthorized("Invalid signing algorithm")
				}
				return []byte(jwtSecret), nil
			})

			if err != nil || !token.Valid {
				response.Error(w, r, httperr.Unauthorized("Invalid or expired authentication token"))
				return
			}

			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				response.Error(w, r, httperr.Unauthorized("Malformed token claims"))
				return
			}

			userID, _ := claims["sub"].(string)
			email, _ := claims["email"].(string)

			var roles []string
			if rawRoles, ok := claims["roles"].([]any); ok {
				for _, r := range rawRoles {
					if strR, ok := r.(string); ok {
						roles = append(roles, strR)
					}
				}
			}

			var deptScopes []string
			if rawScopes, ok := claims["department_scopes"].([]any); ok {
				for _, s := range rawScopes {
					if strS, ok := s.(string); ok {
						deptScopes = append(deptScopes, strS)
					}
				}
			}

			authUser := &AuthUser{
				UserID:           userID,
				Email:            email,
				Roles:            roles,
				DepartmentScopes: deptScopes,
			}

			ctx := context.WithValue(r.Context(), AuthUserKey, authUser)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func OptionalAuthenticate(jwtSecret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				next.ServeHTTP(w, r)
				return
			}

			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) == 2 && strings.EqualFold(parts[0], "Bearer") {
				tokenStr := parts[1]
				token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (any, error) {
					if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
						return nil, httperr.Unauthorized("Invalid signing algorithm")
					}
					return []byte(jwtSecret), nil
				})
				if err == nil && token.Valid {
					if claims, ok := token.Claims.(jwt.MapClaims); ok {
						userID, _ := claims["sub"].(string)
						email, _ := claims["email"].(string)
						var roles []string
						if rawRoles, ok := claims["roles"].([]any); ok {
							for _, r := range rawRoles {
								if strR, ok := r.(string); ok {
									roles = append(roles, strR)
								}
							}
						}
						var deptScopes []string
						if rawScopes, ok := claims["department_scopes"].([]any); ok {
							for _, s := range rawScopes {
								if strS, ok := s.(string); ok {
									deptScopes = append(deptScopes, strS)
								}
							}
						}
						ctx := context.WithValue(r.Context(), AuthUserKey, &AuthUser{
							UserID:           userID,
							Email:            email,
							Roles:            roles,
							DepartmentScopes: deptScopes,
						})
						next.ServeHTTP(w, r.WithContext(ctx))
						return
					}
				}
			}
			next.ServeHTTP(w, r)
		})
	}
}

func RequireRoles(allowedRoles ...string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authUser, ok := r.Context().Value(AuthUserKey).(*AuthUser)
			if !ok || authUser == nil {
				response.Error(w, r, httperr.Unauthorized("Authentication required"))
				return
			}

			if !authUser.HasRole(allowedRoles...) {
				response.Error(w, r, httperr.Forbidden("You do not have the required permissions to perform this action"))
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func RequireDepartmentScope(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authUser, ok := r.Context().Value(AuthUserKey).(*AuthUser)
		if !ok || authUser == nil {
			response.Error(w, r, httperr.Unauthorized("Authentication required"))
			return
		}

		deptID := chi.URLParam(r, "departmentId")
		if deptID == "" {
			deptID = r.URL.Query().Get("department_id")
		}

		if deptID != "" && !authUser.HasDepartmentScope(deptID) {
			response.Error(w, r, httperr.Forbidden("You are not authorized to access or mutate records for this department"))
			return
		}

		next.ServeHTTP(w, r)
	})
}

func GetAuthUser(ctx context.Context) *AuthUser {
	if u, ok := ctx.Value(AuthUserKey).(*AuthUser); ok {
		return u
	}
	return nil
}

type IPRateLimiter struct {
	sync.Mutex
	requests map[string][]time.Time
	limit    int
	window   time.Duration
}

func NewIPRateLimiter(limit int, window time.Duration) *IPRateLimiter {
	limiter := &IPRateLimiter{
		requests: make(map[string][]time.Time),
		limit:    limit,
		window:   window,
	}
	go func() {
		for {
			time.Sleep(5 * time.Minute)
			limiter.Lock()
			cutoff := time.Now().Add(-window)
			for ip, times := range limiter.requests {
				var valid []time.Time
				for _, t := range times {
					if t.After(cutoff) {
						valid = append(valid, t)
					}
				}
				if len(valid) == 0 {
					delete(limiter.requests, ip)
				} else {
					limiter.requests[ip] = valid
				}
			}
			limiter.Unlock()
		}
	}()
	return limiter
}

func (limiter *IPRateLimiter) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := r.Header.Get("X-Real-IP")
		if ip == "" {
			ip = r.Header.Get("X-Forwarded-For")
		}
		if ip == "" {
			ip = r.RemoteAddr
		}
		if strings.Contains(ip, ",") {
			parts := strings.Split(ip, ",")
			ip = parts[0]
		}
		if strings.Contains(ip, ":") {
			parts := strings.Split(ip, ":")
			ip = parts[0]
		}
		ip = strings.TrimSpace(ip)

		now := time.Now()
		cutoff := now.Add(-limiter.window)

		limiter.Lock()
		times := limiter.requests[ip]
		var valid []time.Time
		for _, t := range times {
			if t.After(cutoff) {
				valid = append(valid, t)
			}
		}

		if len(valid) >= limiter.limit {
			limiter.Unlock()
			w.Header().Set("Retry-After", fmt.Sprintf("%d", int(limiter.window.Seconds())))
			response.Error(w, r, httperr.New(http.StatusTooManyRequests, "TOO_MANY_REQUESTS", "Too many attempts. Please wait a minute and try again."))
			return
		}

		valid = append(valid, now)
		limiter.requests[ip] = valid
		limiter.Unlock()

		next.ServeHTTP(w, r)
	})
}
