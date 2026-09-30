"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { MOCK_FACULTY } from "./mock-data";

export interface HiddenFacultyInfo {
  ids: Set<string>;
  legacyIds: Set<number>;
  codes: Set<string>;
  names: string[];
  cleanNames: string[];
}

/**
 * Normalizes a faculty name by stripping prefixes (Dr., Prof., Er., etc.)
 * and removing punctuation/excess whitespace for robust author/supervisor matching.
 */
export function normalizeFacultyName(name: string): string {
  if (!name) return "";
  return name
    .replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.|Er\.)\s*/gi, "")
    .replace(/\(Mrs\.\)/gi, "")
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Checks whether an author or supervisor text contains a specific faculty member's name.
 */
export function matchesFacultyName(text: string, facultyFullName: string): boolean {
  if (!text || !facultyFullName) return false;
  const normalizedText = normalizeFacultyName(text);
  const cleanFac = normalizeFacultyName(facultyFullName);

  if (normalizedText.includes(cleanFac)) return true;

  const words = cleanFac.split(/\s+/).filter((w) => w.length > 2);
  if (words.length >= 2) {
    const firstWord = words[0];
    const lastWord = words[words.length - 1];
    if (normalizedText.includes(firstWord) && normalizedText.includes(lastWord)) {
      return true;
    }
  }

  return false;
}

/**
 * Retrieves the full raw faculty list from localStorage (cached from Admin or API)
 * or falls back to MOCK_FACULTY.
 */
export function getStoredFacultyList(deptSlug: string = "cse"): any[] {
  if (typeof window !== "undefined") {
    const scopedKey = `nith_admin_faculty_list_${deptSlug}`;
    const saved =
      localStorage.getItem(scopedKey) ||
      (deptSlug === "cse" ? localStorage.getItem("nith_admin_faculty_list") : null);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {}
    }
  }

  // Fallback to MOCK_FACULTY if CSE
  if (deptSlug === "cse") {
    return MOCK_FACULTY;
  }
  return [];
}

/**
 * Builds metadata about all hidden faculty members.
 */
export function getHiddenFacultyIdentifiers(facultyList: any[]): HiddenFacultyInfo {
  const ids = new Set<string>();
  const legacyIds = new Set<number>();
  const codes = new Set<string>();
  const names: string[] = [];
  const cleanNames: string[] = [];

  facultyList.forEach((f) => {
    if (f.is_visible === false) {
      if (f.id) {
        ids.add(String(f.id).toLowerCase());
      }
      if (f.legacy_id !== undefined && f.legacy_id !== null) {
        legacyIds.add(Number(f.legacy_id));
      }
      if (f.employee_code) {
        codes.add(String(f.employee_code).toUpperCase());
      }
      if (f.full_name) {
        names.push(f.full_name);
        const clean = normalizeFacultyName(f.full_name);
        if (clean) cleanNames.push(clean);
      }
    }
  });

  return { ids, legacyIds, codes, names, cleanNames };
}

/**
 * Checks whether a faculty identifier or object represents a visible faculty member.
 */
export function isFacultyVisible(
  facultyOrIdentifier: any,
  hiddenInfo: HiddenFacultyInfo
): boolean {
  if (!facultyOrIdentifier) return true;

  if (typeof facultyOrIdentifier === "object") {
    if (facultyOrIdentifier.is_visible === false) return false;
    const fId = String(facultyOrIdentifier.id || "").toLowerCase();
    if (fId && hiddenInfo.ids.has(fId)) return false;

    if (
      facultyOrIdentifier.legacy_id !== undefined &&
      hiddenInfo.legacyIds.has(Number(facultyOrIdentifier.legacy_id))
    ) {
      return false;
    }

    const fCode = String(facultyOrIdentifier.employee_code || "").toUpperCase();
    if (fCode && hiddenInfo.codes.has(fCode)) return false;

    const fName = normalizeFacultyName(facultyOrIdentifier.full_name || "");
    if (fName && hiddenInfo.cleanNames.some((c) => fName.includes(c) || c.includes(fName))) {
      return false;
    }

    return true;
  }

  const str = String(facultyOrIdentifier).trim();
  const lowerStr = str.toLowerCase();
  const upperStr = str.toUpperCase();
  const num = Number(str);

  if (hiddenInfo.ids.has(lowerStr)) return false;
  if (!isNaN(num) && hiddenInfo.legacyIds.has(num)) return false;
  if (hiddenInfo.codes.has(upperStr)) return false;

  const normalized = normalizeFacultyName(str);
  if (normalized && hiddenInfo.cleanNames.some((c) => normalized.includes(c) || c.includes(normalized))) {
    return false;
  }

  return true;
}

/**
 * Checks whether a supervisor name corresponds to a hidden faculty member.
 */
export function isSupervisorVisible(
  supervisorName: string,
  hiddenInfo: HiddenFacultyInfo
): boolean {
  if (!supervisorName) return true;
  const cleanSup = normalizeFacultyName(supervisorName);
  if (!cleanSup) return true;

  for (const hiddenClean of hiddenInfo.cleanNames) {
    if (cleanSup.includes(hiddenClean) || hiddenClean.includes(cleanSup)) {
      return false;
    }
    const words = hiddenClean.split(/\s+/).filter((w) => w.length > 2);
    if (words.length >= 2 && cleanSup.includes(words[0]) && cleanSup.includes(words[words.length - 1])) {
      return false;
    }
  }

  return true;
}

/**
 * Determines whether a publication should be displayed in the public catalogue.
 * A publication is visible if:
 * 1. It is linked to at least one visible faculty member, OR
 * 2. It has no links to any hidden faculty member.
 * If it is linked exclusively to hidden faculty members, it is hidden.
 */
export function isPublicationBelongingToVisibleFaculty(
  pub: any,
  hiddenInfo: HiddenFacultyInfo,
  visibleFaculty: any[]
): boolean {
  if (!pub) return true;

  // 1. Check relational faculty_ids
  const facIds: string[] = Array.isArray(pub.faculty_ids)
    ? pub.faculty_ids.map((id: any) => String(id).toLowerCase())
    : [];
  const legacyIds: number[] = Array.isArray(pub.faculty_legacy_ids)
    ? pub.faculty_legacy_ids.map(Number)
    : [];

  const hasAnyHiddenId =
    facIds.some((id) => hiddenInfo.ids.has(id)) ||
    legacyIds.some((lid) => hiddenInfo.legacyIds.has(lid));

  if (hasAnyHiddenId) {
    // Check if at least ONE visible faculty member is also associated
    const visibleIds = new Set(visibleFaculty.map((f) => String(f.id).toLowerCase()));
    const visibleLegacyIds = new Set(visibleFaculty.map((f) => Number(f.legacy_id)).filter(Boolean));
    const visibleCodes = new Set(visibleFaculty.map((f) => String(f.employee_code || "").toUpperCase()).filter(Boolean));

    const hasVisibleCoAuthor =
      facIds.some((id) => visibleIds.has(id) || visibleCodes.has(id.toUpperCase())) ||
      legacyIds.some((lid) => visibleLegacyIds.has(lid));

    if (!hasVisibleCoAuthor) {
      // Solely authored by hidden faculty
      return false;
    }
    // Has a visible co-author, so keep visible
    return true;
  }

  // 2. Check author text / string
  const authorText = (
    pub.author_text ||
    (Array.isArray(pub.authors) ? pub.authors.map((a: any) => a.author_name || a).join(", ") : "") ||
    ""
  ).toLowerCase();

  if (authorText && hiddenInfo.names.length > 0) {
    const matchesHidden = hiddenInfo.names.some((name) => matchesFacultyName(authorText, name));
    if (matchesHidden) {
      // Check if it also matches any visible faculty member
      const matchesVisible = visibleFaculty.some((f) => matchesFacultyName(authorText, f.full_name));
      if (!matchesVisible) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Filter patent for public visibility
 */
export function isPatentBelongingToVisibleFaculty(
  pat: any,
  hiddenInfo: HiddenFacultyInfo,
  visibleFaculty: any[]
): boolean {
  if (!pat) return true;

  const facIds: string[] = Array.isArray(pat.faculty_ids)
    ? pat.faculty_ids.map((id: any) => String(id).toLowerCase())
    : [];

  if (facIds.length > 0) {
    const hasAnyHidden = facIds.some((id) => hiddenInfo.ids.has(id));
    if (hasAnyHidden) {
      const visibleIds = new Set(visibleFaculty.map((f) => String(f.id).toLowerCase()));
      const visibleCodes = new Set(visibleFaculty.map((f) => String(f.employee_code || "").toUpperCase()).filter(Boolean));
      const hasVisibleCoInventor = facIds.some((id) => visibleIds.has(id) || visibleCodes.has(id.toUpperCase()));
      if (!hasVisibleCoInventor) return false;
      return true;
    }
  }

  const inventors = (pat.raw_inventors || pat.inventors || "").toLowerCase();
  if (inventors && hiddenInfo.names.length > 0) {
    const matchesHidden = hiddenInfo.names.some((name) => matchesFacultyName(inventors, name));
    if (matchesHidden) {
      const matchesVisible = visibleFaculty.some((f) => matchesFacultyName(inventors, f.full_name));
      if (!matchesVisible) return false;
    }
  }

  return true;
}

/**
 * Filter project for public visibility
 */
export function isProjectBelongingToVisibleFaculty(
  prj: any,
  hiddenInfo: HiddenFacultyInfo,
  visibleFaculty: any[]
): boolean {
  if (!prj) return true;

  const facIds: string[] = Array.isArray(prj.faculty_ids)
    ? prj.faculty_ids.map((id: any) => String(id).toLowerCase())
    : [];

  if (facIds.length > 0) {
    const hasAnyHidden = facIds.some((id) => hiddenInfo.ids.has(id));
    if (hasAnyHidden) {
      const visibleIds = new Set(visibleFaculty.map((f) => String(f.id).toLowerCase()));
      const visibleCodes = new Set(visibleFaculty.map((f) => String(f.employee_code || "").toUpperCase()).filter(Boolean));
      const hasVisibleCoInvestigator = facIds.some((id) => visibleIds.has(id) || visibleCodes.has(id.toUpperCase()));
      if (!hasVisibleCoInvestigator) return false;
      return true;
    }
  }

  const investigators = (
    `${prj.principal_investigator || ""} ${prj.co_principal_investigator || ""} ${prj.raw_investigators || ""}`
  ).toLowerCase();

  if (investigators && hiddenInfo.names.length > 0) {
    const matchesHidden = hiddenInfo.names.some((name) => matchesFacultyName(investigators, name));
    if (matchesHidden) {
      const matchesVisible = visibleFaculty.some((f) => matchesFacultyName(investigators, f.full_name));
      if (!matchesVisible) return false;
    }
  }

  return true;
}

/**
 * Filter event for public visibility
 */
export function isEventBelongingToVisibleFaculty(
  evt: any,
  hiddenInfo: HiddenFacultyInfo,
  visibleFaculty: any[]
): boolean {
  if (!evt) return true;

  const facIds: string[] = Array.isArray(evt.faculty_ids)
    ? evt.faculty_ids.map((id: any) => String(id).toLowerCase())
    : [];

  if (facIds.length > 0) {
    const hasAnyHidden = facIds.some((id) => hiddenInfo.ids.has(id));
    if (hasAnyHidden) {
      const visibleIds = new Set(visibleFaculty.map((f) => String(f.id).toLowerCase()));
      const visibleCodes = new Set(visibleFaculty.map((f) => String(f.employee_code || "").toUpperCase()).filter(Boolean));
      const hasVisible = facIds.some((id) => visibleIds.has(id) || visibleCodes.has(id.toUpperCase()));
      if (!hasVisible) return false;
      return true;
    }
  }

  const coordinators = (`${evt.convenor || ""} ${evt.coordinator || ""}`).toLowerCase();
  if (coordinators && hiddenInfo.names.length > 0) {
    const matchesHidden = hiddenInfo.names.some((name) => matchesFacultyName(coordinators, name));
    if (matchesHidden) {
      const matchesVisible = visibleFaculty.some((f) => matchesFacultyName(coordinators, f.full_name));
      if (!matchesVisible) return false;
    }
  }

  return true;
}

/**
 * Filter consultancy for public visibility
 */
export function isConsultancyBelongingToVisibleFaculty(
  c: any,
  hiddenInfo: HiddenFacultyInfo,
  visibleFaculty: any[]
): boolean {
  if (!c) return true;

  const facIds: string[] = Array.isArray(c.faculty_ids)
    ? c.faculty_ids.map((id: any) => String(id).toLowerCase())
    : [];

  if (facIds.length > 0) {
    const hasAnyHidden = facIds.some((id) => hiddenInfo.ids.has(id));
    if (hasAnyHidden) {
      const visibleIds = new Set(visibleFaculty.map((f) => String(f.id).toLowerCase()));
      const visibleCodes = new Set(visibleFaculty.map((f) => String(f.employee_code || "").toUpperCase()).filter(Boolean));
      const hasVisible = facIds.some((id) => visibleIds.has(id) || visibleCodes.has(id.toUpperCase()));
      if (!hasVisible) return false;
      return true;
    }
  }

  const consultants = (c.author_text || "").toLowerCase();
  if (consultants && hiddenInfo.names.length > 0) {
    const matchesHidden = hiddenInfo.names.some((name) => matchesFacultyName(consultants, name));
    if (matchesHidden) {
      const matchesVisible = visibleFaculty.some((f) => matchesFacultyName(consultants, f.full_name));
      if (!matchesVisible) return false;
    }
  }

  return true;
}

/**
 * Hook to provide real-time, centralized faculty visibility data.
 * Reacts automatically to Admin updates across tabs or same window.
 */
export function useFacultyVisibility(deptSlug: string = "cse") {
  const [facultyList, setFacultyList] = useState<any[]>(() => getStoredFacultyList(deptSlug));

  const loadFaculty = useCallback(() => {
    setFacultyList(getStoredFacultyList(deptSlug));
  }, [deptSlug]);

  useEffect(() => {
    loadFaculty();

    const handleStorageChange = (e: StorageEvent) => {
      if (
        !e.key ||
        e.key.includes("nith_admin_faculty_list") ||
        e.key.includes("faculty")
      ) {
        loadFaculty();
      }
    };

    const handleCustomUpdate = () => {
      loadFaculty();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
      window.addEventListener("nith_faculty_updated", handleCustomUpdate);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener("nith_faculty_updated", handleCustomUpdate);
      }
    };
  }, [loadFaculty]);

  const hiddenInfo = useMemo(() => getHiddenFacultyIdentifiers(facultyList), [facultyList]);

  const visibleFaculty = useMemo(() => {
    return facultyList.filter((f) => f.is_visible !== false);
  }, [facultyList]);

  const hiddenFaculty = useMemo(() => {
    return facultyList.filter((f) => f.is_visible === false);
  }, [facultyList]);

  const checkIsFacultyVisible = useCallback(
    (facultyOrId: any) => isFacultyVisible(facultyOrId, hiddenInfo),
    [hiddenInfo]
  );

  const checkIsSupervisorVisible = useCallback(
    (supervisorName: string) => isSupervisorVisible(supervisorName, hiddenInfo),
    [hiddenInfo]
  );

  const filterPublications = useCallback(
    (pubs: any[]) => {
      if (!Array.isArray(pubs)) return [];
      return pubs.filter((p) => isPublicationBelongingToVisibleFaculty(p, hiddenInfo, visibleFaculty));
    },
    [hiddenInfo, visibleFaculty]
  );

  const filterPatents = useCallback(
    (patents: any[]) => {
      if (!Array.isArray(patents)) return [];
      return patents.filter((p) => isPatentBelongingToVisibleFaculty(p, hiddenInfo, visibleFaculty));
    },
    [hiddenInfo, visibleFaculty]
  );

  const filterProjects = useCallback(
    (projects: any[]) => {
      if (!Array.isArray(projects)) return [];
      return projects.filter((p) => isProjectBelongingToVisibleFaculty(p, hiddenInfo, visibleFaculty));
    },
    [hiddenInfo, visibleFaculty]
  );

  const filterEvents = useCallback(
    (events: any[]) => {
      if (!Array.isArray(events)) return [];
      return events.filter((e) => isEventBelongingToVisibleFaculty(e, hiddenInfo, visibleFaculty));
    },
    [hiddenInfo, visibleFaculty]
  );

  const filterConsultancies = useCallback(
    (consultancies: any[]) => {
      if (!Array.isArray(consultancies)) return [];
      return consultancies.filter((c) => isConsultancyBelongingToVisibleFaculty(c, hiddenInfo, visibleFaculty));
    },
    [hiddenInfo, visibleFaculty]
  );

  const filterSupervisors = useCallback(
    (supervisors: string[]) => {
      if (!Array.isArray(supervisors)) return [];
      return supervisors.filter((s) => isSupervisorVisible(s, hiddenInfo));
    },
    [hiddenInfo]
  );

  return {
    allFaculty: facultyList,
    visibleFaculty,
    hiddenFaculty,
    hiddenInfo,
    isFacultyVisible: checkIsFacultyVisible,
    isSupervisorVisible: checkIsSupervisorVisible,
    filterPublications,
    filterPatents,
    filterProjects,
    filterEvents,
    filterConsultancies,
    filterSupervisors,
    refreshFaculty: loadFaculty,
  };
}
