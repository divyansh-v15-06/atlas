package faculty

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/institute-portal/backend/internal/platform/httperr"
	"github.com/institute-portal/backend/internal/platform/middleware"
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
	r.Route("/api/v1/faculty", func(r chi.Router) {
		r.Get("/", h.ListFaculty)
		r.Get("/{idOrSlug}", h.GetFaculty)
		r.Get("/{idOrSlug}/portfolio", h.GetPortfolio)

		r.Group(func(r chi.Router) {
			r.Use(authMiddleware)
			r.Post("/", h.CreateFaculty)
			r.Patch("/{id}", h.UpdateFaculty)
			r.Delete("/{id}", h.DeleteFaculty)

			// Profile
			r.Get("/{id}/profile", h.GetProfile)
			r.Put("/{id}/profile", h.UpsertProfile)

			// Qualifications
			r.Get("/{id}/qualifications", h.ListQualifications)
			r.Post("/{id}/qualifications", h.CreateQualification)
			r.Delete("/qualifications/{qualId}", h.DeleteQualification)

			// Teaching Experiences
			r.Get("/{id}/teaching-experiences", h.ListTeachingExperiences)
			r.Post("/{id}/teaching-experiences", h.CreateTeachingExperience)
			r.Delete("/teaching-experiences/{expId}", h.DeleteTeachingExperience)

			// Administrative Experiences
			r.Get("/{id}/admin-experiences", h.ListAdminExperiences)
			r.Post("/{id}/admin-experiences", h.CreateAdminExperience)
			r.Delete("/admin-experiences/{expId}", h.DeleteAdminExperience)

			// Honors
			r.Get("/{id}/honors", h.ListHonors)
			r.Post("/{id}/honors", h.CreateHonor)
			r.Delete("/honors/{honorId}", h.DeleteHonor)

			// Exposures
			r.Get("/{id}/exposures", h.ListExposures)
			r.Post("/{id}/exposures", h.CreateExposure)
			r.Delete("/exposures/{expId}", h.DeleteExposure)

			// Expert Talks
			r.Get("/{id}/expert-talks", h.ListExpertTalks)
			r.Post("/{id}/expert-talks", h.CreateExpertTalk)
			r.Delete("/expert-talks/{talkId}", h.DeleteExpertTalk)
		})
	})
}

func (h *Handler) ListFaculty(w http.ResponseWriter, r *http.Request) {
	deptID := r.URL.Query().Get("department_id")
	search := r.URL.Query().Get("query")
	var isPermanent *bool
	if permStr := r.URL.Query().Get("permanent"); permStr != "" {
		if val, err := strconv.ParseBool(permStr); err == nil {
			isPermanent = &val
		}
	}

	var isVisible *bool
	if visStr := r.URL.Query().Get("visible"); visStr != "" {
		if val, err := strconv.ParseBool(visStr); err == nil {
			isVisible = &val
		}
	}

	list, err := h.service.ListFaculty(r.Context(), deptID, isPermanent, search, isVisible)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) GetFaculty(w http.ResponseWriter, r *http.Request) {
	idOrSlug := chi.URLParam(r, "idOrSlug")
	f, err := h.service.GetFaculty(r.Context(), idOrSlug)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, f)
}

func (h *Handler) GetPortfolio(w http.ResponseWriter, r *http.Request) {
	idOrSlug := chi.URLParam(r, "idOrSlug")
	portfolio, err := h.service.GetPortfolio(r.Context(), idOrSlug)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, portfolio)
}

func (h *Handler) CreateFaculty(w http.ResponseWriter, r *http.Request) {
	authUser := middleware.GetAuthUser(r.Context())
	if !authUser.HasRole("INSTITUTE_ADMIN", "DEPARTMENT_ADMIN") {
		response.Error(w, r, httperr.Forbidden("Only administrators can create faculty members"))
		return
	}

	var req CreateFacultyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}

	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}

	f, err := h.service.CreateFaculty(r.Context(), &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.JSON(w, http.StatusCreated, f)
}

func (h *Handler) UpdateFaculty(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var req UpdateFacultyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}

	f, err := h.service.UpdateFaculty(r.Context(), id, &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.JSON(w, http.StatusOK, f)
}

func (h *Handler) DeleteFaculty(w http.ResponseWriter, r *http.Request) {
	authUser := middleware.GetAuthUser(r.Context())
	if !authUser.HasRole("INSTITUTE_ADMIN", "DEPARTMENT_ADMIN") {
		response.Error(w, r, httperr.Forbidden("Only administrators can delete faculty members"))
		return
	}

	id := chi.URLParam(r, "id")
	if err := h.service.DeleteFaculty(r.Context(), id); err != nil {
		response.Error(w, r, err)
		return
	}

	response.JSON(w, http.StatusOK, map[string]string{"message": "Faculty member deleted successfully"})
}

func (h *Handler) GetProfile(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	profile, err := h.service.GetProfile(r.Context(), id)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, profile)
}

func (h *Handler) UpsertProfile(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var req UpsertProfileRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}

	profile, err := h.service.UpsertProfile(r.Context(), id, &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.JSON(w, http.StatusOK, profile)
}

func (h *Handler) ListQualifications(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	list, err := h.service.ListQualifications(r.Context(), id)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) CreateQualification(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var req CreateQualificationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}
	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}
	q, err := h.service.CreateQualification(r.Context(), id, &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusCreated, q)
}

func (h *Handler) DeleteQualification(w http.ResponseWriter, r *http.Request) {
	qualID := chi.URLParam(r, "qualId")
	if err := h.service.DeleteQualification(r.Context(), qualID); err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "Qualification deleted successfully"})
}

func (h *Handler) ListTeachingExperiences(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	list, err := h.service.ListTeachingExperiences(r.Context(), id)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) CreateTeachingExperience(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var req CreateTeachingExpRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}
	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}
	te, err := h.service.CreateTeachingExperience(r.Context(), id, &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusCreated, te)
}

func (h *Handler) DeleteTeachingExperience(w http.ResponseWriter, r *http.Request) {
	expID := chi.URLParam(r, "expId")
	if err := h.service.DeleteTeachingExperience(r.Context(), expID); err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "Teaching experience deleted successfully"})
}

func (h *Handler) ListAdminExperiences(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	list, err := h.service.ListAdminExperiences(r.Context(), id)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) CreateAdminExperience(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var req CreateAdminExpRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}
	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}
	ae, err := h.service.CreateAdminExperience(r.Context(), id, &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusCreated, ae)
}

func (h *Handler) DeleteAdminExperience(w http.ResponseWriter, r *http.Request) {
	expID := chi.URLParam(r, "expId")
	if err := h.service.DeleteAdminExperience(r.Context(), expID); err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "Administrative experience deleted successfully"})
}

func (h *Handler) ListHonors(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	list, err := h.service.ListHonors(r.Context(), id)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) CreateHonor(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var req CreateHonorRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}
	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}
	honor, err := h.service.CreateHonor(r.Context(), id, &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusCreated, honor)
}

func (h *Handler) DeleteHonor(w http.ResponseWriter, r *http.Request) {
	honorID := chi.URLParam(r, "honorId")
	if err := h.service.DeleteHonor(r.Context(), honorID); err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "Honor deleted successfully"})
}

func (h *Handler) ListExposures(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	list, err := h.service.ListExposures(r.Context(), id)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) CreateExposure(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var req CreateExposureRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}
	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}
	exp, err := h.service.CreateExposure(r.Context(), id, &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusCreated, exp)
}

func (h *Handler) DeleteExposure(w http.ResponseWriter, r *http.Request) {
	expID := chi.URLParam(r, "expId")
	if err := h.service.DeleteExposure(r.Context(), expID); err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "Exposure deleted successfully"})
}

func (h *Handler) ListExpertTalks(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	list, err := h.service.ListExpertTalks(r.Context(), id)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) CreateExpertTalk(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var req CreateExpertTalkRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}
	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}
	talk, err := h.service.CreateExpertTalk(r.Context(), id, &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusCreated, talk)
}

func (h *Handler) DeleteExpertTalk(w http.ResponseWriter, r *http.Request) {
	talkID := chi.URLParam(r, "talkId")
	if err := h.service.DeleteExpertTalk(r.Context(), talkID); err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "Expert talk deleted successfully"})
}
