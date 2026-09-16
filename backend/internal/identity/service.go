package identity

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/institute-portal/backend/internal/platform/httperr"
	"github.com/institute-portal/backend/internal/platform/mailer"
	"golang.org/x/crypto/bcrypt"
)

type Service interface {
	Login(ctx context.Context, req *LoginRequest) (*LoginResponse, error)
	GetMe(ctx context.Context, userID string) (*UserDTO, error)
	ChangePassword(ctx context.Context, userID string, req *ChangePasswordRequest) error
	ForgotPassword(ctx context.Context, req *ForgotPasswordRequest) (string, error)
	ResetPassword(ctx context.Context, req *ResetPasswordRequest) error
}

type service struct {
	repo               Repository
	jwtSecret          string
	jwtExpirationHours int
	mailer             *mailer.Mailer
	frontendURL        string
}

func NewService(repo Repository, jwtSecret string, jwtExpirationHours int, m *mailer.Mailer, frontendURL string) Service {
	return &service{
		repo:               repo,
		jwtSecret:          jwtSecret,
		jwtExpirationHours: jwtExpirationHours,
		mailer:             m,
		frontendURL:        frontendURL,
	}
}

func (s *service) Login(ctx context.Context, req *LoginRequest) (*LoginResponse, error) {
	loginID := req.Email
	if loginID == "" {
		loginID = req.Identifier
	}
	if loginID == "" {
		return nil, httperr.BadRequest("Email or faculty code is required")
	}

	user, err := s.repo.GetByIdentifier(ctx, loginID)
	if err != nil {
		return nil, err
	}
	if user == nil || !user.IsActive {
		return nil, httperr.Unauthorized("Invalid email or password")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, httperr.Unauthorized("Invalid email or password")
	}

	roles, err := s.repo.GetRolesByUserID(ctx, user.ID)
	if err != nil {
		return nil, err
	}

	deptScopes, err := s.repo.GetDepartmentScopesByUserID(ctx, user.ID)
	if err != nil {
		return nil, err
	}

	facultyID, _ := s.repo.GetFacultyIDByUserID(ctx, user.ID)

	_ = s.repo.UpdateLastLogin(ctx, user.ID)

	token, err := s.generateJWT(user, roles, deptScopes)
	if err != nil {
		return nil, httperr.Internal("Failed to generate token")
	}

	userDTO := &UserDTO{
		ID:               user.ID,
		Email:            user.Email,
		FullName:         user.FullName,
		IsActive:         user.IsActive,
		FirstLogin:       user.FirstLogin,
		LastLoginAt:      user.LastLoginAt,
		Roles:            roles,
		DepartmentScopes: deptScopes,
		FacultyID:        facultyID,
	}

	return &LoginResponse{
		Token: token,
		User:  userDTO,
	}, nil
}

func (s *service) GetMe(ctx context.Context, userID string) (*UserDTO, error) {
	user, err := s.repo.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, httperr.NotFound("User not found")
	}

	roles, err := s.repo.GetRolesByUserID(ctx, user.ID)
	if err != nil {
		return nil, err
	}

	deptScopes, err := s.repo.GetDepartmentScopesByUserID(ctx, user.ID)
	if err != nil {
		return nil, err
	}

	facultyID, _ := s.repo.GetFacultyIDByUserID(ctx, user.ID)

	return &UserDTO{
		ID:               user.ID,
		Email:            user.Email,
		FullName:         user.FullName,
		IsActive:         user.IsActive,
		FirstLogin:       user.FirstLogin,
		LastLoginAt:      user.LastLoginAt,
		Roles:            roles,
		DepartmentScopes: deptScopes,
		FacultyID:        facultyID,
	}, nil
}

func (s *service) ChangePassword(ctx context.Context, userID string, req *ChangePasswordRequest) error {
	user, err := s.repo.GetByID(ctx, userID)
	if err != nil {
		return err
	}
	if user == nil {
		return httperr.NotFound("User not found")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.OldPassword)); err != nil {
		return httperr.BadRequest("Incorrect current password")
	}

	newHash, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return httperr.Internal("Failed to process new password")
	}

	return s.repo.UpdatePassword(ctx, userID, string(newHash))
}

func (s *service) ForgotPassword(ctx context.Context, req *ForgotPasswordRequest) (string, error) {
	user, err := s.repo.GetByEmail(ctx, req.Email)
	if err != nil {
		return "", err
	}
	if user == nil {
		// Silent success to prevent email enumeration
		return "", nil
	}

	rawToken := uuid.New().String() + uuid.New().String()
	hasher := sha256.New()
	hasher.Write([]byte(rawToken))
	tokenHash := hex.EncodeToString(hasher.Sum(nil))

	expiresAt := time.Now().Add(1 * time.Hour)
	if err := s.repo.CreatePasswordReset(ctx, user.ID, tokenHash, expiresAt); err != nil {
		return "", err
	}

	// Send real email if SMTP is configured
	if s.mailer != nil && s.mailer.IsConfigured() {
		resetURL := fmt.Sprintf("%s/reset-password/%s", s.frontendURL, rawToken)
		toName := user.FullName
		if toName == "" {
			toName = user.Email
		}
		// Fire-and-forget — don't block the HTTP response on email delivery
		go func() {
			if emailErr := s.mailer.SendPasswordReset(user.Email, toName, resetURL); emailErr != nil {
				_ = emailErr
			}
		}()
	}

	return "", nil
}

func (s *service) ResetPassword(ctx context.Context, req *ResetPasswordRequest) error {
	hasher := sha256.New()
	hasher.Write([]byte(req.Token))
	tokenHash := hex.EncodeToString(hasher.Sum(nil))

	userID, expiresAt, used, err := s.repo.GetPasswordReset(ctx, tokenHash)
	if err != nil {
		return err
	}
	if userID == "" || used || time.Now().After(expiresAt) {
		return httperr.BadRequest("Invalid or expired password reset token")
	}

	newHash, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return httperr.Internal("Failed to process password")
	}

	if err := s.repo.UpdatePassword(ctx, userID, string(newHash)); err != nil {
		return err
	}

	return s.repo.MarkPasswordResetUsed(ctx, tokenHash)
}

func (s *service) generateJWT(user *User, roles, deptScopes []string) (string, error) {
	claims := jwt.MapClaims{
		"sub":               user.ID,
		"email":             user.Email,
		"name":              user.FullName,
		"roles":             roles,
		"department_scopes": deptScopes,
		"iat":               time.Now().Unix(),
		"exp":               time.Now().Add(time.Duration(s.jwtExpirationHours) * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtSecret))
}
