# 🏛️ NIT Hamirpur Multi-Department Portal & Research Management Platform

[![Production Status](https://img.shields.io/badge/Production-Live-success?style=for-the-badge&logo=nginx)](https://tempcse.nith.ac.in)
[![Domain](https://img.shields.io/badge/Domain-tempcse.nith.ac.in-blue?style=for-the-badge)](https://tempcse.nith.ac.in)
[![Go Version](https://img.shields.io/badge/Go-1.25+-00ADD8?style=for-the-badge&logo=go)](https://golang.org)
[![Next.js](https://img.shields.io/badge/Next.js-16%20(Turbopack)-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org)
[![PM2](https://img.shields.io/badge/PM2-Cluster-2B037A?style=for-the-badge&logo=pm2)](https://pm2.keymetrics.io)
[![Nginx](https://img.shields.io/badge/Nginx-Reverse%20Proxy-009639?style=for-the-badge&logo=nginx)](https://nginx.org)

A standardized, full-stack institutional web portal, research discovery engine, and faculty portfolio platform engineered for **National Institute of Technology Hamirpur (NIT Hamirpur)**. Live in production at **[tempcse.nith.ac.in](https://tempcse.nith.ac.in)**.

---

## 📑 Table of Contents

- [Live Production Deployment (tempcse.nith.ac.in)](#-live-production-deployment-tempcsenithacin)
- [Access & Authentication Architecture](#-access--authentication-architecture)
- [Overview & Architectural Vision](#-overview--architectural-vision)
- [System Architecture](#-system-architecture)
- [Key Features Breakdown](#-key-features-breakdown)
  - [1. Public Institutional Portal](#1-public-institutional-portal-)
  - [2. Multi-Department Portals (14 Departments)](#2-multi-department-portals-14-departments-)
  - [3. Research Discovery & Catalogues](#3-research-discovery--catalogues-)
  - [4. Faculty Portfolios & Verified Profiles](#4-faculty-portfolios--verified-profiles-)
  - [5. Faculty Workspace & Self-Service Portal](#5-faculty-workspace--self-service-portal-)
  - [6. Interactive Resume & CV Dossier Builder](#6-interactive-resume--cv-dossier-builder-)
  - [7. Department & Institute Admin Control Center](#7-department--institute-admin-control-center-)
  - [8. Accreditation & Annual Report Generator (NIRF, NBA, NAAC)](#8-accreditation--annual-report-generator-nirf-nba-naac-)
  - [9. Digital Notice Board & CMS](#9-digital-notice-board--cms-)
  - [10. Facilities, Labs & Asset Tagging](#10-facilities-labs--asset-tagging-)
  - [11. Student & PhD Scholar Registries](#11-student--phd-scholar-registries-)
  - [12. Legacy Data Migration & Bulk CSV Ingestion](#12-legacy-data-migration--bulk-csv-ingestion-)
- [Technology Stack](#-technology-stack)
- [Database Architecture & Materialized Views](#-database-architecture--materialized-views)
- [Security, Roles & Access Control (RBAC)](#-security-roles--access-control-rbac)
- [Canonical API Reference](#-canonical-api-reference)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started & Local Development](#-getting-started--local-development)
- [Production Operations & PM2 Guide](#-production-operations--pm2-guide)

---

## 🌐 Live Production Deployment (`tempcse.nith.ac.in`)

The platform is deployed and actively serving institutional traffic on the on-premise NIT Hamirpur server infrastructure:

* **Production URL**: [https://tempcse.nith.ac.in](https://tempcse.nith.ac.in)
* **Faculty Workspace**: [https://tempcse.nith.ac.in/faculty/login](https://tempcse.nith.ac.in/faculty/login)
* **Administrator Console**: [https://tempcse.nith.ac.in/admin/login](https://tempcse.nith.ac.in/admin/login)
* **Password Recovery**: [https://tempcse.nith.ac.in/forgot-password](https://tempcse.nith.ac.in/forgot-password)
* **Backend API Base**: `https://tempcse.nith.ac.in/backend/api/v1`
* **Health Check**: `https://tempcse.nith.ac.in/backend/health`

### Production Architecture & Process Topology

```text
[ Client Traffic (HTTPS / 443) ]
               │
               ▼
   [ Host NGINX Reverse Proxy ] ── (/etc/nginx/sites-enabled/tempcse)
               │
       ┌───────┴────────────────────────┐
       │ (location /)                   │ (location /backend/)
       ▼                                ▼
[ Next.js 16 SSR Frontend ]     [ Go Modular Monolith Backend ]
  • Port: 3005                    • Port: 3001
  • PM2: tempcse-frontend         • PM2: tempcse-backend
  • Turbopack Engine              • Native Compiled Binary
                                        │
                                        ▼
                           [ PostgreSQL 18.6 Engine ]
                             • Port: 5432
                             • Database: institute_portal
                             • Role: portal_admin
```

### Safety & Multi-Tenant Coexistence

The server hosts multiple institute web properties. The deployment operates in strict isolation without impacting adjacent services:
- **`cms.nith.ac.in`** (Port 8080, `/var/www/cms`, DB `cmsdb`) — Untouched & fully active.
- **`eo.nith.ac.in`** (Ports 8000 & 8001, MongoDB `estate_db`) — Untouched & fully active.
- **`mind2023.nith.ac.in`** (`/var/www/mind2023`) — Untouched & fully active.
- **`tempcsebase_backup`** — Full filesystem backup of the legacy CSE application preserved on server for rollback safety.

---

## 🔐 Access & Authentication Architecture

Authentication is strictly processed by the Go backend using salted bcrypt password hashes and signed JWT session tokens. In accordance with security best practices, all public autofill and demo credentials have been completely removed from the user interface and repository documentation.



### Automated Password Reset Flow

A secure, transactional password recovery pipeline is wired into the Go backend:
1. User enters their registered email at [`/forgot-password`](https://tempcse.nith.ac.in/forgot-password).
2. The Go backend generates a cryptographically secure SHA-256 hashed single-use token (valid for 1 hour).
3. A branded HTML reset email is dispatched via Gmail SMTP TLS to the user's inbox.
4. User sets a new password at [`/reset-password/[token]`](https://tempcse.nith.ac.in/reset-password) with real-time strength validation.

---

## 🌟 Overview & Architectural Vision

Previously, institute departments relied on disjointed, legacy single-department applications (such as the legacy `tempcsebase` system). These suffered from:
- **Single-department assumptions**: Duplicate codebases required for each department.
- **Direct faculty ownership anomalies**: Multi-authored publications and interdisciplinary research were cloned or attributed to single individuals, causing inflation in metric counts.
- **Unstructured strings**: Free-text academic sessions (e.g. `"2023-2024"`) and unstandardized dates made multi-year analytics unreliable.
- **Scattered verification**: Lack of a unified audit trail and review workflow across departments.

### The New Standardized Foundation

This platform re-engineers the institutional experience around a unified **three-tier collective hierarchy**:

```text
Institute Collective View (Pan-Institute KPIs, Cross-Department Deduplication, Overall Leaderboards)
  └── Department / Centre View (Universal Parameterized Template for all 14 Academic Units)
        └── Individual Faculty Portfolio (Canonical Research, Time-Stamped External Metrics, Verified CV)
```

### Core Invariants:
1. **Canonical Research Entity Model**: Publications, patents, projects, and consultancies are stored once as canonical records. Attribution join tables (`publication_authors`, `publication_departments`, `project_members`, `project_departments`) link items to faculty and departments. A joint paper co-authored by CSE and ECE faculty is displayed seamlessly on both department pages, but counted **only once** in Institute-wide KPI totals.
2. **Universal Department Template**: All 14 institute departments render through a single high-performance parameterized Next.js template driven by PostgreSQL materialized views. Adding a department requires zero new frontend code.
3. **Time-Stamped External Metrics Snapshots**: Scopus, Google Scholar, and ORCID metrics (H-index, citations, i10-index) are maintained as historical, immutable snapshots rather than editable text fields.
4. **Automated Academic & Financial Calendars**: Reporting periods derive strictly from real transaction and publication dates matched against institutional calendar rules.

---

## 🏗️ System Architecture

```mermaid
flowchart TB
    subgraph Clients["Clients & Users"]
        Public[Public Visitors]
        FacultyUser[Faculty Members]
        DeptAdmin[Department Administrators]
        InstAdmin[Institute Administrators]
    end

    subgraph Gateway["Reverse Proxy & Gateway"]
        Nginx[Nginx 1.25 Reverse Proxy<br/>Port 80/443 | SSL | Gzip | Rate Limits]
    end

    subgraph AppLayer["Application Layer"]
        Frontend[Next.js 14 App Router<br/>React 19, TypeScript, Tailwind CSS, Recharts<br/>Port 3000]
        Backend[Go 1.23+ Modular Monolith<br/>Chi v5, Pgx Pool, JWT, Zerolog<br/>Port 8080]
    end

    subgraph DataLayer["Storage & Cache Layer"]
        Postgres[(PostgreSQL 16 Database<br/>UUID PKs, Triggered Timestamps, MatViews<br/>Port 5432)]
        Redis[(Redis 7 Cache<br/>Sessions & Rate Limiting<br/>Port 6379)]
    end

    Public --> Nginx
    FacultyUser --> Nginx
    DeptAdmin --> Nginx
    InstAdmin --> Nginx

    Nginx -->|/api/*| Backend
    Nginx -->|/*| Frontend
    Frontend -->|Internal API Calls| Backend
    Backend --> Postgres
    Backend --> Redis
```

---

## 🚀 Key Features Breakdown

### 1. Public Institutional Portal (`/`)
- **Pan-Institute Analytics Hero**: Live counter strip highlighting total faculty, canonical publications, funded research projects, patents, and total sanctioned research funding.
- **Interactive Department Selector (`<DepartmentSelector />`)**: Fast-jump dropdown and visual grid to navigate directly into any of the 14 academic departments.
- **Institute Research Leaderboard**: Ranks top researchers across all disciplines by verified citations and H-index.
- **Cross-Disciplinary Research Feed**: Real-time stream of latest peer-reviewed publications, newly granted patents, and newly sanctioned research grants with multi-department attribution badges.
- **Accreditation Readiness**: Prominently highlights NIRF, NBA, and NAAC metric summaries.

### 2. Multi-Department Portals (14 Departments)
Supported academic units:
1. Computer Science & Engineering (**CSE**)
2. Electronics & Communication Engineering (**ECE**)
3. Electrical Engineering (**EE**)
4. Mechanical Engineering (**ME**)
5. Civil Engineering (**CE**)
6. Chemical Engineering (**CHE**)
7. Materials Science & Engineering (**MS**)
8. Architecture (**ARCH**)
9. Physics & Astronomical Science (**PHY**)
10. Chemistry & Chemical Engineering (**CHY**)
11. Mathematics & Scientific Computing (**MATH**)
12. Humanities & Social Sciences (**HMSS**)
13. Center for Computer Science and Applications (**CA**)
14. Center for Materials Science and Engineering (**CMSE**)

**Each department portal provides:**
- **Department Header & Overview**: Vision, mission, contact info, and official message from the Head of Department (HOD).
- **KPI Metrics Strip**: Dynamic statistics on active faculty, technical staff, UG/PG students, pursuing PhD scholars, publication counts, and total research funding.
- **Curriculum & Academic Programmes**: Bachelor of Technology (B.Tech), Master of Technology (M.Tech), Dual Degrees, and Doctoral programmes with intake and syllabus links.
- **Laboratories & Infrastructure**: Specialized departmental labs, equipment listings, lab in-charges, and technical staff.
- **Placement Records**: Historical placement statistics, highest package, average package, median package, and jobs offered.
- **Department Notice Board**: Official notices, circulars, and academic announcements with attached PDF downloads.

### 3. Research Discovery & Catalogues (`/research/*`)
- **Dedicated Publication Catalogues**:
  - `/research/journals` — Peer-reviewed journal papers (SCI, SCIE, Scopus, UGC-CARE indexed).
  - `/research/conferences` — International and national conference proceedings.
  - `/research/books` — Authored and edited academic books.
  - `/research/book-chapters` — Published book chapters with publisher details.
  - Searchable by DOI, title, author name, publication year, department, and indexing tier (Q1–Q4).
- **Sponsored Projects Catalogue (`/projects`)**:
  - Filterable by sponsoring agency (DST, SERB, ISRO, DRDO, CSIR, MeitY, Industry).
  - Categorized by status (`Ongoing`, `Completed`).
  - Outlay visibility: Total sanctioned amount, received installments, PI, and Co-PIs.
- **Intellectual Property & Patents (`/patents`)**:
  - Patent inventory with application numbers, patent offices, jurisdiction (India/PCT/US), filing date, publication date, and grant date.
  - Inventor order preservation and direct links to gazette/patent documents.
- **Industrial Consultancies (`/research/consultancy`)**:
  - Industry engagement records, client organizations, testing/consultancy outlay, and faculty leads.
- **Academic Events (`/research/events`)**:
  - Conferences, Faculty Development Programmes (FDPs), Short-Term Courses (STCs), workshops, and seminars organized by faculty.

### 4. Faculty Portfolios & Verified Profiles (`/faculty/[slug]`)
- **Verified Biographical Profile**: Designation, department appointments, official email, telephone, office location, and biography.
- **External Scholarly Identifiers**:
  - Scopus Author ID & live Scopus citations/H-index snapshot.
  - Google Scholar Profile ID & live Scholar citations/H-index/i10-index.
  - ORCID iD, Web of Science ResearcherID, Vidwan ID, and ResearchGate profile links.
- **Comprehensive Academic CV Sections**:
  - **Academic Qualifications**: Degrees, institutions, passing years, and specializations.
  - **Teaching Experience**: Prior and current academic designations, universities, and courses taught.
  - **Administrative Experience**: Deanships, HOD tenures, committee chairmanships, warden roles, and institutional responsibilities.
  - **Honors & Awards**: National/international academy fellowships, best paper awards, and state recognitions.
  - **International Exposure**: Visits to foreign universities, collaborative research stints, and overseas conferences.
  - **Expert Talks**: Keynote lectures, invited speaker sessions, and panel discussions delivered.
  - **Doctoral & Master's Supervision**: Guided PhD scholars (both awarded and ongoing) and M.Tech thesis supervisions.

### 5. Faculty Workspace & Self-Service Portal (`/faculty/*`)
- **Role-Gated Faculty Login & Dashboard**:
  - Quick overview of personal research output, ongoing projects, and scholar count.
  - Personal profile and contact information editor.
- **Full Self-Service Research Management (CRUD + Workflow)**:
  - Add/edit Publications with automatic DOI normalization and co-author matching.
  - Register Patents with filing dates, application numbers, and grant status.
  - Manage Sponsored Projects and financial grant installments.
  - Maintain Consultancies, Supervisions, and Academic Events.
- **Self-Service CV Records Manager**:
  - Dedicated forms for qualifications, teaching experience, administrative responsibilities, honors, exposures, and expert talks.
- **Faculty Analytics & Merit Visualizations (`/faculty/analytics`)**:
  - Interactive Recharts charts tracking year-over-year publications, citation trajectory, and project funding mobilization.

### 6. Interactive Resume & CV Dossier Builder (`/faculty/export`)
- **Live Interactive CV Customizer**:
  - Toggle visibility of specific sections (Biography, Qualifications, Teaching Experience, Administrative Experience, Sponsored Projects, Patents, Consultancies, Supervisions, Honors, Talks).
  - Multiple layout modes: **Standard Academic**, **Compact Assessment**, and **Research-Focused Dossier**.
- **Live Zoomable Print Preview**:
  - Interactive preview zoom controls (50% to 150%) with accurate page-break rendering.
- **Multi-Format Export Engine**:
  - **Direct Print / PDF**: Formatted for print layouts.
  - **Official DOCX Resume Generation**: Microsoft Word (`.docx`) file matching the official NIT Hamirpur format for annual appraisal and promotions.

### 7. Department & Institute Admin Control Center (`/admin/*`)
- **Multi-Department Scoped Administration**:
  - `INSTITUTE_ADMIN`: Full institute-wide control across all 14 departments, configuration, and reports.
  - `DEPARTMENT_ADMIN`: Scoped to assigned department's faculty, CMS, infrastructure, and student records.
- **Faculty Master Directory Management**:
  - Onboard new faculty members, update designations, allocate employee codes, and manage active appointments.
  - **Instant Administrative Password Reset**: Reset credentials for faculty members with one click.
- **People Operations Management**:
  - Student records manager with batch year filters and semester promotion tools.
  - Technical & administrative staff directory editor.
  - PhD scholar progress tracking (pursuing vs. awarded degrees).
- **Accreditation Dashboard**:
  - Track real-time department indicators required for accreditation submissions.

### 8. Accreditation & Annual Report Generator (NIRF, NBA, NAAC) (`/admin/report`)
- **Annual Departmental Report (DOCX)**:
  - Generates consolidated annual departmental reports aggregating faculty publications, grants, faculty achievements, equipment acquisitions, and placement milestones.
- **NIRF & NBA Accreditation Export (CSV)**:
  - Exports pre-formatted tabular datasets tailored to NIRF (National Institutional Ranking Framework) and NBA/NAAC criteria.

### 9. Digital Notice Board & CMS (`/admin/news`, `/admin/documents`, `/admin/home`)
- **Announcements & Circulars**:
  - Create notices with category tagging, target audience scoping (Public, Faculty Only, Students Only), publish dates, expiry dates, and attached PDF documents.
- **Achievements & News (Posts)**:
  - Publish department breakthroughs, student awards, high-profile visits, and press releases with feature images.
- **Homepage Carousel CMS**:
  - Manage hero banner slides, titles, call-to-action links, and display order.
- **Academic Documents**:
  - Upload and maintain official syllabi and academic calendars categorized by academic session.
- **About Us & Q&A Blocks**:
  - Editable department introduction, departmental strengths, and frequently asked questions.

### 10. Facilities, Labs & Asset Tagging (`/admin/equipments`, `/academics/labs`)
- **Department Laboratories**:
  - Lab descriptions, location details, assigned faculty in-charge, and lab technicians.
- **Equipment & Asset Inventory**:
  - Comprehensive equipment registry: Asset tags, purchase dates, invoice numbers, vendor details, indenter faculty, capital values (in INR), and operational status.

### 11. Student & PhD Scholar Registries (`/admin/people/*`)
- **Undergraduate & Postgraduate Rosters**:
  - Student database categorized by programme, batch year, roll number, and status.
- **Doctoral Scholar Tracking**:
  - PhD scholar monitoring with registration dates, research titles, supervisor allocation, and status (`pursuing` vs `passed`).

### 12. Legacy Data Migration & Bulk CSV Ingestion (`/admin/*`)
- **Automated CSV Importers**:
  - Batch upload utilities for faculty rosters, student lists, publications, and lab equipment.
- **Legacy `tempcsebase` Migration Suite**:
  - Automated migration scripts that clean, normalize, and ingest legacy MySQL dumps into the PostgreSQL schema while preserving source IDs in `legacy_id_maps`.
  - Non-destructive error tracking via `import_jobs` and `import_errors`.

---

## 💻 Technology Stack

### Frontend
| Component | Technology | Version / Spec |
| :--- | :--- | :--- |
| Framework | Next.js (App Router) | 14.2+ |
| UI Library | React | 19.0 |
| Language | TypeScript | 5.5+ |
| Styling | Tailwind CSS | 3.4+ |
| Component Primitives | Radix UI / Shadcn UI | Latest |
| Iconography | Lucide React | Latest |
| Data Visualization | Recharts | 2.15+ |
| HTTP Client | Axios | 1.7+ with interceptors |
| Forms & Validation | React Hook Form & Zod | Latest |
| Notifications | Sonner | Latest |

### Backend
| Component | Technology | Description |
| :--- | :--- | :--- |
| Language | Go (Golang) | 1.23+ |
| HTTP Router | Chi Router (`github.com/go-chi/chi/v5`) | Lightweight, idiomatic Go router |
| Database Driver | `pgx` / `pgxpool` v5 | High-performance PostgreSQL connection pool |
| Auth & Tokens | `golang-jwt/jwt/v5` & `bcrypt` | Secure HS256 JWT tokens & password hashing |
| Logging | Zerolog (`rs/zerolog`) | High-speed structured JSON logging |
| Cross-Origin | `go-chi/cors` | Configurable CORS middleware |
| Migrations | Custom Go Runner + SQL | Embedded SQL migration executor |

### Data & Infrastructure
| Component | Technology | Role |
| :--- | :--- | :--- |
| Database | PostgreSQL 16+ | Primary relational database & materialized views |
| In-Memory Cache | Redis 7 | Session caching & rate limiting |
| Reverse Proxy | Nginx 1.25 | SSL termination, caching, compression & proxy |
| Containers | Docker & Docker Compose | Multi-container dev & production orchestration |
| CI/CD | GitHub Actions | Automated lint, build, test & zero-downtime SSH deploy |

---

## 🗄️ Database Architecture & Materialized Views

The PostgreSQL database enforces strict relational constraints, soft deletion, and automated timestamp tracking across more than 50 tables.

```
                    ┌─────────────────┐
                    │  institutions   │
                    └────────┬────────┘
                             │ 1:N
                    ┌────────┴────────┐
                    │   departments   │◄───────────────┐
                    └────────┬────────┘                │
                             │ 1:N                     │
           ┌─────────────────┼─────────────────┐       │
           │ 1:N             │ 1:N             │ 1:N   │
    ┌──────┴──────┐   ┌──────┴──────┐   ┌──────┴──────┐│
    │ programmes  │   │   faculty   │   │    labs     ││
    └──────┬──────┘   └──────┬──────┘   └──────┬──────┘│
           │ 1:N             │ 1:N             │ 1:N   │
    ┌──────┴──────┐   ┌──────┴──────┐   ┌──────┴──────┐│
    │  students   │   │ appointments│   │  equipment  ││
    └─────────────┘   └─────────────┘   └─────────────┘│
                             │                         │
            ┌────────────────┴────────────────┐        │
            │ Attribution Join Tables         │        │
            ├─────────────────────────────────┤        │
            │ publication_authors / depts     ├────────┤
            │ patent_inventors / depts        ├────────┤
            │ project_members / depts         ├────────┘
            │ consultancy_members             │
            │ supervision_supervisors         │
            │ event_coordinators              │
            └─────────────────────────────────┘
```

### Key Database Tables

1. **Identity & Organisation**:
   - `institutions`, `departments`, `programmes`, `academic_years`, `financial_years`
   - `users`, `roles`, `user_roles`, `role_department_scopes`, `password_resets`
2. **Faculty Profiles & CV**:
   - `faculty`, `faculty_appointments`, `faculty_profiles`, `faculty_metric_snapshots`
   - `faculty_qualifications`, `faculty_teaching_experiences`, `faculty_administrative_experiences`
   - `faculty_honors`, `faculty_exposures`, `expert_talks`
3. **Research & Intellectual Property**:
   - `publications`, `publication_authors`, `publication_departments`, `publication_reviews`
   - `patents`, `patent_inventors`, `patent_departments`, `patent_reviews`
   - `projects`, `project_members`, `project_departments`, `grants`, `project_reviews`
   - `consultancies`, `consultancy_members`
   - `supervisions`, `supervision_supervisors`
   - `events`, `event_coordinators`
   - `courses`, `course_offerings`
4. **Operations & Facilities**:
   - `students`, `phd_scholars`, `staff`, `labs`, `equipment`, `placement_stats`
5. **CMS & Documents**:
   - `announcements`, `posts`, `about_sections`, `programmes_offered`, `qna`
   - `hod_messages`, `home_slides`, `documents`, `syllabus_documents`, `calendar_documents`
6. **Governance & Traceability**:
   - `audit_logs` (JSONB before/after snapshot, actor ID, IP address, user agent)
   - `legacy_id_maps` (source table, legacy integer ID, target UUID)
   - `import_jobs`, `import_errors`

### Performance Optimization: Materialized Views

To serve instant institute and department KPI dashboards without running heavy multi-table joins on every request, the database employs three Materialized Views:

| Materialized View | Purpose | Refresh Mechanism |
| :--- | :--- | :--- |
| `v_faculty_kpis` | Aggregates publications by type, active/completed projects, total funding, patents, supervisions, and latest Scopus/Scholar metrics per faculty member. | Concurrent refresh (`REFRESH MATERIALIZED VIEW CONCURRENTLY`) |
| `v_department_kpis` | Aggregates total faculty, staff, UG/PG students, PhD scholars, publication counts by type, patents, ongoing/completed projects, funding, and consultancies per department. | Concurrent refresh via `pg_cron` / Admin API |
| `v_institute_kpis` | Aggregates institute-wide totals with **strict deduplication** (`COUNT(DISTINCT publication.id)`). Ensures co-authored works are never counted multiple times. | Concurrent refresh via `pg_cron` / Admin API |

---

## 🔒 Security, Roles & Access Control (RBAC)

The platform implements multi-tier Role-Based Access Control (RBAC) enforced at both HTTP middleware and service layer:

```text
[HTTP Request]
   │
   ├── 1. RequestID Middleware (Assigns UUID)
   ├── 2. StructuredLogger Middleware (Zerolog)
   ├── 3. CORS & Security Headers Middleware
   ├── 4. Authenticate Middleware (Verifies Bearer JWT)
   ├── 5. RequireRoles Middleware (Checks User Roles)
   └── 6. RequireDepartmentScope Middleware (Checks Department Scoping)
         │
         ▼
[Application Service / Handler]
```

### Role Matrix

| Role | Scope | Permissions & Capabilities |
| :--- | :--- | :--- |
| `INSTITUTE_ADMIN` | Pan-Institute | Full administrative rights across all 14 departments; user onboarding, role assignments, institutional settings, system-wide reports, and KPI refreshes. |
| `RESEARCH_OFFICE` | Pan-Institute | Research verification, metric reconciliations, duplicate DOI/patent checks, and accreditation data exports. |
| `DEPARTMENT_ADMIN` | Department Scoped | Department CMS, notice board, staff & student rosters, lab equipment inventory, faculty onboarding within department, and department accreditation exports. |
| `REVIEWER` | Department Scoped | Review, verify, or return submitted faculty publication and research records within assigned department. |
| `FACULTY` | Self-Service | Manage personal bio, research draft creation, submit publications/patents/projects for review, edit CV records, and export official resumes. |
| `PUBLIC` | Read-Only | Search published research, view department pages, browse faculty portfolios, and download public notices. |

---

## 📡 Canonical API Reference

All canonical REST API endpoints are prefixed with `/api/v1`.

### 🔐 Authentication & Identity
```http
POST   /api/v1/auth/login                  # Authenticate and receive JWT token
POST   /api/v1/auth/forgot-password        # Initiate password reset request
POST   /api/v1/auth/reset-password         # Complete password reset with token
GET    /api/v1/auth/me                     # Get authenticated user profile & roles (Protected)
POST   /api/v1/auth/change-password        # Change personal password (Protected)
```

### 🏛️ Institutions & Departments
```http
GET    /api/v1/institutions                # List all institutions
GET    /api/v1/institutions/{id}           # Get institution details
GET    /api/v1/departments                 # List all 14 academic departments
GET    /api/v1/departments/{idOrSlug}      # Get department overview by ID or slug (e.g. 'cse')
GET    /api/v1/departments/{id}/programmes # Get academic programmes for a department
POST   /api/v1/departments/{id}/programmes # Create an academic programme (Dept Admin)
GET    /api/v1/academic-years              # List institute academic years
GET    /api/v1/financial-years             # List institute financial reporting years
```

### 👨‍🏫 Faculty & Academic CV
```http
GET    /api/v1/faculty                     # List faculty (query by department_id, permanent, query)
GET    /api/v1/faculty/{idOrSlug}          # Get faculty profile by ID or slug
GET    /api/v1/faculty/{idOrSlug}/portfolio # Get public faculty portfolio
POST   /api/v1/faculty                     # Create faculty member (Admin)
PATCH  /api/v1/faculty/{id}                # Update faculty record (Admin / Self)
DELETE /api/v1/faculty/{id}                # Soft delete faculty member (Admin)

# Profile & Extended Bio
GET    /api/v1/faculty/{id}/profile        # Get bio, research interests, external IDs
PUT    /api/v1/faculty/{id}/profile        # Upsert bio, research interests, external IDs

# CV Collections (CRUD for each collection)
GET/POST/DELETE  /api/v1/faculty/{id}/qualifications
GET/POST/DELETE  /api/v1/faculty/{id}/teaching-experiences
GET/POST/DELETE  /api/v1/faculty/{id}/admin-experiences
GET/POST/DELETE  /api/v1/faculty/{id}/honors
GET/POST/DELETE  /api/v1/faculty/{id}/exposures
GET/POST/DELETE  /api/v1/faculty/{id}/expert-talks
```

### 🔬 Research & Intellectual Property
```http
# Publications
GET    /api/v1/publications                # Query publications (type, department, year, status)
GET    /api/v1/publications/{id}           # Get publication details
POST   /api/v1/publications                # Create publication draft
POST   /api/v1/publications/{id}/submit    # Submit publication for verification
POST   /api/v1/publications/{id}/reviews   # Review publication (APPROVE / REJECT)

# Patents
GET    /api/v1/patents                     # Query patents (status, department, year)
GET    /api/v1/patents/{id}                # Get patent details
POST   /api/v1/patents                     # Create patent entry
POST   /api/v1/patents/{id}/submit         # Submit patent for verification
POST   /api/v1/patents/{id}/reviews        # Review patent (Reviewer / Admin)

# Sponsored Projects & Grants
GET    /api/v1/projects                    # Query sponsored research projects
GET    /api/v1/projects/{id}               # Get project details
POST   /api/v1/projects                    # Create project entry
GET    /api/v1/projects/{id}/grants        # List grant financial installments
POST   /api/v1/projects/{id}/grants        # Record new grant installment

# Consultancies, Supervisions, Events & Courses
GET/POST  /api/v1/consultancies            # List / create industrial consultancies
GET/POST  /api/v1/supervisions             # List / create research supervisions
GET/POST  /api/v1/events                   # List / create academic events (FDP, workshop)
GET/POST  /api/v1/courses                  # List / create departmental course offerings
```

### 🏫 Operations & Infrastructure
```http
GET/POST/DELETE  /api/v1/students          # Manage undergraduate and postgraduate students
GET/POST/DELETE  /api/v1/phd-scholars      # Manage doctoral scholars
GET/POST/DELETE  /api/v1/staff             # Manage technical and administrative staff
GET/POST         /api/v1/labs              # Manage departmental laboratories
GET/POST         /api/v1/equipment         # Manage equipment inventory and asset tags
GET/POST         /api/v1/placement-stats   # Manage placement statistics
```

### 📢 CMS & Digital Content
```http
GET/POST/DELETE  /api/v1/announcements     # Manage department and institute announcements
GET/POST/DELETE  /api/v1/posts             # Manage achievements and news stories
GET/POST         /api/v1/cms/about-sections # Manage about blocks
GET/POST         /api/v1/cms/programmes-offered # Manage programme showcase cards
GET/POST         /api/v1/cms/qna           # Manage Q&A and FAQ items
GET/POST         /api/v1/cms/hod-message   # Manage HOD message & photograph
GET/POST         /api/v1/cms/home-slides   # Manage hero carousel banners
GET              /api/v1/cms/syllabus-documents # List syllabus PDF links
GET              /api/v1/cms/calendar-documents # List academic calendar PDF links
```

### 📊 Reporting, KPIs & Document Generation
```http
GET    /api/v1/kpi/institute               # Pan-Institute deduplicated KPI metrics
GET    /api/v1/kpi/department/{deptId}     # Department-level KPI metrics
GET    /api/v1/kpi/faculty/{facultyId}     # Individual faculty KPI metrics
POST   /api/v1/kpi/refresh                 # Refresh PostgreSQL Materialized Views (Admin)

# Document & Report Generation
GET    /api/v1/reports/resume/{facultyId}  # Compiled resume dataset for CV generation
GET    /api/v1/reports/annual-report       # Compiled departmental annual report dataset
GET    /api/v1/resume/download-resume      # Legacy resume download endpoint
GET    /api/v1/report/download-report      # Legacy annual report download endpoint

# Legacy Statistics Compatibility
GET    /api/v1/aggregates/count            # Aggregate counts for department entities
GET    /api/v1/aggregates/analytics        # Yearly publication/patent trend datasets
```

---

## 📂 Project Directory Structure

```text
.
├── backend/                             # Go Backend Service
│   ├── cmd/
│   │   └── api/
│   │       └── main.go                  # Service bootstrap, dependency wiring & router
│   ├── internal/                        # Internal business logic modules
│   │   ├── cms/                         # Announcements, posts, slides, HOD message
│   │   ├── faculty/                     # Profiles, CV, qualifications, experience
│   │   ├── identity/                    # Auth, JWT, password resets, RBAC
│   │   ├── imports/                     # CSV & legacy migration engine
│   │   ├── operations/                  # Students, PhD scholars, staff, labs, equipment
│   │   ├── organisation/                # Institutions, departments, programmes, calendars
│   │   ├── platform/                    # Database pool, config, logger, middleware, validator
│   │   ├── reporting/                   # Materialized view queries, resume/report compilers
│   │   └── research/                    # Publications, patents, projects, grants
│   ├── migrations/                      # PostgreSQL DDL, materialized views, and seed data
│   │   ├── 000001_initial_schema.up.sql # Core relational schema
│   │   ├── 000002_materialized_views.up.sql # KPI materialized views
│   │   ├── 000003_seed_data.up.sql     # Baseline system seeds
│   │   └── seed_nith_departments.sql    # 14 NITH departments seed
│   ├── scripts/                         # Migration & database extraction scripts
│   ├── Dockerfile                       # Go development container
│   ├── Dockerfile.prod                  # Lightweight Go scratch/alpine production build
│   └── go.mod                           # Go module dependencies
│
├── frontend/                            # Next.js 14 Frontend Application
│   ├── public/                          # Static assets, branding, imagery
│   ├── src/
│   │   ├── app/                         # Next.js App Router structure
│   │   │   ├── (website)/               # Public website route group
│   │   │   │   ├── aboutus/             # About the institute & departments
│   │   │   │   ├── academics/           # Programmes, syllabus, calendar, labs, courses
│   │   │   │   ├── news/                # Institute achievements & news
│   │   │   │   ├── people/              # Faculty, staff, students, PhD scholars
│   │   │   │   ├── placementpage/       # Placement statistics & trends
│   │   │   │   ├── research/            # Journals, conferences, books, projects, patents
│   │   │   │   └── page.tsx             # Public Institute Homepage (Parallax Hero & KPIs)
│   │   │   ├── admin/                   # Department & Institute Administration Portal
│   │   │   │   ├── (pages)/             # Admin pages: people, research, CMS, reports, labs
│   │   │   │   └── login/               # Administrator authentication
│   │   │   ├── faculty/                 # Faculty Workspace Portal
│   │   │   │   ├── (pages)/             # Profile, CV forms, research management, analytics
│   │   │   │   │   └── export/          # Interactive Resume & CV Dossier Builder
│   │   │   │   └── login/               # Faculty authentication
│   │   │   └── layout.tsx               # Root application layout
│   │   ├── components/                  # Reusable UI component library
│   │   │   ├── admin-components/        # Admin tables, Modals, CSV bulk uploaders
│   │   │   ├── charts/                  # Recharts components (Publications, Patents, Projects)
│   │   │   ├── research-components/     # Research management modals & editors
│   │   │   └── ui/                      # Radix UI / Shadcn UI components
│   │   ├── context/                     # React context providers
│   │   │   └── department-context.tsx   # Global active department state & URL sync
│   │   ├── lib/                         # API client, TypeScript interfaces, utilities
│   │   │   ├── api-client.ts            # Configured Axios instance with JWT interceptors
│   │   │   └── departments-registry.json# Registry of all 14 NITH departments
│   │   └── tailwind.config.ts           # Tailwind CSS configuration
│   ├── Dockerfile                       # Frontend development container
│   ├── Dockerfile.prod                  # Frontend production standalone container
│   └── package.json                     # Frontend dependencies
│
├── deploy/                              # Production deployment scripts & guides
│   ├── setup-server.sh                  # Ubuntu/Debian server bootstrap script
│   ├── deploy.sh                        # Deployment execution script
│   └── README.md                        # Production operations & CI/CD guide
│
├── nginx/                               # Reverse proxy configuration
│   ├── default.conf                     # Production virtual host, caching & security rules
│   └── nginx.conf                       # Core Nginx process configuration
│
├── .github/workflows/                   # Automated CI/CD pipelines
│   ├── ci.yml                           # Build, vet & lint validation on PRs
│   └── deploy.yml                       # Automated SSH deployment on merge to main
│
├── docker-compose.prod.yml              # Production multi-container composition
├── start.sh                             # Local development launcher (one command)
├── dev.sh                               # Alternative dev launcher
└── Makefile                             # Convenience make targets
```

---

## ⚡ Getting Started & Local Development

### Prerequisites
- [Go 1.23+](https://golang.org/dl/)
- [Node.js 20+](https://nodejs.org/) & `npm`
- [Docker](https://www.docker.com/) & Docker Compose

### Option A: Launch Everything with One Command (Recommended)

Run the included development launcher:
```bash
./start.sh
```

This single command automatically:
1. Boots **PostgreSQL 16** (`localhost:5432`) and **Redis 7** (`localhost:6379`) in background containers.
2. Applies all database migrations and seeds.
3. Starts the **Go Backend API** at `http://localhost:8080`.
4. Starts the **Next.js Frontend** at `http://localhost:3000`.

### Option B: Manual Step-by-Step Execution

#### 1. Start Infrastructure (PostgreSQL & Redis)
```bash
cd backend
docker compose up -d
```

#### 2. Start Go Backend Service
```bash
cd backend
cp .env.example .env
go run cmd/api/main.go
```
The backend will automatically connect to PostgreSQL and apply any pending SQL migrations located in `migrations/`.

#### 3. Start Next.js Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

### 🌐 Access URLs Reference

| Environment | Portal | URL | Access Mode |
| :--- | :--- | :--- | :--- |
| **Production** | **Public Website** | [https://tempcse.nith.ac.in](https://tempcse.nith.ac.in) | Public Access |
| **Production** | **Faculty Workspace** | [https://tempcse.nith.ac.in/faculty/login](https://tempcse.nith.ac.in/faculty/login) | Faculty Code or Institute Email |
| **Production** | **Administrator Console** | [https://tempcse.nith.ac.in/admin/login](https://tempcse.nith.ac.in/admin/login) | Administrator Email |
| **Production** | **Password Reset** | [https://tempcse.nith.ac.in/forgot-password](https://tempcse.nith.ac.in/forgot-password) | Transactional OTP/Link via Gmail SMTP |
| **Production** | **Backend API** | [https://tempcse.nith.ac.in/backend/api/v1](https://tempcse.nith.ac.in/backend/api/v1) | JWT Protected (`/backend/` Nginx proxy) |
| **Production** | **Backend Health** | [https://tempcse.nith.ac.in/backend/health](https://tempcse.nith.ac.in/backend/health) | `{"status":"healthy","version":"1.0.0"}` |
| **Local Dev** | **Public Website** | [http://localhost:3000](http://localhost:3000) | Public Access |
| **Local Dev** | **Faculty Workspace** | [http://localhost:3000/faculty/login](http://localhost:3000/faculty/login) | Faculty Code / Password |
| **Local Dev** | **Administrator Console** | [http://localhost:3000/admin/login](http://localhost:3000/admin/login) | Admin Email / Password |
| **Local Dev** | **Backend API Health** | [http://localhost:8080/health](http://localhost:8080/health) | API Status |

---

## 🛠️ Production Operations & PM2 Guide

The production deployment on `14.139.56.28` is managed via **PM2** under the `serv-admin` user:

### Service Lifecycle Commands

```bash
# View live status of production services
pm2 list
pm2 status

# View live output logs
pm2 logs tempcse-backend     # Go API logs
pm2 logs tempcse-frontend    # Next.js SSR logs

# Restarting services
pm2 restart tempcse-backend
pm2 restart tempcse-frontend

# Reloading with zero downtime
pm2 reload all

# Resource monitoring dashboard
pm2 monit
```

### Applying Future Updates to Production

```bash
# 1. SSH into the server
ssh -i ~/.ssh/server_access serv-admin@14.139.56.28

# 2. Navigate to project root
cd ~/Documents/projects/koiniyaraapkozadaaatahai

# 3. Pull latest changes
git pull origin main

# 4. If backend changes: Recompile Go binary
cd backend
/usr/local/go/bin/go build -o server ./cmd/api/main.go
pm2 restart tempcse-backend

# 5. If frontend changes: Rebuild Next.js bundle
cd ../frontend
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
npm run build
pm2 restart tempcse-frontend
```

---

## 📄 License & Attribution

Developed for **National Institute of Technology Hamirpur (NIT Hamirpur)**.  
All institutional emblems, department designations, and curriculum data are property of NIT Hamirpur.