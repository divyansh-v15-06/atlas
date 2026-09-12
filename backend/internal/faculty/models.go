package faculty

import "time"

type Faculty struct {
	ID                string    `json:"id"`
	UserID            *string   `json:"user_id,omitempty"`
	EmployeeCode      string    `json:"employee_code"`
	OfficialEmail     string    `json:"official_email"`
	FullName          string    `json:"full_name"`
	Designation       string    `json:"designation"`
	IsPermanent       bool      `json:"is_permanent"`
	Phone             *string   `json:"phone,omitempty"`
	PhotoDocumentID   *string   `json:"photo_document_id,omitempty"`
	PhotoURL          *string   `json:"photo_url,omitempty"`
	PortfolioSlug     *string   `json:"portfolio_slug,omitempty"`
	SortOrder         int       `json:"sort_order"`
	ResearchInterests *string   `json:"research_interests,omitempty"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

type FacultyProfile struct {
	ID               string    `json:"id"`
	FacultyID        string    `json:"faculty_id"`
	Biography        *string   `json:"biography,omitempty"`
	DateOfBirth      *string   `json:"date_of_birth,omitempty"`
	DateOfJoining    *string   `json:"date_of_joining,omitempty"`
	GoogleScholarURL *string   `json:"google_scholar_url,omitempty"`
	GoogleScholarID  *string   `json:"google_scholar_id,omitempty"`
	ScopusURL        *string   `json:"scopus_url,omitempty"`
	ScopusAuthorID   *string   `json:"scopus_author_id,omitempty"`
	ORCID            *string   `json:"orcid,omitempty"`
	PublonsURL       *string   `json:"publons_url,omitempty"`
	ResearchGateURL  *string   `json:"research_gate_url,omitempty"`
	VidwanURL        *string   `json:"vidwan_url,omitempty"`
	LinkedInURL      *string   `json:"linkedin_url,omitempty"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type FacultyQualification struct {
	ID                    string    `json:"id"`
	FacultyID             string    `json:"faculty_id"`
	Degree                string    `json:"degree"`
	Specialization        *string   `json:"specialization,omitempty"`
	Institution           string    `json:"institution"`
	CompletionYear        int       `json:"completion_year"`
	CertificateDocumentID *string   `json:"certificate_document_id,omitempty"`
	CreatedAt             time.Time `json:"created_at"`
	UpdatedAt             time.Time `json:"updated_at"`
}

type FacultyTeachingExp struct {
	ID           string    `json:"id"`
	FacultyID    string    `json:"faculty_id"`
	Designation  string    `json:"designation"`
	Organization string    `json:"organization"`
	StartDate    string    `json:"start_date"`
	EndDate      *string   `json:"end_date,omitempty"`
	IsCurrent    bool      `json:"is_current"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type FacultyAdminExp struct {
	ID           string    `json:"id"`
	FacultyID    string    `json:"faculty_id"`
	RoleTitle    string    `json:"role_title"`
	Organization string    `json:"organization"`
	StartDate    string    `json:"start_date"`
	EndDate      *string   `json:"end_date,omitempty"`
	IsCurrent    bool      `json:"is_current"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type FacultyHonor struct {
	ID                   string    `json:"id"`
	FacultyID            string    `json:"faculty_id"`
	Title                string    `json:"title"`
	AwardingBody         string    `json:"awarding_body"`
	AwardDate            *string   `json:"award_date,omitempty"`
	AwardYear            *int      `json:"award_year,omitempty"`
	SupportingDocumentID *string   `json:"supporting_document_id,omitempty"`
	CreatedAt            time.Time `json:"created_at"`
	UpdatedAt            time.Time `json:"updated_at"`
}

type FacultyExposure struct {
	ID          string    `json:"id"`
	FacultyID   string    `json:"faculty_id"`
	Title       string    `json:"title"`
	Organizer   *string   `json:"organizer,omitempty"`
	StartDate   *string   `json:"start_date,omitempty"`
	EndDate     *string   `json:"end_date,omitempty"`
	Description *string   `json:"description,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type ExpertTalk struct {
	ID               string    `json:"id"`
	FacultyID        string    `json:"faculty_id"`
	Title            string    `json:"title"`
	HostOrganization string    `json:"host_organization"`
	Venue            *string   `json:"venue,omitempty"`
	TalkDate         string    `json:"talk_date"`
	EndDate          *string   `json:"end_date,omitempty"`
	AcademicSession  *string   `json:"academic_session,omitempty"`
	Description      *string   `json:"description,omitempty"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type FacultyMetricSnapshot struct {
	ID             string    `json:"id"`
	FacultyID      string    `json:"faculty_id"`
	MetricSourceID string    `json:"metric_source_id"`
	SourceCode     string    `json:"source_code"`
	SourceName     string    `json:"source_name"`
	HIndex         int       `json:"h_index"`
	Citations      int       `json:"citations"`
	I10Index       int       `json:"i10_index"`
	CapturedAt     time.Time `json:"captured_at"`
}

type FacultyPortfolioResponse struct {
	Faculty                   *Faculty                 `json:"faculty"`
	Profile                   *FacultyProfile          `json:"profile,omitempty"`
	Qualifications            []FacultyQualification   `json:"qualifications"`
	TeachingExperiences       []FacultyTeachingExp     `json:"teaching_experiences"`
	AdministrativeExperiences []FacultyAdminExp        `json:"administrative_experiences"`
	Honors                    []FacultyHonor           `json:"honors"`
	Exposures                 []FacultyExposure        `json:"exposures"`
	ExpertTalks               []ExpertTalk             `json:"expert_talks"`
	LatestMetrics             []FacultyMetricSnapshot  `json:"latest_metrics"`
}

type CreateFacultyRequest struct {
	EmployeeCode      string  `json:"employee_code" validate:"required"`
	OfficialEmail     string  `json:"official_email" validate:"required,email"`
	FullName          string  `json:"full_name" validate:"required"`
	Designation       string  `json:"designation" validate:"required"`
	IsPermanent       bool    `json:"is_permanent"`
	Phone             *string `json:"phone"`
	PortfolioSlug     *string `json:"portfolio_slug"`
	SortOrder         int     `json:"sort_order"`
	ResearchInterests *string `json:"research_interests"`
	DepartmentID      string  `json:"department_id" validate:"required"`
}

type UpdateFacultyRequest struct {
	FullName          *string `json:"full_name"`
	Designation       *string `json:"designation"`
	IsPermanent       *bool   `json:"is_permanent"`
	Phone             *string `json:"phone"`
	PhotoURL          *string `json:"photo_url"`
	PortfolioSlug     *string `json:"portfolio_slug"`
	SortOrder         *int    `json:"sort_order"`
	ResearchInterests *string `json:"research_interests"`
}

type UpsertProfileRequest struct {
	Biography        *string `json:"biography"`
	DateOfBirth      *string `json:"date_of_birth"`
	DateOfJoining    *string `json:"date_of_joining"`
	GoogleScholarURL *string `json:"google_scholar_url"`
	GoogleScholarID  *string `json:"google_scholar_id"`
	ScopusURL        *string `json:"scopus_url"`
	ScopusAuthorID   *string `json:"scopus_author_id"`
	ORCID            *string `json:"orcid"`
	PublonsURL       *string `json:"publons_url"`
	ResearchGateURL  *string `json:"research_gate_url"`
	VidwanURL        *string `json:"vidwan_url"`
	LinkedInURL      *string `json:"linkedin_url"`
}

type CreateQualificationRequest struct {
	Degree                string  `json:"degree" validate:"required"`
	Specialization        *string `json:"specialization"`
	Institution           string  `json:"institution" validate:"required"`
	CompletionYear        int     `json:"completion_year" validate:"required,min=1950,max=2100"`
	CertificateDocumentID *string `json:"certificate_document_id"`
}

type CreateTeachingExpRequest struct {
	Designation  string  `json:"designation" validate:"required"`
	Organization string  `json:"organization" validate:"required"`
	StartDate    string  `json:"start_date" validate:"required"`
	EndDate      *string `json:"end_date"`
	IsCurrent    bool    `json:"is_current"`
}

type CreateAdminExpRequest struct {
	RoleTitle    string  `json:"role_title" validate:"required"`
	Organization string  `json:"organization" validate:"required"`
	StartDate    string  `json:"start_date" validate:"required"`
	EndDate      *string `json:"end_date"`
	IsCurrent    bool    `json:"is_current"`
}

type CreateHonorRequest struct {
	Title                string  `json:"title" validate:"required"`
	AwardingBody         string  `json:"awarding_body" validate:"required"`
	AwardDate            *string `json:"award_date"`
	AwardYear            *int    `json:"award_year"`
	SupportingDocumentID *string `json:"supporting_document_id"`
}

type CreateExposureRequest struct {
	Title       string  `json:"title" validate:"required"`
	Organizer   *string `json:"organizer"`
	StartDate   *string `json:"start_date"`
	EndDate     *string `json:"end_date"`
	Description *string `json:"description"`
}

type CreateExpertTalkRequest struct {
	Title            string  `json:"title" validate:"required"`
	HostOrganization string  `json:"host_organization" validate:"required"`
	Venue            *string `json:"venue"`
	TalkDate         string  `json:"talk_date" validate:"required"`
	EndDate          *string `json:"end_date"`
	AcademicSession  *string `json:"academic_session"`
	Description      *string `json:"description"`
}
