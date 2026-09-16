"use client";

import { useState, useMemo } from "react";
import {
  Megaphone,
  Calendar,
  Search,
  ExternalLink,
  FileText,
  Sparkles,
  Download,
  Share2,
  Check,
  Tag,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_ANNOUNCEMENTS } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { useDepartment } from "@/context/department-context";
import { DepartmentEmptyState } from "@/components/common/department-empty-state";

export default function AnnouncementsPage() {
  const { activeDepartment } = useDepartment();
  const hasData = activeDepartment.slug === "cse";
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ["ALL", "Curriculum", "Conference", "Admissions", "Academic"];

  const filteredAnnouncements = useMemo(() => {
    return MOCK_ANNOUNCEMENTS.filter((ann) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        ann.title.toLowerCase().includes(searchLower) ||
        ann.body.toLowerCase().includes(searchLower) ||
        ann.category?.toLowerCase().includes(searchLower);

      const matchesCategory =
        selectedCategory === "ALL" ||
        ann.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const handleShare = (ann: typeof MOCK_ANNOUNCEMENTS[0]) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/news/announcements?id=${ann.id}`);
      setCopiedId(ann.id);
      toast.success("Notice link copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 bg-white min-h-[85vh]">
      {/* Title Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-[#85261e]" />
              Announcements &amp; Department Circulars
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {activeDepartment.code}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-0.5">
            Official curriculum updates, examination schedules, NEP-2020 notices, and admissions circulars for Department of {activeDepartment.name}.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#fff9f6] p-1 rounded-lg border border-[#eedfd8]">
          {[
            { id: "ALL", label: "All Notices" },
            { id: "Curriculum", label: "Curriculum & NEP" },
            { id: "Conference", label: "Conferences" },
            { id: "Admissions", label: "Ph.D. Admissions" },
            { id: "Academic", label: "Projects & Exams" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                selectedCategory === cat.id
                  ? "bg-[#33110e] text-white shadow-xs"
                  : "text-[#33110e] hover:bg-[#eedfd8]/50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {!hasData ? (
        <DepartmentEmptyState sectionTitle="Announcements & Circulars" />
      ) : (
        <>
          {/* Search Bar */}
          <div className="bg-[#fff9f6] p-3 rounded-lg border border-[#eedfd8] flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search circulars, syllabus, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-[#eedfd8] bg-white focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
          />
        </div>
        <span className="text-xs text-neutral-500 font-semibold hidden sm:inline">
          Showing {filteredAnnouncements.length} of {MOCK_ANNOUNCEMENTS.length} circulars
        </span>
      </div>

      {/* Announcements Cards */}
      <div className="space-y-4">
        {filteredAnnouncements.map((ann) => (
          <div
            key={ann.id}
            className="bg-white border border-[#eedfd8] rounded-xl p-5 shadow-xs hover:shadow-md hover:border-[#85261e]/40 transition group space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#33110e] text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                  {ann.category}
                </span>
                {ann.is_new && (
                  <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">
                    NEW
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-neutral-500 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-[#85261e]" /> Published: {formatDate(ann.publish_date)}
                </span>
              </div>

              {/* Share Button */}
              <button
                onClick={() => handleShare(ann)}
                className="text-xs text-neutral-500 hover:text-[#33110e] flex items-center gap-1 self-end sm:self-auto transition"
              >
                {copiedId === ann.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold text-[11px]">Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium">Share Notice</span>
                  </>
                )}
              </button>
            </div>

            {/* Title */}
            <h2 className="text-base font-bold text-[#1c110c] group-hover:text-[#85261e] transition leading-snug">
              {ann.title}
            </h2>

            {/* Body */}
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              {ann.body}
            </p>

            {/* Action / Attachment Links */}
            {ann.link_url && (
              <div className="pt-2 flex flex-wrap gap-2 border-t border-[#f4ece8]">
                <a
                  href={ann.link_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fff9f6] border border-[#eedfd8] text-xs font-bold text-[#33110e] hover:bg-[#33110e] hover:text-white transition shadow-2xs"
                >
                  {ann.link_url.includes(".pdf") ? (
                    <>
                      <Download className="w-3.5 h-3.5 text-[#85261e] group-hover:text-white" />
                      <span>Download Official Curriculum PDF</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-3.5 h-3.5 text-[#85261e] group-hover:text-white" />
                      <span>Open Official Portal / Notification</span>
                    </>
                  )}
                </a>
              </div>
            )}
          </div>
        ))}

        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-20 text-neutral-500 text-xs bg-[#fff9f6] rounded-lg border border-[#eedfd8]">
            No announcements found matching your criteria.
          </div>
        )}
      </div>
    </>
  )}
</div>
  );
}
