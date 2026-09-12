"use client";

import { useState } from "react";
import { Users, X, Search } from "lucide-react";
import { MOCK_FACULTY } from "@/lib/mock-data";

export interface AssociatedFacultyPickerProps {
  selected: any[];
  onChange: (facultyList: any[]) => void;
  currentFaculty?: any;
  label?: string;
  placeholder?: string;
  helperText?: string;
}

export default function AssociatedFacultyPicker({
  selected,
  onChange,
  currentFaculty,
  label = "Associated Faculty / Co-Contributors (NIT Hamirpur)",
  placeholder = "Type name or code (e.g. Siddhartha, CS01) to link colleagues...",
  helperText = "Linking colleagues automatically synchronizes this record onto their respective faculty profiles.",
}: AssociatedFacultyPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const currentIdentifier = (
    currentFaculty?.employee_code ||
    currentFaculty?.id ||
    ""
  ).toLowerCase();

  const filteredColleagues = MOCK_FACULTY.filter((f) => {
    const fId = (f.employee_code || f.id || "").toLowerCase();
    if (currentIdentifier && fId === currentIdentifier) return false;

    if (!searchQuery.trim()) return false;

    const q = searchQuery.toLowerCase().trim();
    return (
      f.full_name?.toLowerCase().includes(q) ||
      f.employee_code?.toLowerCase().includes(q) ||
      f.department_name?.toLowerCase().includes(q) ||
      f.designation?.toLowerCase().includes(q)
    );
  });

  const handleToggle = (colleague: any) => {
    const isSelected = selected.some(
      (item) =>
        item.employee_code === colleague.employee_code || item.id === colleague.id
    );

    if (isSelected) {
      onChange(
        selected.filter(
          (item) =>
            item.employee_code !== colleague.employee_code &&
            item.id !== colleague.id
        )
      );
    } else {
      onChange([...selected, colleague]);
    }
    setSearchQuery("");
  };

  const handleRemove = (colleague: any) => {
    onChange(
      selected.filter(
        (item) =>
          item.employee_code !== colleague.employee_code &&
          item.id !== colleague.id
      )
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold uppercase tracking-wider text-[#33110e] flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-[#85261e]" />
          <span>{label}</span>
        </label>
        {selected.length > 0 && (
          <span className="text-[11px] font-semibold text-[#85261e] bg-[#fff9f6] px-2 py-0.5 rounded-full border border-[#eedfd8]">
            {selected.length} Linked
          </span>
        )}
      </div>

      {helperText && (
        <p className="text-[11px] text-neutral-500">{helperText}</p>
      )}

      {/* Selected Faculty Tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-2 bg-[#fff9f6] rounded-xl border border-[#eedfd8]">
          {selected.map((colleague, idx) => (
            <span
              key={colleague.id || colleague.employee_code || idx}
              className="inline-flex items-center gap-1.5 bg-white border border-[#eedfd8] text-[#85261e] text-xs font-semibold px-2.5 py-1 rounded-lg shadow-2xs"
            >
              <span>{colleague.full_name}</span>
              {colleague.employee_code && (
                <span className="text-[10px] text-neutral-400 font-mono">
                  ({colleague.employee_code})
                </span>
              )}
              <button
                type="button"
                onClick={() => handleRemove(colleague)}
                className="hover:text-red-700 hover:bg-neutral-100 p-0.5 rounded transition cursor-pointer"
                title="Remove"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#eedfd8] bg-[#fff9f6] text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
          />
        </div>

        {/* Dropdown Results */}
        {searchQuery.trim().length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 z-50 max-h-48 overflow-y-auto border border-[#eedfd8] rounded-xl bg-white divide-y divide-neutral-100 shadow-xl">
            {filteredColleagues.length > 0 ? (
              filteredColleagues.slice(0, 8).map((colleague) => {
                const isSelected = selected.some(
                  (item) =>
                    item.employee_code === colleague.employee_code ||
                    item.id === colleague.id
                );
                return (
                  <button
                    key={colleague.id || colleague.employee_code}
                    type="button"
                    onClick={() => handleToggle(colleague)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#eedfd8]/30 transition cursor-pointer ${
                      isSelected
                        ? "bg-[#eedfd8]/40 font-bold text-[#85261e]"
                        : "text-neutral-700"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-neutral-900">
                        {colleague.full_name}
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        {colleague.designation} • {colleague.department_name || "Department of CSE"}
                      </div>
                    </div>
                    <span className="font-mono text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600 font-medium ml-2">
                      {isSelected ? "Linked ✓" : colleague.employee_code}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="p-3 text-xs text-neutral-400 text-center">
                No colleagues found matching "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
