package research

import "time"

type Publication struct {
	ID              string                  `json:"id"`
	Title           string                  `json:"title"`
	PublicationType string                  `json:"publication_type"` // 'JOURNAL', 'CONFERENCE', 'BOOK', 'BOOK_CHAPTER'
	DOI             *string                 `json:"doi,omitempty"`
	ISBN            *string                 `json:"isbn,omitempty"`
	Venue           *string                 `json:"venue,omitempty"`
	Publisher       *string                 `json:"publisher,omitempty"`
	Volume          *string                 `json:"volume,omitempty"`
	Issue           *string                 `json:"issue,omitempty"`
	Pages           *string                 `json:"pages,omitempty"`
	PublishedDate   *string                 `json:"published_date,omitempty"`
	Year            int                     `json:"year"`
	Month           *int                    `json:"month,omitempty"`
	AcademicSession *string                 `json:"academic_session,omitempty"`
	Indexing        *string                 `json:"indexing,omitempty"`
	Quartile        *string                 `json:"quartile,omitempty"`
	Status          string                  `json:"status"` // 'DRAFT', 'SUBMITTED', 'DEPARTMENT_VERIFIED', 'PUBLISHED', 'RETURNED', 'ARCHIVED'
	SourceURL       *string                 `json:"source_url,omitempty"`
	RawAuthors      *string                 `json:"raw_authors,omitempty"`
	PublishedAt     *time.Time              `json:"published_at,omitempty"`
	CreatedBy       *string                 `json:"created_by,omitempty"`
	CreatedAt       time.Time               `json:"created_at"`
	UpdatedAt       time.Time               `json:"updated_at"`
	Authors         []PublicationAuthor     `json:"authors,omitempty"`
	Departments     []PublicationDepartment `json:"departments,omitempty"`
}

type PublicationAuthor struct {
	ID              string  `json:"id"`
	PublicationID   string  `json:"publication_id"`
	FacultyID       *string `json:"faculty_id,omitempty"`
	AuthorName      string  `json:"author_name"`
	AuthorOrder     int     `json:"author_order"`
	IsCorresponding bool    `json:"is_corresponding"`
}

type PublicationDepartment struct {
	PublicationID  string `json:"publication_id"`
	DepartmentID   string `json:"department_id"`
	DepartmentName string `json:"department_name,omitempty"`
	DepartmentSlug string `json:"department_slug,omitempty"`
}

type Patent struct {
	ID                string             `json:"id"`
	Title             string             `json:"title"`
	PatentType        string             `json:"patent_type"`
	Status            string             `json:"status"` // 'Filed', 'Published', 'Granted'
	ApplicationNumber *string            `json:"application_number,omitempty"`
	PublicationNumber *string            `json:"publication_number,omitempty"`
	GrantNumber       *string            `json:"grant_number,omitempty"`
	Jurisdiction      string             `json:"jurisdiction"`
	PatentOffice      *string            `json:"patent_office,omitempty"`
	FilingDate        *string            `json:"filing_date,omitempty"`
	PublicationDate   *string            `json:"publication_date,omitempty"`
	GrantDate         *string            `json:"grant_date,omitempty"`
	Year              int                `json:"year"`
	Month             *int               `json:"month,omitempty"`
	AcademicSession   *string            `json:"academic_session,omitempty"`
	Place             *string            `json:"place,omitempty"`
	ApplicantName     *string            `json:"applicant_name,omitempty"`
	RawInventors      *string            `json:"raw_inventors,omitempty"`
	DocumentID        *string            `json:"document_id,omitempty"`
	WorkflowStatus    string             `json:"workflow_status"`
	CreatedAt         time.Time          `json:"created_at"`
	UpdatedAt         time.Time          `json:"updated_at"`
	Inventors         []PatentInventor   `json:"inventors,omitempty"`
	Departments       []PatentDepartment `json:"departments,omitempty"`
}

type PatentInventor struct {
	ID            string  `json:"id"`
	PatentID      string  `json:"patent_id"`
	FacultyID     *string `json:"faculty_id,omitempty"`
	InventorName  string  `json:"inventor_name"`
	InventorOrder int     `json:"inventor_order"`
}

type PatentDepartment struct {
	PatentID       string `json:"patent_id"`
	DepartmentID   string `json:"department_id"`
	DepartmentName string `json:"department_name,omitempty"`
}

type Project struct {
	ID                      string              `json:"id"`
	Title                   string              `json:"title"`
	ProjectNumber           *string             `json:"project_number,omitempty"`
	Sponsor                 string              `json:"sponsor"`
	Scheme                  *string             `json:"scheme,omitempty"`
	Status                  string              `json:"status"` // 'Ongoing', 'Completed'
	StartDate               *string             `json:"start_date,omitempty"`
	EndDate                 *string             `json:"end_date,omitempty"`
	Year                    int                 `json:"year"`
	Month                   *int                `json:"month,omitempty"`
	AcademicSession         *string             `json:"academic_session,omitempty"`
	Duration                *string             `json:"duration,omitempty"`
	PrincipalInvestigator   *string             `json:"principal_investigator,omitempty"`
	CoPrincipalInvestigator *string             `json:"co_principal_investigator,omitempty"`
	TotalSanctionedAmount   float64             `json:"total_sanctioned_amount"`
	TotalAmountReceived     float64             `json:"total_amount_received"`
	LeadDepartmentID        string              `json:"lead_department_id"`
	LeadDepartmentName      string              `json:"lead_department_name,omitempty"`
	RawInvestigators        *string             `json:"raw_investigators,omitempty"`
	WorkflowStatus          string              `json:"workflow_status"`
	CreatedAt               time.Time           `json:"created_at"`
	UpdatedAt               time.Time           `json:"updated_at"`
	Members                 []ProjectMember     `json:"members,omitempty"`
	Departments             []ProjectDepartment `json:"departments,omitempty"`
	Grants                  []Grant             `json:"grants,omitempty"`
}

type ProjectMember struct {
	ID          string  `json:"id"`
	ProjectID   string  `json:"project_id"`
	FacultyID   *string `json:"faculty_id,omitempty"`
	MemberName  string  `json:"member_name"`
	Role        string  `json:"role"` // 'PI', 'Co-PI', 'Investigator'
	MemberOrder int     `json:"member_order"`
}

type ProjectDepartment struct {
	ProjectID      string `json:"project_id"`
	DepartmentID   string `json:"department_id"`
	DepartmentName string `json:"department_name,omitempty"`
	IsLead         bool   `json:"is_lead"`
}

type Grant struct {
	ID                  string    `json:"id"`
	ProjectID           string    `json:"project_id"`
	FinancialYearID     *string   `json:"financial_year_id,omitempty"`
	FinancialYearLabel  string    `json:"financial_year_label,omitempty"`
	SanctionOrderNumber *string   `json:"sanction_order_number,omitempty"`
	SanctionedAmount    float64   `json:"sanctioned_amount"`
	ReceivedAmount      float64   `json:"received_amount"`
	ExpenditureAmount   float64   `json:"expenditure_amount"`
	ReceivedDate        *string   `json:"received_date,omitempty"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
}

type Consultancy struct {
	ID                string              `json:"id"`
	DepartmentID      string              `json:"department_id"`
	DepartmentName    string              `json:"department_name,omitempty"`
	Title             string              `json:"title"`
	ClientName        string              `json:"client_name"`
	ConsultancyNumber *string             `json:"consultancy_number,omitempty"`
	Status            string              `json:"status"`
	SanctionedAmount  float64             `json:"sanctioned_amount"`
	StartDate         *string             `json:"start_date,omitempty"`
	EndDate           *string             `json:"end_date,omitempty"`
	Year              int                 `json:"year"`
	RawFaculty        *string             `json:"raw_faculty,omitempty"`
	CreatedAt         time.Time           `json:"created_at"`
	UpdatedAt         time.Time           `json:"updated_at"`
	Members           []ConsultancyMember `json:"members,omitempty"`
}

type ConsultancyMember struct {
	ID            string  `json:"id"`
	ConsultancyID string  `json:"consultancy_id"`
	FacultyID     *string `json:"faculty_id,omitempty"`
	MemberName    string  `json:"member_name"`
	Role          string  `json:"role"`
}

type Supervision struct {
	ID               string                  `json:"id"`
	DepartmentID     string                  `json:"department_id"`
	DepartmentName   string                  `json:"department_name,omitempty"`
	ProgrammeLevel   string                  `json:"programme_level"` // 'MTech', 'PhD', 'BTech'
	ScholarName      string                  `json:"scholar_name"`
	RollNumber       *string                 `json:"roll_number,omitempty"`
	ThesisTitle      string                  `json:"thesis_title"`
	Status           string                  `json:"status"` // 'Ongoing', 'Submitted', 'Awarded'
	AcademicSession  *string                 `json:"academic_session,omitempty"`
	RegistrationDate *string                 `json:"registration_date,omitempty"`
	SubmissionDate   *string                 `json:"submission_date,omitempty"`
	AwardDate        *string                 `json:"award_date,omitempty"`
	RawSupervisors   *string                 `json:"raw_supervisors,omitempty"`
	CreatedAt        time.Time               `json:"created_at"`
	UpdatedAt        time.Time               `json:"updated_at"`
	Supervisors      []SupervisionSupervisor `json:"supervisors,omitempty"`
}

type SupervisionSupervisor struct {
	ID              string  `json:"id"`
	SupervisionID   string  `json:"supervision_id"`
	FacultyID       *string `json:"faculty_id,omitempty"`
	SupervisorName  string  `json:"supervisor_name"`
	Role            string  `json:"role"` // 'Supervisor', 'Co-Supervisor'
	SupervisorOrder int     `json:"supervisor_order"`
}

type Event struct {
	ID              string             `json:"id"`
	DepartmentID    string             `json:"department_id"`
	DepartmentName  string             `json:"department_name,omitempty"`
	Title           string             `json:"title"`
	EventType       string             `json:"event_type"`         // 'STC', 'E-STC', 'Workshop', 'Conference', 'Seminar', 'FDP'
	Category        *string            `json:"category,omitempty"` // 'organized', 'attended'
	AcademicSession *string            `json:"academic_session,omitempty"`
	Venue           *string            `json:"venue,omitempty"`
	Sponsor         *string            `json:"sponsor,omitempty"`
	StartDate       string             `json:"start_date"`
	EndDate         *string            `json:"end_date,omitempty"`
	Year            int                `json:"year"`
	RawCoordinators *string            `json:"raw_coordinators,omitempty"`
	CreatedAt       time.Time          `json:"created_at"`
	UpdatedAt       time.Time          `json:"updated_at"`
	Coordinators    []EventCoordinator `json:"coordinators,omitempty"`
}

type EventCoordinator struct {
	ID              string  `json:"id"`
	EventID         string  `json:"event_id"`
	FacultyID       *string `json:"faculty_id,omitempty"`
	CoordinatorName string  `json:"coordinator_name"`
	Role            string  `json:"role"`
}

type Course struct {
	ID             string    `json:"id"`
	DepartmentID   string    `json:"department_id"`
	DepartmentName string    `json:"department_name,omitempty"`
	ProgrammeID    *string   `json:"programme_id,omitempty"`
	Code           string    `json:"code"`
	Name           string    `json:"name"`
	Credits        float64   `json:"credits"`
	Semester       *int      `json:"semester,omitempty"`
	CourseLevel    *string   `json:"course_level,omitempty"`
	Description    *string   `json:"description,omitempty"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type ReviewDecisionRequest struct {
	Decision string `json:"decision" validate:"required"` // 'VERIFIED', 'RETURNED', 'PUBLISHED', 'ARCHIVED'
	Comments string `json:"comments"`
}

// Request types
type AuthorInput struct {
	FacultyID       *string `json:"faculty_id"`
	AuthorName      string  `json:"author_name" validate:"required"`
	AuthorOrder     int     `json:"author_order" validate:"required,min=1"`
	IsCorresponding bool    `json:"is_corresponding"`
}

type CreatePublicationRequest struct {
	Title           string        `json:"title" validate:"required"`
	PublicationType string        `json:"publication_type" validate:"required,oneof=JOURNAL CONFERENCE BOOK BOOK_CHAPTER"`
	DOI             *string       `json:"doi"`
	ISBN            *string       `json:"isbn"`
	Venue           *string       `json:"venue"`
	Publisher       *string       `json:"publisher"`
	Volume          *string       `json:"volume"`
	Issue           *string       `json:"issue"`
	Pages           *string       `json:"pages"`
	PublishedDate   *string       `json:"published_date"`
	Year            int           `json:"year" validate:"required,min=1900,max=2100"`
	Indexing        *string       `json:"indexing"`
	Quartile        *string       `json:"quartile"`
	SourceURL       *string       `json:"source_url"`
	RawAuthors      *string       `json:"raw_authors"`
	DepartmentIDs   []string      `json:"department_ids" validate:"required,min=1"`
	Authors         []AuthorInput `json:"authors" validate:"required,min=1"`
}

type InventorInput struct {
	FacultyID     *string `json:"faculty_id"`
	InventorName  string  `json:"inventor_name" validate:"required"`
	InventorOrder int     `json:"inventor_order" validate:"required,min=1"`
}

type CreatePatentRequest struct {
	Title             string          `json:"title" validate:"required"`
	PatentType        string          `json:"patent_type" validate:"required"`
	Status            string          `json:"status" validate:"required,oneof=Filed Published Granted"`
	ApplicationNumber *string         `json:"application_number"`
	PublicationNumber *string         `json:"publication_number"`
	GrantNumber       *string         `json:"grant_number"`
	Jurisdiction      string          `json:"jurisdiction"`
	PatentOffice      *string         `json:"patent_office"`
	FilingDate        *string         `json:"filing_date"`
	PublicationDate   *string         `json:"publication_date"`
	GrantDate         *string         `json:"grant_date"`
	Year              int             `json:"year" validate:"required,min=1900,max=2100"`
	ApplicantName     *string         `json:"applicant_name"`
	RawInventors      *string         `json:"raw_inventors"`
	DepartmentIDs     []string        `json:"department_ids" validate:"required,min=1"`
	Inventors         []InventorInput `json:"inventors" validate:"required,min=1"`
}

type MemberInput struct {
	FacultyID   *string `json:"faculty_id"`
	MemberName  string  `json:"member_name" validate:"required"`
	Role        string  `json:"role" validate:"required,oneof=PI Co-PI Investigator"`
	MemberOrder int     `json:"member_order"`
}

type CreateProjectRequest struct {
	Title                 string        `json:"title" validate:"required"`
	ProjectNumber         *string       `json:"project_number"`
	Sponsor               string        `json:"sponsor" validate:"required"`
	Scheme                *string       `json:"scheme"`
	Status                string        `json:"status" validate:"required,oneof=Ongoing Completed"`
	StartDate             *string       `json:"start_date"`
	EndDate               *string       `json:"end_date"`
	Year                  int           `json:"year" validate:"required,min=1900,max=2100"`
	TotalSanctionedAmount float64       `json:"total_sanctioned_amount"`
	TotalAmountReceived   float64       `json:"total_amount_received"`
	LeadDepartmentID      string        `json:"lead_department_id" validate:"required"`
	DepartmentIDs         []string      `json:"department_ids"`
	Members               []MemberInput `json:"members" validate:"required,min=1"`
	RawInvestigators      *string       `json:"raw_investigators"`
}

type CreateGrantRequest struct {
	FinancialYearID     *string `json:"financial_year_id"`
	SanctionOrderNumber *string `json:"sanction_order_number"`
	SanctionedAmount    float64 `json:"sanctioned_amount"`
	ReceivedAmount      float64 `json:"received_amount"`
	ExpenditureAmount   float64 `json:"expenditure_amount"`
	ReceivedDate        *string `json:"received_date"`
}

type CreateConsultancyRequest struct {
	DepartmentID      string        `json:"department_id" validate:"required"`
	Title             string        `json:"title" validate:"required"`
	ClientName        string        `json:"client_name" validate:"required"`
	ConsultancyNumber *string       `json:"consultancy_number"`
	Status            string        `json:"status"`
	SanctionedAmount  float64       `json:"sanctioned_amount"`
	StartDate         *string       `json:"start_date"`
	EndDate           *string       `json:"end_date"`
	Year              int           `json:"year" validate:"required,min=1900,max=2100"`
	RawFaculty        *string       `json:"raw_faculty"`
	Members           []MemberInput `json:"members"`
}

type SupervisorInput struct {
	FacultyID       *string `json:"faculty_id"`
	SupervisorName  string  `json:"supervisor_name" validate:"required"`
	Role            string  `json:"role" validate:"required,oneof=Supervisor Co-Supervisor"`
	SupervisorOrder int     `json:"supervisor_order"`
}

type CreateSupervisionRequest struct {
	DepartmentID     string            `json:"department_id" validate:"required"`
	ProgrammeLevel   string            `json:"programme_level" validate:"required,oneof=MTech PhD BTech"`
	ScholarName      string            `json:"scholar_name" validate:"required"`
	RollNumber       *string           `json:"roll_number"`
	ThesisTitle      string            `json:"thesis_title" validate:"required"`
	Status           string            `json:"status" validate:"required,oneof=Ongoing Submitted Awarded"`
	AcademicSession  *string           `json:"academic_session"`
	RegistrationDate *string           `json:"registration_date"`
	SubmissionDate   *string           `json:"submission_date"`
	AwardDate        *string           `json:"award_date"`
	RawSupervisors   *string           `json:"raw_supervisors"`
	Supervisors      []SupervisorInput `json:"supervisors" validate:"required,min=1"`
}

type CoordinatorInput struct {
	FacultyID       *string `json:"faculty_id"`
	CoordinatorName string  `json:"coordinator_name" validate:"required"`
	Role            string  `json:"role"`
}

type CreateEventRequest struct {
	DepartmentID    string             `json:"department_id" validate:"required"`
	Title           string             `json:"title" validate:"required"`
	EventType       string             `json:"event_type" validate:"required"`
	Category        *string            `json:"category"`
	AcademicSession *string            `json:"academic_session"`
	Venue           *string            `json:"venue"`
	Sponsor         *string            `json:"sponsor"`
	StartDate       string             `json:"start_date" validate:"required"`
	EndDate         *string            `json:"end_date"`
	Year            int                `json:"year" validate:"required,min=1900,max=2100"`
	RawCoordinators *string            `json:"raw_coordinators"`
	Coordinators    []CoordinatorInput `json:"coordinators"`
}

type CreateCourseRequest struct {
	DepartmentID string  `json:"department_id" validate:"required"`
	ProgrammeID  *string `json:"programme_id"`
	Code         string  `json:"code" validate:"required"`
	Name         string  `json:"name" validate:"required"`
	Credits      float64 `json:"credits" validate:"required,min=0.5,max=20"`
	Semester     *int    `json:"semester"`
	CourseLevel  *string `json:"course_level"`
	Description  *string `json:"description"`
}
