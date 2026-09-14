# ==============================================================================
# Multi-stage Dockerfile for Go Backend
# ==============================================================================

# 1. Build Stage
FROM golang:alpine AS builder

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache git ca-certificates tzdata

# Download dependencies (leveraging Docker layer cache)
COPY go.mod go.sum ./
RUN go mod download

# Copy backend source code
COPY . .

# Compile optimized static binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /app/bin/api ./cmd/api

# 2. Production Runtime Stage
FROM alpine:3.19 AS runner

WORKDIR /app

# Install root certs and timezone data
RUN apk add --no-cache ca-certificates tzdata curl

# Create unprivileged user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy binary and database migration scripts
COPY --from=builder /app/bin/api /app/api
COPY --from=builder /app/migrations /app/migrations

# Set ownership
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

ENTRYPOINT ["/app/api"]
