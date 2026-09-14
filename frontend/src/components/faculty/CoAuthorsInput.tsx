"use client";

import { useState, useMemo } from "react";
import { Users, UserPlus, X, Plus, School, Globe, Search, ArrowUpDown } from "lucide-react";
import { MOCK_FACULTY } from "@/lib/mock-data";

export interface CoAuthorInternal {
  id?: string;
  employee_code?: string;
  full_name: string;
  department_name?: string;
  department_code?: string;
  email?: string;
  legacy_id?: number;
}

export interface CoAuthorsInputProps {
  currentFaculty: any;
  internalAuthors: CoAuthorInternal[];
  externalAuthors: string[];
  onChange: (data: {
    internalAuthors: CoAuthorInternal[];
    externalAuthors: string[];
    combinedAuthorText: string;
  }) => void;
  label?: string;
  helperText?: string;
}

export default function CoAuthorsInput({
  currentFaculty,
  internalAuthors = [],
  externalAuthors = [],
  onChange,
  label = "Publication Co-Authors",
  helperText = "Specify contributors from within NIT Hamirpur to auto-sync to their profile, and add collaborators outside NIT Hamirpur.",
}: CoAuthorsInputProps) {
  const [facultySearch, setFacultySearch] = useState("");
  const [externalInput, setExternalInput] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Normalized current faculty identifier
  const currentIdentifier = (
    currentFaculty?.employee_code ||
    currentFaculty?.id ||
    ""
  ).toLowerCase();

  // Filter internal faculty list
  const availableColleagues = useMemo(() => {
    if (!facultySearch.trim()) return [];
    const q = facultySearch.toLowerCase().trim();

    return MOCK_FACULTY.filter((f) => {
      const fId = (f.employee_code || f.id || "").toLowerCase();
      // Exclude current author
      if (currentIdentifier && fId === currentIdentifier) return false;
      // Exclude already selected
      if (
        internalAuthors.some(
          (a) =>
            (a.employee_code && a.employee_code.toLowerCase() === fId) ||
            (a.id && a.id.toLowerCase() === fId)
        )
      ) {
        return false;
      }

      return (
        f.full_name?.toLowerCase().includes(q) ||
        f.employee_code?.toLowerCase().includes(q) ||
        f.department_name?.toLowerCase().includes(q) ||
        f.designation?.toLowerCase().includes(q)
      );
    }).slice(0, 8); // Top 8 matches
  }, [facultySearch, currentIdentifier, internalAuthors]);

  // Compute composite author citation string
  const computeCombined = (internals: CoAuthorInternal[], externals: string[]) => {
    const list: string[] = [];
    if (currentFaculty?.full_name) {
      list.push(currentFaculty.full_name);
    }
    internals.forEach((f) => list.push(f.full_name));
    externals.forEach((ext) => list.push(ext));
    return list.join(", ");
  };

  // Add an internal colleague
  const handleAddInternal = (colleague: any) => {
    const updated = [
      ...internalAuthors,
      {
        id: colleague.id,
        employee_code: colleague.employee_code,
        full_name: colleague.full_name,
        department_name: colleague.department_name,
        department_code: colleague.department_code || "NITH",
        email: colleague.email,
        legacy_id: colleague.legacy_id,
      },
    ];
    setFacultySearch("");
    setIsDropdownOpen(false);
    onChange({
      internalAuthors: updated,
      externalAuthors,
      combinedAuthorText: computeCombined(updated, externalAuthors),
    });
  };

  // Remove an internal colleague
  const handleRemoveInternal = (indexToRemove: number) => {
    const updated = internalAuthors.filter((_, idx) => idx !== indexToRemove);
    onChange({
      internalAuthors: updated,
      externalAuthors,
      combinedAuthorText: computeCombined(updated, externalAuthors),
    });
  };

  // Add external author(s)
  const handleAddExternal = () => {
    if (!externalInput.trim()) return;

    // Support comma-separated input
    const parts = externalInput
      .split(/[,;]/)
      .map((p) => p.trim())
      .filter(Boolean);

    const updated = [...externalAuthors, ...parts];
    setExternalInput("");
    onChange({
      internalAuthors,
      externalAuthors: updated,
      combinedAuthorText: computeCombined(internalAuthors, updated),
    });
  };

  // Remove external author
  const handleRemoveExternal = (indexToRemove: number) => {
    const updated = externalAuthors.filter((_, idx) => idx !== indexToRemove);
    onChange({
      internalAuthors,
      externalAuthors: updated,
      combinedAuthorText: computeCombined(internalAuthors, updated),
    });
  };

  const totalCoAuthors = internalAuthors.length + externalAuthors.length;

  return (
    <div className="space-y-4 rounded-2xl border border-[#eedfd8] bg-white p-4 sm:p-5 shadow-2xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-[#eedfd8]/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#85261e]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#33110e]">
              {label}
            </h3>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-[10px] font-bold px-2 py-0.5 rounded-full">
              {totalCoAuthors} Co-Author{totalCoAuthors === 1 ? "" : "s"} Selected
            </span>
          </div>
          {helperText && (
            <p className="text-[11px] text-neutral-500 mt-0.5">{helperText}</p>
          )}
        </div>
      </div>

      {/* Two-Column Selection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* OPTION 1: Internal NIT Hamirpur Faculty Dropdown */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] flex items-center gap-1.5">
            <School className="w-3.5 h-3.5 text-emerald-700" />
            <span>Option 1: From College (NIT Hamirpur)</span>
          </label>
          <p className="text-[10px] text-neutral-500 leading-snug">
            Choose colleagues to link. This paper will automatically appear in their profile.
          </p>

          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search colleague by name or code (e.g. Naveen, CS01)..."
                value={facultySearch}
                onChange={(e) => {
                  setFacultySearch(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#eedfd8] bg-[#fff9f6] text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
              />
            </div>

            {/* Dropdown Suggestions */}
            {isDropdownOpen && availableColleagues.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 z-30 max-h-48 overflow-y-auto rounded-xl border border-[#eedfd8] bg-white shadow-lg divide-y divide-[#eedfd8]/40">
                {availableColleagues.map((colleague) => (
                  <div
                    key={colleague.id || colleague.employee_code}
                    onClick={() => handleAddInternal(colleague)}
                    className="p-2.5 hover:bg-[#fff9f6] cursor-pointer flex items-center justify-between text-xs transition"
                  >
                    <div>
                      <p className="font-bold text-[#1c110c]">{colleague.full_name}</p>
                      <p className="text-[10px] text-neutral-500">
                        {colleague.designation} • {colleague.department_name || "NITH"}
                      </p>
                    </div>
                    <span className="bg-[#eedfd8]/60 text-[#85261e] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                      {colleague.employee_code || "FACULTY"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* OPTION 2: Authors Outside NIT Hamirpur (Text Input) */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-700" />
            <span>Option 2: Outside College (External Authors)</span>
          </label>
          <p className="text-[10px] text-neutral-500 leading-snug">
            Enter researchers, industry experts, or scholars from other universities.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Dr. John Doe (Stanford Univ), Jane Smith (IITD)"
              value={externalInput}
              onChange={(e) => setExternalInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddExternal();
                }
              }}
              className="flex-1 px-3 py-2 rounded-xl border border-[#eedfd8] bg-[#fff9f6] text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
            />
            <button
              type="button"
              onClick={handleAddExternal}
              disabled={!externalInput.trim()}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] disabled:opacity-40 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Selected Authors Badges / Chips */}
      {totalCoAuthors > 0 && (
        <div className="space-y-2 pt-2 border-t border-[#eedfd8]/60">
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Current Co-Authors Tagged
          </label>
          <div className="flex flex-wrap gap-2">
            {/* Internal NITH Authors */}
            {internalAuthors.map((author, idx) => (
              <span
                key={author.id || author.employee_code || idx}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50/80 px-2.5 py-1 text-xs text-emerald-950 font-medium shadow-2xs animate-in fade-in"
              >
                <School className="w-3 h-3 text-emerald-700 flex-shrink-0" />
                <span className="font-bold">{author.full_name}</span>
                <span className="text-[9px] bg-emerald-200/80 text-emerald-800 px-1 rounded font-bold uppercase">
                  NITH
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveInternal(idx)}
                  className="ml-1 text-emerald-700 hover:text-emerald-900 rounded-full hover:bg-emerald-200/60 p-0.5"
                  title="Remove author"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* External Authors */}
            {externalAuthors.map((ext, idx) => (
              <span
                key={ext + idx}
                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-300 bg-blue-50/80 px-2.5 py-1 text-xs text-blue-950 font-medium shadow-2xs animate-in fade-in"
              >
                <Globe className="w-3 h-3 text-blue-700 flex-shrink-0" />
                <span className="font-bold">{ext}</span>
                <span className="text-[9px] bg-blue-200/80 text-blue-800 px-1 rounded font-bold uppercase">
                  External
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveExternal(idx)}
                  className="ml-1 text-blue-700 hover:text-blue-900 rounded-full hover:bg-blue-200/60 p-0.5"
                  title="Remove external author"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Live Citation Author Line Preview */}
      <div className="rounded-xl bg-[#fff9f6] border border-[#eedfd8] p-3 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#85261e] block mb-1">
          Printed Citation Author Line Preview:
        </span>
        <p className="font-mono text-neutral-800 break-words leading-relaxed text-[11px]">
          {computeCombined(internalAuthors, externalAuthors)}
        </p>
      </div>
    </div>
  );
}
