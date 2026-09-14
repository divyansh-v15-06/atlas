package cms

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	// Announcements
	ListAnnouncements(ctx context.Context, deptID string, includePrivate bool) ([]Announcement, error)
	CreateAnnouncement(ctx context.Context, userID string, req *CreateAnnouncementRequest) (*Announcement, error)
	DeleteAnnouncement(ctx context.Context, id string) error

	// Posts
	ListPosts(ctx context.Context, deptID, category string) ([]Post, error)
	CreatePost(ctx context.Context, userID string, req *CreatePostRequest) (*Post, error)
	DeletePost(ctx context.Context, id string) error

	// About Sections
	ListAboutSections(ctx context.Context, deptID string) ([]AboutSection, error)
	CreateAboutSection(ctx context.Context, req *CreateAboutSectionRequest) (*AboutSection, error)

	// Programmes Offered
	ListProgrammesOffered(ctx context.Context, deptID string) ([]ProgrammeOffered, error)
	CreateProgrammeOffered(ctx context.Context, req *CreateProgrammeOfferedRequest) (*ProgrammeOffered, error)

	// QnA
	ListQnA(ctx context.Context, deptID string) ([]QnA, error)
	CreateQnA(ctx context.Context, req *CreateQnARequest) (*QnA, error)

	// HOD Message
	GetHODMessage(ctx context.Context, deptID string) (*HODMessage, error)
	CreateHODMessage(ctx context.Context, req *CreateHODMessageRequest) (*HODMessage, error)

	// Home Slides
	ListHomeSlides(ctx context.Context, deptID string) ([]HomeSlide, error)
	CreateHomeSlide(ctx context.Context, req *CreateHomeSlideRequest) (*HomeSlide, error)

	// Syllabus & Calendar Docs
	ListSyllabusDocs(ctx context.Context, deptID string) ([]SyllabusDoc, error)
	ListCalendarDocs(ctx context.Context, deptID string) ([]CalendarDoc, error)
}

type pgRepository struct {
	pool *pgxpool.Pool
}

func NewRepository(pool *pgxpool.Pool) Repository {
	return &pgRepository{pool: pool}
}

func (r *pgRepository) ListAnnouncements(ctx context.Context, deptID string, includePrivate bool) ([]Announcement, error) {
	querySQL := `
		SELECT a.id, a.department_id, COALESCE(d.name, 'Institute-wide'), a.title, a.body,
		       a.publish_date::text, a.expiry_date::text, a.is_private, a.attached_document_id, doc.source_url, a.created_at, a.updated_at
		FROM announcements a
		LEFT JOIN departments d ON d.id = a.department_id
		LEFT JOIN documents doc ON doc.id = a.attached_document_id
		WHERE a.deleted_at IS NULL
		  AND (a.department_id::text = $1 OR a.department_id IS NULL OR $1 = '')
		  AND ($2::boolean = TRUE OR a.is_private = FALSE)
		ORDER BY a.publish_date DESC
	`
	rows, err := r.pool.Query(ctx, querySQL, deptID, includePrivate)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Announcement
	for rows.Next() {
		var a Announcement
		if err := rows.Scan(
			&a.ID, &a.DepartmentID, &a.DepartmentName, &a.Title, &a.Body,
			&a.PublishDate, &a.ExpiryDate, &a.IsPrivate, &a.AttachedDocumentID, &a.DocumentURL, &a.CreatedAt, &a.UpdatedAt,
		); err != nil {
			return nil, err
		}
		list = append(list, a)
	}
	return list, rows.Err()
}

func (r *pgRepository) CreateAnnouncement(ctx context.Context, userID string, req *CreateAnnouncementRequest) (*Announcement, error) {
	var createdBy *string
	if userID != "" {
		createdBy = &userID
	}
	querySQL := `
		INSERT INTO announcements (department_id, title, body, publish_date, expiry_date, is_private, attached_document_id, created_by)
		VALUES ($1, $2, $3, COALESCE($4::date, CURRENT_DATE), $5::date, $6, $7, $8)
		RETURNING id, department_id, title, body, publish_date::text, expiry_date::text, is_private, attached_document_id, created_at, updated_at
	`
	var a Announcement
	err := r.pool.QueryRow(ctx, querySQL, req.DepartmentID, req.Title, req.Body, req.PublishDate, req.ExpiryDate, req.IsPrivate, req.AttachedDocumentID, createdBy).Scan(
		&a.ID, &a.DepartmentID, &a.Title, &a.Body, &a.PublishDate, &a.ExpiryDate, &a.IsPrivate, &a.AttachedDocumentID, &a.CreatedAt, &a.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &a, nil
}

func (r *pgRepository) DeleteAnnouncement(ctx context.Context, id string) error {
	querySQL := `UPDATE announcements SET deleted_at = NOW() WHERE id = $1`
	_, err := r.pool.Exec(ctx, querySQL, id)
	return err
}

func (r *pgRepository) ListPosts(ctx context.Context, deptID, category string) ([]Post, error) {
	querySQL := `
		SELECT p.id, p.department_id, COALESCE(d.name, 'Institute-wide'), p.category, p.title, p.slug, p.body,
		       p.publish_date::text, p.feature_image_document_id, fdoc.source_url, p.attached_document_id, adoc.source_url,
		       p.created_at, p.updated_at
		FROM posts p
		LEFT JOIN departments d ON d.id = p.department_id
		LEFT JOIN documents fdoc ON fdoc.id = p.feature_image_document_id
		LEFT JOIN documents adoc ON adoc.id = p.attached_document_id
		WHERE p.deleted_at IS NULL
		  AND (p.department_id::text = $1 OR p.department_id IS NULL OR $1 = '')
		  AND ($2 = '' OR p.category = $2)
		ORDER BY p.publish_date DESC
	`
	rows, err := r.pool.Query(ctx, querySQL, deptID, category)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Post
	for rows.Next() {
		var p Post
		if err := rows.Scan(
			&p.ID, &p.DepartmentID, &p.DepartmentName, &p.Category, &p.Title, &p.Slug, &p.Body,
			&p.PublishDate, &p.FeatureImageDocID, &p.FeatureImageURL, &p.AttachedDocumentID, &p.DocumentURL,
			&p.CreatedAt, &p.UpdatedAt,
		); err != nil {
			return nil, err
		}
		list = append(list, p)
	}
	return list, rows.Err()
}

func (r *pgRepository) CreatePost(ctx context.Context, userID string, req *CreatePostRequest) (*Post, error) {
	var createdBy *string
	if userID != "" {
		createdBy = &userID
	}
	querySQL := `
		INSERT INTO posts (department_id, category, title, slug, body, publish_date, feature_image_document_id, attached_document_id, created_by)
		VALUES ($1, $2, $3, $4, $5, COALESCE($6::date, CURRENT_DATE), $7, $8, $9)
		RETURNING id, department_id, category, title, slug, body, publish_date::text, feature_image_document_id, attached_document_id, created_at, updated_at
	`
	var p Post
	err := r.pool.QueryRow(ctx, querySQL, req.DepartmentID, req.Category, req.Title, req.Slug, req.Body, req.PublishDate, req.FeatureImageDocID, req.AttachedDocumentID, createdBy).Scan(
		&p.ID, &p.DepartmentID, &p.Category, &p.Title, &p.Slug, &p.Body, &p.PublishDate, &p.FeatureImageDocID, &p.AttachedDocumentID, &p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *pgRepository) DeletePost(ctx context.Context, id string) error {
	querySQL := `UPDATE posts SET deleted_at = NOW() WHERE id = $1`
	_, err := r.pool.Exec(ctx, querySQL, id)
	return err
}

func (r *pgRepository) ListAboutSections(ctx context.Context, deptID string) ([]AboutSection, error) {
	querySQL := `
		SELECT id, department_id, title, body, sort_order, is_published, created_at, updated_at
		FROM about_sections
		WHERE ($1 = '' OR department_id::text = $1) AND deleted_at IS NULL
		ORDER BY sort_order ASC
	`
	rows, err := r.pool.Query(ctx, querySQL, deptID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []AboutSection
	for rows.Next() {
		var a AboutSection
		if err := rows.Scan(&a.ID, &a.DepartmentID, &a.Title, &a.Body, &a.SortOrder, &a.IsPublished, &a.CreatedAt, &a.UpdatedAt); err != nil {
			return nil, err
		}
		list = append(list, a)
	}
	return list, rows.Err()
}

func (r *pgRepository) CreateAboutSection(ctx context.Context, req *CreateAboutSectionRequest) (*AboutSection, error) {
	querySQL := `
		INSERT INTO about_sections (department_id, title, body, sort_order, is_published)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, department_id, title, body, sort_order, is_published, created_at, updated_at
	`
	var a AboutSection
	err := r.pool.QueryRow(ctx, querySQL, req.DepartmentID, req.Title, req.Body, req.SortOrder, req.IsPublished).Scan(
		&a.ID, &a.DepartmentID, &a.Title, &a.Body, &a.SortOrder, &a.IsPublished, &a.CreatedAt, &a.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &a, nil
}

func (r *pgRepository) ListProgrammesOffered(ctx context.Context, deptID string) ([]ProgrammeOffered, error) {
	querySQL := `
		SELECT id, department_id, programme_id, title, body, sort_order, created_at, updated_at
		FROM programmes_offered
		WHERE ($1 = '' OR department_id::text = $1) AND deleted_at IS NULL
		ORDER BY sort_order ASC
	`
	rows, err := r.pool.Query(ctx, querySQL, deptID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []ProgrammeOffered
	for rows.Next() {
		var p ProgrammeOffered
		if err := rows.Scan(&p.ID, &p.DepartmentID, &p.ProgrammeID, &p.Title, &p.Body, &p.SortOrder, &p.CreatedAt, &p.UpdatedAt); err != nil {
			return nil, err
		}
		list = append(list, p)
	}
	return list, rows.Err()
}

func (r *pgRepository) CreateProgrammeOffered(ctx context.Context, req *CreateProgrammeOfferedRequest) (*ProgrammeOffered, error) {
	querySQL := `
		INSERT INTO programmes_offered (department_id, programme_id, title, body, sort_order)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, department_id, programme_id, title, body, sort_order, created_at, updated_at
	`
	var p ProgrammeOffered
	err := r.pool.QueryRow(ctx, querySQL, req.DepartmentID, req.ProgrammeID, req.Title, req.Body, req.SortOrder).Scan(
		&p.ID, &p.DepartmentID, &p.ProgrammeID, &p.Title, &p.Body, &p.SortOrder, &p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *pgRepository) ListQnA(ctx context.Context, deptID string) ([]QnA, error) {
	querySQL := `
		SELECT id, department_id, question, answer, sort_order, created_at, updated_at
		FROM qna
		WHERE ($1 = '' OR department_id::text = $1) AND deleted_at IS NULL
		ORDER BY sort_order ASC
	`
	rows, err := r.pool.Query(ctx, querySQL, deptID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []QnA
	for rows.Next() {
		var q QnA
		if err := rows.Scan(&q.ID, &q.DepartmentID, &q.Question, &q.Answer, &q.SortOrder, &q.CreatedAt, &q.UpdatedAt); err != nil {
			return nil, err
		}
		list = append(list, q)
	}
	return list, rows.Err()
}

func (r *pgRepository) CreateQnA(ctx context.Context, req *CreateQnARequest) (*QnA, error) {
	querySQL := `
		INSERT INTO qna (department_id, question, answer, sort_order)
		VALUES ($1, $2, $3, $4)
		RETURNING id, department_id, question, answer, sort_order, created_at, updated_at
	`
	var q QnA
	err := r.pool.QueryRow(ctx, querySQL, req.DepartmentID, req.Question, req.Answer, req.SortOrder).Scan(
		&q.ID, &q.DepartmentID, &q.Question, &q.Answer, &q.SortOrder, &q.CreatedAt, &q.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &q, nil
}

func (r *pgRepository) GetHODMessage(ctx context.Context, deptID string) (*HODMessage, error) {
	querySQL := `
		SELECT h.id, h.department_id, d.name, h.faculty_id, h.hod_name, h.message, h.image_url, h.publish_date::text, h.created_at, h.updated_at
		FROM hod_messages h
		JOIN departments d ON d.id = h.department_id
		WHERE ($1 = '' OR h.department_id::text = $1 OR d.code ILIKE $1 OR d.slug ILIKE $1) AND h.deleted_at IS NULL
		ORDER BY h.publish_date DESC
		LIMIT 1
	`
	var h HODMessage
	err := r.pool.QueryRow(ctx, querySQL, deptID).Scan(
		&h.ID, &h.DepartmentID, &h.DepartmentName, &h.FacultyID, &h.HODName, &h.Message, &h.ImageURL, &h.PublishDate, &h.CreatedAt, &h.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &h, nil
}

func (r *pgRepository) CreateHODMessage(ctx context.Context, req *CreateHODMessageRequest) (*HODMessage, error) {
	querySQL := `
		INSERT INTO hod_messages (department_id, faculty_id, hod_name, message, image_url, publish_date)
		VALUES ($1, $2, $3, $4, $5, COALESCE($6::date, CURRENT_DATE))
		RETURNING id, department_id, faculty_id, hod_name, message, image_url, publish_date::text, created_at, updated_at
	`
	var h HODMessage
	err := r.pool.QueryRow(ctx, querySQL, req.DepartmentID, req.FacultyID, req.HODName, req.Message, req.ImageURL, req.PublishDate).Scan(
		&h.ID, &h.DepartmentID, &h.FacultyID, &h.HODName, &h.Message, &h.ImageURL, &h.PublishDate, &h.CreatedAt, &h.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &h, nil
}

func (r *pgRepository) ListHomeSlides(ctx context.Context, deptID string) ([]HomeSlide, error) {
	querySQL := `
		SELECT s.id, s.department_id, s.title, s.link_url, s.image_url, s.sort_order, s.is_active, s.created_at, s.updated_at
		FROM home_slides s
		LEFT JOIN departments d ON d.id = s.department_id
		WHERE (s.department_id::text = $1 OR d.code ILIKE $1 OR d.slug ILIKE $1 OR s.department_id IS NULL OR $1 = '') 
		  AND s.deleted_at IS NULL AND s.is_active = TRUE
		ORDER BY s.sort_order ASC
	`
	rows, err := r.pool.Query(ctx, querySQL, deptID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []HomeSlide
	for rows.Next() {
		var s HomeSlide
		if err := rows.Scan(&s.ID, &s.DepartmentID, &s.Title, &s.LinkURL, &s.ImageURL, &s.SortOrder, &s.IsActive, &s.CreatedAt, &s.UpdatedAt); err != nil {
			return nil, err
		}
		list = append(list, s)
	}
	return list, rows.Err()
}

func (r *pgRepository) CreateHomeSlide(ctx context.Context, req *CreateHomeSlideRequest) (*HomeSlide, error) {
	querySQL := `
		INSERT INTO home_slides (department_id, title, link_url, image_url, sort_order, is_active)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, department_id, title, link_url, image_url, sort_order, is_active, created_at, updated_at
	`
	var s HomeSlide
	err := r.pool.QueryRow(ctx, querySQL, req.DepartmentID, req.Title, req.LinkURL, req.ImageURL, req.SortOrder, req.IsActive).Scan(
		&s.ID, &s.DepartmentID, &s.Title, &s.LinkURL, &s.ImageURL, &s.SortOrder, &s.IsActive, &s.CreatedAt, &s.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &s, nil
}

func (r *pgRepository) ListSyllabusDocs(ctx context.Context, deptID string) ([]SyllabusDoc, error) {
	querySQL := `
		SELECT sd.id, sd.department_id, sd.programme_id, COALESCE(p.name, ''), sd.academic_year_id, sd.title, sd.document_id, d.source_url, sd.created_at, sd.updated_at
		FROM syllabus_documents sd
		LEFT JOIN programmes p ON p.id = sd.programme_id
		JOIN documents d ON d.id = sd.document_id
		WHERE ($1 = '' OR sd.department_id::text = $1) AND sd.deleted_at IS NULL
		ORDER BY sd.title ASC
	`
	rows, err := r.pool.Query(ctx, querySQL, deptID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []SyllabusDoc
	for rows.Next() {
		var s SyllabusDoc
		if err := rows.Scan(&s.ID, &s.DepartmentID, &s.ProgrammeID, &s.ProgrammeName, &s.AcademicYearID, &s.Title, &s.DocumentID, &s.DocumentURL, &s.CreatedAt, &s.UpdatedAt); err != nil {
			return nil, err
		}
		list = append(list, s)
	}
	return list, rows.Err()
}

func (r *pgRepository) ListCalendarDocs(ctx context.Context, deptID string) ([]CalendarDoc, error) {
	querySQL := `
		SELECT cd.id, cd.department_id, cd.academic_year_id, cd.title, cd.document_id, d.source_url, cd.created_at, cd.updated_at
		FROM calendar_documents cd
		JOIN documents d ON d.id = cd.document_id
		WHERE ($1 = '' OR cd.department_id::text = $1) AND cd.deleted_at IS NULL
		ORDER BY cd.created_at DESC
	`
	rows, err := r.pool.Query(ctx, querySQL, deptID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []CalendarDoc
	for rows.Next() {
		var c CalendarDoc
		if err := rows.Scan(&c.ID, &c.DepartmentID, &c.AcademicYearID, &c.Title, &c.DocumentID, &c.DocumentURL, &c.CreatedAt, &c.UpdatedAt); err != nil {
			return nil, err
		}
		list = append(list, c)
	}
	return list, rows.Err()
}
