/**
 * Database Schema Data & Mermaid ER Models
 * Canonical PostgreSQL Architecture for NIT Hamirpur Department & Institute Portal
 */

export interface SchemaColumn {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
  fkTarget?: string;
  isUnique?: boolean;
  isNullable?: boolean;
  defaultValue?: string;
  description: string;
}

export interface SchemaTable {
  name: string;
  category: "Organisation" | "Auth & RBAC" | "Faculty & CV" | "Research & Grants" | "Academics & Operations" | "CMS & Content" | "Governance & Audit";
  description: string;
  primaryKey: string;
  foreignKeys: { column: string; references: string }[];
  columns: SchemaColumn[];
}

export const DATABASE_SCHEMA_TABLES: SchemaTable[] = [
  // 1. ORGANISATION
  {
    name: "institutions",
    category: "Organisation",
    description: "Top-level institute entity (e.g. National Institute of Technology Hamirpur). Roots all departments and institutional settings.",
    primaryKey: "id (UUID)",
    foreignKeys: [],
    columns: [
      { name: "id", type: "UUID", isPk: true, defaultValue: "gen_random_uuid()", description: "Primary unique identifier" },
      { name: "name", type: "TEXT", description: "Official institute name" },
      { name: "slug", type: "TEXT", isUnique: true, description: "URL-friendly slug (e.g. 'nith')" },
      { name: "domain", type: "TEXT", isUnique: true, description: "Official domain name (e.g. 'nith.ac.in')" },
      { name: "logo_url", type: "TEXT", isNullable: true, description: "Institute crest/emblem asset URL" },
      { name: "created_at", type: "TIMESTAMPTZ", defaultValue: "NOW()", description: "Record creation timestamp" },
      { name: "updated_at", type: "TIMESTAMPTZ", defaultValue: "NOW()", description: "Automatic trigger-updated timestamp" },
    ],
  },
  {
    name: "departments",
    category: "Organisation",
    description: "Academic & administrative departments (e.g. Computer Science & Engineering). Scopes all portal data.",
    primaryKey: "id (UUID)",
    foreignKeys: [
      { column: "institution_id", references: "institutions(id)" },
      { column: "parent_department_id", references: "departments(id)" },
    ],
    columns: [
      { name: "id", type: "UUID", isPk: true, defaultValue: "gen_random_uuid()", description: "Department unique identifier" },
      { name: "institution_id", type: "UUID", isFk: true, fkTarget: "institutions.id", description: "Parent institution reference" },
      { name: "parent_department_id", type: "UUID", isFk: true, isNullable: true, fkTarget: "departments.id", description: "Parent department if sub-department" },
      { name: "name", type: "TEXT", description: "Department full title" },
      { name: "slug", type: "TEXT", isUnique: true, description: "Slug identifier (e.g. 'cse', 'ece')" },
      { name: "code", type: "VARCHAR(20)", isUnique: true, description: "Short department code" },
      { name: "contact_email", type: "VARCHAR(255)", isNullable: true, description: "Departmental office email" },
      { name: "contact_phone", type: "VARCHAR(50)", isNullable: true, description: "Departmental EPABX / office phone" },
      { name: "about_text", type: "TEXT", isNullable: true, description: "Overview and mission statement" },
    ],
  },
  {
    name: "academic_years",
    category: "Organisation",
    description: "Calendar/academic sessions (e.g. 2024-2025) for course offerings and placement metrics.",
    primaryKey: "id (UUID)",
    foreignKeys: [{ column: "institution_id", references: "institutions(id)" }],
    columns: [
      { name: "id", type: "UUID", isPk: true, description: "Session identifier" },
      { name: "institution_id", type: "UUID", isFk: true, fkTarget: "institutions.id", description: "Parent institution" },
      { name: "label", type: "VARCHAR(50)", description: "Session label (e.g. '2024-2025')" },
      { name: "start_date", type: "DATE", description: "Session start boundary" },
      { name: "end_date", type: "DATE", description: "Session end boundary" },
      { name: "is_current", type: "BOOLEAN", defaultValue: "FALSE", description: "Marks active academic session" },
    ],
  },
  {
    name: "programmes",
    category: "Organisation",
    description: "Degree programmes offered by departments (B.Tech, M.Tech, Ph.D., Dual Degree).",
    primaryKey: "id (UUID)",
    foreignKeys: [{ column: "department_id", references: "departments(id)" }],
    columns: [
      { name: "id", type: "UUID", isPk: true, description: "Programme identifier" },
      { name: "department_id", type: "UUID", isFk: true, fkTarget: "departments.id", description: "Department reference" },
      { name: "code", type: "VARCHAR(50)", description: "Degree code (e.g. 'BCSE', 'MCSE')" },
      { name: "name", type: "TEXT", description: "Full degree name" },
      { name: "level", type: "VARCHAR(50)", description: "Level: 'UG', 'PG', 'PhD'" },
      { name: "duration_years", type: "INT", defaultValue: "4", description: "Programme duration in years" },
    ],
  },

  // 2. AUTH & RBAC
  {
    name: "users",
    category: "Auth & RBAC",
    description: "Central authentication account table with bcrypt hashed credentials and login timestamps.",
    primaryKey: "id (UUID)",
    foreignKeys: [],
    columns: [
      { name: "id", type: "UUID", isPk: true, defaultValue: "gen_random_uuid()", description: "User primary key" },
      { name: "email", type: "VARCHAR(255)", isUnique: true, description: "Institute email address" },
      { name: "password_hash", type: "VARCHAR(255)", description: "Bcrypt salted hash string" },
      { name: "full_name", type: "TEXT", description: "Display name" },
      { name: "is_active", type: "BOOLEAN", defaultValue: "TRUE", description: "Account enabled state" },
      { name: "first_login", type: "BOOLEAN", defaultValue: "TRUE", description: "Triggers initial password reset on first access" },
      { name: "last_login_at", type: "TIMESTAMPTZ", isNullable: true, description: "Last authentication timestamp" },
    ],
  },
  {
    name: "roles",
    category: "Auth & RBAC",
    description: "RBAC authority definitions ('INSTITUTE_ADMIN', 'DEPARTMENT_ADMIN', 'FACULTY', 'REVIEWER').",
    primaryKey: "id (UUID)",
    foreignKeys: [],
    columns: [
      { name: "id", type: "UUID", isPk: true, description: "Role identifier" },
      { name: "name", type: "VARCHAR(50)", isUnique: true, description: "Unique role name" },
      { name: "description", type: "TEXT", isNullable: true, description: "Role permissions description" },
    ],
  },
  {
    name: "user_roles",
    category: "Auth & RBAC",
    description: "M:N relationship connecting users with system permission roles.",
    primaryKey: "id (UUID)",
    foreignKeys: [
      { column: "user_id", references: "users(id)" },
      { column: "role_id", references: "roles(id)" },
    ],
    columns: [
      { name: "id", type: "UUID", isPk: true, description: "Junction record ID" },
      { name: "user_id", type: "UUID", isFk: true, fkTarget: "users.id", description: "User reference" },
      { name: "role_id", type: "UUID", isFk: true, fkTarget: "roles.id", description: "Role reference" },
    ],
  },
  {
    name: "role_department_scopes",
    category: "Auth & RBAC",
    description: "Scopes departmental admin permissions to specific departments.",
    primaryKey: "id (UUID)",
    foreignKeys: [
      { column: "user_id", references: "users(id)" },
      { column: "role_id", references: "roles(id)" },
      { column: "department_id", references: "departments(id)" },
    ],
    columns: [
      { name: "id", type: "UUID", isPk: true, description: "Scope record ID" },
      { name: "user_id", type: "UUID", isFk: true, fkTarget: "users.id", description: "Scoped user" },
      { name: "role_id", type: "UUID", isFk: true, fkTarget: "roles.id", description: "Scoped role" },
      { name: "department_id", type: "UUID", isFk: true, fkTarget: "departments.id", description: "Department bounded scope" },
    ],
  },

  // 3. FACULTY & CV SATELLITES
  {
    name: "faculty",
    category: "Faculty & CV",
    description: "Core faculty directory holding personal, biographical, and appointment metadata.",
    primaryKey: "id (UUID)",
    foreignKeys: [
      { column: "user_id", references: "users(id)" },
    ],
    columns: [
      { name: "id", type: "UUID", isPk: true, defaultValue: "gen_random_uuid()", description: "Faculty unique ID" },
      { name: "user_id", type: "UUID", isFk: true, isUnique: true, isNullable: true, fkTarget: "users.id", description: "Linked login user account" },
      { name: "employee_code", type: "VARCHAR(50)", isUnique: true, description: "Official code (e.g. 'CS012', 'TF046')" },
      { name: "official_email", type: "VARCHAR(255)", isUnique: true, description: "Institute email" },
      { name: "full_name", type: "TEXT", description: "Full formal name and title" },
      { name: "designation", type: "VARCHAR(100)", description: "Academic rank (Professor, Associate Prof, Assistant Prof)" },
      { name: "is_permanent", type: "BOOLEAN", defaultValue: "TRUE", description: "Permanent faculty or temporary/adjunct" },
      { name: "is_visible", type: "BOOLEAN", defaultValue: "TRUE", description: "Public visibility toggle (controls listing in filters/menus)" },
      { name: "photo_url", type: "TEXT", isNullable: true, description: "Portrait photograph URL" },
      { name: "portfolio_slug", type: "VARCHAR(100)", isNullable: true, description: "Public vanity URL slug" },
      { name: "sort_order", type: "INT", defaultValue: "0", description: "Departmental roster display ordering" },
      { name: "research_interests", type: "TEXT", isNullable: true, description: "Specialized domains and keywords" },
    ],
  },
  {
    name: "faculty_appointments",
    category: "Faculty & CV",
    description: "Departmental appointments (supports cross-departmental joint appointments).",
    primaryKey: "id (UUID)",
    foreignKeys: [
      { column: "faculty_id", references: "faculty(id)" },
      { column: "department_id", references: "departments(id)" },
    ],
    columns: [
      { name: "id", type: "UUID", isPk: true, description: "Appointment ID" },
      { name: "faculty_id", type: "UUID", isFk: true, fkTarget: "faculty.id", description: "Appointed faculty" },
      { name: "department_id", type: "UUID", isFk: true, fkTarget: "departments.id", description: "Department of appointment" },
      { name: "designation", type: "VARCHAR(100)", description: "Department-specific rank" },
      { name: "is_primary", type: "BOOLEAN", defaultValue: "TRUE", description: "Primary parent department indicator" },
      { name: "start_date", type: "DATE", description: "Appointment commencement" },
      { name: "end_date", type: "DATE", isNullable: true, description: "Tenure completion date" },
    ],
  },
  {
    name: "faculty_profiles",
    category: "Faculty & CV",
    description: "Academic profile badges, external research IDs (Scopus, Scholar, ORCID, WoS/Publons, Vidwan).",
    primaryKey: "id (UUID)",
    foreignKeys: [{ column: "faculty_id", references: "faculty(id)" }],
    columns: [
      { name: "id", type: "UUID", isPk: true, description: "Profile identifier" },
      { name: "faculty_id", type: "UUID", isFk: true, isUnique: true, fkTarget: "faculty.id", description: "Faculty 1:1 reference" },
      { name: "biography", type: "TEXT", isNullable: true, description: "Narrative academic biography" },
      { name: "google_scholar_url", type: "TEXT", isNullable: true, description: "Google Scholar profile URL" },
      { name: "google_scholar_id", type: "VARCHAR(100)", isNullable: true, description: "Scholar author ID" },
      { name: "scopus_url", type: "TEXT", isNullable: true, description: "Scopus author link" },
      { name: "scopus_author_id", type: "VARCHAR(100)", isNullable: true, description: "Scopus 11-digit author ID" },
      { name: "orcid", type: "VARCHAR(50)", isNullable: true, description: "ORCID 16-digit identifier" },
      { name: "publons_url", type: "TEXT", isNullable: true, description: "Web of Science / Publons profile" },
      { name: "vidwan_url", type: "TEXT", isNullable: true, description: "INFLIBNET Vidwan portal ID" },
      { name: "linkedin_url", type: "TEXT", isNullable: true, description: "LinkedIn professional handle" },
    ],
  },
  {
    name: "faculty_qualifications",
    category: "Faculty & CV",
    description: "Earned academic degrees (Ph.D., M.Tech, B.Tech) with awarding institutes and graduation years.",
    primaryKey: "id (UUID)",
    foreignKeys: [{ column: "faculty_id", references: "faculty(id)" }],
    columns: [
      { name: "id", type: "UUID", isPk: true, description: "Degree ID" },
      { name: "faculty_id", type: "UUID", isFk: true, fkTarget: "faculty.id", description: "Faculty reference" },
      { name: "degree", type: "VARCHAR(100)", description: "Degree title" },
      { name: "specialization", type: "TEXT", isNullable: true, description: "Branch or specialization" },
      { name: "institution", type: "TEXT", description: "Awarding university / institute" },
      { name: "completion_year", type: "INT", description: "Year conferred" },
    ],
  },

  // 4. RESEARCH & PUBLICATIONS
  {
    name: "publications",
    category: "Research & Grants",
    description: "Scholarly publications (Journals, Conferences, Books, Book Chapters) with indexing & quartiles.",
    primaryKey: "id (UUID)",
    foreignKeys: [{ column: "created_by", references: "users(id)" }],
    columns: [
      { name: "id", type: "UUID", isPk: true, defaultValue: "gen_random_uuid()", description: "Publication primary key" },
      { name: "title", type: "TEXT", description: "Full paper or book title" },
      { name: "publication_type", type: "ENUM", description: "Type: 'JOURNAL', 'CONFERENCE', 'BOOK', 'BOOK_CHAPTER'" },
      { name: "doi", type: "VARCHAR(255)", isNullable: true, isUnique: true, description: "Digital Object Identifier" },
      { name: "isbn", type: "VARCHAR(50)", isNullable: true, description: "ISBN or ISSN number" },
      { name: "venue", type: "TEXT", isNullable: true, description: "Journal name, Conference proceeding, or Publisher" },
      { name: "volume", type: "VARCHAR(50)", isNullable: true, description: "Journal volume" },
      { name: "issue", type: "VARCHAR(50)", isNullable: true, description: "Journal issue number" },
      { name: "pages", type: "VARCHAR(50)", isNullable: true, description: "Pagination (e.g. '120-135')" },
      { name: "year", type: "INT", description: "Calendar year of publication" },
      { name: "indexing", type: "VARCHAR(100)", isNullable: true, description: "Indexing ('SCI', 'Scopus', 'Web of Science')" },
      { name: "quartile", type: "VARCHAR(10)", isNullable: true, description: "Journal quartile ('Q1', 'Q2', 'Q3', 'Q4')" },
      { name: "status", type: "ENUM", defaultValue: "'PUBLISHED'", description: "Workflow state" },
      { name: "raw_authors", type: "TEXT", isNullable: true, description: "Full author citation string" },
    ],
  },
  {
    name: "publication_authors",
    category: "Research & Grants",
    description: "M:N join table linking publications to internal NIT Hamirpur faculty members with author ordering.",
    primaryKey: "id (UUID)",
    foreignKeys: [
      { column: "publication_id", references: "publications(id)" },
      { column: "faculty_id", references: "faculty(id)" },
    ],
    columns: [
      { name: "id", type: "UUID", isPk: true, description: "Junction ID" },
      { name: "publication_id", type: "UUID", isFk: true, fkTarget: "publications.id", description: "Publication reference" },
      { name: "faculty_id", type: "UUID", isFk: true, isNullable: true, fkTarget: "faculty.id", description: "Internal faculty co-author (null for external)" },
      { name: "author_name", type: "TEXT", description: "Formatted author name" },
      { name: "author_order", type: "INT", description: "Order position in paper (1st, 2nd, etc.)" },
      { name: "is_corresponding", type: "BOOLEAN", defaultValue: "FALSE", description: "Corresponding author flag" },
    ],
  },
  {
    name: "patents",
    category: "Research & Grants",
    description: "Intellectual property & patent filings (Granted, Published, Filed) with patent office jurisdictions.",
    primaryKey: "id (UUID)",
    foreignKeys: [],
    columns: [
      { name: "id", type: "UUID", isPk: true, description: "Patent ID" },
      { name: "title", type: "TEXT", description: "Invention title" },
      { name: "patent_type", type: "VARCHAR(50)", defaultValue: "'INVENTION'", description: "Patent classification" },
      { name: "status", type: "VARCHAR(50)", description: "Status: 'Granted', 'Published', 'Filed'" },
      { name: "application_number", type: "VARCHAR(100)", isNullable: true, description: "Official application number" },
      { name: "grant_number", type: "VARCHAR(100)", isNullable: true, description: "Conferred patent grant number" },
      { name: "jurisdiction", type: "VARCHAR(100)", defaultValue: "'India'", description: "Filing patent jurisdiction" },
      { name: "year", type: "INT", description: "Year of filing/grant" },
      { name: "raw_inventors", type: "TEXT", isNullable: true, description: "Inventor citation list" },
    ],
  },
  {
    name: "projects",
    category: "Research & Grants",
    description: "Sponsored R&D projects & grants (DST, SERB, ISRO, DRDO) with sanctioned funding amounts.",
    primaryKey: "id (UUID)",
    foreignKeys: [{ column: "lead_department_id", references: "departments(id)" }],
    columns: [
      { name: "id", type: "UUID", isPk: true, description: "Project ID" },
      { name: "title", type: "TEXT", description: "Project title" },
      { name: "project_number", type: "VARCHAR(100)", isNullable: true, description: "Sanction order code" },
      { name: "sponsor", type: "TEXT", description: "Funding agency" },
      { name: "status", type: "VARCHAR(50)", description: "'Ongoing', 'Completed'" },
      { name: "year", type: "INT", description: "Sanction year" },
      { name: "total_sanctioned_amount", type: "NUMERIC(14,2)", defaultValue: "0.00", description: "Approved budget in INR" },
      { name: "lead_department_id", type: "UUID", isFk: true, fkTarget: "departments.id", description: "Lead department" },
    ],
  },
  {
    name: "supervisions",
    category: "Research & Grants",
    description: "Ph.D. and M.Tech postgraduate theses supervised by faculty members.",
    primaryKey: "id (UUID)",
    foreignKeys: [{ column: "department_id", references: "departments(id)" }],
    columns: [
      { name: "id", type: "UUID", isPk: true, description: "Supervision record ID" },
      { name: "department_id", type: "UUID", isFk: true, fkTarget: "departments.id", description: "Department reference" },
      { name: "programme_level", type: "VARCHAR(50)", description: "'PhD', 'MTech'" },
      { name: "scholar_name", type: "TEXT", description: "Student / scholar name" },
      { name: "roll_number", type: "VARCHAR(50)", isNullable: true, description: "Institute roll number" },
      { name: "thesis_title", type: "TEXT", description: "Doctoral dissertation or M.Tech thesis topic" },
      { name: "status", type: "VARCHAR(50)", description: "'Ongoing', 'Submitted', 'Awarded'" },
    ],
  },

  // 5. ACADEMICS & OPERATIONS
  {
    name: "courses",
    category: "Academics & Operations",
    description: "Department course catalog with credit weights and semester allocations.",
    primaryKey: "id (UUID)",
    foreignKeys: [
      { column: "department_id", references: "departments(id)" },
      { column: "programme_id", references: "programmes(id)" },
    ],
    columns: [
      { name: "id", type: "UUID", isPk: true, description: "Course primary key" },
      { name: "department_id", type: "UUID", isFk: true, fkTarget: "departments.id", description: "Offering department" },
      { name: "programme_id", type: "UUID", isFk: true, isNullable: true, fkTarget: "programmes.id", description: "Associated degree" },
      { name: "code", type: "VARCHAR(50)", description: "Course code (e.g. 'CS-311')" },
      { name: "name", type: "TEXT", description: "Course syllabus title" },
      { name: "credits", type: "NUMERIC(3,1)", defaultValue: "3.0", description: "Credit rating" },
      { name: "semester", type: "INT", isNullable: true, description: "Target curriculum semester" },
    ],
  },
  {
    name: "labs",
    category: "Academics & Operations",
    description: "Department computing and experimental laboratories with faculty officers in charge.",
    primaryKey: "id (UUID)",
    foreignKeys: [
      { column: "department_id", references: "departments(id)" },
      { column: "in_charge_faculty_id", references: "faculty(id)" },
    ],
    columns: [
      { name: "id", type: "UUID", isPk: true, description: "Lab identifier" },
      { name: "department_id", type: "UUID", isFk: true, fkTarget: "departments.id", description: "Department reference" },
      { name: "name", type: "VARCHAR(255)", description: "Laboratory name" },
      { name: "description", type: "TEXT", isNullable: true, description: "Facilities & domain focus" },
      { name: "location", type: "VARCHAR(255)", isNullable: true, description: "Room / building block" },
      { name: "in_charge_faculty_id", type: "UUID", isFk: true, isNullable: true, fkTarget: "faculty.id", description: "Faculty Officer-in-Charge (OIC)" },
    ],
  },
  {
    name: "equipment",
    category: "Academics & Operations",
    description: "Hardware assets and major lab equipment with procurement invoice & asset tags.",
    primaryKey: "id (UUID)",
    foreignKeys: [
      { column: "department_id", references: "departments(id)" },
      { column: "lab_id", references: "labs(id)" },
    ],
    columns: [
      { name: "id", type: "UUID", isPk: true, description: "Asset identifier" },
      { name: "department_id", type: "UUID", isFk: true, fkTarget: "departments.id", description: "Department reference" },
      { name: "lab_id", type: "UUID", isFk: true, isNullable: true, fkTarget: "labs.id", description: "Assigned lab location" },
      { name: "name", type: "VARCHAR(255)", description: "Equipment specification name" },
      { name: "asset_tag", type: "VARCHAR(100)", isNullable: true, description: "Institute inventory bar code tag" },
      { name: "quantity", type: "INT", defaultValue: "1", description: "Total inventory count" },
      { name: "purchase_value", type: "NUMERIC(14,2)", defaultValue: "0.00", description: "Procurement value in INR" },
    ],
  },
  {
    name: "placement_stats",
    category: "Academics & Operations",
    description: "Yearly placement statistics, median packages, and graduating student metrics.",
    primaryKey: "id (UUID)",
    foreignKeys: [{ column: "department_id", references: "departments(id)" }],
    columns: [
      { name: "id", type: "UUID", isPk: true, description: "Metric record ID" },
      { name: "department_id", type: "UUID", isFk: true, fkTarget: "departments.id", description: "Department reference" },
      { name: "year", type: "INT", description: "Graduating batch year" },
      { name: "programme_branch", type: "VARCHAR(100)", description: "Branch (e.g. 'B.Tech CSE')" },
      { name: "graduating_count", type: "INT", defaultValue: "0", description: "Students registered" },
      { name: "placed_count", type: "INT", defaultValue: "0", description: "Offers accepted" },
      { name: "highest_package_lpa", type: "NUMERIC(6,2)", isNullable: true, description: "Highest CTC in LPA" },
      { name: "average_package_lpa", type: "NUMERIC(6,2)", isNullable: true, description: "Average CTC in LPA" },
    ],
  },

  // 6. CMS & CONTENT
  {
    name: "announcements",
    category: "CMS & Content",
    description: "Departmental and institute circulars, notices, and official announcements.",
    primaryKey: "id (UUID)",
    foreignKeys: [{ column: "department_id", references: "departments(id)" }],
    columns: [
      { name: "id", type: "UUID", isPk: true, description: "Notice ID" },
      { name: "department_id", type: "UUID", isFk: true, isNullable: true, fkTarget: "departments.id", description: "Department reference (null = Institute-wide)" },
      { name: "title", type: "TEXT", description: "Circular subject title" },
      { name: "body", type: "TEXT", isNullable: true, description: "Notice content / text" },
      { name: "publish_date", type: "DATE", defaultValue: "CURRENT_DATE", description: "Official issuance date" },
      { name: "is_private", type: "BOOLEAN", defaultValue: "FALSE", description: "Restricted to authenticated faculty" },
    ],
  },
  {
    name: "posts",
    category: "CMS & Content",
    description: "Departmental achievements, student awards, and research breakthroughs.",
    primaryKey: "id (UUID)",
    foreignKeys: [{ column: "department_id", references: "departments(id)" }],
    columns: [
      { name: "id", type: "UUID", isPk: true, description: "Article identifier" },
      { name: "department_id", type: "UUID", isFk: true, fkTarget: "departments.id", description: "Department reference" },
      { name: "category", type: "VARCHAR(50)", description: "'Achievement', 'AcademicsNews', 'ResearchNews'" },
      { name: "title", type: "TEXT", description: "Post title" },
      { name: "body", type: "TEXT", description: "Markdown or HTML formatted content" },
      { name: "publish_date", type: "DATE", defaultValue: "CURRENT_DATE", description: "Publication timestamp" },
    ],
  },

  // 7. GOVERNANCE & AUDIT
  {
    name: "audit_logs",
    category: "Governance & Audit",
    description: "Tamper-evident audit trail capturing actor, IP, before/after JSON diffs for all mutations.",
    primaryKey: "id (UUID)",
    foreignKeys: [
      { column: "actor_user_id", references: "users(id)" },
      { column: "department_id", references: "departments(id)" },
    ],
    columns: [
      { name: "id", type: "UUID", isPk: true, defaultValue: "gen_random_uuid()", description: "Audit event record ID" },
      { name: "actor_user_id", type: "UUID", isFk: true, isNullable: true, fkTarget: "users.id", description: "Authenticated actor" },
      { name: "actor_email", type: "VARCHAR(255)", isNullable: true, description: "Actor email snapshot" },
      { name: "action", type: "VARCHAR(50)", description: "'CREATE', 'UPDATE', 'DELETE', 'REVIEW', 'LOGIN'" },
      { name: "entity_type", type: "VARCHAR(100)", description: "Target table (e.g. 'publications', 'faculty')" },
      { name: "entity_id", type: "UUID", description: "Target row UUID" },
      { name: "ip_address", type: "VARCHAR(50)", isNullable: true, description: "Origin client IP address" },
      { name: "before_state", type: "JSONB", isNullable: true, description: "State before mutation" },
      { name: "after_state", type: "JSONB", isNullable: true, description: "State after mutation" },
      { name: "created_at", type: "TIMESTAMPTZ", defaultValue: "NOW()", description: "Immutable event timestamp" },
    ],
  },
];

// ============================================================================
// MERMAID ER DIAGRAM DEFINITIONS
// ============================================================================

export const MERMAID_DIAGRAMS = {
  // 1. Core High-Level Architecture
  core: `erDiagram
    INSTITUTIONS ||--o{ DEPARTMENTS : contains
    DEPARTMENTS ||--o{ PROGRAMMES : offers
    DEPARTMENTS ||--o{ FACULTY_APPOINTMENTS : appoints
    FACULTY ||--o{ FACULTY_APPOINTMENTS : holds
    USERS ||--o| FACULTY : authenticates
    USERS ||--o{ USER_ROLES : has
    ROLES ||--o{ USER_ROLES : assigned_to

    FACULTY ||--|| FACULTY_PROFILES : has_metadata
    FACULTY ||--o{ PUBLICATION_AUTHORS : co_authors
    PUBLICATIONS ||--o{ PUBLICATION_AUTHORS : includes
    PUBLICATIONS ||--o{ PUBLICATION_DEPARTMENTS : credited_to
    DEPARTMENTS ||--o{ PUBLICATION_DEPARTMENTS : credited_with

    FACULTY ||--o{ PATENT_INVENTORS : invents
    PATENTS ||--o{ PATENT_INVENTORS : authored_by

    FACULTY ||--o{ PROJECT_MEMBERS : leads_or_participates
    PROJECTS ||--o{ PROJECT_MEMBERS : staffed_by

    DEPARTMENTS ||--o{ COURSES : curriculum
    FACULTY ||--o{ SUPERVISIONS : guides
    DEPARTMENTS ||--o{ SUPERVISIONS : registered_at

    INSTITUTIONS {
        uuid id PK
        string name
        string slug
        string domain
    }

    DEPARTMENTS {
        uuid id PK
        uuid institution_id FK
        string name
        string code
        string slug
    }

    USERS {
        uuid id PK
        string email
        string full_name
        boolean is_active
    }

    FACULTY {
        uuid id PK
        uuid user_id FK
        string employee_code
        string full_name
        string designation
        boolean is_visible
    }

    PUBLICATIONS {
        uuid id PK
        string title
        string publication_type
        string doi
        int year
        string indexing
        string quartile
    }

    PATENTS {
        uuid id PK
        string title
        string status
        string application_number
        int year
    }

    PROJECTS {
        uuid id PK
        string title
        string sponsor
        numeric total_sanctioned_amount
        int year
    }
`,

  // 2. Organization & Hierarchy
  organisation: `erDiagram
    INSTITUTIONS ||--o{ DEPARTMENTS : contains
    INSTITUTIONS ||--o{ ACADEMIC_YEARS : defines
    INSTITUTIONS ||--o{ FINANCIAL_YEARS : budgets
    DEPARTMENTS ||--o{ PROGRAMMES : administers
    DEPARTMENTS ||--o{ DOCUMENTS : archives
    DEPARTMENTS ||--o{ DEPARTMENTS : parent_sub_hierarchy

    INSTITUTIONS {
        uuid id PK
        string name
        string slug UK
        string domain UK
        string logo_url
    }

    DEPARTMENTS {
        uuid id PK
        uuid institution_id FK
        uuid parent_department_id FK
        string name
        string slug UK
        string code UK
        string contact_email
    }

    ACADEMIC_YEARS {
        uuid id PK
        uuid institution_id FK
        string label
        date start_date
        date end_date
        boolean is_current
    }

    PROGRAMMES {
        uuid id PK
        uuid department_id FK
        string code
        string name
        string level
        int duration_years
    }

    DOCUMENTS {
        uuid id PK
        uuid department_id FK
        string title
        string storage_key
        string mime_type
        bigint size_bytes
        string visibility
    }
`,

  // 3. Faculty & Satellite CV Modules
  faculty: `erDiagram
    USERS ||--o| FACULTY : authenticates
    FACULTY ||--|| FACULTY_PROFILES : profile_details
    FACULTY ||--o{ FACULTY_APPOINTMENTS : departmental_roles
    FACULTY ||--o{ FACULTY_QUALIFICATIONS : degrees
    FACULTY ||--o{ FACULTY_TEACHING_EXPERIENCES : teaching_history
    FACULTY ||--o{ FACULTY_ADMINISTRATIVE_EXPERIENCES : administrative_history
    FACULTY ||--o{ FACULTY_HONORS : awards_recognitions
    FACULTY ||--o{ FACULTY_EXPOSURES : foreign_visits
    FACULTY ||--o{ EXPERT_TALKS : invited_lectures

    FACULTY {
        uuid id PK
        uuid user_id FK
        string employee_code UK
        string official_email UK
        string full_name
        string designation
        boolean is_permanent
        boolean is_visible
        string photo_url
        string portfolio_slug
    }

    FACULTY_PROFILES {
        uuid id PK
        uuid faculty_id FK
        string biography
        string google_scholar_url
        string scopus_url
        string orcid
        string publons_url
        string vidwan_url
    }

    FACULTY_QUALIFICATIONS {
        uuid id PK
        uuid faculty_id FK
        string degree
        string specialization
        string institution
        int completion_year
    }

    FACULTY_TEACHING_EXPERIENCES {
        uuid id PK
        uuid faculty_id FK
        string designation
        string organization
        date start_date
        date end_date
        boolean is_current
    }

    FACULTY_HONORS {
        uuid id PK
        uuid faculty_id FK
        string title
        string awarding_body
        int award_year
    }
`,

  // 4. Research & Scholarly Output (M:N Multi-Faculty)
  research: `erDiagram
    PUBLICATIONS ||--o{ PUBLICATION_AUTHORS : has_authors
    FACULTY ||--o{ PUBLICATION_AUTHORS : co_authored_by
    PUBLICATIONS ||--o{ PUBLICATION_DEPARTMENTS : credited_to
    DEPARTMENTS ||--o{ PUBLICATION_DEPARTMENTS : credited_with

    PATENTS ||--o{ PATENT_INVENTORS : inventors
    FACULTY ||--o{ PATENT_INVENTORS : invented_by

    PROJECTS ||--o{ PROJECT_MEMBERS : staffing
    FACULTY ||--o{ PROJECT_MEMBERS : member
    PROJECTS ||--o{ GRANTS : funding_tranches

    CONSULTANCIES ||--o{ CONSULTANCY_MEMBERS : team
    FACULTY ||--o{ CONSULTANCY_MEMBERS : consultant

    SUPERVISIONS ||--o{ SUPERVISION_SUPERVISORS : advisors
    FACULTY ||--o{ SUPERVISION_SUPERVISORS : supervisor

    PUBLICATIONS {
        uuid id PK
        string title
        string publication_type
        string doi UK
        string isbn
        string venue
        int year
        string indexing
        string quartile
    }

    PUBLICATION_AUTHORS {
        uuid id PK
        uuid publication_id FK
        uuid faculty_id FK
        string author_name
        int author_order
        boolean is_corresponding
    }

    PATENTS {
        uuid id PK
        string title
        string status
        string application_number
        string grant_number
        int year
    }

    PROJECTS {
        uuid id PK
        string title
        string sponsor
        numeric total_sanctioned_amount
        int year
        string status
    }

    SUPERVISIONS {
        uuid id PK
        uuid department_id FK
        string programme_level
        string scholar_name
        string roll_number
        string thesis_title
        string status
    }
`,

  // 5. Dual Persistence Sync Flow
  syncFlow: `flowchart TD
    A["👤 Faculty / Admin User Action"] --> B{"Client Input Validation"}
    B -->|Passed| C["⚡ Local Storage / IndexedDB Cache (nith_faculty_*)"]
    C --> D["Instant Optimistic UI & Live Badge Count Update"]
    C --> E["📡 Asynchronous REST API Call (/api/v1/...)"]
    E --> F["🛡️ Go API Backend JWT Auth & Scope Middleware"]
    F --> G["🗄️ PostgreSQL 16 Database Transaction (ACID)"]
    G --> H["🔍 M:N Co-author Reflection & Cross-Faculty Propagation"]
    G --> I["📝 Automated Immutable Audit Log (audit_logs)"]
    H --> J["🔄 Webhook / Realtime Storage Event (nith_faculty_storage_update)"]
    J --> K["🌐 Public Website & Roster Auto-Synchronization"]

    classDef primary fill:#fcf8f6,stroke:#85261e,stroke-width:2px,color:#33110e;
    classDef action fill:#85261e,stroke:#33110e,stroke-width:2px,color:#ffffff;
    classDef storage fill:#fff9f6,stroke:#b45309,stroke-width:2px,color:#33110e;
    class A,D,K primary;
    class G,I action;
    class C,E,F,H,J storage;
`,
};
