package operations

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	// Students
	ListStudents(ctx context.Context, deptID, programmeID string, year *int, search string) ([]Student, error)
	CreateStudent(ctx context.Context, req *CreateStudentRequest) (*Student, error)
	DeleteStudent(ctx context.Context, id string) error

	// PhD Scholars
	ListPhdScholars(ctx context.Context, deptID, status string) ([]PhdScholar, error)
	CreatePhdScholar(ctx context.Context, req *CreatePhdScholarRequest) (*PhdScholar, error)
	DeletePhdScholar(ctx context.Context, id string) error

	// Staff
	ListStaff(ctx context.Context, deptID string) ([]Staff, error)
	CreateStaff(ctx context.Context, req *CreateStaffRequest) (*Staff, error)
	DeleteStaff(ctx context.Context, id string) error

	// Labs & Equipment
	ListLabs(ctx context.Context, deptID string) ([]Lab, error)
	CreateLab(ctx context.Context, req *CreateLabRequest) (*Lab, error)
	ListEquipment(ctx context.Context, deptID, labID string) ([]Equipment, error)
	CreateEquipment(ctx context.Context, req *CreateEquipmentRequest) (*Equipment, error)
	DeleteEquipment(ctx context.Context, id string) error

	// Placement Stats
	ListPlacementStats(ctx context.Context, deptID string, year *int) ([]PlacementStat, error)
	CreatePlacementStat(ctx context.Context, req *CreatePlacementStatRequest) (*PlacementStat, error)
}

type pgRepository struct {
	pool *pgxpool.Pool
}

func NewRepository(pool *pgxpool.Pool) Repository {
	return &pgRepository{pool: pool}
}

func (r *pgRepository) ListStudents(ctx context.Context, deptID, programmeID string, year *int, search string) ([]Student, error) {
	querySQL := `
		SELECT s.id, s.department_id, d.name, s.programme_id, p.name, p.code,
		       s.roll_number, s.full_name, s.admission_year, s.current_semester, s.email, s.photo_url, s.created_at, s.updated_at
		FROM students s
		JOIN departments d ON d.id = s.department_id
		JOIN programmes p ON p.id = s.programme_id
		WHERE s.deleted_at IS NULL
		  AND ($1 = '' OR s.department_id::text = $1)
		  AND ($2 = '' OR s.programme_id::text = $2)
		  AND ($3::int IS NULL OR s.admission_year = $3)
		  AND ($4 = '' OR s.full_name ILIKE '%' || $4 || '%' OR s.roll_number ILIKE '%' || $4 || '%')
		ORDER BY s.admission_year DESC, s.roll_number ASC
	`
	rows, err := r.pool.Query(ctx, querySQL, deptID, programmeID, year, search)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Student
	for rows.Next() {
		var s Student
		if err := rows.Scan(
			&s.ID, &s.DepartmentID, &s.DepartmentName, &s.ProgrammeID, &s.ProgrammeName, &s.ProgrammeCode,
			&s.RollNumber, &s.FullName, &s.AdmissionYear, &s.CurrentSemester, &s.Email, &s.PhotoURL, &s.CreatedAt, &s.UpdatedAt,
		); err != nil {
			return nil, err
		}
		list = append(list, s)
	}
	return list, rows.Err()
}

func (r *pgRepository) CreateStudent(ctx context.Context, req *CreateStudentRequest) (*Student, error) {
	querySQL := `
		INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url, created_at, updated_at
	`
	var s Student
	err := r.pool.QueryRow(ctx, querySQL, req.DepartmentID, req.ProgrammeID, req.RollNumber, req.FullName, req.AdmissionYear, req.CurrentSemester, req.Email, req.PhotoURL).Scan(
		&s.ID, &s.DepartmentID, &s.ProgrammeID, &s.RollNumber, &s.FullName, &s.AdmissionYear, &s.CurrentSemester, &s.Email, &s.PhotoURL, &s.CreatedAt, &s.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &s, nil
}

func (r *pgRepository) DeleteStudent(ctx context.Context, id string) error {
	querySQL := `UPDATE students SET deleted_at = NOW() WHERE id = $1`
	_, err := r.pool.Exec(ctx, querySQL, id)
	return err
}

func (r *pgRepository) ListPhdScholars(ctx context.Context, deptID, status string) ([]PhdScholar, error) {
	querySQL := `
		SELECT ps.id, ps.department_id, d.name, ps.full_name, ps.roll_number,
		       ps.registration_date::text, ps.dissertation_title, ps.supervisor_name,
		       ps.status, ps.email, ps.contact_number, ps.time_note, ps.created_at, ps.updated_at
		FROM phd_scholars ps
		JOIN departments d ON d.id = ps.department_id
		WHERE ps.deleted_at IS NULL
		  AND ($1 = '' OR ps.department_id::text = $1)
		  AND ($2 = '' OR ps.status = $2)
		ORDER BY ps.created_at DESC
	`
	rows, err := r.pool.Query(ctx, querySQL, deptID, status)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []PhdScholar
	for rows.Next() {
		var ps PhdScholar
		if err := rows.Scan(
			&ps.ID, &ps.DepartmentID, &ps.DepartmentName, &ps.FullName, &ps.RollNumber,
			&ps.RegistrationDate, &ps.DissertationTitle, &ps.SupervisorName,
			&ps.Status, &ps.Email, &ps.ContactNumber, &ps.TimeNote, &ps.CreatedAt, &ps.UpdatedAt,
		); err != nil {
			return nil, err
		}
		list = append(list, ps)
	}
	return list, rows.Err()
}

func (r *pgRepository) CreatePhdScholar(ctx context.Context, req *CreatePhdScholarRequest) (*PhdScholar, error) {
	querySQL := `
		INSERT INTO phd_scholars (department_id, full_name, roll_number, registration_date, dissertation_title, supervisor_name, status, email, contact_number, time_note)
		VALUES ($1, $2, $3, $4::date, $5, $6, $7, $8, $9, $10)
		RETURNING id, department_id, full_name, roll_number, registration_date::text, dissertation_title, supervisor_name, status, email, contact_number, time_note, created_at, updated_at
	`
	var ps PhdScholar
	err := r.pool.QueryRow(ctx, querySQL, req.DepartmentID, req.FullName, req.RollNumber, req.RegistrationDate, req.DissertationTitle, req.SupervisorName, req.Status, req.Email, req.ContactNumber, req.TimeNote).Scan(
		&ps.ID, &ps.DepartmentID, &ps.FullName, &ps.RollNumber, &ps.RegistrationDate, &ps.DissertationTitle, &ps.SupervisorName, &ps.Status, &ps.Email, &ps.ContactNumber, &ps.TimeNote, &ps.CreatedAt, &ps.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &ps, nil
}

func (r *pgRepository) DeletePhdScholar(ctx context.Context, id string) error {
	querySQL := `UPDATE phd_scholars SET deleted_at = NOW() WHERE id = $1`
	_, err := r.pool.Exec(ctx, querySQL, id)
	return err
}

func (r *pgRepository) ListStaff(ctx context.Context, deptID string) ([]Staff, error) {
	querySQL := `
		SELECT s.id, s.department_id, d.name, s.full_name, s.designation, s.email, s.phone, s.photo_url, s.time_note, s.created_at, s.updated_at
		FROM staff s
		JOIN departments d ON d.id = s.department_id
		WHERE s.deleted_at IS NULL
		  AND ($1 = '' OR s.department_id::text = $1)
		ORDER BY s.full_name ASC
	`
	rows, err := r.pool.Query(ctx, querySQL, deptID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Staff
	for rows.Next() {
		var s Staff
		if err := rows.Scan(&s.ID, &s.DepartmentID, &s.DepartmentName, &s.FullName, &s.Designation, &s.Email, &s.Phone, &s.PhotoURL, &s.TimeNote, &s.CreatedAt, &s.UpdatedAt); err != nil {
			return nil, err
		}
		list = append(list, s)
	}
	return list, rows.Err()
}

func (r *pgRepository) CreateStaff(ctx context.Context, req *CreateStaffRequest) (*Staff, error) {
	querySQL := `
		INSERT INTO staff (department_id, full_name, designation, email, phone, photo_url, time_note)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, department_id, full_name, designation, email, phone, photo_url, time_note, created_at, updated_at
	`
	var s Staff
	err := r.pool.QueryRow(ctx, querySQL, req.DepartmentID, req.FullName, req.Designation, req.Email, req.Phone, req.PhotoURL, req.TimeNote).Scan(
		&s.ID, &s.DepartmentID, &s.FullName, &s.Designation, &s.Email, &s.Phone, &s.PhotoURL, &s.TimeNote, &s.CreatedAt, &s.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &s, nil
}

func (r *pgRepository) DeleteStaff(ctx context.Context, id string) error {
	querySQL := `UPDATE staff SET deleted_at = NOW() WHERE id = $1`
	_, err := r.pool.Exec(ctx, querySQL, id)
	return err
}

func (r *pgRepository) ListLabs(ctx context.Context, deptID string) ([]Lab, error) {
	querySQL := `
		SELECT l.id, l.department_id, d.name, l.name, l.description, l.location,
		       l.in_charge_faculty_id, l.raw_in_charge_name, l.technician_name, l.created_at, l.updated_at
		FROM labs l
		JOIN departments d ON d.id = l.department_id
		WHERE l.deleted_at IS NULL
		  AND ($1 = '' OR l.department_id::text = $1)
		ORDER BY l.name ASC
	`
	rows, err := r.pool.Query(ctx, querySQL, deptID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Lab
	for rows.Next() {
		var l Lab
		if err := rows.Scan(&l.ID, &l.DepartmentID, &l.DepartmentName, &l.Name, &l.Description, &l.Location, &l.InChargeFacultyID, &l.RawInChargeName, &l.TechnicianName, &l.CreatedAt, &l.UpdatedAt); err != nil {
			return nil, err
		}
		list = append(list, l)
	}
	return list, rows.Err()
}

func (r *pgRepository) CreateLab(ctx context.Context, req *CreateLabRequest) (*Lab, error) {
	querySQL := `
		INSERT INTO labs (department_id, name, description, location, in_charge_faculty_id, raw_in_charge_name, technician_name)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, department_id, name, description, location, in_charge_faculty_id, raw_in_charge_name, technician_name, created_at, updated_at
	`
	var l Lab
	err := r.pool.QueryRow(ctx, querySQL, req.DepartmentID, req.Name, req.Description, req.Location, req.InChargeFacultyID, req.RawInChargeName, req.TechnicianName).Scan(
		&l.ID, &l.DepartmentID, &l.Name, &l.Description, &l.Location, &l.InChargeFacultyID, &l.RawInChargeName, &l.TechnicianName, &l.CreatedAt, &l.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &l, nil
}

func (r *pgRepository) ListEquipment(ctx context.Context, deptID, labID string) ([]Equipment, error) {
	querySQL := `
		SELECT e.id, e.department_id, d.name, e.lab_id, COALESCE(l.name, ''), e.name, e.asset_tag,
		       e.quantity, e.stock_in_use, e.purchase_value, e.purchase_date::text, e.vendor_name,
		       e.invoice_number, e.indenter_name, e.contact_details, e.created_at, e.updated_at
		FROM equipment e
		JOIN departments d ON d.id = e.department_id
		LEFT JOIN labs l ON l.id = e.lab_id
		WHERE e.deleted_at IS NULL
		  AND ($1 = '' OR e.department_id::text = $1)
		  AND ($2 = '' OR e.lab_id::text = $2)
		ORDER BY e.created_at DESC
	`
	rows, err := r.pool.Query(ctx, querySQL, deptID, labID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Equipment
	for rows.Next() {
		var e Equipment
		if err := rows.Scan(
			&e.ID, &e.DepartmentID, &e.DepartmentName, &e.LabID, &e.LabName, &e.Name, &e.AssetTag,
			&e.Quantity, &e.StockInUse, &e.PurchaseValue, &e.PurchaseDate, &e.VendorName,
			&e.InvoiceNumber, &e.IndenterName, &e.ContactDetails, &e.CreatedAt, &e.UpdatedAt,
		); err != nil {
			return nil, err
		}
		list = append(list, e)
	}
	return list, rows.Err()
}

func (r *pgRepository) CreateEquipment(ctx context.Context, req *CreateEquipmentRequest) (*Equipment, error) {
	querySQL := `
		INSERT INTO equipment (department_id, lab_id, name, asset_tag, quantity, stock_in_use, purchase_value, purchase_date, vendor_name, invoice_number, indenter_name, contact_details)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8::date, $9, $10, $11, $12)
		RETURNING id, department_id, lab_id, name, asset_tag, quantity, stock_in_use, purchase_value, purchase_date::text, vendor_name, invoice_number, indenter_name, contact_details, created_at, updated_at
	`
	var e Equipment
	err := r.pool.QueryRow(ctx, querySQL, req.DepartmentID, req.LabID, req.Name, req.AssetTag, req.Quantity, req.StockInUse, req.PurchaseValue, req.PurchaseDate, req.VendorName, req.InvoiceNumber, req.IndenterName, req.ContactDetails).Scan(
		&e.ID, &e.DepartmentID, &e.LabID, &e.Name, &e.AssetTag, &e.Quantity, &e.StockInUse, &e.PurchaseValue, &e.PurchaseDate, &e.VendorName, &e.InvoiceNumber, &e.IndenterName, &e.ContactDetails, &e.CreatedAt, &e.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &e, nil
}

func (r *pgRepository) DeleteEquipment(ctx context.Context, id string) error {
	querySQL := `UPDATE equipment SET deleted_at = NOW() WHERE id = $1`
	_, err := r.pool.Exec(ctx, querySQL, id)
	return err
}

func (r *pgRepository) ListPlacementStats(ctx context.Context, deptID string, year *int) ([]PlacementStat, error) {
	querySQL := `
		SELECT ps.id, ps.department_id, d.name, ps.academic_year_id, ps.year, ps.programme_branch,
		       ps.graduating_count, ps.placed_count, ps.jobs_offered_count,
		       ps.highest_package_lpa, ps.average_package_lpa, ps.median_package_lpa, ps.created_at, ps.updated_at
		FROM placement_stats ps
		JOIN departments d ON d.id = ps.department_id
		WHERE ps.deleted_at IS NULL
		  AND ($1 = '' OR ps.department_id::text = $1)
		  AND ($2::int IS NULL OR ps.year = $2)
		ORDER BY ps.year DESC
	`
	rows, err := r.pool.Query(ctx, querySQL, deptID, year)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []PlacementStat
	for rows.Next() {
		var ps PlacementStat
		if err := rows.Scan(
			&ps.ID, &ps.DepartmentID, &ps.DepartmentName, &ps.AcademicYearID, &ps.Year, &ps.ProgrammeBranch,
			&ps.GraduatingCount, &ps.PlacedCount, &ps.JobsOfferedCount,
			&ps.HighestPackageLPA, &ps.AveragePackageLPA, &ps.MedianPackageLPA, &ps.CreatedAt, &ps.UpdatedAt,
		); err != nil {
			return nil, err
		}
		if ps.GraduatingCount > 0 {
			ps.PlacementPercent = (float64(ps.PlacedCount) / float64(ps.GraduatingCount)) * 100.0
		}
		list = append(list, ps)
	}
	return list, rows.Err()
}

func (r *pgRepository) CreatePlacementStat(ctx context.Context, req *CreatePlacementStatRequest) (*PlacementStat, error) {
	querySQL := `
		INSERT INTO placement_stats (department_id, academic_year_id, year, programme_branch, graduating_count, placed_count, jobs_offered_count, highest_package_lpa, average_package_lpa, median_package_lpa)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id, department_id, academic_year_id, year, programme_branch, graduating_count, placed_count, jobs_offered_count, highest_package_lpa, average_package_lpa, median_package_lpa, created_at, updated_at
	`
	var ps PlacementStat
	err := r.pool.QueryRow(ctx, querySQL, req.DepartmentID, req.AcademicYearID, req.Year, req.ProgrammeBranch, req.GraduatingCount, req.PlacedCount, req.JobsOfferedCount, req.HighestPackageLPA, req.AveragePackageLPA, req.MedianPackageLPA).Scan(
		&ps.ID, &ps.DepartmentID, &ps.AcademicYearID, &ps.Year, &ps.ProgrammeBranch, &ps.GraduatingCount, &ps.PlacedCount, &ps.JobsOfferedCount, &ps.HighestPackageLPA, &ps.AveragePackageLPA, &ps.MedianPackageLPA, &ps.CreatedAt, &ps.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	if ps.GraduatingCount > 0 {
		ps.PlacementPercent = (float64(ps.PlacedCount) / float64(ps.GraduatingCount)) * 100.0
	}
	return &ps, nil
}
