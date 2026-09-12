import databaseSeed from "./database-seed.json";
import {
  Faculty,
  Publication,
  Patent,
  Project,
  Student,
  Staff,
  PhdScholar,
  Announcement,
  Post,
  DepartmentKPIs,
  Course,
  CourseTaught,
} from "./types";

export const MOCK_FACULTY = databaseSeed.faculty.map((f: any) => ({
  id: f.id,
  legacy_id: f.legacy_id,
  user_id: f.user_id,
  full_name: f.full_name,
  employee_code: f.employee_code,
  designation: f.designation,
  is_active: true,
  email: f.email,
  phone: f.phone ? `+91-1972-${f.phone}` : "+91-1972-254400",
  image_url: f.image_url || "/hod.jpg",
  department_id: f.department_id || "22222222-2222-2222-2222-222222222222",
  department_slug: f.department_slug || "cse",
  department_name: f.department_name || "Computer Science & Engineering",
  department_code: f.department_code || "CSE",
  research_interests: f.research_interests || ["Computer Science & Engineering"],
  qualifications: f.qualifications || [],
  teaching_experiences: f.teaching_experiences || [],
  administrative_experiences: f.admin_experiences || f.administrative_experiences || [],
  admin_experiences: f.admin_experiences || f.administrative_experiences || [],
  honors: f.honors || [],
  expert_talks: f.expert_talks || [],
  exposures: f.exposures || [],
  supervisions: f.supervisions || [],
  publications: f.publications || [],
  patents: f.patents || [],
  projects: f.projects || [],
  profile: {
    faculty_id: f.id,
    specializations: (f.research_interests || []).join(", "),
    google_scholar_id: f.profile?.google_scholar_url || f.google_scholar_url || "",
    scopus_id: f.profile?.scopus_id || f.scopus_url || "",
    orcid: f.profile?.orcid || f.orcid || "",
    personal_website: f.portfolio_url || "https://portfolios.nith.ac.in",
    scholar_url: f.profile?.scholar_url || f.google_scholar_url || "",
    bio: f.bio || `${f.full_name} is currently serving as ${f.designation} in the Department of Computer Science & Engineering at NIT Hamirpur.`,
    profile_image_url: f.image_url || "",
  },
}));

export const MOCK_PUBLICATIONS: (Publication & {
  indexing?: string;
  journal_quartile?: string;
  academic_session?: string;
  author_text?: string;
  venue_name?: string;
  page_range?: string;
  faculty_legacy_ids?: number[];
})[] = databaseSeed.publications.map((p: any) => ({
  id: p.id,
  title: p.title,
  publication_type: (p.publication_type as any) || "Journal",
  journal_or_conference_name: p.journal_or_conference_name || p.venue_name || "Proceedings of Conference",
  venue_name: p.venue_name || p.journal_or_conference_name || "",
  volume: p.volume || "",
  issue: p.issue || "",
  pages: p.pages || p.page_range || "",
  page_range: p.page_range || p.pages || "",
  year: Number(p.year) || 2024,
  month: p.month || 1,
  academic_session: p.academic_session || `${p.year}-${Number(p.year) + 1}`,
  doi: p.doi || "",
  issn_isbn: p.isbn || "",
  indexing: p.indexing || "Other",
  journal_quartile: p.journal_quartile || "T",
  author_text: p.author_text || p.raw_authors || "Faculty",
  impact_factor: p.is_sci ? 3.5 : 0,
  is_sci: Boolean(p.is_sci),
  is_scopus: Boolean(p.is_scopus),
  is_peer_reviewed: true,
  abstract_text: `Published research article. Authors: ${p.author_text || p.raw_authors || 'Faculty'}.`,
  publisher: "IEEE / Elsevier / Springer",
  faculty_ids: p.faculty_ids || [],
  faculty_legacy_ids: p.faculty_legacy_ids || [],
  authors: (p.author_text || p.raw_authors || "Faculty")
    .split(",")
    .map((name: string, idx: number) => ({
      id: `a-${idx}`,
      publication_id: p.id,
      faculty_id: (p.faculty_ids && p.faculty_ids[idx]) || null,
      author_name: name.trim(),
      author_order: idx + 1,
      is_corresponding: idx === 0,
    })),
}));

export const MOCK_PATENTS: (Patent & { raw_inventors?: string; year?: number })[] =
  databaseSeed.patents.map((pat: any) => ({
    id: pat.id,
    title: pat.title,
    application_number: pat.application_number || "202311091240",
    patent_number: pat.patent_number || "",
    status: (pat.status as any) || "Filed",
    filing_date: pat.filing_date || "2023-05-10",
    grant_date: pat.grant_date || "",
    year: Number(pat.year) || 2023,
    country: pat.country || "India",
    patent_office: pat.patent_office || "Indian Patent Office (New Delhi)",
    raw_inventors: pat.raw_inventors || "Faculty Inventors",
    abstract_text: `Patented technology developed by CSE department inventors: ${pat.raw_inventors || "Faculty"}.`,
    faculty_ids: pat.faculty_ids || [],
  }));

export const MOCK_PROJECTS: (Project & { raw_investigators?: string; year?: number })[] =
  databaseSeed.projects.map((prj: any) => ({
    id: prj.id,
    title: prj.title,
    funding_agency: prj.funding_agency || "DST-SERB / MeitY",
    status: (prj.status as any) || "Ongoing",
    project_type: "Sponsored R&D",
    start_date: `${prj.year || "2023"}-04-01`,
    end_date: `${Number(prj.year || 2023) + 3}-03-31`,
    year: Number(prj.year) || 2023,
    total_sanctioned_amount: Number(prj.total_sanctioned_amount) || 2500000,
    total_amount_received: Number(prj.total_amount_received) || 2500000,
    scheme: "Core Research Grant",
    reference_number: prj.reference_number || `CRG/${prj.year || 2023}/084`,
    raw_investigators: prj.raw_investigators || "Faculty Investigators",
    faculty_ids: prj.faculty_ids || [],
  }));

export const MOCK_CONSULTANCIES = (databaseSeed.consultancies || []).map((c: any) => ({
  id: c.id,
  title: c.title,
  client_organisation: c.client_organisation || "Corporate Partner",
  amount: Number(c.amount) || 0,
  start_year: Number(c.start_year) || 2024,
  academic_session: c.academic_session || "2024-2025",
  status: c.status || "Completed",
  author_text: c.author_text || "Faculty Consultants",
  faculty_ids: c.faculty_ids || [],
}));

export const MOCK_EVENTS = ((databaseSeed as any).events || []).map((e: any) => ({
  id: e.id,
  title: e.title,
  category: e.category || "organized",
  event_type: e.event_type || "FDP/STC",
  venue: e.venue || "NIT Hamirpur",
  sponsoring_agency: e.sponsoring_agency || "NIT Hamirpur",
  start_date: e.start_date || "2024-06-01",
  end_date: e.end_date || e.start_date,
  academic_session: e.academic_session || "2024-2025",
  convenor: e.convenor || "",
  coordinator: e.coordinator || "",
  link_url: e.link_url || "",
  faculty_ids: e.faculty_ids || [],
}));

export const MOCK_STUDENTS: (Student & { programme_name?: string })[] =
  databaseSeed.students.map((s: any) => ({
    id: s.id,
    department_id: s.department_id,
    programme_id: s.programme_id,
    programme_name: s.programme_name || "B.Tech CSE",
    name: s.name,
    roll_number: s.roll_number,
    email: s.email,
    batch_year: Number(s.admission_year) || 2024,
    current_semester: Number(s.current_semester) || 1,
    cgpa: 8.5,
  }));

export const MOCK_PHD_SCHOLARS: (PhdScholar & {
  supervisor?: string;
  co_supervisor?: string;
  last_qualification?: string;
  research_area?: string;
  dissertation_title?: string;
  registration_year?: string;
  end_date?: string;
  linkedin_url?: string;
  google_scholar_url?: string;
  scopus_url?: string;
})[] = (databaseSeed.phd_scholars || []).map((phd: any) => ({
  id: phd.id,
  department_id: phd.department_id,
  name: phd.name,
  enrollment_number: phd.roll_number,
  topic: phd.topic || phd.dissertation_title || "Computer Science & Engineering",
  dissertation_title: phd.dissertation_title || phd.topic || "Computer Science & Engineering",
  supervisor_faculty_id: "f1",
  supervisor: phd.supervisor || "Faculty Supervisor",
  co_supervisor: phd.co_supervisor || "",
  status: phd.status || "pursuing",
  registration_year: phd.registration_year || "2022",
  joining_date: `${phd.registration_year || "2022"}-08-01`,
  completion_date: phd.end_date || "",
  last_qualification: phd.last_qualification || "M.Tech",
  research_area: phd.research_area || phd.topic || "Computer Science",
  end_date: phd.end_date || "",
  linkedin_url: phd.linkedin_url || "",
  google_scholar_url: phd.google_scholar_url || "",
  scopus_url: phd.scopus_url || "",
}));

export const MOCK_ANNOUNCEMENTS: (Announcement & { category?: string; link_url?: string; is_new?: boolean })[] =
  (databaseSeed.announcements || []).map((ann: any) => ({
    id: ann.id,
    department_id: ann.department_id,
    category: ann.category || "General Notice",
    title: ann.title,
    body: ann.body,
    publish_date: ann.publish_date,
    expiry_date: ann.expiry_date || "2026-12-31",
    link_url: ann.link_url || "",
    is_new: ann.is_new || false,
    is_private: false,
  }));

export const MOCK_ACHIEVEMENTS = (databaseSeed.achievements || []).map((ach: any) => ({
  id: ach.id,
  department_id: ach.department_id,
  category: ach.category || "achievement",
  title: ach.title,
  description: ach.description,
  photo_url: ach.photo_url,
  pdf_url: ach.pdf_url,
  publish_date: ach.publish_date,
}));

export const MOCK_POSTS: Post[] = (databaseSeed.achievements || []).map((ach: any) => ({
  id: ach.id,
  department_id: ach.department_id,
  category: ach.category || "Achievement",
  title: ach.title,
  slug: `post-${ach.legacy_id || ach.id}`,
  body: ach.description,
  publish_date: ach.publish_date,
}));

export const MOCK_STAFF: (Staff & { photo_url?: string; image_url?: string })[] =
  (databaseSeed.staff || []).map((st: any) => ({
    id: st.id,
    department_id: st.department_id,
    name: st.name || st.full_name,
    designation: st.designation,
    email: st.email,
    phone: st.phone || "—",
    photo_url: st.photo_url || st.image_url || "",
    image_url: st.photo_url || st.image_url || "",
  }));

export const MOCK_DEPARTMENT_KPIS: DepartmentKPIs = {
  department_id: "22222222-2222-2222-2222-222222222222",
  department_name: "Computer Science & Engineering",
  faculty_count: MOCK_FACULTY.length,
  staff_count: 8,
  total_students: databaseSeed.students.length,
  total_publications: MOCK_PUBLICATIONS.length,
  patent_count: MOCK_PATENTS.length,
  ongoing_projects: MOCK_PROJECTS.length,
  total_sanctioned_amount: 38500000,
  event_count: 45,
};

export const MOCK_PLACEMENT_STATS = [
  { year: 2025, branch: "B.Tech CSE", graduating: 120, placed: 116, offers: 154, highest_lpa: 54.0, avg_lpa: 18.2, median_lpa: 15.0 },
  { year: 2025, branch: "M.Tech CSE", graduating: 28, placed: 26, offers: 32, highest_lpa: 32.0, avg_lpa: 14.5, median_lpa: 12.0 },
  { year: 2024, branch: "B.Tech CSE", graduating: 115, placed: 111, offers: 148, highest_lpa: 52.5, avg_lpa: 17.8, median_lpa: 14.2 },
];

export const MOCK_COURSES: Course[] = [
  { id: "c-1", code: "CS-201", name: "Data Structures & Algorithms", credits: 4, semester: 3, level: "UG", type: "Core", lecture_hours: 3, tutorial_hours: 1, practical_hours: 2, description: "Advanced data structures including balanced trees, heaps, graphs, hashing, and complexity analysis." },
  { id: "c-2", code: "CS-202", name: "Discrete Mathematics", credits: 4, semester: 3, level: "UG", type: "Core", lecture_hours: 3, tutorial_hours: 1, practical_hours: 0, description: "Set theory, propositional and predicate logic, combinatorics, graph theory, and recurrence relations." },
  { id: "c-3", code: "CS-301", name: "Database Management Systems", credits: 4, semester: 5, level: "UG", type: "Core", lecture_hours: 3, tutorial_hours: 1, practical_hours: 2, description: "Relational models, SQL, normalization, concurrency control, ACID properties, and transaction recovery." },
  { id: "c-4", code: "CS-302", name: "Operating Systems", credits: 4, semester: 5, level: "UG", type: "Core", lecture_hours: 3, tutorial_hours: 1, practical_hours: 2, description: "Process synchronization, deadlock, memory management, virtual memory, paging, and file systems." },
  { id: "c-5", code: "CS-303", name: "Computer Networks", credits: 4, semester: 5, level: "UG", type: "Core", lecture_hours: 3, tutorial_hours: 1, practical_hours: 2, description: "OSI and TCP/IP stack, routing protocols, flow and congestion control, transport protocols, and socket programming." },
  { id: "c-6", code: "CS-401", name: "Artificial Intelligence & Machine Learning", credits: 4, semester: 7, level: "UG", type: "Core", lecture_hours: 3, tutorial_hours: 1, practical_hours: 2, description: "Supervised and unsupervised learning, deep neural networks, heuristic search, reinforcement learning, and computer vision." },
  { id: "c-7", code: "CS-501", name: "Advanced Distributed Systems", credits: 3, semester: 1, level: "PG", type: "Elective", lecture_hours: 3, tutorial_hours: 0, practical_hours: 0, description: "Consensus protocols, Raft, Paxos, distributed transaction processing, cloud computing, and CAP theorem." },
  { id: "c-8", code: "CS-502", name: "Deep Learning & Neural Networks", credits: 4, semester: 2, level: "PG", type: "Core", lecture_hours: 3, tutorial_hours: 1, practical_hours: 2, description: "CNNs, RNNs, transformers, generative adversarial networks, attention mechanisms, and transfer learning." },
  { id: "c-9", code: "CS-601", name: "Research Methodologies in Computing", credits: 3, semester: 1, level: "Doctoral", type: "Core", lecture_hours: 3, tutorial_hours: 0, practical_hours: 0, description: "Literature review techniques, scientific benchmarking, experimental design, paper writing, and ethics in AI research." },
];

export const MOCK_COURSES_TAUGHT: CourseTaught[] = [
  {
    id: "ct-1",
    faculty_code: "101",
    faculty_name: "Prof. Lalit Kumar Awasthi",
    course_code: "CS-501",
    course_name: "Advanced Distributed Systems",
    semester: 1,
    course_level: "PG",
    lecture_hours: 3,
    tutorial_hours: 0,
    practical_hours: 0,
    credits: 3,
    academic_year: "2024-2025",
    section: "M.Tech CSE",
    description: "Consensus protocols, Raft, Paxos, distributed transaction processing, cloud computing, and CAP theorem.",
  },
  {
    id: "ct-2",
    faculty_code: "101",
    faculty_name: "Prof. Lalit Kumar Awasthi",
    course_code: "CS-302",
    course_name: "Operating Systems",
    semester: 5,
    course_level: "UG",
    lecture_hours: 3,
    tutorial_hours: 1,
    practical_hours: 2,
    credits: 4,
    academic_year: "2024-2025",
    section: "B.Tech Sec A",
    description: "Process synchronization, deadlock, memory management, virtual memory, paging, and file systems.",
  },
  {
    id: "ct-3",
    faculty_code: "101",
    faculty_name: "Prof. Lalit Kumar Awasthi",
    course_code: "CS-201",
    course_name: "Data Structures & Algorithms",
    semester: 3,
    course_level: "UG",
    lecture_hours: 3,
    tutorial_hours: 1,
    practical_hours: 2,
    credits: 4,
    academic_year: "2023-2024",
    section: "B.Tech Sec B",
    description: "Advanced data structures including balanced trees, heaps, graphs, hashing, and complexity analysis.",
  },
  {
    id: "ct-4",
    faculty_code: "102",
    faculty_name: "Dr. Kamlesh Dutta",
    course_code: "CS-401",
    course_name: "Artificial Intelligence & Machine Learning",
    semester: 7,
    course_level: "UG",
    lecture_hours: 3,
    tutorial_hours: 1,
    practical_hours: 2,
    credits: 4,
    academic_year: "2024-2025",
    section: "B.Tech Sec A",
    description: "Supervised and unsupervised learning, deep neural networks, heuristic search, and reinforcement learning.",
  },
  {
    id: "ct-5",
    faculty_code: "102",
    faculty_name: "Dr. Kamlesh Dutta",
    course_code: "CS-502",
    course_name: "Deep Learning & Neural Networks",
    semester: 2,
    course_level: "PG",
    lecture_hours: 3,
    tutorial_hours: 1,
    practical_hours: 2,
    credits: 4,
    academic_year: "2024-2025",
    section: "M.Tech AI",
    description: "CNNs, RNNs, transformers, generative adversarial networks, attention mechanisms, and transfer learning.",
  },
  {
    id: "ct-6",
    faculty_code: "103",
    faculty_name: "Dr. T P Sharma",
    course_code: "CS-303",
    course_name: "Computer Networks",
    semester: 5,
    course_level: "UG",
    lecture_hours: 3,
    tutorial_hours: 1,
    practical_hours: 2,
    credits: 4,
    academic_year: "2024-2025",
    section: "B.Tech Sec A",
    description: "OSI and TCP/IP stack, routing protocols, flow and congestion control, transport protocols, and socket programming.",
  },
  {
    id: "ct-7",
    faculty_code: "104",
    faculty_name: "Dr. Narottam Chand",
    course_code: "CS-301",
    course_name: "Database Management Systems",
    semester: 5,
    course_level: "UG",
    lecture_hours: 3,
    tutorial_hours: 1,
    practical_hours: 2,
    credits: 4,
    academic_year: "2024-2025",
    section: "B.Tech Sec B",
    description: "Relational models, SQL, normalization, concurrency control, ACID properties, and transaction recovery.",
  },
];

export const MOCK_LABS = [
  { id: "lab1", name: "High-Performance Cloud & Distributed Systems Lab", location: "Block C, Room 204", head: "Prof. Lalit Kumar Awasthi", equipment_count: 45, description: "Equipped with 4-node Supermicro GPU cluster and OpenStack testbed for distributed computing experiments." },
  { id: "lab2", name: "Artificial Intelligence & Medical Vision Lab", location: "Block C, Room 301", head: "Dr. Kamlesh Dutta", equipment_count: 32, description: "Dedicated to biomedical image segmentation and deep transformer training." },
  { id: "lab3", name: "Cybersecurity & Blockchain Research Lab", location: "Block C, Room 305", head: "Dr. T P Sharma", equipment_count: 28, description: "Equipped with isolated network simulation racks and hardware security modules." },
];
