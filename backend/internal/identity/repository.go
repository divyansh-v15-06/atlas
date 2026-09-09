package identity

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	GetByEmail(ctx context.Context, email string) (*User, error)
	GetByIdentifier(ctx context.Context, identifier string) (*User, error)
	GetByID(ctx context.Context, id string) (*User, error)
	GetRolesByUserID(ctx context.Context, userID string) ([]string, error)
	GetDepartmentScopesByUserID(ctx context.Context, userID string) ([]string, error)
	GetFacultyIDByUserID(ctx context.Context, userID string) (*string, error)
	UpdatePassword(ctx context.Context, userID, newHash string) error
	UpdateLastLogin(ctx context.Context, userID string) error
	CreatePasswordReset(ctx context.Context, userID, tokenHash string, expiresAt time.Time) error
	GetPasswordReset(ctx context.Context, tokenHash string) (string, time.Time, bool, error)
	MarkPasswordResetUsed(ctx context.Context, tokenHash string) error
}

type pgRepository struct {
	pool *pgxpool.Pool
}

func NewRepository(pool *pgxpool.Pool) Repository {
	return &pgRepository{pool: pool}
}

func (r *pgRepository) GetByEmail(ctx context.Context, email string) (*User, error) {
	return r.GetByIdentifier(ctx, email)
}

func (r *pgRepository) GetByIdentifier(ctx context.Context, identifier string) (*User, error) {
	query := `
		SELECT u.id, u.email, u.password_hash, u.full_name, u.is_active, u.first_login, u.last_login_at, u.created_at, u.updated_at
		FROM users u
		LEFT JOIN faculty f ON f.user_id = u.id AND f.deleted_at IS NULL
		WHERE (LOWER(u.email) = LOWER($1) OR UPPER(f.employee_code) = UPPER($1))
		  AND u.deleted_at IS NULL
		LIMIT 1
	`
	var u User
	err := r.pool.QueryRow(ctx, query, identifier).Scan(
		&u.ID, &u.Email, &u.PasswordHash, &u.FullName, &u.IsActive, &u.FirstLogin, &u.LastLoginAt, &u.CreatedAt, &u.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &u, nil
}

func (r *pgRepository) GetByID(ctx context.Context, id string) (*User, error) {
	query := `
		SELECT id, email, password_hash, full_name, is_active, first_login, last_login_at, created_at, updated_at
		FROM users
		WHERE id = $1 AND deleted_at IS NULL
	`
	var u User
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&u.ID, &u.Email, &u.PasswordHash, &u.FullName, &u.IsActive, &u.FirstLogin, &u.LastLoginAt, &u.CreatedAt, &u.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &u, nil
}

func (r *pgRepository) GetRolesByUserID(ctx context.Context, userID string) ([]string, error) {
	query := `
		SELECT r.name
		FROM user_roles ur
		JOIN roles r ON r.id = ur.role_id
		WHERE ur.user_id = $1
	`
	rows, err := r.pool.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var roles []string
	for rows.Next() {
		var roleName string
		if err := rows.Scan(&roleName); err != nil {
			return nil, err
		}
		roles = append(roles, roleName)
	}
	return roles, rows.Err()
}

func (r *pgRepository) GetDepartmentScopesByUserID(ctx context.Context, userID string) ([]string, error) {
	query := `
		SELECT department_id
		FROM role_department_scopes
		WHERE user_id = $1
	`
	rows, err := r.pool.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var scopes []string
	for rows.Next() {
		var deptID string
		if err := rows.Scan(&deptID); err != nil {
			return nil, err
		}
		scopes = append(scopes, deptID)
	}
	return scopes, rows.Err()
}

func (r *pgRepository) GetFacultyIDByUserID(ctx context.Context, userID string) (*string, error) {
	query := `SELECT id FROM faculty WHERE user_id = $1 AND deleted_at IS NULL LIMIT 1`
	var facultyID string
	err := r.pool.QueryRow(ctx, query, userID).Scan(&facultyID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &facultyID, nil
}

func (r *pgRepository) UpdatePassword(ctx context.Context, userID, newHash string) error {
	query := `UPDATE users SET password_hash = $1, first_login = FALSE, updated_at = NOW() WHERE id = $2`
	_, err := r.pool.Exec(ctx, query, newHash, userID)
	return err
}

func (r *pgRepository) UpdateLastLogin(ctx context.Context, userID string) error {
	query := `UPDATE users SET last_login_at = NOW() WHERE id = $1`
	_, err := r.pool.Exec(ctx, query, userID)
	return err
}

func (r *pgRepository) CreatePasswordReset(ctx context.Context, userID, tokenHash string, expiresAt time.Time) error {
	query := `INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`
	_, err := r.pool.Exec(ctx, query, userID, tokenHash, expiresAt)
	return err
}

func (r *pgRepository) GetPasswordReset(ctx context.Context, tokenHash string) (string, time.Time, bool, error) {
	query := `SELECT user_id, expires_at, used_at IS NOT NULL FROM password_resets WHERE token_hash = $1`
	var userID string
	var expiresAt time.Time
	var used bool
	err := r.pool.QueryRow(ctx, query, tokenHash).Scan(&userID, &expiresAt, &used)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return "", time.Time{}, false, nil
		}
		return "", time.Time{}, false, err
	}
	return userID, expiresAt, used, nil
}

func (r *pgRepository) MarkPasswordResetUsed(ctx context.Context, tokenHash string) error {
	query := `UPDATE password_resets SET used_at = NOW() WHERE token_hash = $1`
	_, err := r.pool.Exec(ctx, query, tokenHash)
	return err
}
