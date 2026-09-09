package faculty

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	ListFaculty(ctx context.Context, departmentID string, isPermanent *bool, query string) ([]Faculty, error)
	GetFacultyByID(ctx context.Context, id string) (*Faculty, error)
	GetFacultyBySlug(ctx context.Context, slug string) (*Faculty, error)
	CreateFaculty(ctx context.Context, req *CreateFacultyRequest) (*Faculty, error)
	UpdateFaculty(ctx context.Context, id string, req *UpdateFacultyRequest) (*Faculty, error)
	DeleteFaculty(ctx context.Context, id string) error

	GetProfile(ctx context.Context, facultyID string) (*FacultyProfile, error)
	UpsertProfile(ctx context.Context, facultyID string, req *UpsertProfileRequest) (*FacultyProfile, error)

	ListQualifications(ctx context.Context, facultyID string) ([]FacultyQualification, error)
	CreateQualification(ctx context.Context, facultyID string, req *CreateQualificationRequest) (*FacultyQualification, error)
	DeleteQualification(ctx context.Context, id string) error

	ListTeachingExperiences(ctx context.Context, facultyID string) ([]FacultyTeachingExp, error)
	CreateTeachingExperience(ctx context.Context, facultyID string, req *CreateTeachingExpRequest) (*FacultyTeachingExp, error)
	DeleteTeachingExperience(ctx context.Context, id string) error

	ListAdminExperiences(ctx context.Context, facultyID string) ([]FacultyAdminExp, error)
	CreateAdminExperience(ctx context.Context, facultyID string, req *CreateAdminExpRequest) (*FacultyAdminExp, error)
	DeleteAdminExperience(ctx context.Context, id string) error

	ListHonors(ctx context.Context, facultyID string) ([]FacultyHonor, error)
	CreateHonor(ctx context.Context, facultyID string, req *CreateHonorRequest) (*FacultyHonor, error)
	DeleteHonor(ctx context.Context, id string) error

	ListExposures(ctx context.Context, facultyID string) ([]FacultyExposure, error)
	CreateExposure(ctx context.Context, facultyID string, req *CreateExposureRequest) (*FacultyExposure, error)
	DeleteExposure(ctx context.Context, id string) error

	ListExpertTalks(ctx context.Context, facultyID string) ([]ExpertTalk, error)
	CreateExpertTalk(ctx context.Context, facultyID string, req *CreateExpertTalkRequest) (*ExpertTalk, error)
	DeleteExpertTalk(ctx context.Context, id string) error

	ListLatestMetricSnapshots(ctx context.Context, facultyID string) ([]FacultyMetricSnapshot, error)
}

type pgRepository struct {
	pool *pgxpool.Pool
}

func NewRepository(pool *pgxpool.Pool) Repository {
	return &pgRepository{pool: pool}
}

func (r *pgRepository) ListFaculty(ctx context.Context, departmentID string, isPermanent *bool, search string) ([]Faculty, error) {
	querySQL := `
		SELECT DISTINCT f.id, f.user_id, f.employee_code, f.official_email, f.full_name, f.designation, f.is_permanent, f.phone, f.photo_document_id, f.photo_url, f.portfolio_slug, f.sort_order, f.research_interests, f.created_at, f.updated_at
		FROM faculty f
		LEFT JOIN faculty_appointments fa ON fa.faculty_id = f.id AND fa.end_date IS NULL AND fa.deleted_at IS NULL
		WHERE f.deleted_at IS NULL
		  AND (fa.department_id::text = $1 OR $1 = '')
		  AND ($2::boolean IS NULL OR f.is_permanent = $2)
		  AND ($3 = '' OR f.full_name ILIKE '%' || $3 || '%' OR f.research_interests ILIKE '%' || $3 || '%')
		ORDER BY f.sort_order ASC, f.full_name ASC
	`
	rows, err := r.pool.Query(ctx, querySQL, departmentID, isPermanent, search)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Faculty
	for rows.Next() {
		var f Faculty
		if err := rows.Scan(
			&f.ID, &f.UserID, &f.EmployeeCode, &f.OfficialEmail, &f.FullName, &f.Designation, &f.IsPermanent,
			&f.Phone, &f.PhotoDocumentID, &f.PhotoURL, &f.PortfolioSlug, &f.SortOrder, &f.ResearchInterests,
			&f.CreatedAt, &f.UpdatedAt,
		); err != nil {
			return nil, err
		}
		list = append(list, f)
	}
	return list, rows.Err()
}

func (r *pgRepository) GetFacultyByID(ctx context.Context, id string) (*Faculty, error) {
	querySQL := `
		SELECT id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_document_id, photo_url, portfolio_slug, sort_order, research_interests, created_at, updated_at
		FROM faculty
		WHERE id::text = $1 AND deleted_at IS NULL
	`
	var f Faculty
	err := r.pool.QueryRow(ctx, querySQL, id).Scan(
		&f.ID, &f.UserID, &f.EmployeeCode, &f.OfficialEmail, &f.FullName, &f.Designation, &f.IsPermanent,
		&f.Phone, &f.PhotoDocumentID, &f.PhotoURL, &f.PortfolioSlug, &f.SortOrder, &f.ResearchInterests,
		&f.CreatedAt, &f.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &f, nil
}

func (r *pgRepository) GetFacultyBySlug(ctx context.Context, slug string) (*Faculty, error) {
	querySQL := `
		SELECT id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_document_id, photo_url, portfolio_slug, sort_order, research_interests, created_at, updated_at
		FROM faculty
		WHERE (LOWER(portfolio_slug) = LOWER($1) OR LOWER(employee_code) = LOWER($1)) AND deleted_at IS NULL
	`
	var f Faculty
	err := r.pool.QueryRow(ctx, querySQL, slug).Scan(
		&f.ID, &f.UserID, &f.EmployeeCode, &f.OfficialEmail, &f.FullName, &f.Designation, &f.IsPermanent,
		&f.Phone, &f.PhotoDocumentID, &f.PhotoURL, &f.PortfolioSlug, &f.SortOrder, &f.ResearchInterests,
		&f.CreatedAt, &f.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &f, nil
}

func (r *pgRepository) CreateFaculty(ctx context.Context, req *CreateFacultyRequest) (*Faculty, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer func() { _ = tx.Rollback(ctx) }()

	querySQL := `
		INSERT INTO faculty (employee_code, official_email, full_name, designation, is_permanent, phone, portfolio_slug, sort_order, research_interests)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_document_id, photo_url, portfolio_slug, sort_order, research_interests, created_at, updated_at
	`
	var f Faculty
	err = tx.QueryRow(ctx, querySQL, req.EmployeeCode, req.OfficialEmail, req.FullName, req.Designation, req.IsPermanent, req.Phone, req.PortfolioSlug, req.SortOrder, req.ResearchInterests).Scan(
		&f.ID, &f.UserID, &f.EmployeeCode, &f.OfficialEmail, &f.FullName, &f.Designation, &f.IsPermanent,
		&f.Phone, &f.PhotoDocumentID, &f.PhotoURL, &f.PortfolioSlug, &f.SortOrder, &f.ResearchInterests,
		&f.CreatedAt, &f.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	// Create primary appointment
	appQuery := `
		INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
		VALUES ($1, $2, $3, TRUE, CURRENT_DATE)
	`
	if _, err := tx.Exec(ctx, appQuery, f.ID, req.DepartmentID, req.Designation); err != nil {
		return nil, err
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return &f, nil
}

func (r *pgRepository) UpdateFaculty(ctx context.Context, id string, req *UpdateFacultyRequest) (*Faculty, error) {
	querySQL := `
		UPDATE faculty
		SET full_name = COALESCE($2, full_name),
		    designation = COALESCE($3, designation),
		    is_permanent = COALESCE($4, is_permanent),
		    phone = COALESCE($5, phone),
		    photo_url = COALESCE($6, photo_url),
		    portfolio_slug = COALESCE($7, portfolio_slug),
		    sort_order = COALESCE($8, sort_order),
		    research_interests = COALESCE($9, research_interests),
		    updated_at = NOW()
		WHERE id = $1 AND deleted_at IS NULL
		RETURNING id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_document_id, photo_url, portfolio_slug, sort_order, research_interests, created_at, updated_at
	`
	var f Faculty
	err := r.pool.QueryRow(ctx, querySQL, id, req.FullName, req.Designation, req.IsPermanent, req.Phone, req.PhotoURL, req.PortfolioSlug, req.SortOrder, req.ResearchInterests).Scan(
		&f.ID, &f.UserID, &f.EmployeeCode, &f.OfficialEmail, &f.FullName, &f.Designation, &f.IsPermanent,
		&f.Phone, &f.PhotoDocumentID, &f.PhotoURL, &f.PortfolioSlug, &f.SortOrder, &f.ResearchInterests,
		&f.CreatedAt, &f.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &f, nil
}

func (r *pgRepository) DeleteFaculty(ctx context.Context, id string) error {
	querySQL := `UPDATE faculty SET deleted_at = NOW() WHERE id = $1`
	_, err := r.pool.Exec(ctx, querySQL, id)
	return err
}

func (r *pgRepository) GetProfile(ctx context.Context, facultyID string) (*FacultyProfile, error) {
	querySQL := `
		SELECT id, faculty_id, biography, date_of_birth::text, date_of_joining::text, google_scholar_url, google_scholar_id, scopus_url, scopus_author_id, orcid, publons_url, research_gate_url, vidwan_url, linkedin_url, created_at, updated_at
		FROM faculty_profiles
		WHERE faculty_id = $1
	`
	var p FacultyProfile
	err := r.pool.QueryRow(ctx, querySQL, facultyID).Scan(
		&p.ID, &p.FacultyID, &p.Biography, &p.DateOfBirth, &p.DateOfJoining, &p.GoogleScholarURL,
		&p.GoogleScholarID, &p.ScopusURL, &p.ScopusAuthorID, &p.ORCID, &p.PublonsURL,
		&p.ResearchGateURL, &p.VidwanURL, &p.LinkedInURL, &p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &p, nil
}

func (r *pgRepository) UpsertProfile(ctx context.Context, facultyID string, req *UpsertProfileRequest) (*FacultyProfile, error) {
	querySQL := `
		INSERT INTO faculty_profiles (
			faculty_id, biography, date_of_birth, date_of_joining, google_scholar_url, google_scholar_id,
			scopus_url, scopus_author_id, orcid, publons_url, research_gate_url, vidwan_url, linkedin_url
		) VALUES (
			$1, $2, $3::date, $4::date, $5, $6, $7, $8, $9, $10, $11, $12, $13
		)
		ON CONFLICT (faculty_id) DO UPDATE SET
			biography = EXCLUDED.biography,
			date_of_birth = EXCLUDED.date_of_birth,
			date_of_joining = EXCLUDED.date_of_joining,
			google_scholar_url = EXCLUDED.google_scholar_url,
			google_scholar_id = EXCLUDED.google_scholar_id,
			scopus_url = EXCLUDED.scopus_url,
			scopus_author_id = EXCLUDED.scopus_author_id,
			orcid = EXCLUDED.orcid,
			publons_url = EXCLUDED.publons_url,
			research_gate_url = EXCLUDED.research_gate_url,
			vidwan_url = EXCLUDED.vidwan_url,
			linkedin_url = EXCLUDED.linkedin_url,
			updated_at = NOW()
		RETURNING id, faculty_id, biography, date_of_birth::text, date_of_joining::text, google_scholar_url, google_scholar_id, scopus_url, scopus_author_id, orcid, publons_url, research_gate_url, vidwan_url, linkedin_url, created_at, updated_at
	`
	var p FacultyProfile
	err := r.pool.QueryRow(ctx, querySQL,
		facultyID, req.Biography, req.DateOfBirth, req.DateOfJoining, req.GoogleScholarURL, req.GoogleScholarID,
		req.ScopusURL, req.ScopusAuthorID, req.ORCID, req.PublonsURL, req.ResearchGateURL, req.VidwanURL, req.LinkedInURL,
	).Scan(
		&p.ID, &p.FacultyID, &p.Biography, &p.DateOfBirth, &p.DateOfJoining, &p.GoogleScholarURL,
		&p.GoogleScholarID, &p.ScopusURL, &p.ScopusAuthorID, &p.ORCID, &p.PublonsURL,
		&p.ResearchGateURL, &p.VidwanURL, &p.LinkedInURL, &p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *pgRepository) ListQualifications(ctx context.Context, facultyID string) ([]FacultyQualification, error) {
	querySQL := `SELECT id, faculty_id, degree, specialization, institution, completion_year, certificate_document_id, created_at, updated_at FROM faculty_qualifications WHERE faculty_id = $1 AND deleted_at IS NULL ORDER BY completion_year DESC`
	rows, err := r.pool.Query(ctx, querySQL, facultyID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []FacultyQualification
	for rows.Next() {
		var q FacultyQualification
		if err := rows.Scan(&q.ID, &q.FacultyID, &q.Degree, &q.Specialization, &q.Institution, &q.CompletionYear, &q.CertificateDocumentID, &q.CreatedAt, &q.UpdatedAt); err != nil {
			return nil, err
		}
		list = append(list, q)
	}
	return list, rows.Err()
}

func (r *pgRepository) CreateQualification(ctx context.Context, facultyID string, req *CreateQualificationRequest) (*FacultyQualification, error) {
	querySQL := `
		INSERT INTO faculty_qualifications (faculty_id, degree, specialization, institution, completion_year, certificate_document_id)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, faculty_id, degree, specialization, institution, completion_year, certificate_document_id, created_at, updated_at
	`
	var q FacultyQualification
	err := r.pool.QueryRow(ctx, querySQL, facultyID, req.Degree, req.Specialization, req.Institution, req.CompletionYear, req.CertificateDocumentID).Scan(
		&q.ID, &q.FacultyID, &q.Degree, &q.Specialization, &q.Institution, &q.CompletionYear, &q.CertificateDocumentID, &q.CreatedAt, &q.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &q, nil
}

func (r *pgRepository) DeleteQualification(ctx context.Context, id string) error {
	querySQL := `UPDATE faculty_qualifications SET deleted_at = NOW() WHERE id = $1`
	_, err := r.pool.Exec(ctx, querySQL, id)
	return err
}

func (r *pgRepository) ListTeachingExperiences(ctx context.Context, facultyID string) ([]FacultyTeachingExp, error) {
	querySQL := `SELECT id, faculty_id, designation, organization, start_date::text, end_date::text, is_current, created_at, updated_at FROM faculty_teaching_experiences WHERE faculty_id = $1 AND deleted_at IS NULL ORDER BY start_date DESC`
	rows, err := r.pool.Query(ctx, querySQL, facultyID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []FacultyTeachingExp
	for rows.Next() {
		var te FacultyTeachingExp
		if err := rows.Scan(&te.ID, &te.FacultyID, &te.Designation, &te.Organization, &te.StartDate, &te.EndDate, &te.IsCurrent, &te.CreatedAt, &te.UpdatedAt); err != nil {
			return nil, err
		}
		list = append(list, te)
	}
	return list, rows.Err()
}

func (r *pgRepository) CreateTeachingExperience(ctx context.Context, facultyID string, req *CreateTeachingExpRequest) (*FacultyTeachingExp, error) {
	querySQL := `
		INSERT INTO faculty_teaching_experiences (faculty_id, designation, organization, start_date, end_date, is_current)
		VALUES ($1, $2, $3, $4::date, $5::date, $6)
		RETURNING id, faculty_id, designation, organization, start_date::text, end_date::text, is_current, created_at, updated_at
	`
	var te FacultyTeachingExp
	err := r.pool.QueryRow(ctx, querySQL, facultyID, req.Designation, req.Organization, req.StartDate, req.EndDate, req.IsCurrent).Scan(
		&te.ID, &te.FacultyID, &te.Designation, &te.Organization, &te.StartDate, &te.EndDate, &te.IsCurrent, &te.CreatedAt, &te.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &te, nil
}

func (r *pgRepository) DeleteTeachingExperience(ctx context.Context, id string) error {
	querySQL := `UPDATE faculty_teaching_experiences SET deleted_at = NOW() WHERE id = $1`
	_, err := r.pool.Exec(ctx, querySQL, id)
	return err
}

func (r *pgRepository) ListAdminExperiences(ctx context.Context, facultyID string) ([]FacultyAdminExp, error) {
	querySQL := `SELECT id, faculty_id, role_title, organization, start_date::text, end_date::text, is_current, created_at, updated_at FROM faculty_administrative_experiences WHERE faculty_id = $1 AND deleted_at IS NULL ORDER BY start_date DESC`
	rows, err := r.pool.Query(ctx, querySQL, facultyID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []FacultyAdminExp
	for rows.Next() {
		var ae FacultyAdminExp
		if err := rows.Scan(&ae.ID, &ae.FacultyID, &ae.RoleTitle, &ae.Organization, &ae.StartDate, &ae.EndDate, &ae.IsCurrent, &ae.CreatedAt, &ae.UpdatedAt); err != nil {
			return nil, err
		}
		list = append(list, ae)
	}
	return list, rows.Err()
}

func (r *pgRepository) CreateAdminExperience(ctx context.Context, facultyID string, req *CreateAdminExpRequest) (*FacultyAdminExp, error) {
	querySQL := `
		INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date, is_current)
		VALUES ($1, $2, $3, $4::date, $5::date, $6)
		RETURNING id, faculty_id, role_title, organization, start_date::text, end_date::text, is_current, created_at, updated_at
	`
	var ae FacultyAdminExp
	err := r.pool.QueryRow(ctx, querySQL, facultyID, req.RoleTitle, req.Organization, req.StartDate, req.EndDate, req.IsCurrent).Scan(
		&ae.ID, &ae.FacultyID, &ae.RoleTitle, &ae.Organization, &ae.StartDate, &ae.EndDate, &ae.IsCurrent, &ae.CreatedAt, &ae.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &ae, nil
}

func (r *pgRepository) DeleteAdminExperience(ctx context.Context, id string) error {
	querySQL := `UPDATE faculty_administrative_experiences SET deleted_at = NOW() WHERE id = $1`
	_, err := r.pool.Exec(ctx, querySQL, id)
	return err
}

func (r *pgRepository) ListHonors(ctx context.Context, facultyID string) ([]FacultyHonor, error) {
	querySQL := `SELECT id, faculty_id, title, awarding_body, award_date::text, award_year, supporting_document_id, created_at, updated_at FROM faculty_honors WHERE faculty_id = $1 AND deleted_at IS NULL ORDER BY award_year DESC, award_date DESC`
	rows, err := r.pool.Query(ctx, querySQL, facultyID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []FacultyHonor
	for rows.Next() {
		var h FacultyHonor
		if err := rows.Scan(&h.ID, &h.FacultyID, &h.Title, &h.AwardingBody, &h.AwardDate, &h.AwardYear, &h.SupportingDocumentID, &h.CreatedAt, &h.UpdatedAt); err != nil {
			return nil, err
		}
		list = append(list, h)
	}
	return list, rows.Err()
}

func (r *pgRepository) CreateHonor(ctx context.Context, facultyID string, req *CreateHonorRequest) (*FacultyHonor, error) {
	querySQL := `
		INSERT INTO faculty_honors (faculty_id, title, awarding_body, award_date, award_year, supporting_document_id)
		VALUES ($1, $2, $3, $4::date, $5, $6)
		RETURNING id, faculty_id, title, awarding_body, award_date::text, award_year, supporting_document_id, created_at, updated_at
	`
	var h FacultyHonor
	err := r.pool.QueryRow(ctx, querySQL, facultyID, req.Title, req.AwardingBody, req.AwardDate, req.AwardYear, req.SupportingDocumentID).Scan(
		&h.ID, &h.FacultyID, &h.Title, &h.AwardingBody, &h.AwardDate, &h.AwardYear, &h.SupportingDocumentID, &h.CreatedAt, &h.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &h, nil
}

func (r *pgRepository) DeleteHonor(ctx context.Context, id string) error {
	querySQL := `UPDATE faculty_honors SET deleted_at = NOW() WHERE id = $1`
	_, err := r.pool.Exec(ctx, querySQL, id)
	return err
}

func (r *pgRepository) ListExposures(ctx context.Context, facultyID string) ([]FacultyExposure, error) {
	querySQL := `SELECT id, faculty_id, title, organizer, start_date::text, end_date::text, description, created_at, updated_at FROM faculty_exposures WHERE faculty_id = $1 AND deleted_at IS NULL ORDER BY start_date DESC`
	rows, err := r.pool.Query(ctx, querySQL, facultyID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []FacultyExposure
	for rows.Next() {
		var e FacultyExposure
		if err := rows.Scan(&e.ID, &e.FacultyID, &e.Title, &e.Organizer, &e.StartDate, &e.EndDate, &e.Description, &e.CreatedAt, &e.UpdatedAt); err != nil {
			return nil, err
		}
		list = append(list, e)
	}
	return list, rows.Err()
}

func (r *pgRepository) CreateExposure(ctx context.Context, facultyID string, req *CreateExposureRequest) (*FacultyExposure, error) {
	querySQL := `
		INSERT INTO faculty_exposures (faculty_id, title, organizer, start_date, end_date, description)
		VALUES ($1, $2, $3, $4::date, $5::date, $6)
		RETURNING id, faculty_id, title, organizer, start_date::text, end_date::text, description, created_at, updated_at
	`
	var e FacultyExposure
	err := r.pool.QueryRow(ctx, querySQL, facultyID, req.Title, req.Organizer, req.StartDate, req.EndDate, req.Description).Scan(
		&e.ID, &e.FacultyID, &e.Title, &e.Organizer, &e.StartDate, &e.EndDate, &e.Description, &e.CreatedAt, &e.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &e, nil
}

func (r *pgRepository) DeleteExposure(ctx context.Context, id string) error {
	querySQL := `UPDATE faculty_exposures SET deleted_at = NOW() WHERE id = $1`
	_, err := r.pool.Exec(ctx, querySQL, id)
	return err
}

func (r *pgRepository) ListExpertTalks(ctx context.Context, facultyID string) ([]ExpertTalk, error) {
	querySQL := `SELECT id, faculty_id, title, host_organization, venue, talk_date::text, description, created_at, updated_at FROM expert_talks WHERE faculty_id = $1 AND deleted_at IS NULL ORDER BY talk_date DESC`
	rows, err := r.pool.Query(ctx, querySQL, facultyID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []ExpertTalk
	for rows.Next() {
		var et ExpertTalk
		if err := rows.Scan(&et.ID, &et.FacultyID, &et.Title, &et.HostOrganization, &et.Venue, &et.TalkDate, &et.Description, &et.CreatedAt, &et.UpdatedAt); err != nil {
			return nil, err
		}
		list = append(list, et)
	}
	return list, rows.Err()
}

func (r *pgRepository) CreateExpertTalk(ctx context.Context, facultyID string, req *CreateExpertTalkRequest) (*ExpertTalk, error) {
	querySQL := `
		INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
		VALUES ($1, $2, $3, $4, $5::date, $6)
		RETURNING id, faculty_id, title, host_organization, venue, talk_date::text, description, created_at, updated_at
	`
	var et ExpertTalk
	err := r.pool.QueryRow(ctx, querySQL, facultyID, req.Title, req.HostOrganization, req.Venue, req.TalkDate, req.Description).Scan(
		&et.ID, &et.FacultyID, &et.Title, &et.HostOrganization, &et.Venue, &et.TalkDate, &et.Description, &et.CreatedAt, &et.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &et, nil
}

func (r *pgRepository) DeleteExpertTalk(ctx context.Context, id string) error {
	querySQL := `UPDATE expert_talks SET deleted_at = NOW() WHERE id = $1`
	_, err := r.pool.Exec(ctx, querySQL, id)
	return err
}

func (r *pgRepository) ListLatestMetricSnapshots(ctx context.Context, facultyID string) ([]FacultyMetricSnapshot, error) {
	querySQL := `
		SELECT DISTINCT ON (ms.code)
			fms.id, fms.faculty_id, fms.metric_source_id, ms.code, ms.name, fms.h_index, fms.citations, fms.i10_index, fms.captured_at
		FROM faculty_metric_snapshots fms
		JOIN metric_sources ms ON ms.id = fms.metric_source_id
		WHERE fms.faculty_id = $1
		ORDER BY ms.code, fms.captured_at DESC
	`
	rows, err := r.pool.Query(ctx, querySQL, facultyID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []FacultyMetricSnapshot
	for rows.Next() {
		var s FacultyMetricSnapshot
		if err := rows.Scan(&s.ID, &s.FacultyID, &s.MetricSourceID, &s.SourceCode, &s.SourceName, &s.HIndex, &s.Citations, &s.I10Index, &s.CapturedAt); err != nil {
			return nil, err
		}
		list = append(list, s)
	}
	return list, rows.Err()
}
