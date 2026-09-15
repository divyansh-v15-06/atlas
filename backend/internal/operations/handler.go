package operations

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/institute-portal/backend/internal/platform/httperr"
	"github.com/institute-portal/backend/internal/platform/response"
	"github.com/institute-portal/backend/internal/platform/validator"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) RegisterRoutes(r chi.Router, authMiddleware func(http.Handler) http.Handler) {
	// Students
	r.Route("/api/v1/students", func(r chi.Router) {
		r.Get("/", h.ListStudents)

		r.Group(func(r chi.Router) {
			r.Use(authMiddleware)
			r.Post("/", h.CreateStudent)
			r.Delete("/{id}", h.DeleteStudent)
		})
	})

	// PhD Scholars
	r.Route("/api/v1/phd-scholars", func(r chi.Router) {
		r.Get("/", h.ListPhdScholars)

		r.Group(func(r chi.Router) {
			r.Use(authMiddleware)
			r.Post("/", h.CreatePhdScholar)
			r.Delete("/{id}", h.DeletePhdScholar)
		})
	})

	// Staff
	r.Route("/api/v1/staff", func(r chi.Router) {
		r.Get("/", h.ListStaff)

		r.Group(func(r chi.Router) {
			r.Use(authMiddleware)
			r.Post("/", h.CreateStaff)
			r.Delete("/{id}", h.DeleteStaff)
		})
	})

	// Labs & Equipment
	r.Route("/api/v1/labs", func(r chi.Router) {
		r.Get("/", h.ListLabs)

		r.Group(func(r chi.Router) {
			r.Use(authMiddleware)
			r.Post("/", h.CreateLab)
		})
	})

	r.Route("/api/v1/equipment", func(r chi.Router) {
		r.Get("/", h.ListEquipment)

		r.Group(func(r chi.Router) {
			r.Use(authMiddleware)
			r.Post("/", h.CreateEquipment)
			r.Delete("/{id}", h.DeleteEquipment)
		})
	})

	// Placement Stats
	r.Route("/api/v1/placement-stats", func(r chi.Router) {
		r.Get("/", h.ListPlacementStats)

		r.Group(func(r chi.Router) {
			r.Use(authMiddleware)
			r.Post("/", h.CreatePlacementStat)
		})
	})
}

func (h *Handler) ListStudents(w http.ResponseWriter, r *http.Request) {
	deptID := r.URL.Query().Get("department_id")
	programmeID := r.URL.Query().Get("programme_id")
	search := r.URL.Query().Get("query")
	var year *int
	if yStr := r.URL.Query().Get("year"); yStr != "" {
		if y, err := strconv.Atoi(yStr); err == nil {
			year = &y
		}
	}

	list, err := h.service.ListStudents(r.Context(), deptID, programmeID, year, search)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) CreateStudent(w http.ResponseWriter, r *http.Request) {
	var req CreateStudentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}
	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}

	s, err := h.service.CreateStudent(r.Context(), &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusCreated, s)
}

func (h *Handler) DeleteStudent(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if err := h.service.DeleteStudent(r.Context(), id); err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "Student deleted successfully"})
}

func (h *Handler) ListPhdScholars(w http.ResponseWriter, r *http.Request) {
	deptID := r.URL.Query().Get("department_id")
	status := r.URL.Query().Get("status")

	list, err := h.service.ListPhdScholars(r.Context(), deptID, status)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) CreatePhdScholar(w http.ResponseWriter, r *http.Request) {
	var req CreatePhdScholarRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}
	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}

	ps, err := h.service.CreatePhdScholar(r.Context(), &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusCreated, ps)
}

func (h *Handler) DeletePhdScholar(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if err := h.service.DeletePhdScholar(r.Context(), id); err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "PhD scholar deleted successfully"})
}

func (h *Handler) ListStaff(w http.ResponseWriter, r *http.Request) {
	deptID := r.URL.Query().Get("department_id")
	list, err := h.service.ListStaff(r.Context(), deptID)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) CreateStaff(w http.ResponseWriter, r *http.Request) {
	var req CreateStaffRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}
	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}

	s, err := h.service.CreateStaff(r.Context(), &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusCreated, s)
}

func (h *Handler) DeleteStaff(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if err := h.service.DeleteStaff(r.Context(), id); err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "Staff member deleted successfully"})
}

func (h *Handler) ListLabs(w http.ResponseWriter, r *http.Request) {
	deptID := r.URL.Query().Get("department_id")
	list, err := h.service.ListLabs(r.Context(), deptID)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) CreateLab(w http.ResponseWriter, r *http.Request) {
	var req CreateLabRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}
	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}

	l, err := h.service.CreateLab(r.Context(), &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusCreated, l)
}

func (h *Handler) ListEquipment(w http.ResponseWriter, r *http.Request) {
	deptID := r.URL.Query().Get("department_id")
	labID := r.URL.Query().Get("lab_id")

	list, err := h.service.ListEquipment(r.Context(), deptID, labID)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) CreateEquipment(w http.ResponseWriter, r *http.Request) {
	var req CreateEquipmentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}
	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}

	e, err := h.service.CreateEquipment(r.Context(), &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusCreated, e)
}

func (h *Handler) DeleteEquipment(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if err := h.service.DeleteEquipment(r.Context(), id); err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "Equipment record deleted successfully"})
}

func (h *Handler) ListPlacementStats(w http.ResponseWriter, r *http.Request) {
	deptID := r.URL.Query().Get("department_id")
	var year *int
	if yStr := r.URL.Query().Get("year"); yStr != "" {
		if y, err := strconv.Atoi(yStr); err == nil {
			year = &y
		}
	}

	list, err := h.service.ListPlacementStats(r.Context(), deptID, year)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) CreatePlacementStat(w http.ResponseWriter, r *http.Request) {
	var req CreatePlacementStatRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}
	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}

	ps, err := h.service.CreatePlacementStat(r.Context(), &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusCreated, ps)
}
