package cms

import "context"

type Service interface {
	ListAnnouncements(ctx context.Context, deptID string, includePrivate bool) ([]Announcement, error)
	CreateAnnouncement(ctx context.Context, userID string, req *CreateAnnouncementRequest) (*Announcement, error)
	DeleteAnnouncement(ctx context.Context, id string) error

	ListPosts(ctx context.Context, deptID, category string) ([]Post, error)
	CreatePost(ctx context.Context, userID string, req *CreatePostRequest) (*Post, error)
	DeletePost(ctx context.Context, id string) error

	ListAboutSections(ctx context.Context, deptID string) ([]AboutSection, error)
	CreateAboutSection(ctx context.Context, req *CreateAboutSectionRequest) (*AboutSection, error)

	ListProgrammesOffered(ctx context.Context, deptID string) ([]ProgrammeOffered, error)
	CreateProgrammeOffered(ctx context.Context, req *CreateProgrammeOfferedRequest) (*ProgrammeOffered, error)

	ListQnA(ctx context.Context, deptID string) ([]QnA, error)
	CreateQnA(ctx context.Context, req *CreateQnARequest) (*QnA, error)

	GetHODMessage(ctx context.Context, deptID string) (*HODMessage, error)
	CreateHODMessage(ctx context.Context, req *CreateHODMessageRequest) (*HODMessage, error)

	ListHomeSlides(ctx context.Context, deptID string) ([]HomeSlide, error)
	CreateHomeSlide(ctx context.Context, req *CreateHomeSlideRequest) (*HomeSlide, error)
	DeleteHomeSlide(ctx context.Context, id string) error

	ListSyllabusDocs(ctx context.Context, deptID string) ([]SyllabusDoc, error)
	ListCalendarDocs(ctx context.Context, deptID string) ([]CalendarDoc, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) ListAnnouncements(ctx context.Context, deptID string, includePrivate bool) ([]Announcement, error) {
	return s.repo.ListAnnouncements(ctx, deptID, includePrivate)
}

func (s *service) CreateAnnouncement(ctx context.Context, userID string, req *CreateAnnouncementRequest) (*Announcement, error) {
	return s.repo.CreateAnnouncement(ctx, userID, req)
}

func (s *service) DeleteAnnouncement(ctx context.Context, id string) error {
	return s.repo.DeleteAnnouncement(ctx, id)
}

func (s *service) ListPosts(ctx context.Context, deptID, category string) ([]Post, error) {
	return s.repo.ListPosts(ctx, deptID, category)
}

func (s *service) CreatePost(ctx context.Context, userID string, req *CreatePostRequest) (*Post, error) {
	return s.repo.CreatePost(ctx, userID, req)
}

func (s *service) DeletePost(ctx context.Context, id string) error {
	return s.repo.DeletePost(ctx, id)
}

func (s *service) ListAboutSections(ctx context.Context, deptID string) ([]AboutSection, error) {
	return s.repo.ListAboutSections(ctx, deptID)
}

func (s *service) CreateAboutSection(ctx context.Context, req *CreateAboutSectionRequest) (*AboutSection, error) {
	return s.repo.CreateAboutSection(ctx, req)
}

func (s *service) ListProgrammesOffered(ctx context.Context, deptID string) ([]ProgrammeOffered, error) {
	return s.repo.ListProgrammesOffered(ctx, deptID)
}

func (s *service) CreateProgrammeOffered(ctx context.Context, req *CreateProgrammeOfferedRequest) (*ProgrammeOffered, error) {
	return s.repo.CreateProgrammeOffered(ctx, req)
}

func (s *service) ListQnA(ctx context.Context, deptID string) ([]QnA, error) {
	return s.repo.ListQnA(ctx, deptID)
}

func (s *service) CreateQnA(ctx context.Context, req *CreateQnARequest) (*QnA, error) {
	return s.repo.CreateQnA(ctx, req)
}

func (s *service) GetHODMessage(ctx context.Context, deptID string) (*HODMessage, error) {
	return s.repo.GetHODMessage(ctx, deptID)
}

func (s *service) CreateHODMessage(ctx context.Context, req *CreateHODMessageRequest) (*HODMessage, error) {
	return s.repo.CreateHODMessage(ctx, req)
}

func (s *service) ListHomeSlides(ctx context.Context, deptID string) ([]HomeSlide, error) {
	return s.repo.ListHomeSlides(ctx, deptID)
}

func (s *service) CreateHomeSlide(ctx context.Context, req *CreateHomeSlideRequest) (*HomeSlide, error) {
	return s.repo.CreateHomeSlide(ctx, req)
}

func (s *service) DeleteHomeSlide(ctx context.Context, id string) error {
	return s.repo.DeleteHomeSlide(ctx, id)
}

func (s *service) ListSyllabusDocs(ctx context.Context, deptID string) ([]SyllabusDoc, error) {
	return s.repo.ListSyllabusDocs(ctx, deptID)
}

func (s *service) ListCalendarDocs(ctx context.Context, deptID string) ([]CalendarDoc, error) {
	return s.repo.ListCalendarDocs(ctx, deptID)
}
