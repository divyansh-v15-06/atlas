package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/institute-portal/backend/internal/cms"
	"github.com/institute-portal/backend/internal/faculty"
	"github.com/institute-portal/backend/internal/identity"
	"github.com/institute-portal/backend/internal/imports"
	"github.com/institute-portal/backend/internal/operations"
	"github.com/institute-portal/backend/internal/organisation"
	"github.com/institute-portal/backend/internal/platform/config"
	"github.com/institute-portal/backend/internal/platform/database"
	"github.com/institute-portal/backend/internal/platform/logger"
	"github.com/institute-portal/backend/internal/platform/middleware"
	"github.com/institute-portal/backend/internal/platform/response"
	"github.com/institute-portal/backend/internal/reporting"
	"github.com/institute-portal/backend/internal/research"
)

func main() {
	cfg := config.Load()
	log := logger.Init(cfg.Env)

	log.Info("Starting Institute Platform Backend Service",
		"env", cfg.Env,
		"port", cfg.Port,
	)

	// Initialize Database Pool
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	db, err := database.NewPool(ctx, cfg.DSN())
	if err != nil {
		log.Warn("Could not connect to PostgreSQL immediately (will proceed for migration checks/dev boot)", "error", err)
	} else {
		defer db.Close()
		log.Info("Connected to PostgreSQL successfully")

		// Run Migrations
		migrationsDir := "migrations"
		if _, err := os.Stat(migrationsDir); os.IsNotExist(err) {
			migrationsDir = filepath.Join("..", "migrations")
		}
		if err := db.RunMigrations(context.Background(), migrationsDir); err != nil {
			log.Warn("Migration step note", "error", err)
		} else {
			log.Info("Database migrations checked/applied successfully")
		}
	}

	// Router Setup
	r := chi.NewRouter()

	// Global Middlewares
	r.Use(middleware.RequestID)
	r.Use(middleware.StructuredLogger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "X-Request-ID"},
		ExposedHeaders:   []string{"Link", "X-Request-ID"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Health Check & Root Info
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		response.JSON(w, http.StatusOK, map[string]any{
			"status":    "healthy",
			"timestamp": time.Now().UTC().Format(time.RFC3339),
			"version":   "1.0.0",
		})
	})

	r.Get("/api/v1/info", func(w http.ResponseWriter, r *http.Request) {
		response.JSON(w, http.StatusOK, map[string]any{
			"message": "Institute Research, Department & Faculty Portfolio Platform API is live",
			"version": "v1",
		})
	})

	// Auth Middleware helper
	authMiddleware := middleware.Authenticate(cfg.JWTSecret)

	if db != nil && db.Pool != nil {
		// Identity Module
		identityRepo := identity.NewRepository(db.Pool)
		identityService := identity.NewService(identityRepo, cfg.JWTSecret, cfg.JWTExpirationHours)
		identityHandler := identity.NewHandler(identityService)
		identityHandler.RegisterRoutes(r, authMiddleware)

		// Organisation Module
		orgRepo := organisation.NewRepository(db.Pool)
		orgService := organisation.NewService(orgRepo)
		orgHandler := organisation.NewHandler(orgService)
		orgHandler.RegisterRoutes(r, authMiddleware)

		// Faculty Module
		facultyRepo := faculty.NewRepository(db.Pool)
		facultyService := faculty.NewService(facultyRepo)
		facultyHandler := faculty.NewHandler(facultyService)
		facultyHandler.RegisterRoutes(r, authMiddleware)

		// Research Module
		researchRepo := research.NewRepository(db.Pool)
		researchService := research.NewService(researchRepo)
		researchHandler := research.NewHandler(researchService)
		researchHandler.RegisterRoutes(r, authMiddleware)

		// Operations Module
		opsRepo := operations.NewRepository(db.Pool)
		opsService := operations.NewService(opsRepo)
		opsHandler := operations.NewHandler(opsService)
		opsHandler.RegisterRoutes(r, authMiddleware)

		// CMS Module
		cmsRepo := cms.NewRepository(db.Pool)
		cmsService := cms.NewService(cmsRepo)
		cmsHandler := cms.NewHandler(cmsService)
		cmsHandler.RegisterRoutes(r, authMiddleware)

		// Reporting Module
		reportingRepo := reporting.NewRepository(db.Pool)
		reportingService := reporting.NewService(reportingRepo)
		reportingHandler := reporting.NewHandler(reportingService)
		reportingHandler.RegisterRoutes(r, authMiddleware)

		// Imports Module
		importsService := imports.NewService(db.Pool)
		importsHandler := imports.NewHandler(importsService)
		importsHandler.RegisterRoutes(r, authMiddleware)
	}

	// Server Configuration
	srv := &http.Server{
		Addr:         fmt.Sprintf(":%s", cfg.Port),
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Graceful Shutdown Channel
	serverErrors := make(chan error, 1)
	go func() {
		log.Info(fmt.Sprintf("Server listening on http://localhost:%s", cfg.Port))
		serverErrors <- srv.ListenAndServe()
	}()

	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, os.Interrupt, syscall.SIGTERM)

	select {
	case err := <-serverErrors:
		if !errors.Is(err, http.ErrServerClosed) {
			log.Error("Server error", "error", err)
			os.Exit(1)
		}
	case sig := <-shutdown:
		log.Info("Shutdown signal received", "signal", sig.String())
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		if err := srv.Shutdown(ctx); err != nil {
			log.Error("Graceful shutdown failed, forcing close", "error", err)
			_ = srv.Close()
		}
		log.Info("Server stopped cleanly")
	}
}
