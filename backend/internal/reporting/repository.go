package reporting

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	RefreshMaterializedViews(ctx context.Context) error
	GetFacultyKPI(ctx context.Context, facultyID string) (*FacultyKPI, error)
	GetDepartmentKPI(ctx context.Context, deptID string) (*DepartmentKPI, error)
	GetInstituteKPI(ctx context.Context, instID string) (*InstituteKPI, error)
	GetLegacyCounts(ctx context.Context, deptID string) (*LegacyCountsResponse, error)
	GetLegacyAnalytics(ctx context.Context, deptID, facultyName, facultyCode string) (*LegacyAnalyticsResponse, error)
	GetFacultyResumeData(ctx context.Context, facultyIDOrCode string) (*FacultyResumeData, error)
	GetDepartmentAnnualReportData(ctx context.Context, deptID string, startYear, endYear int) (*DepartmentAnnualReportData, error)
}

type pgRepository struct {
	pool *pgxpool.Pool
}

func NewRepository(pool *pgxpool.Pool) Repository {
	return &pgRepository{pool: pool}
}

func (r *pgRepository) RefreshMaterializedViews(ctx context.Context) error {
	queries := []string{
		"REFRESH MATERIALIZED VIEW CONCURRENTLY v_faculty_kpis",
		"REFRESH MATERIALIZED VIEW CONCURRENTLY v_department_kpis",
		"REFRESH MATERIALIZED VIEW CONCURRENTLY v_institute_kpis",
	}
	for _, q := range queries {
		if _, err := r.pool.Exec(ctx, q); err != nil {
			return err
		}
	}
	return nil
}

func (r *pgRepository) GetFacultyKPI(ctx context.Context, facultyID string) (*FacultyKPI, error) {
	querySQL := `
		SELECT faculty_id, faculty_name, employee_code, designation, journal_count, conference_count,
		       book_count, book_chapter_count, total_publications, patent_count, ongoing_projects,
		       completed_projects, total_funding, total_supervisions, total_events, scopus_h_index,
		       scopus_citations, scholar_h_index, scholar_citations, calculated_at
		FROM v_faculty_kpis
		WHERE faculty_id = $1
	`
	var k FacultyKPI
	err := r.pool.QueryRow(ctx, querySQL, facultyID).Scan(
		&k.FacultyID, &k.FacultyName, &k.EmployeeCode, &k.Designation, &k.JournalCount, &k.ConferenceCount,
		&k.BookCount, &k.BookChapterCount, &k.TotalPublications, &k.PatentCount, &k.OngoingProjects,
		&k.CompletedProjects, &k.TotalFunding, &k.TotalSupervisions, &k.TotalEvents, &k.ScopusHIndex,
		&k.ScopusCitations, &k.ScholarHIndex, &k.ScholarCitations, &k.CalculatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &k, nil
}

func (r *pgRepository) GetDepartmentKPI(ctx context.Context, deptID string) (*DepartmentKPI, error) {
	querySQL := `
		SELECT department_id, institution_id, department_name, department_slug, department_code,
		       faculty_count, staff_count, total_students, ug_students, pg_students,
		       pursuing_phd_count, passed_phd_count, journal_count, conference_count, book_count,
		       book_chapter_count, total_publications, patent_count, ongoing_projects, completed_projects,
		       total_sanctioned_amount, total_amount_received, event_count, consultancy_count,
		       consultancy_funding, calculated_at
		FROM v_department_kpis
		WHERE department_id = $1
	`
	var k DepartmentKPI
	err := r.pool.QueryRow(ctx, querySQL, deptID).Scan(
		&k.DepartmentID, &k.InstitutionID, &k.DepartmentName, &k.DepartmentSlug, &k.DepartmentCode,
		&k.FacultyCount, &k.StaffCount, &k.TotalStudents, &k.UGStudents, &k.PGStudents,
		&k.PursuingPhdCount, &k.PassedPhdCount, &k.JournalCount, &k.ConferenceCount, &k.BookCount,
		&k.BookChapterCount, &k.TotalPublications, &k.PatentCount, &k.OngoingProjects, &k.CompletedProjects,
		&k.TotalSanctionedAmount, &k.TotalAmountReceived, &k.EventCount, &k.ConsultancyCount,
		&k.ConsultancyFunding, &k.CalculatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &k, nil
}

func (r *pgRepository) GetInstituteKPI(ctx context.Context, instID string) (*InstituteKPI, error) {
	querySQL := `
		SELECT institution_id, institution_name, institution_slug, department_count, faculty_count,
		       canonical_publications_count, canonical_patents_count, canonical_projects_count,
		       total_sanctioned_funding, total_received_funding, calculated_at
		FROM v_institute_kpis
		WHERE $1 = '' OR institution_id::text = $1
		LIMIT 1
	`
	var k InstituteKPI
	err := r.pool.QueryRow(ctx, querySQL, instID).Scan(
		&k.InstitutionID, &k.InstitutionName, &k.InstitutionSlug, &k.DepartmentCount, &k.FacultyCount,
		&k.CanonicalPublicationsCount, &k.CanonicalPatentsCount, &k.CanonicalProjectsCount,
		&k.TotalSanctionedFunding, &k.TotalReceivedFunding, &k.CalculatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &k, nil
}

func (r *pgRepository) GetLegacyCounts(ctx context.Context, deptID string) (*LegacyCountsResponse, error) {
	querySQL := `
		SELECT 
			(SELECT COUNT(*) FROM staff WHERE deleted_at IS NULL AND (department_id::text = $1 OR $1 = '')) AS staff,
			(SELECT COUNT(*) FROM faculty WHERE deleted_at IS NULL) AS faculty,
			(SELECT COUNT(*) FROM students s JOIN programmes p ON p.id = s.programme_id WHERE s.deleted_at IS NULL AND p.level = 'UG' AND (s.department_id::text = $1 OR $1 = '')) AS bachelor_student,
			(SELECT COUNT(DISTINCT p.id) FROM publications p LEFT JOIN publication_departments pd ON pd.publication_id = p.id WHERE p.deleted_at IS NULL AND (pd.department_id::text = $1 OR $1 = '')) AS publication,
			(SELECT COUNT(DISTINCT pat.id) FROM patents pat LEFT JOIN patent_departments pd ON pd.patent_id = pat.id WHERE pat.deleted_at IS NULL AND (pd.department_id::text = $1 OR $1 = '')) AS patent,
			(SELECT COUNT(DISTINCT prj.id) FROM projects prj LEFT JOIN project_departments pd ON pd.project_id = prj.id WHERE prj.deleted_at IS NULL AND prj.status = 'Ongoing' AND (pd.department_id::text = $1 OR $1 = '')) AS ongoing_project,
			(SELECT COUNT(*) FROM events WHERE deleted_at IS NULL AND (department_id::text = $1 OR $1 = '')) AS event,
			(SELECT COUNT(*) FROM phd_scholars WHERE deleted_at IS NULL AND status = 'pursuing' AND (department_id::text = $1 OR $1 = '')) AS pursuing_phd,
			(SELECT COUNT(*) FROM phd_scholars WHERE deleted_at IS NULL AND status = 'passed' AND (department_id::text = $1 OR $1 = '')) AS passed_phd,
			(SELECT COUNT(*) FROM students s JOIN programmes p ON p.id = s.programme_id WHERE s.deleted_at IS NULL AND p.level = 'PG' AND (s.department_id::text = $1 OR $1 = '')) AS master_student,
			(SELECT COUNT(*) FROM students s JOIN programmes p ON p.id = s.programme_id WHERE s.deleted_at IS NULL AND p.level = 'DualDegree' AND (s.department_id::text = $1 OR $1 = '')) AS dualdegree_student
	`
	var res LegacyCountsResponse
	err := r.pool.QueryRow(ctx, querySQL, deptID).Scan(
		&res.Staff, &res.Faculty, &res.BachelorStudent, &res.Publication,
		&res.Patent, &res.Project, &res.Event, &res.PursuingPhdScholar,
		&res.PassedPhdScholar, &res.MasterStudent, &res.DualdegreeStudent,
	)
	if err != nil {
		return nil, err
	}
	return &res, nil
}

func (r *pgRepository) GetLegacyAnalytics(ctx context.Context, deptID, facultyName, facultyCode string) (*LegacyAnalyticsResponse, error) {
	facQuery := `
		SELECT f.id, f.full_name, COALESCE(f.employee_code, '')
		FROM faculty f
		WHERE f.deleted_at IS NULL
		ORDER BY f.sort_order ASC, f.id ASC
	`
	facRows, err := r.pool.Query(ctx, facQuery)
	if err != nil {
		return nil, err
	}
	defer facRows.Close()

	facultyData := make([]LegacyAnalyticsFaculty, 0)
	facUUIDToSeq := make(map[string]int)
	facUUIDToCode := make(map[string]string)

	idx := 1
	for facRows.Next() {
		var uuidStr, name, empCode string
		if err := facRows.Scan(&uuidStr, &name, &empCode); err != nil {
			return nil, err
		}
		facultyData = append(facultyData, LegacyAnalyticsFaculty{
			ID:   idx,
			Name: name,
		})
		facUUIDToSeq[uuidStr] = idx
		facUUIDToCode[uuidStr] = empCode
		idx++
	}

	pubQuery := `
		SELECT p.year, p.publication_type::text, COALESCE(p.indexing, 'unknown'), pa.faculty_id
		FROM publications p
		LEFT JOIN publication_authors pa ON pa.publication_id = p.id
		WHERE p.deleted_at IS NULL
		ORDER BY p.year DESC
	`
	pubRows, err := r.pool.Query(ctx, pubQuery)
	if err != nil {
		return nil, err
	}
	defer pubRows.Close()

	pubMap := make(map[string]*LegacyAnalyticsPublication)
	for pubRows.Next() {
		var year *int
		var pType, indexing string
		var facID *string
		if err := pubRows.Scan(&year, &pType, &indexing, &facID); err != nil {
			return nil, err
		}
		key := pType + "_" + indexing
		if year != nil {
			key += string(rune(*year))
		}
		item, exists := pubMap[key]
		if !exists {
			item = &LegacyAnalyticsPublication{
				Year:       year,
				Type:       pType,
				Indexing:   indexing,
				FacultyIDs: []int{},
			}
			pubMap[key] = item
		}
		if facID != nil {
			if seq, ok := facUUIDToSeq[*facID]; ok {
				item.FacultyIDs = append(item.FacultyIDs, seq)
			}
		}
	}

	pubs := make([]LegacyAnalyticsPublication, 0, len(pubMap))
	for _, p := range pubMap {
		pubs = append(pubs, *p)
	}

	patQuery := `
		SELECT p.id, p.year, p.status, pi.faculty_id
		FROM patents p
		LEFT JOIN patent_inventors pi ON pi.patent_id = p.id
		WHERE p.deleted_at IS NULL
		ORDER BY p.year DESC
	`
	patRows, err := r.pool.Query(ctx, patQuery)
	if err != nil {
		return nil, err
	}
	defer patRows.Close()

	patMap := make(map[string]*LegacyAnalyticsPatent)
	for patRows.Next() {
		var id string
		var year *int
		var status string
		var facID *string
		if err := patRows.Scan(&id, &year, &status, &facID); err != nil {
			return nil, err
		}
		item, exists := patMap[id]
		if !exists {
			item = &LegacyAnalyticsPatent{
				ID:         id,
				Year:       year,
				Status:     status,
				FacultyIDs: []int{},
			}
			patMap[id] = item
		}
		if facID != nil {
			if seq, ok := facUUIDToSeq[*facID]; ok {
				item.FacultyIDs = append(item.FacultyIDs, seq)
			}
		}
	}

	patents := make([]LegacyAnalyticsPatent, 0, len(patMap))
	for _, pat := range patMap {
		patents = append(patents, *pat)
	}

	prjQuery := `
		SELECT p.id, p.year, p.status, p.total_sanctioned_amount, pm.faculty_id
		FROM projects p
		LEFT JOIN project_members pm ON pm.project_id = p.id
		WHERE p.deleted_at IS NULL
		ORDER BY p.year DESC
	`
	prjRows, err := r.pool.Query(ctx, prjQuery)
	if err != nil {
		return nil, err
	}
	defer prjRows.Close()

	prjMap := make(map[string]*LegacyAnalyticsProject)
	for prjRows.Next() {
		var id string
		var year *int
		var status string
		var funding float64
		var facID *string
		if err := prjRows.Scan(&id, &year, &status, &funding, &facID); err != nil {
			return nil, err
		}
		item, exists := prjMap[id]
		if !exists {
			item = &LegacyAnalyticsProject{
				ID:         id,
				Year:       year,
				Status:     status,
				Funding:    funding,
				FacultyIDs: []int{},
			}
			prjMap[id] = item
		}
		if facID != nil {
			if seq, ok := facUUIDToSeq[*facID]; ok {
				item.FacultyIDs = append(item.FacultyIDs, seq)
			}
		}
	}

	projects := make([]LegacyAnalyticsProject, 0, len(prjMap))
	for _, prj := range prjMap {
		projects = append(projects, *prj)
	}

	evQuery := `
		SELECT e.year, e.event_type, ec.faculty_id
		FROM events e
		LEFT JOIN event_coordinators ec ON ec.event_id = e.id
		WHERE e.deleted_at IS NULL
		ORDER BY e.year DESC
	`
	evRows, err := r.pool.Query(ctx, evQuery)
	if err != nil {
		return nil, err
	}
	defer evRows.Close()

	events := make([]LegacyAnalyticsEvent, 0)
	for evRows.Next() {
		var year *int
		var evType string
		var facID *string
		if err := evRows.Scan(&year, &evType, &facID); err != nil {
			return nil, err
		}
		ev := LegacyAnalyticsEvent{
			Year:       year,
			Type:       evType,
			FacultyIDs: []int{},
		}
		if facID != nil {
			if seq, ok := facUUIDToSeq[*facID]; ok {
				ev.FacultyIDs = append(ev.FacultyIDs, seq)
			}
		}
		events = append(events, ev)
	}

	// If a specific faculty is requested by name or code, filter output collections
	var targetSeq *int
	if facultyCode != "" {
		for uuidStr, seq := range facUUIDToSeq {
			if code, ok := facUUIDToCode[uuidStr]; ok && strings.EqualFold(code, facultyCode) {
				s := seq
				targetSeq = &s
				break
			}
			if strings.EqualFold(uuidStr, facultyCode) {
				s := seq
				targetSeq = &s
				break
			}
		}
	}
	if targetSeq == nil && facultyName != "" {
		for _, f := range facultyData {
			if strings.EqualFold(strings.TrimSpace(f.Name), strings.TrimSpace(facultyName)) {
				s := f.ID
				targetSeq = &s
				break
			}
		}
	}

	if targetSeq != nil {
		filteredPubs := make([]LegacyAnalyticsPublication, 0)
		for _, p := range pubs {
			if containsInt(p.FacultyIDs, *targetSeq) {
				filteredPubs = append(filteredPubs, p)
			}
		}
		pubs = filteredPubs

		filteredPatents := make([]LegacyAnalyticsPatent, 0)
		for _, pat := range patents {
			if containsInt(pat.FacultyIDs, *targetSeq) {
				filteredPatents = append(filteredPatents, pat)
			}
		}
		patents = filteredPatents

		filteredProjects := make([]LegacyAnalyticsProject, 0)
		for _, prj := range projects {
			if containsInt(prj.FacultyIDs, *targetSeq) {
				filteredProjects = append(filteredProjects, prj)
			}
		}
		projects = filteredProjects

		filteredEvents := make([]LegacyAnalyticsEvent, 0)
		for _, ev := range events {
			if containsInt(ev.FacultyIDs, *targetSeq) {
				filteredEvents = append(filteredEvents, ev)
			}
		}
		events = filteredEvents
	}

	return &LegacyAnalyticsResponse{
		FacultyData:      facultyData,
		PublicationsData: pubs,
		PatentsData:      patents,
		ProjectsData:     projects,
		EventsData:       events,
	}, nil
}

func containsInt(slice []int, val int) bool {
	for _, item := range slice {
		if item == val {
			return true
		}
	}
	return false
}

// ----------------------------------------------------------------------------
// FACULTY RESUME DATA GENERATOR
// ----------------------------------------------------------------------------

func (r *pgRepository) GetFacultyResumeData(ctx context.Context, facultyIDOrCode string) (*FacultyResumeData, error) {
	// 1. Fetch Faculty
	facQuery := `
		SELECT f.id, f.full_name, COALESCE(f.phone, ''), f.official_email, COALESCE(f.photo_url, ''),
		       COALESCE(fp.google_scholar_url, ''), COALESCE(f.research_interests, '')
		FROM faculty f
		LEFT JOIN faculty_profiles fp ON fp.faculty_id = f.id
		WHERE (f.id::text = $1 OR f.employee_code = $1 OR f.portfolio_slug = $1) AND f.deleted_at IS NULL
	`
	var facID, name, phone, email, photo, scholarURL, interests string
	err := r.pool.QueryRow(ctx, facQuery, facultyIDOrCode).Scan(&facID, &name, &phone, &email, &photo, &scholarURL, &interests)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	// 2. Qualifications
	qualQuery := `
		SELECT degree, institution, completion_year
		FROM faculty_qualifications
		WHERE faculty_id = $1 AND deleted_at IS NULL
		ORDER BY completion_year DESC
	`
	qRows, err := r.pool.Query(ctx, qualQuery, facID)
	if err != nil {
		return nil, err
	}
	defer qRows.Close()

	quals := make([]ResumeQualificationItem, 0)
	for qRows.Next() {
		var q ResumeQualificationItem
		if err := qRows.Scan(&q.NameOfDegree, &q.UniversityName, &q.PassingYear); err != nil {
			return nil, err
		}
		quals = append(quals, q)
	}

	// 3. Teaching Experiences
	teachQuery := `
		SELECT designation, organization, start_date::text, COALESCE(end_date::text, 'Present')
		FROM faculty_teaching_experiences
		WHERE faculty_id = $1 AND deleted_at IS NULL
		ORDER BY start_date DESC
	`
	tRows, err := r.pool.Query(ctx, teachQuery, facID)
	if err != nil {
		return nil, err
	}
	defer tRows.Close()

	teachings := make([]ResumeTeachingExpItem, 0)
	for tRows.Next() {
		var t ResumeTeachingExpItem
		if err := tRows.Scan(&t.Position, &t.Department, &t.From, &t.To); err != nil {
			return nil, err
		}
		teachings = append(teachings, t)
	}

	// Calculate total experience
	totalExp := fmt.Sprintf("%d years", len(teachings)*3) // Approximate or sum of date ranges

	// 4. Publications by category and academic year
	pubQuery := `
		SELECT p.publication_type::text, COALESCE(p.raw_authors, ''), p.title, COALESCE(p.venue, ''),
		       COALESCE(p.volume, ''), COALESCE(p.issue, ''), COALESCE(p.pages, ''), p.year, p.doi
		FROM publications p
		JOIN publication_authors pa ON pa.publication_id = p.id
		WHERE pa.faculty_id = $1 AND p.deleted_at IS NULL
		ORDER BY p.year DESC
	`
	pRows, err := r.pool.Query(ctx, pubQuery, facID)
	if err != nil {
		return nil, err
	}
	defer pRows.Close()

	journalMap := make(map[string][]ResumePublicationSessionItem)
	confMap := make(map[string][]ResumePublicationSessionItem)
	bookMap := make(map[string][]ResumePublicationSessionItem)

	for pRows.Next() {
		var pType, authors, title, venue, vol, issue, pages string
		var year int
		var doi *string
		if err := pRows.Scan(&pType, &authors, &title, &venue, &vol, &issue, &pages, &year, &doi); err != nil {
			return nil, err
		}

		session := fmt.Sprintf("%d-%d", year, year+1)
		parts := []string{authors, title, venue}
		if vol != "" {
			parts = append(parts, "Vol: "+vol)
		}
		if issue != "" {
			parts = append(parts, "Issue: "+issue)
		}
		if pages != "" {
			parts = append(parts, "Pages: "+pages)
		}
		parts = append(parts, fmt.Sprintf("%d", year))

		var citationParts []string
		for _, p := range parts {
			if strings.TrimSpace(p) != "" {
				citationParts = append(citationParts, strings.TrimSpace(p))
			}
		}
		citation := strings.Join(citationParts, ", ")
		item := ResumePublicationSessionItem{Data: citation, DOI: doi}

		switch pType {
		case "JOURNAL":
			journalMap[session] = append(journalMap[session], item)
		case "CONFERENCE":
			confMap[session] = append(confMap[session], item)
		default:
			bookMap[session] = append(bookMap[session], item)
		}
	}

	mapToGroups := func(m map[string][]ResumePublicationSessionItem) []ResumePublicationGroup {
		groups := make([]ResumePublicationGroup, 0, len(m))
		for s, items := range m {
			groups = append(groups, ResumePublicationGroup{
				AcademicSession: s,
				Publications:    items,
			})
		}
		return groups
	}

	// 5. Projects
	prjQuery := `
		SELECT p.title, p.sponsor, p.total_sanctioned_amount, p.year, pm.role
		FROM projects p
		JOIN project_members pm ON pm.project_id = p.id
		WHERE pm.faculty_id = $1 AND p.deleted_at IS NULL
		ORDER BY p.year DESC
	`
	prRows, err := r.pool.Query(ctx, prjQuery, facID)
	if err != nil {
		return nil, err
	}
	defer prRows.Close()

	projects := make([]ResumeProjectItem, 0)
	pIdx := 1
	for prRows.Next() {
		var pr ResumeProjectItem
		var yr int
		if err := prRows.Scan(&pr.ProjectTitle, &pr.FundingAgency, &pr.FinancialOutlay, &yr, &pr.Role); err != nil {
			return nil, err
		}
		pr.Index = pIdx
		pr.StartYear = &yr
		projects = append(projects, pr)
		pIdx++
	}

	// 6. Patents
	patQuery := `
		SELECT p.title, p.status, p.year
		FROM patents p
		JOIN patent_inventors pi ON pi.patent_id = p.id
		WHERE pi.faculty_id = $1 AND p.deleted_at IS NULL
		ORDER BY p.year DESC
	`
	patRows, err := r.pool.Query(ctx, patQuery, facID)
	if err != nil {
		return nil, err
	}
	defer patRows.Close()

	patents := make([]ResumePatentItem, 0)
	patIdx := 1
	for patRows.Next() {
		var pat ResumePatentItem
		if err := patRows.Scan(&pat.PatentTitle, &pat.Status, &pat.Year); err != nil {
			return nil, err
		}
		pat.Index = patIdx
		patents = append(patents, pat)
		patIdx++
	}

	// 7. Supervisions
	supQuery := `
		SELECT s.scholar_name, s.thesis_title, s.status
		FROM supervisions s
		JOIN supervision_supervisors ss ON ss.supervision_id = s.id
		WHERE ss.faculty_id = $1 AND s.deleted_at IS NULL
	`
	sRows, err := r.pool.Query(ctx, supQuery, facID)
	if err != nil {
		return nil, err
	}
	defer sRows.Close()

	supervisions := make([]ResumeSupervisionItem, 0)
	sIdx := 1
	for sRows.Next() {
		var sup ResumeSupervisionItem
		if err := sRows.Scan(&sup.ScholarName, &sup.ResearchTopic, &sup.Status); err != nil {
			return nil, err
		}
		sup.Index = sIdx
		supervisions = append(supervisions, sup)
		sIdx++
	}

	// 8. Events
	evQuery := `
		SELECT e.title, ec.role, e.event_type, e.start_date::text, e.end_date::text, e.sponsor
		FROM events e
		JOIN event_coordinators ec ON ec.event_id = e.id
		WHERE ec.faculty_id = $1 AND e.deleted_at IS NULL
		ORDER BY e.start_date DESC
	`
	eRows, err := r.pool.Query(ctx, evQuery, facID)
	if err != nil {
		return nil, err
	}
	defer eRows.Close()

	events := make([]ResumeEventItem, 0)
	eIdx := 1
	for eRows.Next() {
		var ev ResumeEventItem
		if err := eRows.Scan(&ev.EventTitle, &ev.Role, &ev.Type, &ev.StartDate, &ev.EndDate, &ev.Sponsor); err != nil {
			return nil, err
		}
		ev.Index = eIdx
		events = append(events, ev)
		eIdx++
	}

	// 9. Honors
	honQuery := `
		SELECT title, awarding_body, award_year
		FROM faculty_honors
		WHERE faculty_id = $1 AND deleted_at IS NULL
		ORDER BY award_year DESC
	`
	hRows, err := r.pool.Query(ctx, honQuery, facID)
	if err != nil {
		return nil, err
	}
	defer hRows.Close()

	honors := make([]ResumeHonorItem, 0)
	hIdx := 1
	for hRows.Next() {
		var h ResumeHonorItem
		if err := hRows.Scan(&h.HonorTitle, &h.AwardingAgency, &h.Year); err != nil {
			return nil, err
		}
		h.Index = hIdx
		honors = append(honors, h)
		hIdx++
	}

	// 10. Consultancies
	conQuery := `
		SELECT c.title, c.client_name, c.sanctioned_amount, c.year
		FROM consultancies c
		JOIN consultancy_members cm ON cm.consultancy_id = c.id
		WHERE cm.faculty_id = $1 AND c.deleted_at IS NULL
		ORDER BY c.year DESC
	`
	cRows, err := r.pool.Query(ctx, conQuery, facID)
	if err != nil {
		return nil, err
	}
	defer cRows.Close()

	consultancies := make([]ResumeConsultancyItem, 0)
	cIdx := 1
	for cRows.Next() {
		var con ResumeConsultancyItem
		var yr int
		if err := cRows.Scan(&con.Title, &con.ClientOrganisation, &con.FinancialOutlay, &yr); err != nil {
			return nil, err
		}
		con.Index = cIdx
		con.StartYear = &yr
		consultancies = append(consultancies, con)
		cIdx++
	}

	return &FacultyResumeData{
		FacultyName:                  name,
		PhoneNo:                      phone,
		EmailID:                      email,
		Image:                        photo,
		GoogleScholar:                scholarURL,
		ResearchArea:                 interests,
		Qualifications:               quals,
		TotalExperience:              totalExp,
		TeachingExp:                  teachings,
		GroupedByAcademicSessionpub:  mapToGroups(journalMap),
		GroupedByAcademicSessioncon:  mapToGroups(confMap),
		GroupedByAcademicSessionbook: mapToGroups(bookMap),
		Projects:                     projects,
		Patents:                      patents,
		ResearchSupervisions:         supervisions,
		Events:                       events,
		Honors:                       honors,
		Consultancies:                consultancies,
	}, nil
}

// ----------------------------------------------------------------------------
// DEPARTMENT ANNUAL REPORT DATA GENERATOR
// ----------------------------------------------------------------------------

func (r *pgRepository) GetDepartmentAnnualReportData(ctx context.Context, deptID string, startYear, endYear int) (*DepartmentAnnualReportData, error) {
	// 1. Faculty designation buckets
	facQuery := `
		SELECT f.full_name, f.designation
		FROM faculty f
		JOIN faculty_appointments fa ON fa.faculty_id = f.id
		WHERE (fa.department_id::text = $1 OR $1 = '') AND f.deleted_at IS NULL
		ORDER BY f.sort_order ASC, f.full_name ASC
	`
	rows, err := r.pool.Query(ctx, facQuery, deptID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var profs, assoProfs, assiProfs []string
	for rows.Next() {
		var name, desig string
		if err := rows.Scan(&name, &desig); err != nil {
			return nil, err
		}
		desigTrim := strings.TrimSpace(desig)
		if desigTrim == "Professor" {
			profs = append(profs, name)
		} else if desigTrim == "Associate Professor" {
			assoProfs = append(assoProfs, name)
		} else {
			assiProfs = append(assiProfs, name)
		}
	}

	// 2. Staff
	staffQuery := `
		SELECT full_name, designation
		FROM staff
		WHERE (department_id::text = $1 OR $1 = '') AND deleted_at IS NULL
		ORDER BY full_name ASC
	`
	sRows, err := r.pool.Query(ctx, staffQuery, deptID)
	if err != nil {
		return nil, err
	}
	defer sRows.Close()

	staffItems := make([]AnnualReportStaffItem, 0)
	sIdx := 1
	for sRows.Next() {
		var s AnnualReportStaffItem
		if err := sRows.Scan(&s.Name, &s.Position); err != nil {
			return nil, err
		}
		s.Index = sIdx
		staffItems = append(staffItems, s)
		sIdx++
	}

	// 3. Equipment
	eqQuery := `
		SELECT e.name, COALESCE(l.name, 'General Lab'), e.quantity, e.stock_in_use,
		       e.purchase_value, COALESCE(e.invoice_number, ''), COALESCE(e.purchase_date::text, ''), COALESCE(e.indenter_name, '')
		FROM equipment e
		LEFT JOIN labs l ON l.id = e.lab_id
		WHERE (e.department_id::text = $1 OR $1 = '') AND e.deleted_at IS NULL
		ORDER BY e.name ASC
	`
	eqRows, err := r.pool.Query(ctx, eqQuery, deptID)
	if err != nil {
		return nil, err
	}
	defer eqRows.Close()

	equipmentItems := make([]AnnualReportEquipmentItem, 0)
	eIdx := 1
	for eqRows.Next() {
		var eq AnnualReportEquipmentItem
		if err := eqRows.Scan(&eq.Name, &eq.Lab, &eq.Quantity, &eq.InUse, &eq.PurchaseValue, &eq.InvoiceNumber, &eq.Date, &eq.Indenter); err != nil {
			return nil, err
		}
		eq.Index = eIdx
		equipmentItems = append(equipmentItems, eq)
		eIdx++
	}

	return &DepartmentAnnualReportData{
		Professors:        profs,
		AssociateProfs:    assoProfs,
		AssistantProfs:    assiProfs,
		Staff:             staffItems,
		PublicationCounts: []AnnualReportPubCount{},
		Projects:          []ResumeProjectItem{},
		Supervisions:      []ResumeSupervisionItem{},
		Consultancies:     []ResumeConsultancyItem{},
		Events:            []ResumeEventItem{},
		Equipment:         equipmentItems,
	}, nil
}
