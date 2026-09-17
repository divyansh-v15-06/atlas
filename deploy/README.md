# 🚀 CI/CD & Deployment Guide

This guide walks you through deploying the **NIT Hamirpur Multi-Department Portal** on any Linux server (Ubuntu, Debian, CentOS, Rocky Linux) using **GitHub Actions CI/CD** with **SSH username and password** authentication.

---

## 1. Architecture Overview

The production deployment runs via **Docker Compose** with:
- **Nginx Reverse Proxy**: Entry point on ports 80/443, routes `/api/*` to Go Backend and `/` to Next.js Frontend.
- **Go Backend API**: High performance REST API running on port 8080.
- **Next.js Frontend**: Standalone React/Next.js 14 application on port 3000.
- **PostgreSQL 16**: Relational database with persistent storage.
- **Redis 7**: Caching layer with persistent storage.

---

## 2. Server Prerequisites (One-Time Setup)

Log in to your target server via SSH and execute the setup script:

```bash
# Clone the repository (or copy deploy/setup-server.sh directly)
git clone https://github.com/divyansh-v15-06/atlas.git /var/www/institute-portal
cd /var/www/institute-portal

# Run the automated server setup script (requires sudo/root)
sudo bash deploy/setup-server.sh
```

The script automatically:
1. Installs Docker and Docker Compose v2.
2. Creates the deployment directory (`/var/www/institute-portal`).
3. Adds your user to the `docker` group.
4. Enables the UFW firewall for ports 22 (SSH), 80 (HTTP), and 443 (HTTPS).

---

## 3. Configure GitHub Actions Secrets

To enable automated CI/CD deployment on git push, go to your GitHub repository:
**`Settings` &rarr; `Secrets and variables` &rarr; `Actions` &rarr; `New repository secret`**

Add the following 5 secrets:

| Secret Name | Example Value | Description |
| :--- | :--- | :--- |
| `SSH_HOST` | `192.168.1.100` or `server.nith.ac.in` | Your remote server IP or domain |
| `SSH_USER` | `ubuntu` or `root` | SSH login username |
| `SSH_PASSWORD` | `YourPassword123` | SSH login password |
| `SSH_PORT` | `22` | SSH port (defaults to 22 if omitted) |
| `DEPLOY_PATH` | `/var/www/institute-portal` | Target deployment directory on the server |

---

## 4. Production Environment Configuration (`.env`)

On the server inside `/var/www/institute-portal`, configure your `.env` file:

```bash
cp .env.production.example .env
nano .env
```

Customize the database passwords, JWT secret, and ports:
```env
HTTP_PORT=80
HTTPS_PORT=443

DB_USER=postgres
DB_PASSWORD=your_secure_postgres_password
DB_NAME=institute_portal

JWT_SECRET=your_random_64_character_secret_jwt_key
JWT_EXPIRATION_HOURS=24

NEXT_PUBLIC_API_URL=/api
```

---

## 5. How the CI/CD Pipeline Works

### 🧪 Continuous Integration (`.github/workflows/ci.yml`)
- Triggers on every **Pull Request** and **Push** to `main`.
- Validates:
  - Go Backend: `go vet`, `go test`, static binary compilation.
  - Next.js Frontend: `npm ci`, linting, static page build.

### 🚀 Continuous Deployment (`.github/workflows/deploy.yml`)
- Triggers automatically when commits are merged/pushed to `main` (or triggered manually from GitHub Actions UI).
- Steps:
  1. Runs pre-deployment build verification.
  2. Connects to your server over SSH using `SSH_USER` and `SSH_PASSWORD`.
  3. Pulls the latest code from `main`.
  4. Runs `docker compose -f docker-compose.prod.yml up -d --build`.
  5. Verifies service health checks.
  6. Prunes dangling Docker images to maintain server disk health.

---

## 6. Useful Server Operations Commands

### View Service Status:
```bash
docker compose -f docker-compose.prod.yml ps
```

### View Live Logs:
```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Backend only
docker compose -f docker-compose.prod.yml logs -f backend

# Frontend only
docker compose -f docker-compose.prod.yml logs -f frontend

# Nginx access & errors
docker compose -f docker-compose.prod.yml logs -f nginx
```

### Restart All Services:
```bash
docker compose -f docker-compose.prod.yml restart
```

### Manual Trigger / Deploy on Server:
```bash
bash deploy/deploy.sh
```

---

## 7. Enabling HTTPS with Let's Encrypt (Optional)

To enable free SSL certificates with Certbot on your domain:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d portal.nith.ac.in
```
