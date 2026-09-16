/**
 * Authentication and authorization guard utilities for Admin and Faculty portals.
 */

export interface AuthUser {
  id?: string | number;
  email?: string;
  full_name?: string;
  name?: string;
  role?: string;
  roles?: string[];
  employee_code?: string;
  faculty_id?: string | number;
  designation?: string;
  department?: string;
  [key: string]: any;
}

const ADMIN_ROLES = new Set([
  "ADMIN",
  "HOD_ADMIN",
  "SYS_ADMIN",
  "SYSTEM_ADMIN",
  "SUPER_ADMIN",
  "HOD",
]);

const FACULTY_ROLES = new Set([
  "FACULTY",
  "TEACHER",
  "PROFESSOR",
  "ADMIN",
  "HOD_ADMIN",
  "SYS_ADMIN",
  "SYSTEM_ADMIN",
  "SUPER_ADMIN",
  "HOD",
]);

/**
 * Retrieve the current stored auth token safely from localStorage.
 */
export function getStoredAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const token =
      localStorage.getItem("auth_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("admin_token");
    if (!token || token.trim() === "" || token === "null" || token === "undefined") {
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

/**
 * Retrieve the current stored auth user safely from localStorage.
 */
export function getStoredAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("auth_user");
    if (!raw || raw.trim() === "" || raw === "null" || raw === "undefined") {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Determine if a user object has administrative privileges.
 */
export function isAdminUser(user: AuthUser | null): boolean {
  if (!user) return false;

  const primaryRole = String(user.role || "").trim().toUpperCase();
  if (ADMIN_ROLES.has(primaryRole)) return true;

  if (Array.isArray(user.roles)) {
    for (const r of user.roles) {
      if (ADMIN_ROLES.has(String(r || "").trim().toUpperCase())) {
        return true;
      }
    }
  }

  // Check email convention for fallback
  const email = String(user.email || "").toLowerCase();
  if (email === "admin@nith.ac.in" || email === "sysadmin@nith.ac.in" || email === "hod@nith.ac.in") {
    return true;
  }

  return false;
}

/**
 * Determine if a user object has faculty portal access privileges.
 */
export function isFacultyUser(user: AuthUser | null): boolean {
  if (!user) return false;

  const primaryRole = String(user.role || "").trim().toUpperCase();
  if (FACULTY_ROLES.has(primaryRole)) return true;

  if (Array.isArray(user.roles)) {
    for (const r of user.roles) {
      if (FACULTY_ROLES.has(String(r || "").trim().toUpperCase())) {
        return true;
      }
    }
  }

  // Check if they have faculty identifiers
  if (user.employee_code || user.faculty_id) {
    return true;
  }

  return false;
}

/**
 * Complete session logout and cache cleanup.
 */
export function clearAuthSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("token");
    localStorage.removeItem("admin_token");

    // Also clear cookies if any were set
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "auth_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("nith_faculty_storage_update"));
  } catch (err) {
    console.error("Failed to clear auth session:", err);
  }
}

