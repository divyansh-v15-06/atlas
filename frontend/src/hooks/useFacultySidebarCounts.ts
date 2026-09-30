"use client";

import { useState, useEffect, useCallback } from "react";
import { getStoredData, resolveFacultyBaseline } from "@/lib/faculty-storage";
import { MOCK_FACULTY } from "@/lib/mock-data";

export interface FacultySidebarCounts {
  journals: number;
  conferences: number;
  books: number;
  bookChapters: number;
  allPublications: number;
  patents: number;
  projects: number;
  events: number;
  consultancies: number;
  supervisions: number;
  phdSupervisions: number;
  mtechTheses: number;
  qualifications: number;
  teachingExp: number;
  courses: number;
  adminExp: number;
  honors: number;
  exposures: number;
  expertTalks: number;
}

export function useFacultySidebarCounts(targetFaculty?: any) {
  const [counts, setCounts] = useState<FacultySidebarCounts>({
    journals: 0,
    conferences: 0,
    books: 0,
    bookChapters: 0,
    allPublications: 0,
    patents: 0,
    projects: 0,
    events: 0,
    consultancies: 0,
    supervisions: 0,
    phdSupervisions: 0,
    mtechTheses: 0,
    qualifications: 0,
    teachingExp: 0,
    courses: 0,
    adminExp: 0,
    honors: 0,
    exposures: 0,
    expertTalks: 0,
  });

  const computeCounts = useCallback(() => {
    let faculty = targetFaculty;
    if (!faculty && typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("auth_user");
        if (raw) {
          const parsed = JSON.parse(raw);
          faculty =
            MOCK_FACULTY.find(
              (f) =>
                (parsed.employee_code && f.employee_code?.toLowerCase() === parsed.employee_code?.toLowerCase()) ||
                (parsed.email && f.email?.toLowerCase() === parsed.email?.toLowerCase()) ||
                f.id === parsed.faculty_id
            ) || parsed;
        }
      } catch {}
    }

    if (!faculty) {
      faculty = MOCK_FACULTY[0];
    }

    // Baseline + persistent publications
    const basePubs = resolveFacultyBaseline(faculty, "publications");
    const allPubs = getStoredData(faculty, "publications", basePubs);

    const journals = allPubs.filter(
      (p: any) =>
        p.publication_type?.toUpperCase() === "JOURNAL" ||
        p.type?.toUpperCase() === "JOURNAL" ||
        p.research_type_id === 1 ||
        p.research_type_id === "1"
    ).length;

    const conferences = allPubs.filter(
      (p: any) =>
        p.publication_type?.toUpperCase() === "CONFERENCE" ||
        p.type?.toUpperCase() === "CONFERENCE" ||
        p.research_type_id === 2 ||
        p.research_type_id === "2"
    ).length;

    const books = allPubs.filter(
      (p: any) =>
        p.publication_type?.toUpperCase() === "BOOK" ||
        p.type?.toUpperCase() === "BOOK" ||
        p.research_type_id === 3 ||
        p.research_type_id === "3"
    ).length;

    const bookChapters = allPubs.filter(
      (p: any) =>
        p.publication_type?.toUpperCase() === "BOOK CHAPTER" ||
        p.publication_type?.toUpperCase() === "BOOK_CHAPTER" ||
        p.publication_type?.toUpperCase() === "BOOKCHAPTER" ||
        p.type?.toUpperCase() === "BOOK CHAPTER" ||
        p.type?.toUpperCase() === "BOOK_CHAPTER" ||
        p.type?.toUpperCase() === "BOOKCHAPTER" ||
        p.research_type_id === 4 ||
        p.research_type_id === "4"
    ).length;

    const patents = getStoredData(faculty, "patents", resolveFacultyBaseline(faculty, "patents")).length;
    const projects = getStoredData(faculty, "projects", resolveFacultyBaseline(faculty, "projects")).length;
    const events = getStoredData(faculty, "events", resolveFacultyBaseline(faculty, "events")).length;
    const consultancies = getStoredData(faculty, "consultancies", resolveFacultyBaseline(faculty, "consultancies")).length;

    const supervisionsList = getStoredData(faculty, "supervisions", resolveFacultyBaseline(faculty, "supervisions"));
    const phdSupervisions = supervisionsList.filter((s: any) => {
      const lvl = (s.level || "").toLowerCase();
      return lvl.includes("ph.d") || lvl.includes("phd") || lvl === "doctoral";
    }).length;
    const mtechTheses = supervisionsList.filter((s: any) => {
      const lvl = (s.level || "").toLowerCase();
      return lvl.includes("m.tech") || lvl.includes("mtech") || lvl.includes("pg") || lvl.includes("master");
    }).length;

    const qualifications = getStoredData(faculty, "qualifications", resolveFacultyBaseline(faculty, "qualifications")).length;
    const teachingExp = getStoredData(faculty, "teaching_experiences", resolveFacultyBaseline(faculty, "teaching_experiences")).length;
    const courses = getStoredData(faculty, "courses", resolveFacultyBaseline(faculty, "courses")).length;
    const adminExp = getStoredData(faculty, "administrative_experiences", resolveFacultyBaseline(faculty, "administrative_experiences")).length;
    const honors = getStoredData(faculty, "honors", resolveFacultyBaseline(faculty, "honors")).length;
    const exposures = getStoredData(faculty, "exposures", resolveFacultyBaseline(faculty, "exposures")).length;
    const expertTalks = getStoredData(faculty, "expert_talks", resolveFacultyBaseline(faculty, "expert_talks")).length;

    setCounts({
      journals,
      conferences,
      books,
      bookChapters,
      allPublications: allPubs.length,
      patents,
      projects,
      events,
      consultancies,
      supervisions: supervisionsList.length,
      phdSupervisions,
      mtechTheses,
      qualifications,
      teachingExp,
      courses,
      adminExp,
      honors,
      exposures,
      expertTalks,
    });
  }, [targetFaculty]);

  useEffect(() => {
    computeCounts();

    const handleUpdate = () => {
      computeCounts();
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("nith_faculty_storage_update", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("nith_faculty_storage_update", handleUpdate);
    };
  }, [computeCounts]);

  return counts;
}
