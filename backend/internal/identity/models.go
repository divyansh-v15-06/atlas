package identity

import "time"

type User struct {
	ID           string     `json:"id"`
	Email        string     `json:"email"`
	PasswordHash string     `json:"-"`
	FullName     string     `json:"full_name"`
	IsActive     bool       `json:"is_active"`
	FirstLogin   bool       `json:"first_login"`
	LastLoginAt  *time.Time `json:"last_login_at"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}

type Role struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type UserDTO struct {
	ID               string     `json:"id"`
	Email            string     `json:"email"`
	FullName         string     `json:"full_name"`
	IsActive         bool       `json:"is_active"`
	FirstLogin       bool       `json:"first_login"`
	LastLoginAt      *time.Time `json:"last_login_at"`
	Roles            []string   `json:"roles"`
	DepartmentScopes []string   `json:"department_scopes"`
	FacultyID        *string    `json:"faculty_id,omitempty"`
}

type LoginRequest struct {
	Email      string `json:"email"`
	Identifier string `json:"identifier"`
	Password   string `json:"password" validate:"required,min=6"`
}

type LoginResponse struct {
	Token string   `json:"token"`
	User  *UserDTO `json:"user"`
}

type ChangePasswordRequest struct {
	OldPassword string `json:"old_password" validate:"required"`
	NewPassword string `json:"new_password" validate:"required,min=8"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email" validate:"required,email"`
}

type ResetPasswordRequest struct {
	Token       string `json:"token" validate:"required"`
	NewPassword string `json:"new_password" validate:"required,min=8"`
}
