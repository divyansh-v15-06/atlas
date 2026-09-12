"use client";

/**
 * Faculty Persistent Storage Manager
 * Ensures that all added, edited, and deleted records (publications, projects, patents,
 * consultancies, supervisions, events, qualifications, teaching exp, admin exp, honors,
 * expert talks, exposures, and profile info) persist across page reloads and sync seamlessly.
 */

export function getFacultyStorageKey(faculty: any, section: string): string {
  const identifier =
    faculty?.employee_code?.toLowerCase() ||
    faculty?.id?.toLowerCase() ||
    faculty?.email?.toLowerCase() ||
    "default";
  return `nith_faculty_${section}_${identifier}`;
}

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

  // Title match fallback
  const titleA = (a.title || "").trim().toLowerCase();
  const titleB = (b.title || "").trim().toLowerCase();
  if (titleA && titleB && titleA === titleB && titleA.length > 5) return true;

  return false;
}

export function getStoredData<T>(faculty: any, section: string, defaultFallback: T[]): T[] {
  if (typeof window === "undefined") return defaultFallback;
  try {
    const key = getFacultyStorageKey(faculty, section);
    const raw = localStorage.getItem(key);
    let list: any[] = [];
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        list = parsed;
      }
    } else {
      list = [...defaultFallback];
    }

    // Cross-faculty discovery: inspect other faculty records that reference this faculty member
    const currentCode = (faculty?.employee_code || "").toLowerCase();
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
                const facIds = (foreignItem.faculty_ids || []).map((x: any) => String(x).toLowerCase());
                const assocList = (foreignItem.associated_faculty || []).map((x: any) =>
                  typeof x === "string" ? x.toLowerCase() : (x?.code || x?.id || x?.name || "").toLowerCase()
                );
                const authorText = (foreignItem.author_text || foreignItem.raw_authors || "").toLowerCase();

                const isAssociated =
                  (currentCode && facIds.includes(currentCode)) ||
                  (currentId && facIds.includes(currentId)) ||
                  (currentCode && assocList.some((a: string) => a.includes(currentCode))) ||
                  (currentId && assocList.some((a: string) => a.includes(currentId))) ||
                  (currentName && assocList.some((a: string) => a.includes(currentName)));

                if (isAssociated) {
                  const alreadyExists = list.some((existing) => isMatchingRecord(existing, foreignItem));
                  if (!alreadyExists) {
                    list.unshift(foreignItem);
                  }
                }
              }
            }
          }
        } catch {
          // Ignore parse errors on individual foreign keys
        }
      }
    }

    return list as T[];
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

  // 1. Update current faculty's store
  const currentKey = getFacultyStorageKey(currentFaculty, section);
  let currentList: any[] = [];
  try {
    const raw = localStorage.getItem(currentKey);
    if (raw) currentList = JSON.parse(raw) || [];
  } catch {}

  if (isDelete) {
    currentList = currentList.filter((item) => !isMatchingRecord(item, record));
  } else {
    const existingIndex = currentList.findIndex((item) => isMatchingRecord(item, record));
    if (existingIndex >= 0) {
      currentList[existingIndex] = { ...currentList[existingIndex], ...record };
    } else {
      currentList = [record, ...currentList];
    }
  }
  localStorage.setItem(currentKey, JSON.stringify(currentList));

  // 2. Cross-sync to each selected associated faculty member
  if (Array.isArray(associatedFacultyList)) {
    for (const coFaculty of associatedFacultyList) {
      if (!coFaculty) continue;
      const coKey = getFacultyStorageKey(coFaculty, section);
      let coList: any[] = [];
      try {
        const rawCo = localStorage.getItem(coKey);
        if (rawCo) coList = JSON.parse(rawCo) || [];
      } catch {}

      if (isDelete) {
        coList = coList.filter((item) => !isMatchingRecord(item, record));
      } else {
        const coIndex = coList.findIndex((item) => isMatchingRecord(item, record));
        if (coIndex >= 0) {
          coList[coIndex] = { ...coList[coIndex], ...record };
        } else {
          coList = [record, ...coList];
        }
      }
      localStorage.setItem(coKey, JSON.stringify(coList));
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
    const key = getFacultyStorageKey(faculty, section);
    localStorage.setItem(key, JSON.stringify(data));
    // Dispatch custom event for cross-tab or cross-component reactivity
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

import departmentsRegistry from "@/lib/departments-registry.json";

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

