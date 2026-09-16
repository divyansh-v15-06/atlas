package identity

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/institute-portal/backend/internal/platform/httperr"
	"github.com/institute-portal/backend/internal/platform/middleware"
	"github.com/institute-portal/backend/internal/platform/response"
	"github.com/institute-portal/backend/internal/platform/validator"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) RegisterRoutes(r chi.Router, authMiddleware func(http.Handler) http.Handler, rateLimitMiddleware ...func(http.Handler) http.Handler) {
	r.Route("/api/v1/auth", func(r chi.Router) {
		r.Group(func(r chi.Router) {
			for _, rl := range rateLimitMiddleware {
				r.Use(rl)
			}
			r.Post("/login", h.Login)
			r.Post("/forgot-password", h.ForgotPassword)
			r.Post("/reset-password", h.ResetPassword)
		})

		r.Group(func(r chi.Router) {
			r.Use(authMiddleware)
			r.Get("/me", h.GetMe)
			r.Post("/change-password", h.ChangePassword)
		})
	})
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}

	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}

	resp, err := h.service.Login(r.Context(), &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.JSON(w, http.StatusOK, resp)
}

func (h *Handler) GetMe(w http.ResponseWriter, r *http.Request) {
	authUser := middleware.GetAuthUser(r.Context())
	if authUser == nil {
		response.Error(w, r, httperr.Unauthorized("Authentication required"))
		return
	}

	userDTO, err := h.service.GetMe(r.Context(), authUser.UserID)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.JSON(w, http.StatusOK, userDTO)
}

func (h *Handler) ChangePassword(w http.ResponseWriter, r *http.Request) {
	authUser := middleware.GetAuthUser(r.Context())
	if authUser == nil {
		response.Error(w, r, httperr.Unauthorized("Authentication required"))
		return
	}

	var req ChangePasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}

	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}

	if err := h.service.ChangePassword(r.Context(), authUser.UserID, &req); err != nil {
		response.Error(w, r, err)
		return
	}

	response.JSON(w, http.StatusOK, map[string]string{"message": "Password updated successfully"})
}

func (h *Handler) ForgotPassword(w http.ResponseWriter, r *http.Request) {
	var req ForgotPasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}

	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}

	_, err := h.service.ForgotPassword(r.Context(), &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.JSON(w, http.StatusOK, map[string]any{
		"message": "If the email is registered, a password reset link has been dispatched.",
	})
}

func (h *Handler) ResetPassword(w http.ResponseWriter, r *http.Request) {
	var req ResetPasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}

	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}

	if err := h.service.ResetPassword(r.Context(), &req); err != nil {
		response.Error(w, r, err)
		return
	}

	response.JSON(w, http.StatusOK, map[string]string{"message": "Password reset successfully. You can now login with your new password."})
}
