package organisation

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	ListInstitutions(ctx context.Context) ([]Institution, error)
	GetInstitutionByID(ctx context.Context, id string) (*Institution, error)
	ListDepartments(ctx context.Context, institutionID string) ([]Department, error)
	GetDepartmentByID(ctx context.Context, id string) (*Department, error)
	GetDepartmentBySlug(ctx context.Context, slug string) (*Department, error)
	ListProgrammes(ctx context.Context, departmentID string) ([]Programme, error)
	CreateProgramme(ctx context.Context, departmentID string, req *CreateProgrammeRequest) (*Programme, error)
	ListAcademicYears(ctx context.Context, institutionID string) ([]AcademicYear, error)
	ListFinancialYears(ctx context.Context, institutionID string) ([]FinancialYear, error)
	ListAppointmentsByFaculty(ctx context.Context, facultyID string) ([]FacultyAppointment, error)
}

type pgRepository struct {
	pool *pgxpool.Pool
}

func NewRepository(pool *pgxpool.Pool) Repository {
	return &pgRepository{pool: pool}
}

func (r *pgRepository) ListInstitutions(ctx context.Context) ([]Institution, error) {
	query := `SELECT id, name, slug, domain, logo_url, created_at, updated_at FROM institutions WHERE deleted_at IS NULL ORDER BY name ASC`
	rows, err := r.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Institution
	for rows.Next() {
		var i Institution
		if err := rows.Scan(&i.ID, &i.Name, &i.Slug, &i.Domain, &i.LogoURL, &i.CreatedAt, &i.UpdatedAt); err != nil {
			return nil, err
		}
		list = append(list, i)
	}
	return list, rows.Err()
}

func (r *pgRepository) GetInstitutionByID(ctx context.Context, id string) (*Institution, error) {
	query := `SELECT id, name, slug, domain, logo_url, created_at, updated_at FROM institutions WHERE id = $1 AND deleted_at IS NULL`
	var i Institution
	err := r.pool.QueryRow(ctx, query, id).Scan(&i.ID, &i.Name, &i.Slug, &i.Domain, &i.LogoURL, &i.CreatedAt, &i.UpdatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &i, nil
}

func (r *pgRepository) ListDepartments(ctx context.Context, institutionID string) ([]Department, error) {
	query := `
		SELECT id, institution_id, parent_department_id, name, slug, code, contact_email, contact_phone, about_text, created_at, updated_at
		FROM departments
		WHERE ($1 = '' OR institution_id::text = $1) AND deleted_at IS NULL
		ORDER BY name ASC
	`
	rows, err := r.pool.Query(ctx, query, institutionID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Department
	for rows.Next() {
		var d Department
		if err := rows.Scan(&d.ID, &d.InstitutionID, &d.ParentDepartmentID, &d.Name, &d.Slug, &d.Code, &d.ContactEmail, &d.ContactPhone, &d.AboutText, &d.CreatedAt, &d.UpdatedAt); err != nil {
			return nil, err
		}
		list = append(list, d)
	}
	return list, rows.Err()
}

func (r *pgRepository) GetDepartmentByID(ctx context.Context, id string) (*Department, error) {
	query := `
		SELECT id, institution_id, parent_department_id, name, slug, code, contact_email, contact_phone, about_text, created_at, updated_at
		FROM departments
		WHERE id = $1 AND deleted_at IS NULL
	`
	var d Department
	err := r.pool.QueryRow(ctx, query, id).Scan(&d.ID, &d.InstitutionID, &d.ParentDepartmentID, &d.Name, &d.Slug, &d.Code, &d.ContactEmail, &d.ContactPhone, &d.AboutText, &d.CreatedAt, &d.UpdatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &d, nil
}

func (r *pgRepository) GetDepartmentBySlug(ctx context.Context, slug string) (*Department, error) {
	query := `
		SELECT id, institution_id, parent_department_id, name, slug, code, contact_email, contact_phone, about_text, created_at, updated_at
		FROM departments
		WHERE LOWER(slug) = LOWER($1) AND deleted_at IS NULL
	`
	var d Department
	err := r.pool.QueryRow(ctx, query, slug).Scan(&d.ID, &d.InstitutionID, &d.ParentDepartmentID, &d.Name, &d.Slug, &d.Code, &d.ContactEmail, &d.ContactPhone, &d.AboutText, &d.CreatedAt, &d.UpdatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &d, nil
}

func (r *pgRepository) ListProgrammes(ctx context.Context, departmentID string) ([]Programme, error) {
	query := `
		SELECT id, department_id, code, name, level, duration_years, created_at, updated_at
		FROM programmes
		WHERE ($1 = '' OR department_id::text = $1) AND deleted_at IS NULL
		ORDER BY level ASC, name ASC
	`
	rows, err := r.pool.Query(ctx, query, departmentID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Programme
	for rows.Next() {
		var p Programme
		if err := rows.Scan(&p.ID, &p.DepartmentID, &p.Code, &p.Name, &p.Level, &p.DurationYears, &p.CreatedAt, &p.UpdatedAt); err != nil {
			return nil, err
		}
		list = append(list, p)
	}
	return list, rows.Err()
}

func (r *pgRepository) CreateProgramme(ctx context.Context, departmentID string, req *CreateProgrammeRequest) (*Programme, error) {
	query := `
		INSERT INTO programmes (department_id, code, name, level, duration_years)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, department_id, code, name, level, duration_years, created_at, updated_at
	`
	var p Programme
	err := r.pool.QueryRow(ctx, query, departmentID, req.Code, req.Name, req.Level, req.DurationYears).Scan(
		&p.ID, &p.DepartmentID, &p.Code, &p.Name, &p.Level, &p.DurationYears, &p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *pgRepository) ListAcademicYears(ctx context.Context, institutionID string) ([]AcademicYear, error) {
	query := `
		SELECT id, institution_id, label, start_date::text, end_date::text, is_current, created_at, updated_at
		FROM academic_years
		WHERE ($1 = '' OR institution_id::text = $1)
		ORDER BY start_date DESC
	`
	rows, err := r.pool.Query(ctx, query, institutionID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []AcademicYear
	for rows.Next() {
		var ay AcademicYear
		if err := rows.Scan(&ay.ID, &ay.InstitutionID, &ay.Label, &ay.StartDate, &ay.EndDate, &ay.IsCurrent, &ay.CreatedAt, &ay.UpdatedAt); err != nil {
			return nil, err
		}
		list = append(list, ay)
	}
	return list, rows.Err()
}

func (r *pgRepository) ListFinancialYears(ctx context.Context, institutionID string) ([]FinancialYear, error) {
	query := `
		SELECT id, institution_id, label, start_date::text, end_date::text, is_current, created_at, updated_at
		FROM financial_years
		WHERE ($1 = '' OR institution_id::text = $1)
		ORDER BY start_date DESC
	`
	rows, err := r.pool.Query(ctx, query, institutionID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []FinancialYear
	for rows.Next() {
		var fy FinancialYear
		if err := rows.Scan(&fy.ID, &fy.InstitutionID, &fy.Label, &fy.StartDate, &fy.EndDate, &fy.IsCurrent, &fy.CreatedAt, &fy.UpdatedAt); err != nil {
			return nil, err
		}
		list = append(list, fy)
	}
	return list, rows.Err()
}

func (r *pgRepository) ListAppointmentsByFaculty(ctx context.Context, facultyID string) ([]FacultyAppointment, error) {
	query := `
		SELECT fa.id, fa.faculty_id, fa.department_id, d.name, d.slug, fa.designation, fa.is_primary, fa.start_date::text, fa.end_date::text, fa.created_at, fa.updated_at
		FROM faculty_appointments fa
		JOIN departments d ON d.id = fa.department_id
		WHERE fa.faculty_id = $1 AND fa.deleted_at IS NULL
		ORDER BY fa.is_primary DESC, fa.start_date DESC
	`
	rows, err := r.pool.Query(ctx, query, facultyID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []FacultyAppointment
	for rows.Next() {
		var app FacultyAppointment
		if err := rows.Scan(&app.ID, &app.FacultyID, &app.DepartmentID, &app.DepartmentName, &app.DepartmentSlug, &app.Designation, &app.IsPrimary, &app.StartDate, &app.EndDate, &app.CreatedAt, &app.UpdatedAt); err != nil {
			return nil, err
		}
		list = append(list, app)
	}
	return list, rows.Err()
}
