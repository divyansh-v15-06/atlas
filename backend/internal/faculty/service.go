package faculty

import (
	"context"

	"github.com/institute-portal/backend/internal/platform/httperr"
)

type Service interface {
	ListFaculty(ctx context.Context, departmentID string, isPermanent *bool, query string, isVisible *bool) ([]Faculty, error)
	GetFaculty(ctx context.Context, idOrSlug string) (*Faculty, error)
	GetPortfolio(ctx context.Context, idOrSlug string) (*FacultyPortfolioResponse, error)
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
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) ListFaculty(ctx context.Context, departmentID string, isPermanent *bool, query string, isVisible *bool) ([]Faculty, error) {
	return s.repo.ListFaculty(ctx, departmentID, isPermanent, query, isVisible)
}

func (s *service) GetFaculty(ctx context.Context, idOrSlug string) (*Faculty, error) {
	f, err := s.repo.GetFacultyBySlug(ctx, idOrSlug)
	if err != nil {
		return nil, err
	}
	if f == nil {
		f, err = s.repo.GetFacultyByID(ctx, idOrSlug)
		if err != nil {
			return nil, err
		}
	}
	if f == nil {
		return nil, httperr.NotFound("Faculty member not found")
	}
	return f, nil
}

func (s *service) GetPortfolio(ctx context.Context, idOrSlug string) (*FacultyPortfolioResponse, error) {
	f, err := s.GetFaculty(ctx, idOrSlug)
	if err != nil {
		return nil, err
	}

	profile, err := s.repo.GetProfile(ctx, f.ID)
	if err != nil {
		return nil, err
	}

	quals, err := s.repo.ListQualifications(ctx, f.ID)
	if err != nil {
		return nil, err
	}

	teachExp, err := s.repo.ListTeachingExperiences(ctx, f.ID)
	if err != nil {
		return nil, err
	}

	adminExp, err := s.repo.ListAdminExperiences(ctx, f.ID)
	if err != nil {
		return nil, err
	}

	honors, err := s.repo.ListHonors(ctx, f.ID)
	if err != nil {
		return nil, err
	}

	exposures, err := s.repo.ListExposures(ctx, f.ID)
	if err != nil {
		return nil, err
	}

	talks, err := s.repo.ListExpertTalks(ctx, f.ID)
	if err != nil {
		return nil, err
	}

	metrics, err := s.repo.ListLatestMetricSnapshots(ctx, f.ID)
	if err != nil {
		return nil, err
	}

	return &FacultyPortfolioResponse{
		Faculty:                   f,
		Profile:                   profile,
		Qualifications:            quals,
		TeachingExperiences:       teachExp,
		AdministrativeExperiences: adminExp,
		Honors:                    honors,
		Exposures:                 exposures,
		ExpertTalks:               talks,
		LatestMetrics:             metrics,
	}, nil
}

func (s *service) CreateFaculty(ctx context.Context, req *CreateFacultyRequest) (*Faculty, error) {
	return s.repo.CreateFaculty(ctx, req)
}

func (s *service) UpdateFaculty(ctx context.Context, id string, req *UpdateFacultyRequest) (*Faculty, error) {
	return s.repo.UpdateFaculty(ctx, id, req)
}

func (s *service) DeleteFaculty(ctx context.Context, id string) error {
	return s.repo.DeleteFaculty(ctx, id)
}

func (s *service) GetProfile(ctx context.Context, facultyID string) (*FacultyProfile, error) {
	return s.repo.GetProfile(ctx, facultyID)
}

func (s *service) UpsertProfile(ctx context.Context, facultyID string, req *UpsertProfileRequest) (*FacultyProfile, error) {
	return s.repo.UpsertProfile(ctx, facultyID, req)
}

func (s *service) ListQualifications(ctx context.Context, facultyID string) ([]FacultyQualification, error) {
	return s.repo.ListQualifications(ctx, facultyID)
}

func (s *service) CreateQualification(ctx context.Context, facultyID string, req *CreateQualificationRequest) (*FacultyQualification, error) {
	return s.repo.CreateQualification(ctx, facultyID, req)
}

func (s *service) DeleteQualification(ctx context.Context, id string) error {
	return s.repo.DeleteQualification(ctx, id)
}

func (s *service) ListTeachingExperiences(ctx context.Context, facultyID string) ([]FacultyTeachingExp, error) {
	return s.repo.ListTeachingExperiences(ctx, facultyID)
}

func (s *service) CreateTeachingExperience(ctx context.Context, facultyID string, req *CreateTeachingExpRequest) (*FacultyTeachingExp, error) {
	return s.repo.CreateTeachingExperience(ctx, facultyID, req)
}

func (s *service) DeleteTeachingExperience(ctx context.Context, id string) error {
	return s.repo.DeleteTeachingExperience(ctx, id)
}

func (s *service) ListAdminExperiences(ctx context.Context, facultyID string) ([]FacultyAdminExp, error) {
	return s.repo.ListAdminExperiences(ctx, facultyID)
}

func (s *service) CreateAdminExperience(ctx context.Context, facultyID string, req *CreateAdminExpRequest) (*FacultyAdminExp, error) {
	return s.repo.CreateAdminExperience(ctx, facultyID, req)
}

func (s *service) DeleteAdminExperience(ctx context.Context, id string) error {
	return s.repo.DeleteAdminExperience(ctx, id)
}

func (s *service) ListHonors(ctx context.Context, facultyID string) ([]FacultyHonor, error) {
	return s.repo.ListHonors(ctx, facultyID)
}

func (s *service) CreateHonor(ctx context.Context, facultyID string, req *CreateHonorRequest) (*FacultyHonor, error) {
	return s.repo.CreateHonor(ctx, facultyID, req)
}

func (s *service) DeleteHonor(ctx context.Context, id string) error {
	return s.repo.DeleteHonor(ctx, id)
}

func (s *service) ListExposures(ctx context.Context, facultyID string) ([]FacultyExposure, error) {
	return s.repo.ListExposures(ctx, facultyID)
}

func (s *service) CreateExposure(ctx context.Context, facultyID string, req *CreateExposureRequest) (*FacultyExposure, error) {
	return s.repo.CreateExposure(ctx, facultyID, req)
}

func (s *service) DeleteExposure(ctx context.Context, id string) error {
	return s.repo.DeleteExposure(ctx, id)
}

func (s *service) ListExpertTalks(ctx context.Context, facultyID string) ([]ExpertTalk, error) {
	return s.repo.ListExpertTalks(ctx, facultyID)
}

func (s *service) CreateExpertTalk(ctx context.Context, facultyID string, req *CreateExpertTalkRequest) (*ExpertTalk, error) {
	return s.repo.CreateExpertTalk(ctx, facultyID, req)
}

func (s *service) DeleteExpertTalk(ctx context.Context, id string) error {
	return s.repo.DeleteExpertTalk(ctx, id)
}
