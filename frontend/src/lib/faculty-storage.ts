"use client";

/**
 * Faculty Persistent Storage Manager
 * Ensures that all added, edited, and deleted records (publications, projects, patents,
 * consultancies, supervisions, events, qualifications, teaching exp, admin exp, honors,
 * expert talks, exposures, and profile info) persist across page reloads and sync seamlessly.
 */

import {
  MOCK_FACULTY,
  MOCK_PUBLICATIONS,
  MOCK_PATENTS,
  MOCK_PROJECTS,
  MOCK_CONSULTANCIES,
  MOCK_EVENTS,
  MOCK_COURSES_TAUGHT,
} from "./mock-data";
import departmentsRegistry from "@/lib/departments-registry.json";

/**
 * Resolves a normalized, canonical employee code or identifier for a faculty member.
 * Guarantees that whether a component passes an ID, employee_code, or object,
 * the exact same storage key is used everywhere.
 */
export function getFacultyCanonicalCode(faculty: any): string {
  if (!faculty) return "default";
  if (typeof faculty === "string") {
    const rawStr = faculty.trim().toLowerCase();
    const found = MOCK_FACULTY.find(
      (f: any) =>
        f.employee_code?.toLowerCase() === rawStr ||
        f.id?.toLowerCase() === rawStr ||
        String(f.legacy_id) === rawStr
    );
    if (found?.employee_code) return found.employee_code.toLowerCase();
    return rawStr;
  }

  if (faculty.employee_code) {
    return String(faculty.employee_code).trim().toLowerCase();
  }

  const facId = String(faculty.id || "").toLowerCase();
  const facEmail = String(faculty.email || "").toLowerCase();
  const found = MOCK_FACULTY.find(
    (f: any) =>
      (facId && f.id?.toLowerCase() === facId) ||
      (faculty.legacy_id && f.legacy_id === faculty.legacy_id) ||
      (facEmail && f.email?.toLowerCase() === facEmail)
  );

  if (found?.employee_code) return found.employee_code.toLowerCase();
  return (faculty.employee_code || faculty.id || faculty.email || "default").toLowerCase();
}

export function getFacultyStorageKey(faculty: any, section: string): string {
  const code = getFacultyCanonicalCode(faculty);
  return `nith_faculty_${section}_${code}`;
}

export function getFacultyDeletedKey(faculty: any, section: string): string {
  const code = getFacultyCanonicalCode(faculty);
  return `nith_faculty_deleted_${section}_${code}`;
}

/**
 * Matches two records using canonical DOI, reference number, ID, legacy ID, or title.
 */
export function isMatchingRecord(a: any, b: any): boolean {
  if (!a || !b) return false;

  // Canonical deduplication using DOI (primary key)
  const doiA = (a.doi || "").trim().toLowerCase();
  const doiB = (b.doi || "").trim().toLowerCase();
  if (doiA && doiB && doiA === doiB) return true;

  // Reference number (for Patents, Projects, Consultancies)
  const refA = (a.reference_number || a.reference_no || a.application_number || "").trim().toLowerCase();
  const refB = (b.reference_number || b.reference_no || b.application_number || "").trim().toLowerCase();
  if (refA && refB && refA === refB) return true;

  // Exact ID match
  const idA = String(a.id || "").trim().toLowerCase();
  const idB = String(b.id || "").trim().toLowerCase();
  if (idA && idB && idA === idB) return true;

  // Legacy ID match
  if (a.legacy_id && b.legacy_id && String(a.legacy_id) === String(b.legacy_id)) return true;

  // Course code & session match (for CourseTaught)
  if (a.course_code && b.course_code) {
    const codeA = (a.course_code || "").trim().toLowerCase();
    const codeB = (b.course_code || "").trim().toLowerCase();
    if (codeA === codeB) {
      const yearA = (a.academic_year || "").trim().toLowerCase();
      const yearB = (b.academic_year || "").trim().toLowerCase();
      const semA = String(a.semester ?? "").trim();
      const semB = String(b.semester ?? "").trim();
      const secA = (a.section || "").trim().toLowerCase();
      const secB = (b.section || "").trim().toLowerCase();
      if (
        (!yearA || !yearB || yearA === yearB) &&
        (!semA || !semB || semA === semB) &&
        (!secA || !secB || secA === secB)
      ) {
        return true;
      }
    }
  }

  // Title match fallback (strip punctuation for robust matching)
  const titleA = (a.title || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  const titleB = (b.title || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  if (titleA && titleB && titleA === titleB && titleA.length > 5) return true;

  return false;
}

/**
 * Records a deletion tombstone so a deleted baseline item is not restored.
 */
export function recordFacultyDeletion(faculty: any, section: string, record: any): void {
  if (typeof window === "undefined" || !faculty || !record) return;
  const key = getFacultyDeletedKey(faculty, section);
  try {
    const raw = localStorage.getItem(key);
    let deletedList: any[] = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(deletedList)) deletedList = [];
    if (!deletedList.some((d) => isMatchingRecord(d, record))) {
      deletedList.push({
        id: record.id,
        doi: record.doi,
        legacy_id: record.legacy_id,
        title: record.title,
        reference_number: record.reference_number || record.reference_no || record.application_number,
      });
      localStorage.setItem(key, JSON.stringify(deletedList));
    }
  } catch {}
}

/**
 * Clears any deletion tombstone if a record is restored or re-added.
 */
export function clearFacultyDeletion(faculty: any, section: string, record: any): void {
  if (typeof window === "undefined" || !faculty || !record) return;
  const key = getFacultyDeletedKey(faculty, section);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return;
    let deletedList: any[] = JSON.parse(raw);
    if (!Array.isArray(deletedList)) return;
    deletedList = deletedList.filter((d) => !isMatchingRecord(d, record));
    localStorage.setItem(key, JSON.stringify(deletedList));
  } catch {}
}

/**
 * Checks if a record was marked deleted by the user.
 */
export function isRecordDeleted(faculty: any, section: string, record: any): boolean {
  if (typeof window === "undefined" || !faculty || !record) return false;
  const key = getFacultyDeletedKey(faculty, section);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const deletedList: any[] = JSON.parse(raw);
    if (!Array.isArray(deletedList)) return false;
    return deletedList.some((d) => isMatchingRecord(d, record));
  } catch {
    return false;
  }
}

/**
 * Resolves baseline records from database seed data for a faculty member.
 */
export function resolveFacultyBaseline(faculty: any, section: string): any[] {
  if (!faculty) return [];
  const canonicalCode = getFacultyCanonicalCode(faculty);
  const baseFaculty =
    MOCK_FACULTY.find((f: any) => getFacultyCanonicalCode(f) === canonicalCode) || faculty;

  if (section === "publications") {
    if (Array.isArray(baseFaculty.publications)) {
      return baseFaculty.publications;
    }
    const legacyId = baseFaculty.legacy_id;
    return MOCK_PUBLICATIONS.filter((p: any) => {
      if (baseFaculty.id && p.faculty_ids?.includes(baseFaculty.id)) return true;
      if (legacyId && p.faculty_legacy_ids?.includes(legacyId)) return true;
      return false;
    });
  }

  if (section === "patents") {
    const rawList =
      Array.isArray(baseFaculty.patents) && baseFaculty.patents.length > 0
        ? baseFaculty.patents
        : (() => {
            const legacyId = baseFaculty.legacy_id;
            return MOCK_PATENTS.filter((p: any) => {
              if (p.faculty_ids && p.faculty_ids.includes(baseFaculty.id)) return true;
              if (legacyId && p.faculty_legacy_ids && p.faculty_legacy_ids.includes(legacyId)) return true;
              return false;
            });
          })();

    return rawList.map((p: any) => {
      const isGranted = (p.status || "").toLowerCase().includes("grant");
      const patentNo =
        p.patent_number ||
        p.grant_number ||
        (isGranted ? p.application_number : "") ||
        "";
      return {
        ...p,
        patent_number: patentNo,
      };
    });
  }

  if (section === "projects") {
    const rawList =
      Array.isArray(baseFaculty.projects) && baseFaculty.projects.length > 0
        ? baseFaculty.projects
        : (() => {
            const legacyId = baseFaculty.legacy_id;
            return MOCK_PROJECTS.filter((p: any) => {
              if (p.faculty_ids && p.faculty_ids.includes(baseFaculty.id)) return true;
              if (legacyId && p.faculty_legacy_ids && p.faculty_legacy_ids.includes(legacyId)) return true;
              return false;
            });
          })();

    return rawList.map((p: any) => {
      const match = MOCK_PROJECTS.find(
        (mp: any) =>
          mp.id === p.id ||
          (p.legacy_id && (mp as any).legacy_id === p.legacy_id) ||
          mp.title === p.title
      );
      return {
        ...p,
        raw_investigators: p.raw_investigators || match?.raw_investigators || "Faculty Investigators",
        principal_investigator: p.principal_investigator || match?.principal_investigator || "",
        co_principal_investigator: p.co_principal_investigator || match?.co_principal_investigator || "",
      };
    });
  }

  if (section === "consultancies") {
    if (Array.isArray(baseFaculty.consultancies)) {
      return baseFaculty.consultancies;
    }
    const legacyId = baseFaculty.legacy_id;
    return MOCK_CONSULTANCIES.filter((c: any) =>
      (c.faculty_ids && c.faculty_ids.includes(baseFaculty.id)) ||
      (legacyId && c.faculty_legacy_ids && c.faculty_legacy_ids.includes(legacyId))
    );
  }

  if (section === "events") {
    const allEvents = getStoredEvents();
    const legacyId = baseFaculty.legacy_id;
    return allEvents.filter((e: any) =>
      (e.faculty_ids && e.faculty_ids.includes(baseFaculty.id)) ||
      (legacyId && e.faculty_legacy_ids && e.faculty_legacy_ids.includes(legacyId))
    );
  }

  if (section === "supervisions") return baseFaculty.supervisions || [];
  if (section === "qualifications") return baseFaculty.qualifications || [];
  if (section === "teaching_experiences") return baseFaculty.teaching_experiences || [];
  if (section === "admin_experiences" || section === "administrative_experiences") {
    return baseFaculty.administrative_experiences || baseFaculty.admin_experiences || [];
  }
  if (section === "honors") return baseFaculty.honors || [];
  if (section === "expert_talks") return baseFaculty.expert_talks || [];
  if (section === "exposures") return baseFaculty.exposures || [];

  if (section === "courses") {
    const canonicalCode = getFacultyCanonicalCode(faculty);
    const facCode = (baseFaculty.employee_code || "").trim().toLowerCase();
    const facId = String(baseFaculty.id || "").trim().toLowerCase();
    const facName = (baseFaculty.full_name || "").trim().toLowerCase();

    // Check if admin has set custom allocations
    let sourceAllocations = MOCK_COURSES_TAUGHT;
    if (typeof window !== "undefined") {
      try {
        const adminAllocRaw = localStorage.getItem("nith_admin_course_allocations");
        if (adminAllocRaw) {
          const parsed = JSON.parse(adminAllocRaw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            sourceAllocations = parsed;
          }
        }
      } catch {}
    }

    return sourceAllocations.filter((c: any) => {
      const cCode = (c.faculty_code || "").trim().toLowerCase();
      const cId = String(c.faculty_id || "").trim().toLowerCase();
      const cName = (c.faculty_name || "").trim().toLowerCase();

      return Boolean(
        (canonicalCode && canonicalCode !== "default" && cCode === canonicalCode) ||
        (facCode && cCode === facCode) ||
        (facId && cId === facId) ||
        (facName && cName === facName)
      );
    });
  }

  return [];
}

/**
 * Loads stored data, merging baseline seed records with user-added/edited records
 * and excluding any deleted records.
 */
export function getStoredData<T>(faculty: any, section: string, defaultFallback: T[]): T[] {
  if (typeof window === "undefined") return defaultFallback;
  try {
    const canonicalCode = getFacultyCanonicalCode(faculty);
    const key = `nith_faculty_${section}_${canonicalCode}`;

    // 1. Resolve baseline data
    const baseline: any[] =
      Array.isArray(defaultFallback) && defaultFallback.length > 0
        ? defaultFallback
        : resolveFacultyBaseline(faculty, section);

    // 2. Read stored items for this faculty
    const raw = localStorage.getItem(key);
    let storedItems: any[] = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          storedItems = parsed;
        }
      } catch {}
    }

    // 3. Prepare result list starting with stored items (user additions & edits)
    const result: any[] = [];
    const isDeleted = (item: any) => isRecordDeleted(faculty, section, item);

    // Add valid stored items
    for (const item of storedItems) {
      if (!item || isDeleted(item)) continue;
      if (!result.some((existing) => isMatchingRecord(existing, item))) {
        result.push(item);
      }
    }

    // 4. Merge in baseline records that haven't been deleted or edited/replaced in storedItems
    for (const baseItem of baseline) {
      if (!baseItem || isDeleted(baseItem)) continue;
      // Check if this baseline item was edited/replaced by an item in storedItems
      const replacedByStored = storedItems.some((stored) => isMatchingRecord(stored, baseItem));
      if (!replacedByStored) {
        result.push(baseItem);
      }
    }

    // 5. Cross-faculty discovery: inspect other faculty stores where this faculty is associated
    const targetFaculty =
      MOCK_FACULTY.find((f: any) => getFacultyCanonicalCode(f) === canonicalCode) || faculty;
    const currentCode = canonicalCode;
    const currentId = (targetFaculty?.id || "").toLowerCase();
    const currentName = (targetFaculty?.full_name || "").toLowerCase();

    for (let i = 0; i < localStorage.length; i++) {
      const storageKey = localStorage.key(i);
      if (storageKey && storageKey.startsWith(`nith_faculty_${section}_`) && storageKey !== key) {
        try {
          const foreignRaw = localStorage.getItem(storageKey);
          if (foreignRaw) {
            const foreignList = JSON.parse(foreignRaw);
            if (Array.isArray(foreignList)) {
              for (const foreignItem of foreignList) {
                if (!foreignItem || isDeleted(foreignItem)) continue;

                const facIds = (foreignItem.faculty_ids || []).map((x: any) => String(x).toLowerCase());
                const assocList = (foreignItem.associated_faculty || []).map((x: any) =>
                  typeof x === "string"
                    ? x.toLowerCase()
                    : (x?.employee_code || x?.code || x?.id || x?.full_name || x?.name || "").toLowerCase()
                );

                const isAssociated =
                  (currentCode && currentCode !== "default" && facIds.includes(currentCode)) ||
                  (currentId && facIds.includes(currentId)) ||
                  (currentCode && currentCode !== "default" && assocList.some((a: string) => a.includes(currentCode))) ||
                  (currentId && assocList.some((a: string) => a.includes(currentId))) ||
                  (currentName && assocList.some((a: string) => a.includes(currentName)));

                if (isAssociated) {
                  const alreadyExists = result.some((existing) => isMatchingRecord(existing, foreignItem));
                  if (!alreadyExists) {
                    result.unshift(foreignItem);
                  }
                }
              }
            }
          }
        } catch {}
      }
    }

    if (section === "publications") {
      return result.map((item: any) => {
        if (!item) return item;
        const q = item.journal_quartile || item.quartile;
        const validQ = q && ["Q1", "Q2", "Q3", "Q4"].includes(String(q).toUpperCase().trim())
          ? String(q).toUpperCase().trim()
          : undefined;
        return {
          ...item,
          journal_quartile: validQ,
          quartile: validQ,
        };
      }) as T[];
    }

    return result as T[];
  } catch (err) {
    console.error(`Error reading persistent storage for ${section}:`, err);
  }
  return defaultFallback;
}

export function saveFacultyRecord(
  currentFaculty: any,
  section: string,
  record: any,
  isDelete: boolean = false
): void {
  const associatedList = Array.isArray(record?.associated_faculty)
    ? record.associated_faculty
    : [];
  syncMultiFacultyRecord(currentFaculty, section, record, associatedList, isDelete);
}

export function syncMultiFacultyRecord(
  currentFaculty: any,
  section: string,
  record: any,
  associatedFacultyList: any[],
  isDelete: boolean = false
): void {
  if (typeof window === "undefined") return;

  const currentCode = getFacultyCanonicalCode(currentFaculty);
  const currentKey = `nith_faculty_${section}_${currentCode}`;

  if (isDelete) {
    recordFacultyDeletion(currentFaculty, section, record);

    // Filter from current faculty's stored list
    try {
      const raw = localStorage.getItem(currentKey);
      if (raw) {
        let list: any[] = JSON.parse(raw) || [];
        list = list.filter((item) => !isMatchingRecord(item, record));
        localStorage.setItem(currentKey, JSON.stringify(list));
      }
    } catch {}

    // Cross-sync deletion to associated faculty
    if (Array.isArray(associatedFacultyList)) {
      for (const coFaculty of associatedFacultyList) {
        if (!coFaculty) continue;
        recordFacultyDeletion(coFaculty, section, record);
        const coCode = getFacultyCanonicalCode(coFaculty);
        const coKey = `nith_faculty_${section}_${coCode}`;
        try {
          const rawCo = localStorage.getItem(coKey);
          if (rawCo) {
            let coList: any[] = JSON.parse(rawCo) || [];
            coList = coList.filter((item) => !isMatchingRecord(item, record));
            localStorage.setItem(coKey, JSON.stringify(coList));
          }
        } catch {}
      }
    }
  } else {
    // Adding or editing a record
    clearFacultyDeletion(currentFaculty, section, record);

    let activeRecord = record;
    if (section === "publications" && record) {
      const q = record.journal_quartile || record.quartile;
      const validQ = q && ["Q1", "Q2", "Q3", "Q4"].includes(String(q).toUpperCase().trim()) ? String(q).toUpperCase().trim() : undefined;
      activeRecord = { ...record, journal_quartile: validQ, quartile: validQ };
    }

    // 1. Update current faculty store
    let currentList: any[] = [];
    try {
      const raw = localStorage.getItem(currentKey);
      if (raw) currentList = JSON.parse(raw) || [];
    } catch {}

    const existingIndex = currentList.findIndex((item) => isMatchingRecord(item, activeRecord));
    if (existingIndex >= 0) {
      currentList[existingIndex] = { ...currentList[existingIndex], ...activeRecord };
    } else {
      currentList = [activeRecord, ...currentList];
    }
    localStorage.setItem(currentKey, JSON.stringify(currentList));

    // 2. Cross-sync to each selected associated faculty member
    if (Array.isArray(associatedFacultyList)) {
      for (const coFaculty of associatedFacultyList) {
        if (!coFaculty) continue;
        clearFacultyDeletion(coFaculty, section, record);

        const coCode = getFacultyCanonicalCode(coFaculty);
        const coKey = `nith_faculty_${section}_${coCode}`;
        let coList: any[] = [];
        try {
          const rawCo = localStorage.getItem(coKey);
          if (rawCo) coList = JSON.parse(rawCo) || [];
        } catch {}

        const coIndex = coList.findIndex((item) => isMatchingRecord(item, activeRecord));
        if (coIndex >= 0) {
          coList[coIndex] = { ...coList[coIndex], ...activeRecord };
        } else {
          coList = [activeRecord, ...coList];
        }
        localStorage.setItem(coKey, JSON.stringify(coList));
      }
    }
  }

  // 3. Dispatch reactive update event
  window.dispatchEvent(
    new CustomEvent("nith_faculty_storage_update", {
      detail: { section, recordId: record?.id, doi: record?.doi },
    })
  );
}

export function setStoredData<T>(faculty: any, section: string, data: T[]): void {
  if (typeof window === "undefined") return;
  try {
    const code = getFacultyCanonicalCode(faculty);
    const key = `nith_faculty_${section}_${code}`;
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(
      new CustomEvent("nith_faculty_storage_update", {
        detail: { section, key, count: data.length },
      })
    );
  } catch (err) {
    console.error(`Error writing persistent storage for ${section}:`, err);
  }
}

export function getStoredObject<T>(faculty: any, section: string, defaultFallback: T): T {
  if (typeof window === "undefined") return defaultFallback;
  try {
    const code = getFacultyCanonicalCode(faculty);
    const key = `nith_faculty_${section}_${code}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error(`Error reading persistent object for ${section}:`, err);
  }
  return defaultFallback;
}

export function setStoredObject<T>(faculty: any, section: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    const code = getFacultyCanonicalCode(faculty);
    const key = `nith_faculty_${section}_${code}`;
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(
      new CustomEvent("nith_faculty_storage_update", {
        detail: { section, key },
      })
    );
  } catch (err) {
    console.error(`Error writing persistent object for ${section}:`, err);
  }
}

export function resolveFacultyDepartment(faculty: any, user?: any) {
  const deptSlug = faculty?.department_slug || user?.department_slug;
  const deptCode = faculty?.department_code || user?.department_code;
  const deptName = faculty?.department_name || user?.department_name;

  if (deptSlug) {
    const found = departmentsRegistry.find((d) => d.slug.toLowerCase() === deptSlug.toLowerCase());
    if (found) return found;
  }
  if (deptCode) {
    const found = departmentsRegistry.find((d) => d.code.toLowerCase() === deptCode.toLowerCase());
    if (found) return found;
  }
  if (deptName) {
    const found = departmentsRegistry.find(
      (d) =>
        d.name.toLowerCase().includes(deptName.toLowerCase()) ||
        deptName.toLowerCase().includes(d.name.toLowerCase())
    );
    if (found) return found;
  }

  const identifier = (
    faculty?.employee_code ||
    user?.employee_code ||
    faculty?.email ||
    user?.email ||
    ""
  ).toLowerCase();

  if (identifier.startsWith("ec") || identifier.includes("ece") || identifier.includes("electronics")) {
    return departmentsRegistry.find((d) => d.slug === "ece") || departmentsRegistry[1];
  }
  if (identifier.startsWith("ee") || identifier.includes("elec")) {
    return departmentsRegistry.find((d) => d.slug === "ee") || departmentsRegistry[2];
  }
  if (identifier.startsWith("me") || identifier.includes("mech")) {
    return departmentsRegistry.find((d) => d.slug === "me") || departmentsRegistry[3];
  }
  if (identifier.startsWith("ce") || identifier.includes("civil")) {
    return departmentsRegistry.find((d) => d.slug === "ce") || departmentsRegistry[4];
  }
  if (identifier.startsWith("ch") || identifier.includes("chem")) {
    return departmentsRegistry.find((d) => d.slug === "che") || departmentsRegistry[5];
  }
  if (identifier.startsWith("ar") || identifier.includes("arch")) {
    return departmentsRegistry.find((d) => d.slug === "arch") || departmentsRegistry[7];
  }
  if (identifier.startsWith("ma") || identifier.includes("math")) {
    return departmentsRegistry.find((d) => d.slug === "maths") || departmentsRegistry[8];
  }
  if (identifier.startsWith("ph") || identifier.includes("phys")) {
    return departmentsRegistry.find((d) => d.slug === "physics") || departmentsRegistry[9];
  }
  if (identifier.startsWith("cy") || identifier.includes("chemistry")) {
    return departmentsRegistry.find((d) => d.slug === "chemistry") || departmentsRegistry[10];
  }
  if (identifier.startsWith("ms") || identifier.includes("mgmt")) {
    return departmentsRegistry.find((d) => d.slug === "management") || departmentsRegistry[12];
  }

  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("active_department_slug");
    if (saved) {
      const found = departmentsRegistry.find((d) => d.slug.toLowerCase() === saved.toLowerCase());
      if (found) return found;
    }
  }

  return departmentsRegistry[0]; // CSE default
}

/**
 * Retrieves all stored events from localStorage (or fallback to MOCK_EVENTS).
 */
export function getStoredEvents(): any[] {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("nith_admin_events");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error reading stored events:", e);
    }
  }
  return MOCK_EVENTS;
}

/**
 * Persists events to localStorage and broadcasts update events.
 */
export function saveStoredEvents(events: any[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("nith_admin_events", JSON.stringify(events));
    window.dispatchEvent(new Event("nith_events_updated"));
    window.dispatchEvent(new Event("nith_faculty_storage_update"));
  } catch (err) {
    console.error("Error saving events to localStorage:", err);
  }
}

/**
 * Deletes an event by ID from storage.
 */
export function deleteStoredEvent(id: string): any[] {
  const current = getStoredEvents();
  const filtered = current.filter((e: any) => String(e.id) !== String(id));
  saveStoredEvents(filtered);
  return filtered;
}

/**
 * Updates an existing event or adds a new one.
 */
export function updateOrAddStoredEvent(event: any): any[] {
  const current = getStoredEvents();
  const eventId = event.id || `event-${Date.now()}`;
  const normalizedEvent = { ...event, id: eventId };
  const idx = current.findIndex((e: any) => String(e.id) === String(eventId));
  let updated: any[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = { ...updated[idx], ...normalizedEvent };
  } else {
    updated = [normalizedEvent, ...current];
  }
  saveStoredEvents(updated);
  return updated;
}

/**
 * Scans events for duplicates (matching normalized title and start date).
 * Consolidates metadata and faculty associations onto the most complete copy,
 * and deletes all duplicate clones.
 */
export function deduplicateStoredEvents(): { cleaned: any[]; removedCount: number } {
  const current = getStoredEvents();
  const groups = new Map<string, any[]>();

  current.forEach((ev: any) => {
    // Generate key based on normalized title and start_date
    const normTitle = (ev.title || "").trim().toLowerCase().replace(/\s+/g, " ");
    const startDate = (ev.start_date || "").trim();
    const key = `${normTitle}:::${startDate}`;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(ev);
  });

  let removedCount = 0;
  const cleaned: any[] = [];

  groups.forEach((items) => {
    if (items.length === 1) {
      cleaned.push(items[0]);
      return;
    }

    // Multiple duplicate copies found
    removedCount += items.length - 1;

    // Pick the best primary record (most non-empty fields and faculty_ids)
    let best = items[0];
    let bestScore = -1;

    items.forEach((item) => {
      let score = 0;
      if (item.link_url) score += 5;
      if (item.convenor) score += 3;
      if (item.coordinator) score += 3;
      if (item.venue && item.venue !== "NIT Hamirpur") score += 2;
      if (Array.isArray(item.faculty_ids) && item.faculty_ids.length > 0) score += item.faculty_ids.length * 4;
      if (Array.isArray(item.faculty_legacy_ids) && item.faculty_legacy_ids.length > 0) score += item.faculty_legacy_ids.length * 2;
      if (score > bestScore) {
        bestScore = score;
        best = item;
      }
    });

    // Merge faculty_ids and missing fields from all duplicate copies into the best record
    const allFacultyIds = new Set<string>(Array.isArray(best.faculty_ids) ? best.faculty_ids : []);
    const allLegacyIds = new Set<number>(Array.isArray(best.faculty_legacy_ids) ? best.faculty_legacy_ids : []);
    let mergedConvenor = best.convenor || "";
    let mergedCoordinator = best.coordinator || "";
    let mergedLink = best.link_url || "";
    let mergedVenue = best.venue || "";

    items.forEach((item) => {
      if (Array.isArray(item.faculty_ids)) {
        item.faculty_ids.forEach((fid: string) => allFacultyIds.add(fid));
      }
      if (Array.isArray(item.faculty_legacy_ids)) {
        item.faculty_legacy_ids.forEach((lid: number) => allLegacyIds.add(lid));
      }
      if (!mergedConvenor && item.convenor) mergedConvenor = item.convenor;
      if (!mergedCoordinator && item.coordinator) mergedCoordinator = item.coordinator;
      if (!mergedLink && item.link_url) mergedLink = item.link_url;
      if ((!mergedVenue || mergedVenue === "NIT Hamirpur") && item.venue) mergedVenue = item.venue;
    });

    cleaned.push({
      ...best,
      convenor: mergedConvenor,
      coordinator: mergedCoordinator,
      link_url: mergedLink,
      venue: mergedVenue || "NIT Hamirpur",
      faculty_ids: Array.from(allFacultyIds),
      faculty_legacy_ids: Array.from(allLegacyIds),
    });
  });

  saveStoredEvents(cleaned);
  return { cleaned, removedCount };
}
