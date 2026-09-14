/**
 * Shared TypeScript types matching the Go backend's data models.
 * These are the API response shapes returned by the Go backend.
 */

// ─── Core ─────────────────────────────────────────────────────────────────
export interface Institution {
  id: string;
  name: string;
  slug: string;
  domain: string;
}

export interface Department {
  id: string;
  institution_id: string;
  name: string;
  slug: string;
  code: string;
  contact_email: string;
  about_text: string;
}

export interface Programme {
  id: string;
  department_id: string;
  code: string;
  name: string;
  level: "UG" | "PG" | "DualDegree" | "PhD";
  duration_years: number;
}

// ─── Identity ─────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  roles: string[];
}

export interface AuthTokens {
  access_token: string;
  user: User;
}

// ─── Faculty ──────────────────────────────────────────────────────────────
export interface Faculty {
  id: string;
  user_id: string | null;
  full_name: string;
  employee_code: string;
  designation: string;
  is_active: boolean;
  profile?: FacultyProfile;
}

export interface FacultyProfile {
  faculty_id: string;
  specializations: string;
  google_scholar_id: string;
  scopus_id: string;
  orcid: string;
  personal_website: string;
  bio: string;
  profile_image_url: string;
}

// ─── Research ─────────────────────────────────────────────────────────────
export interface Publication {
  id: string;
  title: string;
  publication_type: "JOURNAL" | "CONFERENCE" | "BOOK" | "BOOK_CHAPTER" | string;
  journal_or_conference_name?: string;
  venue_name?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  page_range?: string;
  year: number;
  month?: number | string | null;
  academic_session?: string;
  doi?: string;
  issn_isbn?: string;
  isbn?: string;
  indexing?: string;
  journal_quartile?: string;
  author_text?: string;
  raw_authors?: string;
  impact_factor?: number;
  is_sci?: boolean;
  is_scopus?: boolean;
  is_peer_reviewed?: boolean;
  abstract_text?: string;
  publisher?: string;
  faculty_ids?: string[];
  associated_faculty?: any[];
  authors?: PublicationAuthor[];
}

export interface PublicationAuthor {
  id: string;
  publication_id: string;
  faculty_id: string | null;
  author_name: string;
  author_order: number;
  is_corresponding: boolean;
}

export interface Patent {
  id: string;
  title: string;
  application_number: string;
  patent_number?: string;
  status: "Filed" | "Published" | "Granted" | "Abandoned" | string;
  filing_date?: string;
  grant_date?: string;
  country?: string;
  patent_office?: string;
  place?: string;
  year?: number | string;
  month?: number | string | null;
  academic_session?: string;
  raw_inventors?: string;
  author_text?: string;
  abstract_text?: string;
  faculty_ids?: string[];
  associated_faculty?: any[];
}

export interface Project {
  id: string;
  title: string;
  funding_agency: string;
  status: "Ongoing" | "Completed" | "Submitted" | string;
  project_type?: string;
  start_date?: string;
  end_date?: string;
  duration?: string;
  year?: number | string;
  month?: number | string | null;
  academic_session?: string;
  principal_investigator?: string;
  co_principal_investigator?: string;
  raw_investigators?: string;
  author_text?: string;
  total_sanctioned_amount: number;
  total_amount_received?: number;
  scheme?: string;
  reference_number?: string;
  faculty_ids?: string[];
  associated_faculty?: any[];
}

export interface Consultancy {
  id: string;
  title: string;
  client_organisation: string;
  amount: number;
  academic_session?: string;
  year?: number | string;
  month?: number | string | null;
  status?: string;
  reference_number?: string;
  author_text?: string;
  faculty_ids?: string[];
  associated_faculty?: any[];
}

export interface Event {
  id: string;
  title: string;
  event_type: string;
  category?: string;
  convenor?: string;
  coordinator?: string;
  position1?: string;
  position2?: string;
  positionother1?: string;
  positionother2?: string;
  sponsoring_agency?: string;
  venue?: string;
  start_date?: string;
  end_date?: string;
  academic_session?: string;
  link_url?: string;
  faculty_ids?: string[];
  associated_faculty?: any[];
}

export interface Supervision {
  id: string;
  department_id?: string;
  scholar_name?: string;
  student_name?: string;
  roll_number?: string;
  programme_level?: string;
  level?: string;
  thesis_title?: string;
  status?: string;
  year?: number | string;
  academic_session?: string;
  registration_date?: string;
  submission_date?: string;
  award_date?: string;
  co_supervisor?: string;
  co_supervisors?: string;
  raw_supervisors?: string;
  faculty_ids?: string[];
  associated_faculty?: any[];
}

export interface ExpertTalk {
  id: string;
  title: string;
  venue?: string;
  host_organization?: string;
  talk_date?: string;
  start_date?: string;
  end_date?: string;
  is_present?: boolean;
  academic_session?: string;
  description?: string;
  faculty_ids?: string[];
  associated_faculty?: any[];
}

// ─── People ───────────────────────────────────────────────────────────────
export interface Student {
  id: string;
  department_id: string;
  programme_id: string;
  name: string;
  roll_number: string;
  email: string;
  batch_year: number;
  cgpa: number;
}

export interface Staff {
  id: string;
  department_id: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
}

export interface PhdScholar {
  id: string;
  department_id: string;
  name: string;
  enrollment_number: string;
  topic: string;
  supervisor_faculty_id: string;
  status: "pursuing" | "passed";
  joining_date: string;
  completion_date: string;
}

// ─── CMS ──────────────────────────────────────────────────────────────────
export interface Announcement {
  id: string;
  department_id: string | null;
  title: string;
  body: string;
  publish_date: string;
  expiry_date: string;
  is_private: boolean;
}

export interface Post {
  id: string;
  department_id: string;
  category: "Achievement" | "AcademicsNews" | "ResearchNews";
  title: string;
  slug: string;
  body: string;
  publish_date: string;
}

export interface HomeSlide {
  id: string;
  title: string;
  link_url: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}

// ─── KPIs / Dashboard ────────────────────────────────────────────────────
export interface FacultyKPIs {
  faculty_id: string;
  faculty_name: string;
  total_publications: number;
  journal_count: number;
  conference_count: number;
  patent_count: number;
  ongoing_projects: number;
  completed_projects: number;
  total_funding: number;
  total_supervisions: number;
  total_events: number;
  scopus_h_index: number;
  scopus_citations: number;
  scholar_h_index: number;
  scholar_citations: number;
}

export interface DepartmentKPIs {
  department_id: string;
  department_name: string;
  faculty_count: number;
  staff_count: number;
  total_students: number;
  total_publications: number;
  patent_count: number;
  ongoing_projects: number;
  total_sanctioned_amount: number;
  event_count: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  semester?: number | string;
  level?: "UG" | "PG" | "Doctoral" | string;
  type?: string;
  lecture_hours?: number;
  tutorial_hours?: number;
  practical_hours?: number;
  description?: string;
  department_id?: string;
  academic_year?: string;
  prerequisites?: string;
  coordinator?: string;
  instructors?: {
    faculty_id?: string;
    faculty_code?: string;
    faculty_name: string;
    faculty_slug?: string;
    designation?: string;
  }[];
}

export interface CourseTaught {
  id: string;
  faculty_id?: string;
  faculty_code?: string;
  faculty_name?: string;
  course_code: string;
  course_name: string;
  semester: number | string;
  course_level: "UG" | "PG" | "Doctoral" | string;
  lecture_hours: number;
  tutorial_hours: number;
  practical_hours: number;
  credits: number;
  academic_year: string;
  section?: string;
  description?: string;
  department_id?: string;
  course_coordinator?: string;
  created_at?: string;
  updated_at?: string;
}

// ─── Pagination ───────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}
