package research

import (
	"context"
	"errors"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	// Publications
	ListPublications(ctx context.Context, typeFilter, deptID, facultyID string, year *int, status, indexing, search string, limit, offset int) ([]Publication, error)
	GetPublicationByID(ctx context.Context, id string) (*Publication, error)
	CreatePublication(ctx context.Context, userID string, req *CreatePublicationRequest) (*Publication, error)
	UpdatePublicationStatus(ctx context.Context, id string, status string) error
	CreatePublicationReview(ctx context.Context, id, reviewerUserID, decision, comments string) error

	// Patents
	ListPatents(ctx context.Context, status, deptID, facultyID string, year *int, search string, limit, offset int) ([]Patent, error)
	GetPatentByID(ctx context.Context, id string) (*Patent, error)
	CreatePatent(ctx context.Context, userID string, req *CreatePatentRequest) (*Patent, error)
	UpdatePatentWorkflow(ctx context.Context, id string, status string) error
	CreatePatentReview(ctx context.Context, id, reviewerUserID, decision, comments string) error

	// Projects
	ListProjects(ctx context.Context, status, deptID, facultyID string, year *int, search string, limit, offset int) ([]Project, error)
	GetProjectByID(ctx context.Context, id string) (*Project, error)
	CreateProject(ctx context.Context, userID string, req *CreateProjectRequest) (*Project, error)
	CreateGrant(ctx context.Context, projectID string, req *CreateGrantRequest) (*Grant, error)
	ListGrants(ctx context.Context, projectID string) ([]Grant, error)

	// Consultancies
	ListConsultancies(ctx context.Context, deptID, facultyID string, year *int) ([]Consultancy, error)
	CreateConsultancy(ctx context.Context, userID string, req *CreateConsultancyRequest) (*Consultancy, error)

	// Supervisions
	ListSupervisions(ctx context.Context, deptID, facultyID, status, level string) ([]Supervision, error)
	CreateSupervision(ctx context.Context, userID string, req *CreateSupervisionRequest) (*Supervision, error)

	// Events
	ListEvents(ctx context.Context, deptID, facultyID, eventType string, year *int) ([]Event, error)
	CreateEvent(ctx context.Context, userID string, req *CreateEventRequest) (*Event, error)

	// Courses
	ListCourses(ctx context.Context, deptID, programmeID string) ([]Course, error)
	CreateCourse(ctx context.Context, req *CreateCourseRequest) (*Course, error)
}

type pgRepository struct {
	pool *pgxpool.Pool
}

func NewRepository(pool *pgxpool.Pool) Repository {
	return &pgRepository{pool: pool}
}

// ----------------------------------------------------------------------------
// PUBLICATIONS
// ----------------------------------------------------------------------------

func (r *pgRepository) ListPublications(ctx context.Context, typeFilter, deptID, facultyID string, year *int, status, indexing, search string, limit, offset int) ([]Publication, error) {
	if limit <= 0 {
		limit = 50
	}
	querySQL := `
		SELECT DISTINCT p.id, p.title, p.publication_type::text, p.doi, p.isbn, p.venue, p.publisher,
		       p.volume, p.issue, p.pages, p.published_date::text, p.year, p.indexing, p.quartile,
		       p.status::text, p.source_url, p.raw_authors, p.published_at, p.created_by, p.created_at, p.updated_at
		FROM publications p
		LEFT JOIN publication_departments pd ON pd.publication_id = p.id
		LEFT JOIN publication_authors pa ON pa.publication_id = p.id
		WHERE p.deleted_at IS NULL
		  AND ($1 = '' OR p.publication_type::text = $1)
		  AND ($2 = '' OR pd.department_id::text = $2)
		  AND ($3 = '' OR pa.faculty_id::text = $3)
		  AND ($4::int IS NULL OR p.year = $4)
		  AND ($5 = '' OR p.status::text = $5)
		  AND ($6 = '' OR p.indexing ILIKE '%' || $6 || '%')
		  AND ($7 = '' OR p.title ILIKE '%' || $7 || '%' OR p.raw_authors ILIKE '%' || $7 || '%')
		ORDER BY p.year DESC, p.created_at DESC
		LIMIT $8 OFFSET $9
	`
	rows, err := r.pool.Query(ctx, querySQL, typeFilter, deptID, facultyID, year, status, indexing, search, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Publication
	for rows.Next() {
		var p Publication
		if err := rows.Scan(
			&p.ID, &p.Title, &p.PublicationType, &p.DOI, &p.ISBN, &p.Venue, &p.Publisher,
			&p.Volume, &p.Issue, &p.Pages, &p.PublishedDate, &p.Year, &p.Indexing, &p.Quartile,
			&p.Status, &p.SourceURL, &p.RawAuthors, &p.PublishedAt, &p.CreatedBy, &p.CreatedAt, &p.UpdatedAt,
		); err != nil {
			return nil, err
		}
		list = append(list, p)
	}

	// Populate Authors and Departments for returned items
	for i := range list {
		authors, err := r.getPublicationAuthors(ctx, list[i].ID)
		if err == nil {
			list[i].Authors = authors
		}
		depts, err := r.getPublicationDepartments(ctx, list[i].ID)
		if err == nil {
			list[i].Departments = depts
		}
	}

	return list, rows.Err()
}

func (r *pgRepository) getPublicationAuthors(ctx context.Context, publicationID string) ([]PublicationAuthor, error) {
	querySQL := `
		SELECT id, publication_id, faculty_id, author_name, author_order, is_corresponding
		FROM publication_authors
		WHERE publication_id = $1
		ORDER BY author_order ASC
	`
	rows, err := r.pool.Query(ctx, querySQL, publicationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []PublicationAuthor
	for rows.Next() {
		var a PublicationAuthor
		if err := rows.Scan(&a.ID, &a.PublicationID, &a.FacultyID, &a.AuthorName, &a.AuthorOrder, &a.IsCorresponding); err != nil {
			return nil, err
		}
		list = append(list, a)
	}
	return list, rows.Err()
}

func (r *pgRepository) getPublicationDepartments(ctx context.Context, publicationID string) ([]PublicationDepartment, error) {
	querySQL := `
		SELECT pd.publication_id, pd.department_id, d.name, d.slug
		FROM publication_departments pd
		JOIN departments d ON d.id = pd.department_id
		WHERE pd.publication_id = $1
	`
	rows, err := r.pool.Query(ctx, querySQL, publicationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []PublicationDepartment
	for rows.Next() {
		var d PublicationDepartment
		if err := rows.Scan(&d.PublicationID, &d.DepartmentID, &d.DepartmentName, &d.DepartmentSlug); err != nil {
			return nil, err
		}
		list = append(list, d)
	}
	return list, rows.Err()
}

func (r *pgRepository) GetPublicationByID(ctx context.Context, id string) (*Publication, error) {
	querySQL := `
		SELECT id, title, publication_type::text, doi, isbn, venue, publisher,
		       volume, issue, pages, published_date::text, year, indexing, quartile,
		       status::text, source_url, raw_authors, published_at, created_by, created_at, updated_at
		FROM publications
		WHERE id = $1 AND deleted_at IS NULL
	`
	var p Publication
	err := r.pool.QueryRow(ctx, querySQL, id).Scan(
		&p.ID, &p.Title, &p.PublicationType, &p.DOI, &p.ISBN, &p.Venue, &p.Publisher,
		&p.Volume, &p.Issue, &p.Pages, &p.PublishedDate, &p.Year, &p.Indexing, &p.Quartile,
		&p.Status, &p.SourceURL, &p.RawAuthors, &p.PublishedAt, &p.CreatedBy, &p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	p.Authors, _ = r.getPublicationAuthors(ctx, p.ID)
	p.Departments, _ = r.getPublicationDepartments(ctx, p.ID)
	return &p, nil
}

func (r *pgRepository) CreatePublication(ctx context.Context, userID string, req *CreatePublicationRequest) (*Publication, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer func() { _ = tx.Rollback(ctx) }()

	// Normalize DOI
	var normalizedDOI *string
	if req.DOI != nil && strings.TrimSpace(*req.DOI) != "" {
		d := strings.TrimSpace(*req.DOI)
		d = strings.TrimPrefix(d, "https://doi.org/")
		d = strings.TrimPrefix(d, "http://doi.org/")
		d = strings.TrimPrefix(d, "doi:")
		d = strings.ToLower(strings.TrimSpace(d))
		normalizedDOI = &d
	}

	var createdBy *string
	if userID != "" {
		createdBy = &userID
	}

	querySQL := `
		INSERT INTO publications (
			title, publication_type, doi, isbn, venue, publisher, volume, issue, pages,
			published_date, year, indexing, quartile, source_url, raw_authors, status, created_by
		) VALUES (
			$1, $2::publication_types, $3, $4, $5, $6, $7, $8, $9,
			$10::date, $11, $12, $13, $14, $15, 'DRAFT', $16
		)
		RETURNING id, title, publication_type::text, doi, isbn, venue, publisher,
		          volume, issue, pages, published_date::text, year, indexing, quartile,
		          status::text, source_url, raw_authors, published_at, created_by, created_at, updated_at
	`
	var p Publication
	err = tx.QueryRow(ctx, querySQL,
		req.Title, req.PublicationType, normalizedDOI, req.ISBN, req.Venue, req.Publisher,
		req.Volume, req.Issue, req.Pages, req.PublishedDate, req.Year, req.Indexing, req.Quartile,
		req.SourceURL, req.RawAuthors, createdBy,
	).Scan(
		&p.ID, &p.Title, &p.PublicationType, &p.DOI, &p.ISBN, &p.Venue, &p.Publisher,
		&p.Volume, &p.Issue, &p.Pages, &p.PublishedDate, &p.Year, &p.Indexing, &p.Quartile,
		&p.Status, &p.SourceURL, &p.RawAuthors, &p.PublishedAt, &p.CreatedBy, &p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	// Insert authors
	for _, a := range req.Authors {
		var facID *string
		if a.FacultyID != nil && *a.FacultyID != "" {
			facID = a.FacultyID
		}
		authorQuery := `
			INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order, is_corresponding)
			VALUES ($1, $2, $3, $4, $5)
		`
		if _, err := tx.Exec(ctx, authorQuery, p.ID, facID, a.AuthorName, a.AuthorOrder, a.IsCorresponding); err != nil {
			return nil, err
		}
	}

	// Insert departments
	for _, deptID := range req.DepartmentIDs {
		deptQuery := `
			INSERT INTO publication_departments (publication_id, department_id)
			VALUES ($1, $2)
			ON CONFLICT DO NOTHING
		`
		if _, err := tx.Exec(ctx, deptQuery, p.ID, deptID); err != nil {
			return nil, err
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}

	return r.GetPublicationByID(ctx, p.ID)
}

func (r *pgRepository) UpdatePublicationStatus(ctx context.Context, id string, status string) error {
	var querySQL string
	if status == "PUBLISHED" {
		querySQL = `UPDATE publications SET status = $2::workflow_statuses, published_at = NOW(), updated_at = NOW() WHERE id = $1`
	} else {
		querySQL = `UPDATE publications SET status = $2::workflow_statuses, updated_at = NOW() WHERE id = $1`
	}
	_, err := r.pool.Exec(ctx, querySQL, id, status)
	return err
}

func (r *pgRepository) CreatePublicationReview(ctx context.Context, id, reviewerUserID, decision, comments string) error {
	querySQL := `
		INSERT INTO publication_reviews (publication_id, reviewer_user_id, decision, comments)
		VALUES ($1, $2, $3, $4)
	`
	_, err := r.pool.Exec(ctx, querySQL, id, reviewerUserID, decision, comments)
	return err
}

// ----------------------------------------------------------------------------
// PATENTS
// ----------------------------------------------------------------------------

func (r *pgRepository) ListPatents(ctx context.Context, status, deptID, facultyID string, year *int, search string, limit, offset int) ([]Patent, error) {
	if limit <= 0 {
		limit = 50
	}
	querySQL := `
		SELECT DISTINCT p.id, p.title, p.patent_type, p.status, p.application_number, p.publication_number,
		       p.grant_number, p.jurisdiction, p.patent_office, p.filing_date::text, p.publication_date::text,
		       p.grant_date::text, p.year, p.applicant_name, p.raw_inventors, p.document_id, p.workflow_status::text,
		       p.created_at, p.updated_at
		FROM patents p
		LEFT JOIN patent_departments pd ON pd.patent_id = p.id
		LEFT JOIN patent_inventors pi ON pi.patent_id = p.id
		WHERE p.deleted_at IS NULL
		  AND ($1 = '' OR p.status = $1)
		  AND ($2 = '' OR pd.department_id::text = $2)
		  AND ($3 = '' OR pi.faculty_id::text = $3)
		  AND ($4::int IS NULL OR p.year = $4)
		  AND ($5 = '' OR p.title ILIKE '%' || $5 || '%' OR p.raw_inventors ILIKE '%' || $5 || '%')
		ORDER BY p.year DESC, p.created_at DESC
		LIMIT $6 OFFSET $7
	`
	rows, err := r.pool.Query(ctx, querySQL, status, deptID, facultyID, year, search, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Patent
	for rows.Next() {
		var p Patent
		if err := rows.Scan(
			&p.ID, &p.Title, &p.PatentType, &p.Status, &p.ApplicationNumber, &p.PublicationNumber,
			&p.GrantNumber, &p.Jurisdiction, &p.PatentOffice, &p.FilingDate, &p.PublicationDate,
			&p.GrantDate, &p.Year, &p.ApplicantName, &p.RawInventors, &p.DocumentID, &p.WorkflowStatus,
			&p.CreatedAt, &p.UpdatedAt,
		); err != nil {
			return nil, err
		}
		list = append(list, p)
	}

	for i := range list {
		list[i].Inventors, _ = r.getPatentInventors(ctx, list[i].ID)
		list[i].Departments, _ = r.getPatentDepartments(ctx, list[i].ID)
	}

	return list, rows.Err()
}

func (r *pgRepository) getPatentInventors(ctx context.Context, patentID string) ([]PatentInventor, error) {
	querySQL := `SELECT id, patent_id, faculty_id, inventor_name, inventor_order FROM patent_inventors WHERE patent_id = $1 ORDER BY inventor_order ASC`
	rows, err := r.pool.Query(ctx, querySQL, patentID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []PatentInventor
	for rows.Next() {
		var inv PatentInventor
		if err := rows.Scan(&inv.ID, &inv.PatentID, &inv.FacultyID, &inv.InventorName, &inv.InventorOrder); err != nil {
			return nil, err
		}
		list = append(list, inv)
	}
	return list, rows.Err()
}

func (r *pgRepository) getPatentDepartments(ctx context.Context, patentID string) ([]PatentDepartment, error) {
	querySQL := `SELECT pd.patent_id, pd.department_id, d.name FROM patent_departments pd JOIN departments d ON d.id = pd.department_id WHERE pd.patent_id = $1`
	rows, err := r.pool.Query(ctx, querySQL, patentID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []PatentDepartment
	for rows.Next() {
		var pd PatentDepartment
		if err := rows.Scan(&pd.PatentID, &pd.DepartmentID, &pd.DepartmentName); err != nil {
			return nil, err
		}
		list = append(list, pd)
	}
	return list, rows.Err()
}

func (r *pgRepository) GetPatentByID(ctx context.Context, id string) (*Patent, error) {
	querySQL := `
		SELECT id, title, patent_type, status, application_number, publication_number,
		       grant_number, jurisdiction, patent_office, filing_date::text, publication_date::text,
		       grant_date::text, year, applicant_name, raw_inventors, document_id, workflow_status::text,
		       created_at, updated_at
		FROM patents
		WHERE id = $1 AND deleted_at IS NULL
	`
	var p Patent
	err := r.pool.QueryRow(ctx, querySQL, id).Scan(
		&p.ID, &p.Title, &p.PatentType, &p.Status, &p.ApplicationNumber, &p.PublicationNumber,
		&p.GrantNumber, &p.Jurisdiction, &p.PatentOffice, &p.FilingDate, &p.PublicationDate,
		&p.GrantDate, &p.Year, &p.ApplicantName, &p.RawInventors, &p.DocumentID, &p.WorkflowStatus,
		&p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	p.Inventors, _ = r.getPatentInventors(ctx, p.ID)
	p.Departments, _ = r.getPatentDepartments(ctx, p.ID)
	return &p, nil
}

func (r *pgRepository) CreatePatent(ctx context.Context, userID string, req *CreatePatentRequest) (*Patent, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer func() { _ = tx.Rollback(ctx) }()

	var createdBy *string
	if userID != "" {
		createdBy = &userID
	}

	querySQL := `
		INSERT INTO patents (
			title, patent_type, status, application_number, publication_number, grant_number,
			jurisdiction, patent_office, filing_date, publication_date, grant_date, year,
			applicant_name, raw_inventors, workflow_status, created_by
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9::date, $10::date, $11::date, $12, $13, $14, 'DRAFT', $15
		)
		RETURNING id, title, patent_type, status, application_number, publication_number,
		          grant_number, jurisdiction, patent_office, filing_date::text, publication_date::text,
		          grant_date::text, year, applicant_name, raw_inventors, document_id, workflow_status::text,
		          created_at, updated_at
	`
	var p Patent
	err = tx.QueryRow(ctx, querySQL,
		req.Title, req.PatentType, req.Status, req.ApplicationNumber, req.PublicationNumber, req.GrantNumber,
		req.Jurisdiction, req.PatentOffice, req.FilingDate, req.PublicationDate, req.GrantDate, req.Year,
		req.ApplicantName, req.RawInventors, createdBy,
	).Scan(
		&p.ID, &p.Title, &p.PatentType, &p.Status, &p.ApplicationNumber, &p.PublicationNumber,
		&p.GrantNumber, &p.Jurisdiction, &p.PatentOffice, &p.FilingDate, &p.PublicationDate,
		&p.GrantDate, &p.Year, &p.ApplicantName, &p.RawInventors, &p.DocumentID, &p.WorkflowStatus,
		&p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	for _, inv := range req.Inventors {
		var facID *string
		if inv.FacultyID != nil && *inv.FacultyID != "" {
			facID = inv.FacultyID
		}
		invQuery := `INSERT INTO patent_inventors (patent_id, faculty_id, inventor_name, inventor_order) VALUES ($1, $2, $3, $4)`
		if _, err := tx.Exec(ctx, invQuery, p.ID, facID, inv.InventorName, inv.InventorOrder); err != nil {
			return nil, err
		}
	}

	for _, deptID := range req.DepartmentIDs {
		deptQuery := `INSERT INTO patent_departments (patent_id, department_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`
		if _, err := tx.Exec(ctx, deptQuery, p.ID, deptID); err != nil {
			return nil, err
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}

	return r.GetPatentByID(ctx, p.ID)
}

func (r *pgRepository) UpdatePatentWorkflow(ctx context.Context, id string, status string) error {
	querySQL := `UPDATE patents SET workflow_status = $2::workflow_statuses, updated_at = NOW() WHERE id = $1`
	_, err := r.pool.Exec(ctx, querySQL, id, status)
	return err
}

func (r *pgRepository) CreatePatentReview(ctx context.Context, id, reviewerUserID, decision, comments string) error {
	querySQL := `INSERT INTO patent_reviews (patent_id, reviewer_user_id, decision, comments) VALUES ($1, $2, $3, $4)`
	_, err := r.pool.Exec(ctx, querySQL, id, reviewerUserID, decision, comments)
	return err
}

// ----------------------------------------------------------------------------
// PROJECTS & GRANTS
// ----------------------------------------------------------------------------

func (r *pgRepository) ListProjects(ctx context.Context, status, deptID, facultyID string, year *int, search string, limit, offset int) ([]Project, error) {
	if limit <= 0 {
		limit = 50
	}
	querySQL := `
		SELECT DISTINCT p.id, p.title, p.project_number, p.sponsor, p.scheme, p.status,
		       p.start_date::text, p.end_date::text, p.year, p.total_sanctioned_amount, p.total_amount_received,
		       p.lead_department_id, d.name AS lead_dept_name, p.raw_investigators, p.workflow_status::text,
		       p.created_at, p.updated_at
		FROM projects p
		JOIN departments d ON d.id = p.lead_department_id
		LEFT JOIN project_departments pd ON pd.project_id = p.id
		LEFT JOIN project_members pm ON pm.project_id = p.id
		WHERE p.deleted_at IS NULL
		  AND ($1 = '' OR p.status = $1)
		  AND ($2 = '' OR pd.department_id::text = $2 OR p.lead_department_id::text = $2)
		  AND ($3 = '' OR pm.faculty_id::text = $3)
		  AND ($4::int IS NULL OR p.year = $4)
		  AND ($5 = '' OR p.title ILIKE '%' || $5 || '%' OR p.sponsor ILIKE '%' || $5 || '%')
		ORDER BY p.year DESC, p.created_at DESC
		LIMIT $6 OFFSET $7
	`
	rows, err := r.pool.Query(ctx, querySQL, status, deptID, facultyID, year, search, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Project
	for rows.Next() {
		var p Project
		if err := rows.Scan(
			&p.ID, &p.Title, &p.ProjectNumber, &p.Sponsor, &p.Scheme, &p.Status,
			&p.StartDate, &p.EndDate, &p.Year, &p.TotalSanctionedAmount, &p.TotalAmountReceived,
			&p.LeadDepartmentID, &p.LeadDepartmentName, &p.RawInvestigators, &p.WorkflowStatus,
			&p.CreatedAt, &p.UpdatedAt,
		); err != nil {
			return nil, err
		}
		list = append(list, p)
	}

	for i := range list {
		list[i].Members, _ = r.getProjectMembers(ctx, list[i].ID)
		list[i].Departments, _ = r.getProjectDepartments(ctx, list[i].ID)
		list[i].Grants, _ = r.ListGrants(ctx, list[i].ID)
	}

	return list, rows.Err()
}

func (r *pgRepository) getProjectMembers(ctx context.Context, projectID string) ([]ProjectMember, error) {
	querySQL := `SELECT id, project_id, faculty_id, member_name, role, member_order FROM project_members WHERE project_id = $1 ORDER BY member_order ASC`
	rows, err := r.pool.Query(ctx, querySQL, projectID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []ProjectMember
	for rows.Next() {
		var m ProjectMember
		if err := rows.Scan(&m.ID, &m.ProjectID, &m.FacultyID, &m.MemberName, &m.Role, &m.MemberOrder); err != nil {
			return nil, err
		}
		list = append(list, m)
	}
	return list, rows.Err()
}

func (r *pgRepository) getProjectDepartments(ctx context.Context, projectID string) ([]ProjectDepartment, error) {
	querySQL := `SELECT pd.project_id, pd.department_id, d.name, pd.is_lead FROM project_departments pd JOIN departments d ON d.id = pd.department_id WHERE pd.project_id = $1`
	rows, err := r.pool.Query(ctx, querySQL, projectID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []ProjectDepartment
	for rows.Next() {
		var pd ProjectDepartment
		if err := rows.Scan(&pd.ProjectID, &pd.DepartmentID, &pd.DepartmentName, &pd.IsLead); err != nil {
			return nil, err
		}
		list = append(list, pd)
	}
	return list, rows.Err()
}

func (r *pgRepository) GetProjectByID(ctx context.Context, id string) (*Project, error) {
	querySQL := `
		SELECT p.id, p.title, p.project_number, p.sponsor, p.scheme, p.status,
		       p.start_date::text, p.end_date::text, p.year, p.total_sanctioned_amount, p.total_amount_received,
		       p.lead_department_id, d.name, p.raw_investigators, p.workflow_status::text,
		       p.created_at, p.updated_at
		FROM projects p
		JOIN departments d ON d.id = p.lead_department_id
		WHERE p.id = $1 AND p.deleted_at IS NULL
	`
	var p Project
	err := r.pool.QueryRow(ctx, querySQL, id).Scan(
		&p.ID, &p.Title, &p.ProjectNumber, &p.Sponsor, &p.Scheme, &p.Status,
		&p.StartDate, &p.EndDate, &p.Year, &p.TotalSanctionedAmount, &p.TotalAmountReceived,
		&p.LeadDepartmentID, &p.LeadDepartmentName, &p.RawInvestigators, &p.WorkflowStatus,
		&p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	p.Members, _ = r.getProjectMembers(ctx, p.ID)
	p.Departments, _ = r.getProjectDepartments(ctx, p.ID)
	p.Grants, _ = r.ListGrants(ctx, p.ID)
	return &p, nil
}

func (r *pgRepository) CreateProject(ctx context.Context, userID string, req *CreateProjectRequest) (*Project, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer func() { _ = tx.Rollback(ctx) }()

	var createdBy *string
	if userID != "" {
		createdBy = &userID
	}

	querySQL := `
		INSERT INTO projects (
			title, project_number, sponsor, scheme, status, start_date, end_date, year,
			total_sanctioned_amount, total_amount_received, lead_department_id, raw_investigators, workflow_status, created_by
		) VALUES (
			$1, $2, $3, $4, $5, $6::date, $7::date, $8, $9, $10, $11, $12, 'DRAFT', $13
		)
		RETURNING id
	`
	var projectID string
	err = tx.QueryRow(ctx, querySQL,
		req.Title, req.ProjectNumber, req.Sponsor, req.Scheme, req.Status, req.StartDate, req.EndDate, req.Year,
		req.TotalSanctionedAmount, req.TotalAmountReceived, req.LeadDepartmentID, req.RawInvestigators, createdBy,
	).Scan(&projectID)
	if err != nil {
		return nil, err
	}

	for _, m := range req.Members {
		memQuery := `INSERT INTO project_members (project_id, faculty_id, member_name, role, member_order) VALUES ($1, $2, $3, $4, $5)`
		if _, err := tx.Exec(ctx, memQuery, projectID, m.FacultyID, m.MemberName, m.Role, m.MemberOrder); err != nil {
			return nil, err
		}
	}

	leadDeptQuery := `INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ($1, $2, TRUE)`
	if _, err := tx.Exec(ctx, leadDeptQuery, projectID, req.LeadDepartmentID); err != nil {
		return nil, err
	}

	for _, deptID := range req.DepartmentIDs {
		if deptID != req.LeadDepartmentID {
			otherDeptQuery := `INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ($1, $2, FALSE) ON CONFLICT DO NOTHING`
			if _, err := tx.Exec(ctx, otherDeptQuery, projectID, deptID); err != nil {
				return nil, err
			}
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}

	return r.GetProjectByID(ctx, projectID)
}

func (r *pgRepository) CreateGrant(ctx context.Context, projectID string, req *CreateGrantRequest) (*Grant, error) {
	querySQL := `
		INSERT INTO grants (project_id, financial_year_id, sanction_order_number, sanctioned_amount, received_amount, expenditure_amount, received_date)
		VALUES ($1, $2, $3, $4, $5, $6, $7::date)
		RETURNING id, project_id, financial_year_id, sanction_order_number, sanctioned_amount, received_amount, expenditure_amount, received_date::text, created_at, updated_at
	`
	var g Grant
	err := r.pool.QueryRow(ctx, querySQL, projectID, req.FinancialYearID, req.SanctionOrderNumber, req.SanctionedAmount, req.ReceivedAmount, req.ExpenditureAmount, req.ReceivedDate).Scan(
		&g.ID, &g.ProjectID, &g.FinancialYearID, &g.SanctionOrderNumber, &g.SanctionedAmount, &g.ReceivedAmount, &g.ExpenditureAmount, &g.ReceivedDate, &g.CreatedAt, &g.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &g, nil
}

func (r *pgRepository) ListGrants(ctx context.Context, projectID string) ([]Grant, error) {
	querySQL := `
		SELECT g.id, g.project_id, g.financial_year_id, COALESCE(fy.label, ''), g.sanction_order_number,
		       g.sanctioned_amount, g.received_amount, g.expenditure_amount, g.received_date::text, g.created_at, g.updated_at
		FROM grants g
		LEFT JOIN financial_years fy ON fy.id = g.financial_year_id
		WHERE g.project_id = $1
		ORDER BY g.created_at DESC
	`
	rows, err := r.pool.Query(ctx, querySQL, projectID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Grant
	for rows.Next() {
		var g Grant
		if err := rows.Scan(
			&g.ID, &g.ProjectID, &g.FinancialYearID, &g.FinancialYearLabel, &g.SanctionOrderNumber,
			&g.SanctionedAmount, &g.ReceivedAmount, &g.ExpenditureAmount, &g.ReceivedDate, &g.CreatedAt, &g.UpdatedAt,
		); err != nil {
			return nil, err
		}
		list = append(list, g)
	}
	return list, rows.Err()
}

// ----------------------------------------------------------------------------
// CONSULTANCIES
// ----------------------------------------------------------------------------

func (r *pgRepository) ListConsultancies(ctx context.Context, deptID, facultyID string, year *int) ([]Consultancy, error) {
	querySQL := `
		SELECT DISTINCT c.id, c.department_id, d.name, c.title, c.client_name, c.consultancy_number,
		       c.status, c.sanctioned_amount, c.start_date::text, c.end_date::text, c.year, c.raw_faculty, c.created_at, c.updated_at
		FROM consultancies c
		JOIN departments d ON d.id = c.department_id
		LEFT JOIN consultancy_members cm ON cm.consultancy_id = c.id
		WHERE c.deleted_at IS NULL
		  AND ($1 = '' OR c.department_id::text = $1)
		  AND ($2 = '' OR cm.faculty_id::text = $2)
		  AND ($3::int IS NULL OR c.year = $3)
		ORDER BY c.year DESC, c.created_at DESC
	`
	rows, err := r.pool.Query(ctx, querySQL, deptID, facultyID, year)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Consultancy
	for rows.Next() {
		var c Consultancy
		if err := rows.Scan(
			&c.ID, &c.DepartmentID, &c.DepartmentName, &c.Title, &c.ClientName, &c.ConsultancyNumber,
			&c.Status, &c.SanctionedAmount, &c.StartDate, &c.EndDate, &c.Year, &c.RawFaculty, &c.CreatedAt, &c.UpdatedAt,
		); err != nil {
			return nil, err
		}
		list = append(list, c)
	}

	for i := range list {
		list[i].Members, _ = r.getConsultancyMembers(ctx, list[i].ID)
	}

	return list, rows.Err()
}

func (r *pgRepository) getConsultancyMembers(ctx context.Context, consultancyID string) ([]ConsultancyMember, error) {
	querySQL := `SELECT id, consultancy_id, faculty_id, member_name, role FROM consultancy_members WHERE consultancy_id = $1`
	rows, err := r.pool.Query(ctx, querySQL, consultancyID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []ConsultancyMember
	for rows.Next() {
		var m ConsultancyMember
		if err := rows.Scan(&m.ID, &m.ConsultancyID, &m.FacultyID, &m.MemberName, &m.Role); err != nil {
			return nil, err
		}
		list = append(list, m)
	}
	return list, rows.Err()
}

func (r *pgRepository) CreateConsultancy(ctx context.Context, userID string, req *CreateConsultancyRequest) (*Consultancy, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer func() { _ = tx.Rollback(ctx) }()

	querySQL := `
		INSERT INTO consultancies (department_id, title, client_name, consultancy_number, status, sanctioned_amount, start_date, end_date, year, raw_faculty)
		VALUES ($1, $2, $3, $4, $5, $6, $7::date, $8::date, $9, $10)
		RETURNING id
	`
	var cid string
	err = tx.QueryRow(ctx, querySQL, req.DepartmentID, req.Title, req.ClientName, req.ConsultancyNumber, req.Status, req.SanctionedAmount, req.StartDate, req.EndDate, req.Year, req.RawFaculty).Scan(&cid)
	if err != nil {
		return nil, err
	}

	for _, m := range req.Members {
		memQuery := `INSERT INTO consultancy_members (consultancy_id, faculty_id, member_name, role) VALUES ($1, $2, $3, $4)`
		if _, err := tx.Exec(ctx, memQuery, cid, m.FacultyID, m.MemberName, m.Role); err != nil {
			return nil, err
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}

	list, err := r.ListConsultancies(ctx, req.DepartmentID, "", &req.Year)
	if err != nil {
		return nil, err
	}
	for _, item := range list {
		if item.ID == cid {
			return &item, nil
		}
	}
	return nil, nil
}

// ----------------------------------------------------------------------------
// SUPERVISIONS
// ----------------------------------------------------------------------------

func (r *pgRepository) ListSupervisions(ctx context.Context, deptID, facultyID, status, level string) ([]Supervision, error) {
	querySQL := `
		SELECT DISTINCT s.id, s.department_id, d.name, s.programme_level, s.scholar_name, s.roll_number,
		       s.thesis_title, s.status, s.registration_date::text, s.submission_date::text, s.award_date::text,
		       s.raw_supervisors, s.created_at, s.updated_at
		FROM supervisions s
		JOIN departments d ON d.id = s.department_id
		LEFT JOIN supervision_supervisors ss ON ss.supervision_id = s.id
		WHERE s.deleted_at IS NULL
		  AND ($1 = '' OR s.department_id::text = $1)
		  AND ($2 = '' OR ss.faculty_id::text = $2)
		  AND ($3 = '' OR s.status = $3)
		  AND ($4 = '' OR s.programme_level = $4)
		ORDER BY s.created_at DESC
	`
	rows, err := r.pool.Query(ctx, querySQL, deptID, facultyID, status, level)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Supervision
	for rows.Next() {
		var s Supervision
		if err := rows.Scan(
			&s.ID, &s.DepartmentID, &s.DepartmentName, &s.ProgrammeLevel, &s.ScholarName, &s.RollNumber,
			&s.ThesisTitle, &s.Status, &s.RegistrationDate, &s.SubmissionDate, &s.AwardDate,
			&s.RawSupervisors, &s.CreatedAt, &s.UpdatedAt,
		); err != nil {
			return nil, err
		}
		list = append(list, s)
	}

	for i := range list {
		list[i].Supervisors, _ = r.getSupervisors(ctx, list[i].ID)
	}

	return list, rows.Err()
}

func (r *pgRepository) getSupervisors(ctx context.Context, supervisionID string) ([]SupervisionSupervisor, error) {
	querySQL := `SELECT id, supervision_id, faculty_id, supervisor_name, role, supervisor_order FROM supervision_supervisors WHERE supervision_id = $1 ORDER BY supervisor_order ASC`
	rows, err := r.pool.Query(ctx, querySQL, supervisionID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []SupervisionSupervisor
	for rows.Next() {
		var ss SupervisionSupervisor
		if err := rows.Scan(&ss.ID, &ss.SupervisionID, &ss.FacultyID, &ss.SupervisorName, &ss.Role, &ss.SupervisorOrder); err != nil {
			return nil, err
		}
		list = append(list, ss)
	}
	return list, rows.Err()
}

func (r *pgRepository) CreateSupervision(ctx context.Context, userID string, req *CreateSupervisionRequest) (*Supervision, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer func() { _ = tx.Rollback(ctx) }()

	querySQL := `
		INSERT INTO supervisions (department_id, programme_level, scholar_name, roll_number, thesis_title, status, registration_date, submission_date, award_date, raw_supervisors)
		VALUES ($1, $2, $3, $4, $5, $6, $7::date, $8::date, $9::date, $10)
		RETURNING id
	`
	var sid string
	err = tx.QueryRow(ctx, querySQL, req.DepartmentID, req.ProgrammeLevel, req.ScholarName, req.RollNumber, req.ThesisTitle, req.Status, req.RegistrationDate, req.SubmissionDate, req.AwardDate, req.RawSupervisors).Scan(&sid)
	if err != nil {
		return nil, err
	}

	for _, s := range req.Supervisors {
		supQuery := `INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role, supervisor_order) VALUES ($1, $2, $3, $4, $5)`
		if _, err := tx.Exec(ctx, supQuery, sid, s.FacultyID, s.SupervisorName, s.Role, s.SupervisorOrder); err != nil {
			return nil, err
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}

	list, err := r.ListSupervisions(ctx, req.DepartmentID, "", req.Status, req.ProgrammeLevel)
	if err != nil {
		return nil, err
	}
	for _, item := range list {
		if item.ID == sid {
			return &item, nil
		}
	}
	return nil, nil
}

// ----------------------------------------------------------------------------
// EVENTS
// ----------------------------------------------------------------------------

func (r *pgRepository) ListEvents(ctx context.Context, deptID, facultyID, eventType string, year *int) ([]Event, error) {
	querySQL := `
		SELECT DISTINCT e.id, e.department_id, d.name, e.title, e.event_type, e.venue, e.sponsor,
		       e.start_date::text, e.end_date::text, e.year, e.raw_coordinators, e.created_at, e.updated_at
		FROM events e
		JOIN departments d ON d.id = e.department_id
		LEFT JOIN event_coordinators ec ON ec.event_id = e.id
		WHERE e.deleted_at IS NULL
		  AND ($1 = '' OR e.department_id::text = $1)
		  AND ($2 = '' OR ec.faculty_id::text = $2)
		  AND ($3 = '' OR e.event_type = $3)
		  AND ($4::int IS NULL OR e.year = $4)
		ORDER BY e.start_date::text DESC
	`
	rows, err := r.pool.Query(ctx, querySQL, deptID, facultyID, eventType, year)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Event
	for rows.Next() {
		var e Event
		if err := rows.Scan(
			&e.ID, &e.DepartmentID, &e.DepartmentName, &e.Title, &e.EventType, &e.Venue, &e.Sponsor,
			&e.StartDate, &e.EndDate, &e.Year, &e.RawCoordinators, &e.CreatedAt, &e.UpdatedAt,
		); err != nil {
			return nil, err
		}
		list = append(list, e)
	}

	for i := range list {
		list[i].Coordinators, _ = r.getEventCoordinators(ctx, list[i].ID)
	}

	return list, rows.Err()
}

func (r *pgRepository) getEventCoordinators(ctx context.Context, eventID string) ([]EventCoordinator, error) {
	querySQL := `SELECT id, event_id, faculty_id, coordinator_name, role FROM event_coordinators WHERE event_id = $1`
	rows, err := r.pool.Query(ctx, querySQL, eventID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []EventCoordinator
	for rows.Next() {
		var ec EventCoordinator
		if err := rows.Scan(&ec.ID, &ec.EventID, &ec.FacultyID, &ec.CoordinatorName, &ec.Role); err != nil {
			return nil, err
		}
		list = append(list, ec)
	}
	return list, rows.Err()
}

func (r *pgRepository) CreateEvent(ctx context.Context, userID string, req *CreateEventRequest) (*Event, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer func() { _ = tx.Rollback(ctx) }()

	querySQL := `
		INSERT INTO events (department_id, title, event_type, venue, sponsor, start_date, end_date, year, raw_coordinators)
		VALUES ($1, $2, $3, $4, $5, $6::date, $7::date, $8, $9)
		RETURNING id
	`
	var eid string
	err = tx.QueryRow(ctx, querySQL, req.DepartmentID, req.Title, req.EventType, req.Venue, req.Sponsor, req.StartDate, req.EndDate, req.Year, req.RawCoordinators).Scan(&eid)
	if err != nil {
		return nil, err
	}

	for _, c := range req.Coordinators {
		coordQuery := `INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role) VALUES ($1, $2, $3, $4)`
		if _, err := tx.Exec(ctx, coordQuery, eid, c.FacultyID, c.CoordinatorName, c.Role); err != nil {
			return nil, err
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}

	list, err := r.ListEvents(ctx, req.DepartmentID, "", req.EventType, &req.Year)
	if err != nil {
		return nil, err
	}
	for _, item := range list {
		if item.ID == eid {
			return &item, nil
		}
	}
	return nil, nil
}

// ----------------------------------------------------------------------------
// COURSES
// ----------------------------------------------------------------------------

func (r *pgRepository) ListCourses(ctx context.Context, deptID, programmeID string) ([]Course, error) {
	querySQL := `
		SELECT c.id, c.department_id, d.name, c.programme_id, c.code, c.name, c.credits, c.semester, c.course_level, c.description, c.created_at, c.updated_at
		FROM courses c
		JOIN departments d ON d.id = c.department_id
		WHERE c.deleted_at IS NULL
		  AND ($1 = '' OR c.department_id::text = $1)
		  AND ($2 = '' OR c.programme_id::text = $2)
		ORDER BY c.code ASC
	`
	rows, err := r.pool.Query(ctx, querySQL, deptID, programmeID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Course
	for rows.Next() {
		var c Course
		if err := rows.Scan(&c.ID, &c.DepartmentID, &c.DepartmentName, &c.ProgrammeID, &c.Code, &c.Name, &c.Credits, &c.Semester, &c.CourseLevel, &c.Description, &c.CreatedAt, &c.UpdatedAt); err != nil {
			return nil, err
		}
		list = append(list, c)
	}
	return list, rows.Err()
}

func (r *pgRepository) CreateCourse(ctx context.Context, req *CreateCourseRequest) (*Course, error) {
	querySQL := `
		INSERT INTO courses (department_id, programme_id, code, name, credits, semester, course_level, description)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, department_id, code, name, credits, semester, course_level, description, created_at, updated_at
	`
	var c Course
	err := r.pool.QueryRow(ctx, querySQL, req.DepartmentID, req.ProgrammeID, req.Code, req.Name, req.Credits, req.Semester, req.CourseLevel, req.Description).Scan(
		&c.ID, &c.DepartmentID, &c.Code, &c.Name, &c.Credits, &c.Semester, &c.CourseLevel, &c.Description, &c.CreatedAt, &c.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &c, nil
}
