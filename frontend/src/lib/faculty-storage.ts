"use client";

/**
 * Faculty Persistent Storage Manager
 * Ensures that all added, edited, and deleted records (publications, projects, patents,
 * consultancies, supervisions, events, qualifications, teaching exp, admin exp, honors,
 * expert talks, exposures, and profile info) persist across page reloads and sync seamlessly
 * without ever wiping out existing or baseline records.
 */

import { MOCK_FACULTY, MOCK_PUBLICATIONS } from "@/lib/mock-data";
import departmentsRegistry from "@/lib/departments-registry.json";

/**
 * Resolves the canonical faculty identifier (always prefers lowercase employee_code, e.g. "cs01")
 */
export function getFacultyCanonicalCode(faculty: any): string {
  if (!faculty) return "default";
  if (typeof faculty === "string") return faculty.trim().toLowerCase();

  const code = (faculty.employee_code || faculty.code || "").trim().toLowerCase();
  if (code) return code;

  const id = (faculty.id || faculty.faculty_id || "").trim().toLowerCase();
  const email = (faculty.email || "").trim().toLowerCase();
  const name = (faculty.full_name || faculty.name || "").trim().toLowerCase();

  // Try finding canonical match in MOCK_FACULTY
  const match = MOCK_FACULTY.find(
    (f: any) =>
      (id && f.id?.toLowerCase() === id) ||
      (email && f.email?.toLowerCase() === email) ||
      (name && f.full_name?.toLowerCase() === name)
  );

  if (match?.employee_code) {
    return match.employee_code.toLowerCase();
  }

  return id || email || "default";
}

export function getFacultyStorageKey(faculty: any, section: string): string {
  const identifier = getFacultyCanonicalCode(faculty);
  return `nith_faculty_${section}_${identifier}`;
}

export function getFacultyDeletedKey(faculty: any, section: string): string {
  const identifier = getFacultyCanonicalCode(faculty);
  return `nith_faculty_deleted_${section}_${identifier}`;
}

export function isMatchingRecord(a: any, b: any): boolean {
  if (!a || !b) return false;

  // Exact ID match
  const idA = String(a.id || "").trim().toLowerCase();
  const idB = String(b.id || "").trim().toLowerCase();
  if (idA && idB && idA === idB) return true;

  // Canonical deduplication using DOI (primary key for publications)
  const doiA = (a.doi || "").trim().toLowerCase();
  const doiB = (b.doi || "").trim().toLowerCase();
  if (doiA && doiB && doiA === doiB) return true;

  // Reference number (for Patents, Projects, Consultancies)
  const refA = (a.reference_number || a.reference_no || a.application_number || "").trim().toLowerCase();
  const refB = (b.reference_number || b.reference_no || b.application_number || "").trim().toLowerCase();
  if (refA && refB && refA === refB) return true;

  // Title match fallback (normalized, minimum length, avoid generic placeholders)
  const cleanTitleA = (a.title || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  const cleanTitleB = (b.title || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  if (
    cleanTitleA &&
    cleanTitleB &&
    cleanTitleA === cleanTitleB &&
    cleanTitleA.length > 8 &&
    !cleanTitleA.includes("untitled") &&
    !cleanTitleA.includes("testpaper")
  ) {
    return true;
  }

  return false;
}

export function getRecordKeys(record: any): string[] {
  if (!record) return [];
  const keys: string[] = [];
  if (record.id) keys.push(String(record.id).trim().toLowerCase());
  if (record.doi) keys.push(String(record.doi).trim().toLowerCase());
  const ref = record.reference_number || record.reference_no || record.application_number;
  if (ref) keys.push(String(ref).trim().toLowerCase());
  const cleanTitle = (record.title || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  if (cleanTitle && cleanTitle.length > 8 && !cleanTitle.includes("untitled")) {
    keys.push(cleanTitle);
  }
  return keys;
}

export function isRecordDeleted(record: any, deletedSet: Set<string>): boolean {
  if (!record || deletedSet.size === 0) return false;
  const keys = getRecordKeys(record);
  return keys.some((k) => deletedSet.has(k));
}

/**
 * Resolves static baseline records for any faculty member and section.
 */
export function getFacultyBaselineRecords(faculty: any, section: string): any[] {
  const canonicalCode = getFacultyCanonicalCode(faculty);
  const targetFaculty =
    MOCK_FACULTY.find(
      (f: any) =>
        (f.employee_code || "").toLowerCase() === canonicalCode ||
        f.id?.toLowerCase() === String(faculty?.id || "").toLowerCase()
    ) || faculty;

  if (!targetFaculty) return [];

  if (section === "publications") {
    // If targetFaculty has publications embedded, return them
    if (Array.isArray(targetFaculty.publications) && targetFaculty.publications.length > 0) {
      return [...targetFaculty.publications];
    }
    // Otherwise gather from MOCK_PUBLICATIONS matching legacy_id or id or employee code
    const legId = targetFaculty.legacy_id;
    const fId = targetFaculty.id;
    const fCode = targetFaculty.employee_code?.toUpperCase();

    const matched = MOCK_PUBLICATIONS.filter((p: any) => {
      if (legId && p.faculty_legacy_ids?.includes(legId)) return true;
      if (fId && p.faculty_ids?.includes(fId)) return true;
      if (fCode && p.faculty_ids?.includes(fCode)) return true;
      return false;
    });
    return matched;
  }

  if (section === "patents") {
    return Array.isArray(targetFaculty.patents) ? [...targetFaculty.patents] : [];
  }
  if (section === "projects") {
    return Array.isArray(targetFaculty.projects) ? [...targetFaculty.projects] : [];
  }
  if (section === "supervisions") {
    return Array.isArray(targetFaculty.supervisions) ? [...targetFaculty.supervisions] : [];
  }
  if (section === "qualifications") {
    return Array.isArray(targetFaculty.qualifications) ? [...targetFaculty.qualifications] : [];
  }
  if (section === "teaching_experiences") {
    return Array.isArray(targetFaculty.teaching_experiences) ? [...targetFaculty.teaching_experiences] : [];
  }
  if (section === "admin_experiences" || section === "administrative_experiences") {
    return Array.isArray(targetFaculty.administrative_experiences)
      ? [...targetFaculty.administrative_experiences]
      : Array.isArray(targetFaculty.admin_experiences)
      ? [...targetFaculty.admin_experiences]
      : [];
  }
  if (section === "honors") {
    return Array.isArray(targetFaculty.honors) ? [...targetFaculty.honors] : [];
  }
  if (section === "expert_talks") {
    return Array.isArray(targetFaculty.expert_talks) ? [...targetFaculty.expert_talks] : [];
  }
  if (section === "exposures") {
    return Array.isArray(targetFaculty.exposures) ? [...targetFaculty.exposures] : [];
  }

  return Array.isArray(targetFaculty[section]) ? [...targetFaculty[section]] : [];
}

/**
 * Get stored records for a faculty member.
 * ALWAYS merges user-created/edited records with baseline fallback data,
 * respecting the explicit deleted set so deleted items stay deleted,
 * and user-added/associated items appear without wiping existing publications.
 */
export function getStoredData<T>(faculty: any, section: string, defaultFallback: T[]): T[] {
  if (typeof window === "undefined") return defaultFallback;
  try {
    const key = getFacultyStorageKey(faculty, section);
    const deletedKey = getFacultyDeletedKey(faculty, section);

    // Read deleted set
    let deletedSet = new Set<string>();
    try {
      const rawDel = localStorage.getItem(deletedKey);
      if (rawDel) {
        deletedSet = new Set(JSON.parse(rawDel));
      }
    } catch {}

    // Baseline records
    const baseline =
      defaultFallback && defaultFallback.length > 0
        ? defaultFallback
        : getFacultyBaselineRecords(faculty, section);

    // Read stored user additions/edits
    let userList: any[] = [];
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          userList = parsed;
        }
      }
    } catch {}

    const result: any[] = [];

    // 1. First, include user records that are NOT deleted
    for (const item of userList) {
      if (!item) continue;
      if (isRecordDeleted(item, deletedSet)) continue;
      if (!result.some((existing) => isMatchingRecord(existing, item))) {
        result.push(item);
      }
    }

    // 2. Merge baseline records that are NOT deleted and NOT already in result
    for (const baseItem of baseline) {
      if (!baseItem) continue;
      if (isRecordDeleted(baseItem, deletedSet)) continue;
      if (!result.some((existing) => isMatchingRecord(existing, baseItem))) {
        result.push(baseItem);
      }
    }

    // 3. Cross-faculty discovery: inspect other faculty stores to see if any record references this faculty
    const currentCode = getFacultyCanonicalCode(faculty);
    const currentId = (faculty?.id || "").toLowerCase();
    const currentName = (faculty?.full_name || "").toLowerCase();

    for (let i = 0; i < localStorage.length; i++) {
      const storageKey = localStorage.key(i);
      if (storageKey && storageKey.startsWith(`nith_faculty_${section}_`) && storageKey !== key) {
        try {
          const foreignRaw = localStorage.getItem(storageKey);
          if (foreignRaw) {
            const foreignList = JSON.parse(foreignRaw);
            if (Array.isArray(foreignList)) {
              for (const foreignItem of foreignList) {
                if (!foreignItem || isRecordDeleted(foreignItem, deletedSet)) continue;

                const facIds = (foreignItem.faculty_ids || []).map((x: any) => String(x).toLowerCase());
                const assocList = (foreignItem.associated_faculty || []).map((x: any) =>
                  typeof x === "string"
                    ? x.toLowerCase()
                    : (x?.employee_code || x?.code || x?.id || x?.full_name || x?.name || "").toLowerCase()
                );

                const isAssociated =
                  (currentCode && facIds.includes(currentCode)) ||
                  (currentId && facIds.includes(currentId)) ||
                  (currentCode && assocList.some((a: string) => a === currentCode || a.includes(currentCode))) ||
                  (currentId && assocList.some((a: string) => a === currentId || a.includes(currentId))) ||
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

  const currentKey = getFacultyStorageKey(currentFaculty, section);
  const currentDeletedKey = getFacultyDeletedKey(currentFaculty, section);
  const canonicalCurrentCode = getFacultyCanonicalCode(currentFaculty);

  if (isDelete) {
    // 1. Mark as deleted for current faculty
    try {
      const rawDel = localStorage.getItem(currentDeletedKey);
      const delList: string[] = rawDel ? JSON.parse(rawDel) : [];
      const recordKeys = getRecordKeys(record);
      const updatedDel = Array.from(new Set([...delList, ...recordKeys]));
      localStorage.setItem(currentDeletedKey, JSON.stringify(updatedDel));
    } catch {}

    // 2. Remove from current faculty user store
    try {
      const raw = localStorage.getItem(currentKey);
      if (raw) {
        const list: any[] = JSON.parse(raw);
        const filtered = list.filter((item) => !isMatchingRecord(item, record));
        localStorage.setItem(currentKey, JSON.stringify(filtered));
      }
    } catch {}

    // 3. Remove from each associated colleague store
    if (Array.isArray(associatedFacultyList)) {
      for (const coFaculty of associatedFacultyList) {
        if (!coFaculty) continue;
        const coKey = getFacultyStorageKey(coFaculty, section);
        try {
          const rawCo = localStorage.getItem(coKey);
          if (rawCo) {
            const coList: any[] = JSON.parse(rawCo);
            const filteredCo = coList.filter((item) => !isMatchingRecord(item, record));
            localStorage.setItem(coKey, JSON.stringify(filteredCo));
          }
        } catch {}
      }
    }
  } else {
    // ADD OR EDIT
    // 1. Remove record keys from current faculty's deleted set
    try {
      const rawDel = localStorage.getItem(currentDeletedKey);
      if (rawDel) {
        const delList: string[] = JSON.parse(rawDel);
        const recordKeys = new Set(getRecordKeys(record));
        const updatedDel = delList.filter((k) => !recordKeys.has(k));
        localStorage.setItem(currentDeletedKey, JSON.stringify(updatedDel));
      }
    } catch {}

    // 2. Save record to current faculty store
    let currentList: any[] = [];
    try {
      const raw = localStorage.getItem(currentKey);
      if (raw) currentList = JSON.parse(raw) || [];
    } catch {}

    const existingIndex = currentList.findIndex((item) => isMatchingRecord(item, record));
    if (existingIndex >= 0) {
      currentList[existingIndex] = { ...currentList[existingIndex], ...record };
    } else {
      currentList = [record, ...currentList];
    }
    localStorage.setItem(currentKey, JSON.stringify(currentList));

    // 3. Cross-sync to each selected associated colleague
    const associatedCodes = new Set<string>();
    if (Array.isArray(associatedFacultyList)) {
      for (const coFaculty of associatedFacultyList) {
        if (!coFaculty) continue;
        const coCode = getFacultyCanonicalCode(coFaculty);
        if (coCode === canonicalCurrentCode) continue;
        associatedCodes.add(coCode);

        const coKey = getFacultyStorageKey(coFaculty, section);
        const coDeletedKey = getFacultyDeletedKey(coFaculty, section);

        // Remove from colleague's deleted set
        try {
          const rawCoDel = localStorage.getItem(coDeletedKey);
          if (rawCoDel) {
            const coDelList: string[] = JSON.parse(rawCoDel);
            const recordKeys = new Set(getRecordKeys(record));
            const updatedCoDel = coDelList.filter((k) => !recordKeys.has(k));
            localStorage.setItem(coDeletedKey, JSON.stringify(updatedCoDel));
          }
        } catch {}

        // Add/update in colleague's store
        let coList: any[] = [];
        try {
          const rawCo = localStorage.getItem(coKey);
          if (rawCo) coList = JSON.parse(rawCo) || [];
        } catch {}

        const coIndex = coList.findIndex((item) => isMatchingRecord(item, record));
        if (coIndex >= 0) {
          coList[coIndex] = { ...coList[coIndex], ...record };
        } else {
          coList = [record, ...coList];
        }
        localStorage.setItem(coKey, JSON.stringify(coList));
      }
    }

    // 4. Clean up any previous colleagues who were unselected in this edit
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const storageKey = localStorage.key(i);
        if (
          storageKey &&
          storageKey.startsWith(`nith_faculty_${section}_`) &&
          storageKey !== currentKey
        ) {
          const colleagueCode = storageKey.replace(`nith_faculty_${section}_`, "");
          if (!associatedCodes.has(colleagueCode)) {
            const rawColleague = localStorage.getItem(storageKey);
            if (rawColleague && rawColleague.includes(record.id || record.doi || "")) {
              const parsed = JSON.parse(rawColleague);
              if (Array.isArray(parsed) && parsed.some((item) => isMatchingRecord(item, record))) {
                const cleaned = parsed.filter((item) => !isMatchingRecord(item, record));
                localStorage.setItem(storageKey, JSON.stringify(cleaned));
              }
            }
          }
        }
      }
    } catch {}
  }

  // 5. Dispatch reactive update event
  window.dispatchEvent(
    new CustomEvent("nith_faculty_storage_update", {
      detail: { section, recordId: record?.id, doi: record?.doi },
    })
  );
}

export function setStoredData<T>(faculty: any, section: string, data: T[]): void {
  if (typeof window === "undefined") return;
  try {
    const key = getFacultyStorageKey(faculty, section);
    localStorage.setItem(key, JSON.stringify(data));

    // Update deleted set for any baseline items missing from data
    const baseline = getFacultyBaselineRecords(faculty, section);
    const deletedKey = getFacultyDeletedKey(faculty, section);
    let deletedList: string[] = [];
    try {
      const rawDel = localStorage.getItem(deletedKey);
      if (rawDel) deletedList = JSON.parse(rawDel);
    } catch {}

    const dataItemMatches = (baseItem: any) =>
      data.some((d: any) => isMatchingRecord(d, baseItem));

    for (const baseItem of baseline) {
      if (!dataItemMatches(baseItem)) {
        deletedList.push(...getRecordKeys(baseItem));
      }
    }
    localStorage.setItem(deletedKey, JSON.stringify(Array.from(new Set(deletedList))));

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
    const key = getFacultyStorageKey(faculty, section);
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
    const key = getFacultyStorageKey(faculty, section);
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
