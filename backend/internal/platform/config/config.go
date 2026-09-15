package config

import (
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	Port                 string
	Env                  string
	DBHost               string
	DBPort               string
	DBUser               string
	DBPassword           string
	DBName               string
	DBSSLMode            string
	JWTSecret            string
	JWTExpirationHours   int
	CORSAllowedOrigins   string
	DefaultInstitutionID string
	DefaultDepartmentID  string

	// SMTP / Email
	SMTPHost     string
	SMTPPort     string
	SMTPUser     string
	SMTPPassword string
	SMTPFrom     string
	FrontendURL  string
}

func Load() *Config {
	_ = godotenv.Load()

	expHours, err := strconv.Atoi(getEnv("JWT_EXPIRATION_HOURS", "24"))
	if err != nil {
		expHours = 24
	}

	return &Config{
		Port:                 getEnv("PORT", "8080"),
		Env:                  getEnv("ENV", "development"),
		DBHost:               getEnv("DB_HOST", "localhost"),
		DBPort:               getEnv("DB_PORT", "5432"),
		DBUser:               getEnv("DB_USER", "postgres"),
		DBPassword:           getEnv("DB_PASSWORD", "postgrespassword"),
		DBName:               getEnv("DB_NAME", "institute_portal"),
		DBSSLMode:            getEnv("DB_SSLMODE", "disable"),
		JWTSecret:            getEnv("JWT_SECRET", "super-secret-key-change-in-production-min-32-chars"),
		JWTExpirationHours:   expHours,
		CORSAllowedOrigins:   getEnv("CORS_ALLOWED_ORIGINS", "*"),
		DefaultInstitutionID: getEnv("DEFAULT_INSTITUTION_ID", "11111111-1111-1111-1111-111111111111"),
		DefaultDepartmentID:  getEnv("DEFAULT_DEPARTMENT_ID", "22222222-2222-2222-2222-222222222222"),

		SMTPHost:     getEnv("SMTP_HOST", "smtp.gmail.com"),
		SMTPPort:     getEnv("SMTP_PORT", "587"),
		SMTPUser:     getEnv("SMTP_USER", ""),
		SMTPPassword: getEnv("SMTP_PASSWORD", ""),
		SMTPFrom:     getEnv("SMTP_FROM", "NIT Hamirpur Portal <24bcs042@nith.ac.in>"),
		FrontendURL:  getEnv("FRONTEND_URL", "https://tempcse.nith.ac.in"),
	}
}

func (c *Config) DSN() string {
	return "postgres://" + c.DBUser + ":" + c.DBPassword + "@" + c.DBHost + ":" + c.DBPort + "/" + c.DBName + "?sslmode=" + c.DBSSLMode
}

func getEnv(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}
