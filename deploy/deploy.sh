#!/usr/bin/env bash

# ==============================================================================
# Institute Portal - Manual/Local Deployment Script
# Run directly on the server to pull and deploy the latest version:
#   cd /var/www/institute-portal && bash deploy/deploy.sh
# ==============================================================================

set -euo pipefail

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$SCRIPT_DIR"

echo -e "${BLUE}================================================================${NC}"
echo -e "${GREEN}  🚀 Deploying NIT Hamirpur Multi-Department Portal             ${NC}"
echo -e "${BLUE}================================================================${NC}"

PREBUILT=false
if [[ "${1:-}" == "--prebuilt" ]]; then
    PREBUILT=true
fi

# Detect if Docker requires sudo privilege
SUDO_PREFIX=""
if ! docker info >/dev/null 2>&1; then
    if sudo -n docker info >/dev/null 2>&1; then
        echo -e "${YELLOW}ℹ️  Using passwordless sudo for Docker commands...${NC}"
        SUDO_PREFIX="sudo -E "
    elif [ -n "${SUDO_PASS:-}" ] && echo "$SUDO_PASS" | sudo -S -E docker info >/dev/null 2>&1; then
        echo -e "${YELLOW}ℹ️  Using authenticated sudo for Docker commands...${NC}"
        SUDO_PREFIX="echo '$SUDO_PASS' | sudo -S -E "
    else
        echo -e "${YELLOW}⚠️  Docker daemon requires sudo permissions; attempting sudo...${NC}"
        SUDO_PREFIX="sudo -E "
    fi
fi

# Detect docker compose CLI command
if eval "${SUDO_PREFIX}docker compose version" >/dev/null 2>&1; then
    COMPOSE_CMD="${SUDO_PREFIX}docker compose"
elif eval "${SUDO_PREFIX}docker-compose version" >/dev/null 2>&1; then
    COMPOSE_CMD="${SUDO_PREFIX}docker-compose"
else
    echo -e "${RED}Error: Neither 'docker compose' nor 'docker-compose' found!${NC}"
    exit 1
fi

# 1. Pull latest git commits if inside a git repository
if [ "$PREBUILT" = true ]; then
    echo -e "\n${YELLOW}[1/4] Using pre-compiled CI/CD build artifacts...${NC}"
elif [ -d ".git" ]; then
    echo -e "\n${YELLOW}[1/4] Pulling latest code from origin/main...${NC}"
    git fetch origin main
    git reset --hard origin/main
else
    echo -e "\n${YELLOW}[1/4] Non-git environment; using local workspace files...${NC}"
fi

# 2. Check .env configuration
echo -e "\n${YELLOW}[2/4] Checking environment configuration (.env)...${NC}"
if [ ! -f ".env" ]; then
    if [ -f ".env.production.example" ]; then
        echo -e "${YELLOW}Creating default .env from .env.production.example...${NC}"
        cp .env.production.example .env
    else
        echo -e "${RED}Error: No .env or .env.production.example found!${NC}"
        exit 1
    fi
fi

# 3. Build & start containers
echo -e "\n${YELLOW}[3/4] Building and launching production containers...${NC}"
eval "$COMPOSE_CMD -f docker-compose.prod.yml down --remove-orphans" || true
eval "$COMPOSE_CMD -f docker-compose.prod.yml build --progress=plain"
eval "$COMPOSE_CMD -f docker-compose.prod.yml up -d --remove-orphans"

# 4. Verification & Status
echo -e "\n${YELLOW}[4/4] Verifying service health...${NC}"
sleep 5
eval "$COMPOSE_CMD -f docker-compose.prod.yml ps"

# Cleanup unused images
echo -e "\n${YELLOW}Cleaning up dangling Docker images...${NC}"
eval "${SUDO_PREFIX}docker image prune -f" || true

echo -e "\n${GREEN}================================================================${NC}"
echo -e "${GREEN}  ✅ Deployment Finished! Service proxy live on Port 3000       ${NC}"
echo -e "${BLUE}================================================================${NC}\n"



