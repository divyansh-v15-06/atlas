package identity_test

import (
	"context"
	"testing"
	"time"

	"github.com/institute-portal/backend/internal/identity"
	"github.com/institute-portal/backend/internal/platform/validator"
	"golang.org/x/crypto/bcrypt"
)

type mockIdentityRepo struct {
	user *identity.User
}

func (m *mockIdentityRepo) GetByEmail(ctx context.Context, email string) (*identity.User, error) {
	if m.user != nil && m.user.Email == email {
		return m.user, nil
	}
	return nil, nil
}

func (m *mockIdentityRepo) GetByIdentifier(ctx context.Context, identifier string) (*identity.User, error) {
	return m.GetByEmail(ctx, identifier)
}

func (m *mockIdentityRepo) GetByID(ctx context.Context, id string) (*identity.User, error) {
	if m.user != nil && m.user.ID == id {
		return m.user, nil
	}
	return nil, nil
}

func (m *mockIdentityRepo) GetRolesByUserID(ctx context.Context, userID string) ([]string, error) {
	return []string{"INSTITUTE_ADMIN", "FACULTY"}, nil
}

func (m *mockIdentityRepo) GetDepartmentScopesByUserID(ctx context.Context, userID string) ([]string, error) {
	return []string{"dept-123"}, nil
}

func (m *mockIdentityRepo) GetFacultyIDByUserID(ctx context.Context, userID string) (*string, error) {
	facID := "fac-uuid-1"
	return &facID, nil
}

func (m *mockIdentityRepo) UpdatePassword(ctx context.Context, userID, newHash string) error {
	if m.user != nil {
		m.user.PasswordHash = newHash
	}
	return nil
}

func (m *mockIdentityRepo) UpdateLastLogin(ctx context.Context, userID string) error {
	return nil
}

func (m *mockIdentityRepo) CreatePasswordReset(ctx context.Context, userID, tokenHash string, expiresAt time.Time) error {
	return nil
}

func (m *mockIdentityRepo) GetPasswordReset(ctx context.Context, tokenHash string) (string, time.Time, bool, error) {
	return "", time.Time{}, false, nil
}

func (m *mockIdentityRepo) MarkPasswordResetUsed(ctx context.Context, tokenHash string) error {
	return nil
}

func TestLoginValidation(t *testing.T) {
	req := identity.LoginRequest{
		Email:    "invalid-email",
		Password: "123",
	}
	err := validator.Validate(req)
	if err == nil {
		t.Fatal("expected validation error for invalid email and short password")
	}

	validReq := identity.LoginRequest{
		Email:    "admin@nith.ac.in",
		Password: "secretpassword",
	}
	if err := validator.Validate(validReq); err != nil {
		t.Fatalf("expected valid request, got: %v", err)
	}
}

func TestPasswordHashingAndLogin(t *testing.T) {
	password := "SecretPass123"
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		t.Fatalf("failed to hash password: %v", err)
	}

	user := &identity.User{
		ID:           "test-user-1",
		Email:        "user@nith.ac.in",
		PasswordHash: string(hash),
		FullName:     "Test User",
		IsActive:     true,
	}

	repo := &mockIdentityRepo{user: user}
	svc := identity.NewService(repo, "test-jwt-secret-key-32-characters-min", 24, nil, "http://localhost:3000")

	// Correct password
	resp, err := svc.Login(context.Background(), &identity.LoginRequest{
		Email:    "user@nith.ac.in",
		Password: password,
	})
	if err != nil {
		t.Fatalf("expected successful login, got: %v", err)
	}
	if resp.Token == "" || resp.User.Email != "user@nith.ac.in" {
		t.Fatalf("unexpected login response: %+v", resp)
	}

	// Wrong password
	_, err = svc.Login(context.Background(), &identity.LoginRequest{
		Email:    "user@nith.ac.in",
		Password: "WrongPassword!",
	})
	if err == nil {
		t.Fatal("expected unauthorized error for incorrect password")
	}
}
