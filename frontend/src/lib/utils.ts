import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with conflict resolution.
 * Combines clsx (conditional classes) with tailwind-merge (dedup/override).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to a human-readable string.
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format currency in INR (Indian Rupees).
 * Omit unnecessary decimal zeroes for integer amounts (e.g. ₹3,85,00,000 instead of ₹3,85,00,000.00).
 */
export function formatINR(amount: number | null | undefined): string {
  if (amount == null || isNaN(Number(amount))) return "—";
  const num = Number(amount);
  const hasDecimals = num % 1 !== 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Format currency compactly in INR (e.g. ₹3.85 Cr, ₹45.2 L, ₹25 K).
 */
export function formatCompactINR(amount: number | null | undefined): string {
  if (amount == null || isNaN(Number(amount))) return "—";
  const num = Number(amount);
  const abs = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  if (abs >= 10000000) {
    // Crores (>= 1,00,00,000 = 10^7)
    const cr = abs / 10000000;
    const formatted = cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2).replace(/\.?0+$/, "");
    return `${sign}₹${formatted} Cr`;
  }
  if (abs >= 100000) {
    // Lakhs (>= 1,00,000 = 10^5)
    const lk = abs / 100000;
    const formatted = lk % 1 === 0 ? lk.toFixed(0) : lk.toFixed(2).replace(/\.?0+$/, "");
    return `${sign}₹${formatted} L`;
  }
  if (abs >= 1000) {
    // Thousands (>= 1,000 = 10^3)
    const k = abs / 1000;
    const formatted = k % 1 === 0 ? k.toFixed(0) : k.toFixed(1).replace(/\.?0+$/, "");
    return `${sign}₹${formatted} K`;
  }
  return formatINR(num);
}

/**
 * Truncate text to a max length with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Generate initials from a full name (e.g., "John Doe" → "JD").
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Academic session string from a year (e.g., 2024 → "2024-2025").
 */
export function academicSession(year: number): string {
  return `${year}-${year + 1}`;
}

/**
 * Upload an image file directly to Cloudinary using unsigned preset.
 * Returns the secure URL of the uploaded image.
 */
export async function uploadToCloudinary(file: File | Blob): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "eqvhqx5q";
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "faculty_nith";

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", uploadPreset);
  data.append("asset_folder", "nith");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: data,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Image upload failed with status ${res.status}`);
  }

  const result = await res.json();
  return result.secure_url || result.url;
}
