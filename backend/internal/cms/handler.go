package cms

import (
	"encoding/json"
	"net/http"

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
	// Announcements
	r.Route("/api/v1/announcements", func(r chi.Router) {
		r.Get("/", h.ListAnnouncements)

		r.Group(func(r chi.Router) {
			r.Use(authMiddleware)
			r.Post("/", h.CreateAnnouncement)
			r.Delete("/{id}", h.DeleteAnnouncement)
		})
	})

	// Posts (Achievements & News)
	r.Route("/api/v1/posts", func(r chi.Router) {
		r.Get("/", h.ListPosts)

		r.Group(func(r chi.Router) {
			r.Use(authMiddleware)
			r.Post("/", h.CreatePost)
			r.Delete("/{id}", h.DeletePost)
		})
	})

	// Public alias for tempcse compatibility
	r.Route("/api/v1/hod", func(r chi.Router) {
		r.Get("/get", h.GetHODMessage)
	})
	r.Route("/api/v1/carousel", func(r chi.Router) {
		r.Get("/get", h.ListHomeSlides)
	})

	// CMS Sections
	r.Route("/api/v1/cms", func(r chi.Router) {
		r.Get("/about-sections", h.ListAboutSections)
		r.Get("/programmes-offered", h.ListProgrammesOffered)
		r.Get("/qna", h.ListQnA)
		r.Get("/hod-message", h.GetHODMessage)
		r.Get("/home-slides", h.ListHomeSlides)
		r.Get("/syllabus-documents", h.ListSyllabusDocs)
		r.Get("/calendar-documents", h.ListCalendarDocs)

		r.Group(func(r chi.Router) {
			r.Use(authMiddleware)
			r.Post("/about-sections", h.CreateAboutSection)
			r.Post("/programmes-offered", h.CreateProgrammeOffered)
			r.Post("/qna", h.CreateQnA)
			r.Post("/hod-message", h.CreateHODMessage)
			r.Post("/home-slides", h.CreateHomeSlide)
			r.Delete("/home-slides/{id}", h.DeleteHomeSlide)
		})
	})
}

func (h *Handler) ListAnnouncements(w http.ResponseWriter, r *http.Request) {
	deptID := r.URL.Query().Get("department_id")
	includePrivate := false
	authUser := middleware.GetAuthUser(r.Context())
	if authUser != nil {
		includePrivate = true
	}

	list, err := h.service.ListAnnouncements(r.Context(), deptID, includePrivate)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) CreateAnnouncement(w http.ResponseWriter, r *http.Request) {
	authUser := middleware.GetAuthUser(r.Context())
	var req CreateAnnouncementRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}
	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}

	a, err := h.service.CreateAnnouncement(r.Context(), authUser.UserID, &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusCreated, a)
}

func (h *Handler) DeleteAnnouncement(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if err := h.service.DeleteAnnouncement(r.Context(), id); err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "Announcement deleted successfully"})
}

func (h *Handler) ListPosts(w http.ResponseWriter, r *http.Request) {
	deptID := r.URL.Query().Get("department_id")
	category := r.URL.Query().Get("category")

	list, err := h.service.ListPosts(r.Context(), deptID, category)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) CreatePost(w http.ResponseWriter, r *http.Request) {
	authUser := middleware.GetAuthUser(r.Context())
	var req CreatePostRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}
	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}

	p, err := h.service.CreatePost(r.Context(), authUser.UserID, &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusCreated, p)
}

func (h *Handler) DeletePost(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if err := h.service.DeletePost(r.Context(), id); err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "Post deleted successfully"})
}

func (h *Handler) ListAboutSections(w http.ResponseWriter, r *http.Request) {
	deptID := r.URL.Query().Get("department_id")
	list, err := h.service.ListAboutSections(r.Context(), deptID)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) CreateAboutSection(w http.ResponseWriter, r *http.Request) {
	var req CreateAboutSectionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}
	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}
	a, err := h.service.CreateAboutSection(r.Context(), &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusCreated, a)
}

func (h *Handler) ListProgrammesOffered(w http.ResponseWriter, r *http.Request) {
	deptID := r.URL.Query().Get("department_id")
	list, err := h.service.ListProgrammesOffered(r.Context(), deptID)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) CreateProgrammeOffered(w http.ResponseWriter, r *http.Request) {
	var req CreateProgrammeOfferedRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}
	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}
	p, err := h.service.CreateProgrammeOffered(r.Context(), &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusCreated, p)
}

func (h *Handler) ListQnA(w http.ResponseWriter, r *http.Request) {
	deptID := r.URL.Query().Get("department_id")
	list, err := h.service.ListQnA(r.Context(), deptID)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) CreateQnA(w http.ResponseWriter, r *http.Request) {
	var req CreateQnARequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}
	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}
	q, err := h.service.CreateQnA(r.Context(), &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusCreated, q)
}

func (h *Handler) GetHODMessage(w http.ResponseWriter, r *http.Request) {
	deptID := r.URL.Query().Get("department_id")
	if deptID == "" {
		deptID = r.URL.Query().Get("dept")
	}
	if deptID == "" {
		deptID = r.URL.Query().Get("dept_id")
	}
	if deptID == "" {
		deptID = r.URL.Query().Get("slug")
	}
	msg, err := h.service.GetHODMessage(r.Context(), deptID)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, msg)
}

func (h *Handler) CreateHODMessage(w http.ResponseWriter, r *http.Request) {
	var req CreateHODMessageRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}
	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}
	m, err := h.service.CreateHODMessage(r.Context(), &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusCreated, m)
}

func (h *Handler) ListHomeSlides(w http.ResponseWriter, r *http.Request) {
	deptID := r.URL.Query().Get("department_id")
	if deptID == "" {
		deptID = r.URL.Query().Get("dept")
	}
	if deptID == "" {
		deptID = r.URL.Query().Get("dept_id")
	}
	if deptID == "" {
		deptID = r.URL.Query().Get("slug")
	}
	list, err := h.service.ListHomeSlides(r.Context(), deptID)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) CreateHomeSlide(w http.ResponseWriter, r *http.Request) {
	var req CreateHomeSlideRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}
	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}
	s, err := h.service.CreateHomeSlide(r.Context(), &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusCreated, s)
}

func (h *Handler) DeleteHomeSlide(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if err := h.service.DeleteHomeSlide(r.Context(), id); err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "Home slide deleted successfully"})
}

func (h *Handler) ListSyllabusDocs(w http.ResponseWriter, r *http.Request) {
	deptID := r.URL.Query().Get("department_id")
	list, err := h.service.ListSyllabusDocs(r.Context(), deptID)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) ListCalendarDocs(w http.ResponseWriter, r *http.Request) {
	deptID := r.URL.Query().Get("department_id")
	list, err := h.service.ListCalendarDocs(r.Context(), deptID)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}
