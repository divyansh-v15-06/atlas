package operations

import "context"

type Service interface {
	ListStudents(ctx context.Context, deptID, programmeID string, year *int, search string) ([]Student, error)
	CreateStudent(ctx context.Context, req *CreateStudentRequest) (*Student, error)
	DeleteStudent(ctx context.Context, id string) error

	ListPhdScholars(ctx context.Context, deptID, status string) ([]PhdScholar, error)
	CreatePhdScholar(ctx context.Context, req *CreatePhdScholarRequest) (*PhdScholar, error)
	DeletePhdScholar(ctx context.Context, id string) error

	ListStaff(ctx context.Context, deptID string) ([]Staff, error)
	CreateStaff(ctx context.Context, req *CreateStaffRequest) (*Staff, error)
	DeleteStaff(ctx context.Context, id string) error

	ListLabs(ctx context.Context, deptID string) ([]Lab, error)
	CreateLab(ctx context.Context, req *CreateLabRequest) (*Lab, error)
	ListEquipment(ctx context.Context, deptID, labID string) ([]Equipment, error)
	CreateEquipment(ctx context.Context, req *CreateEquipmentRequest) (*Equipment, error)
	DeleteEquipment(ctx context.Context, id string) error

	ListPlacementStats(ctx context.Context, deptID string, year *int) ([]PlacementStat, error)
	CreatePlacementStat(ctx context.Context, req *CreatePlacementStatRequest) (*PlacementStat, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) ListStudents(ctx context.Context, deptID, programmeID string, year *int, search string) ([]Student, error) {
	return s.repo.ListStudents(ctx, deptID, programmeID, year, search)
}

func (s *service) CreateStudent(ctx context.Context, req *CreateStudentRequest) (*Student, error) {
	return s.repo.CreateStudent(ctx, req)
}

func (s *service) DeleteStudent(ctx context.Context, id string) error {
	return s.repo.DeleteStudent(ctx, id)
}

func (s *service) ListPhdScholars(ctx context.Context, deptID, status string) ([]PhdScholar, error) {
	return s.repo.ListPhdScholars(ctx, deptID, status)
}

func (s *service) CreatePhdScholar(ctx context.Context, req *CreatePhdScholarRequest) (*PhdScholar, error) {
	return s.repo.CreatePhdScholar(ctx, req)
}

func (s *service) DeletePhdScholar(ctx context.Context, id string) error {
	return s.repo.DeletePhdScholar(ctx, id)
}

func (s *service) ListStaff(ctx context.Context, deptID string) ([]Staff, error) {
	return s.repo.ListStaff(ctx, deptID)
}

func (s *service) CreateStaff(ctx context.Context, req *CreateStaffRequest) (*Staff, error) {
	return s.repo.CreateStaff(ctx, req)
}

func (s *service) DeleteStaff(ctx context.Context, id string) error {
	return s.repo.DeleteStaff(ctx, id)
}

func (s *service) ListLabs(ctx context.Context, deptID string) ([]Lab, error) {
	return s.repo.ListLabs(ctx, deptID)
}

func (s *service) CreateLab(ctx context.Context, req *CreateLabRequest) (*Lab, error) {
	return s.repo.CreateLab(ctx, req)
}

func (s *service) ListEquipment(ctx context.Context, deptID, labID string) ([]Equipment, error) {
	return s.repo.ListEquipment(ctx, deptID, labID)
}

func (s *service) CreateEquipment(ctx context.Context, req *CreateEquipmentRequest) (*Equipment, error) {
	return s.repo.CreateEquipment(ctx, req)
}

func (s *service) DeleteEquipment(ctx context.Context, id string) error {
	return s.repo.DeleteEquipment(ctx, id)
}

func (s *service) ListPlacementStats(ctx context.Context, deptID string, year *int) ([]PlacementStat, error) {
	return s.repo.ListPlacementStats(ctx, deptID, year)
}

func (s *service) CreatePlacementStat(ctx context.Context, req *CreatePlacementStatRequest) (*PlacementStat, error) {
	return s.repo.CreatePlacementStat(ctx, req)
}
