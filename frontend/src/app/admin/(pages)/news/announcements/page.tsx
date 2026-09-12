"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  Megaphone,
  X,
  Search,
  Filter,
  Calendar,
  Users,
  AlertCircle,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  FileText,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useDepartment } from "@/context/department-context";

interface AnnouncementItem {
  id: string;
  title: string;
  category: string;
  target?: string;
  publish_date: string;
  urgent: boolean;
  body?: string;
  link_url?: string;
}

const DEFAULT_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: "ann-1",
    title: "Call for PhD Admissions (Odd Semester 2026-27)",
    category: "Academic",
    target: "All Applicants",
    publish_date: "2026-08-18",
    urgent: true,
    body: "Applications are invited from eligible candidates for admission to the Ph.D. Program in the Department of Computer Science & Engineering under Institute Fellowship and Sponsored categories.",
    link_url: "https://nith.ac.in/admissions/phd",
  },
  {
    id: "ann-2",
    title: "DST-SERB Core Research Grant Applications Open for Faculty",
    category: "Research",
    target: "Faculty Only",
    publish_date: "2026-08-15",
    urgent: false,
    body: "Department faculty members are invited to submit sponsored project proposals under the Core Research Grant scheme of the Science and Engineering Research Board.",
  },
  {
    id: "ann-3",
    title: "Campus Placement Drive: Google & Microsoft Scheduled for September",
    category: "Placement",
    target: "Final Year Students",
    publish_date: "2026-08-12",
    urgent: false,
    body: "Upcoming national placement season for final year B.Tech and M.Tech CSE students. Online assessments will commence from September 5th on the designated testing portal.",
  },
  {
    id: "ann-4",
    title: "International Conference on Next-Gen Computing (ICNGC-2026)",
    category: "Event",
    target: "All",
    publish_date: "2026-08-01",
    urgent: false,
    body: "Department of CSE, NIT Hamirpur is organizing an international conference focusing on Distributed Systems, Edge AI, and Quantum Computing. Call for papers is now active.",
    link_url: "https://nith.ac.in/conferences/icngc2026",
  },
];

const CATEGORIES = ["All", "Academic", "Research", "Placement", "Event", "General"];

export default function AdminAnnouncementsPage() {
  const { activeDepartment } = useDepartment();
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(DEFAULT_ANNOUNCEMENTS);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Academic");
  const [target, setTarget] = useState("All");
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split("T")[0]);
  const [urgent, setUrgent] = useState(false);
  const [body, setBody] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  // Load from localStorage if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("nith_admin_announcements");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAnnouncements(parsed);
          }
        } catch {}
      }
    }
  }, []);

  const saveToStorage = (items: AnnouncementItem[]) => {
    setAnnouncements(items);
    if (typeof window !== "undefined") {
      localStorage.setItem("nith_admin_announcements", JSON.stringify(items));
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Announcement title is required");
      return;
    }

    const newAnn: AnnouncementItem = {
      id: `ann-${Date.now()}`,
      title: title.trim(),
      category,
      target,
      publish_date: publishDate,
      urgent,
      body: body.trim(),
      link_url: linkUrl.trim() || undefined,
    };

    const updated = [newAnn, ...announcements];
    saveToStorage(updated);
    setShowModal(false);
    toast.success("Announcement published live!", {
      description: "Broadcasted across student and faculty department notices.",
    });

    // Reset Form
    setTitle("");
    setCategory("Academic");
    setTarget("All");
    setPublishDate(new Date().toISOString().split("T")[0]);
    setUrgent(false);
    setBody("");
    setLinkUrl("");
  };

  const handleDelete = (id: string, annTitle: string) => {
    const updated = announcements.filter((a) => a.id !== id);
    saveToStorage(updated);
    toast.success(`Removed announcement "${annTitle.slice(0, 30)}..."`);
  };

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((a) => {
      const q = search.toLowerCase();
      const matchQuery =
        !search ||
        a.title.toLowerCase().includes(q) ||
        (a.body && a.body.toLowerCase().includes(q)) ||
        (a.target && a.target.toLowerCase().includes(q));

      const matchCat =
        selectedCategory === "All" ||
        a.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchQuery && matchCat;
    });
  }, [announcements, search, selectedCategory]);

  return (
    <div className="space-y-6 font-sans">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-[#eedfd8] bg-gradient-to-r from-[#33110e] via-[#4a1814] to-[#85261e] p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/20 px-3 py-0.5 font-mono text-xs font-bold text-amber-300 backdrop-blur-xs">
                {activeDepartment?.code || "CSE"} CMS
              </span>
              <span className="text-xs text-neutral-300">
                Department Broadcast &amp; Public Notices
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Announcements &amp; Circulars
            </h1>
            <p className="text-xs text-neutral-300 max-w-xl">
              Publish urgent student circulars, research call-for-proposals, admissions notifications, and event announcements.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#33110e] px-4 py-2.5 text-xs font-bold shadow-xs transition duration-150 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Publish Announcement
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl border border-[#eedfd8] bg-white p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search announcements by keyword, title, or target audience..."
              className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] pl-9 pr-4 py-2 text-xs text-[#33110e] placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-[#85261e] focus:ring-2 focus:ring-[#85261e]/15 transition"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#85261e] text-white shadow-2xs"
                    : "bg-[#fff9f6] text-[#6b5c58] hover:bg-neutral-100 border border-[#eedfd8]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {filteredAnnouncements.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#eedfd8] bg-white p-12 text-center space-y-2">
            <Megaphone className="w-10 h-10 text-neutral-300 mx-auto" />
            <p className="text-sm font-bold text-[#33110e]">No announcements found</p>
            <p className="text-xs text-neutral-500">Try adjusting your search or category filters.</p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-2xs hover:shadow-md transition space-y-2.5 relative group"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold text-[#85261e] bg-[#85261e]/10 border border-[#85261e]/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {ann.category}
                  </span>

                  {ann.target && (
                    <span className="text-[10px] font-semibold text-[#6b5c58] bg-[#fff9f6] border border-[#eedfd8] px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#85261e]" />
                      {ann.target}
                    </span>
                  )}

                  {ann.urgent && (
                    <span className="text-[9.5px] font-extrabold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-red-600" />
                      URGENT NOTICE
                    </span>
                  )}

                  <span className="text-[10.5px] font-mono text-[#6b5c58] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-neutral-400" />
                    {ann.publish_date}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(ann.id, ann.title)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                  title="Delete Announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-[#33110e] leading-snug">
                  {ann.title}
                </h3>
                {ann.body && (
                  <p className="mt-1 text-xs text-neutral-600 leading-relaxed whitespace-pre-line">
                    {ann.body}
                  </p>
                )}
              </div>

              {ann.link_url && (
                <div className="pt-1">
                  <a
                    href={ann.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#85261e] hover:underline"
                  >
                    View Attached Resource / Portal <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ========================================================================= */}
      {/* PUBLISH ANNOUNCEMENT MODAL - SOLID, FULLY STYLED, ZERO TRANSPARENCY */}
      {/* ========================================================================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#eedfd8] bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#eedfd8] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff9f6] border border-[#eedfd8] text-[#85261e] shadow-2xs">
                  <Megaphone className="w-4 h-4 text-[#85261e]" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#33110e]">
                    Publish Department Notice
                  </h2>
                  <p className="text-[11px] text-[#6b5c58]">
                    Broadcast academic notices and circulars across department portals
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-xl text-neutral-400 hover:text-[#33110e] hover:bg-neutral-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAdd} className="space-y-3.5 pt-1">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b5c58] mb-1">
                  Notice Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Schedule for Mid-Semester Practical Examinations (Autumn 2026)"
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#33110e] placeholder:text-neutral-400 focus:bg-white focus:border-[#85261e] focus:outline-none focus:ring-2 focus:ring-[#85261e]/15 transition font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b5c58] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#33110e] focus:bg-white focus:border-[#85261e] focus:outline-none transition cursor-pointer"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Research">Research &amp; Grants</option>
                    <option value="Placement">Placement &amp; Internships</option>
                    <option value="Event">Conference &amp; Workshops</option>
                    <option value="Administrative">Administrative</option>
                    <option value="General">General Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b5c58] mb-1">
                    Target Audience
                  </label>
                  <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#33110e] focus:bg-white focus:border-[#85261e] focus:outline-none transition cursor-pointer"
                  >
                    <option value="All">All Visitors &amp; Students</option>
                    <option value="Faculty Only">Faculty Members Only</option>
                    <option value="Final Year Students">Final Year Students</option>
                    <option value="PhD Scholars">PhD Research Scholars</option>
                    <option value="UG / PG Students">UG &amp; PG Students</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b5c58] mb-1">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#33110e] focus:bg-white focus:border-[#85261e] focus:outline-none transition cursor-pointer"
                  />
                </div>

                <div className="flex items-center sm:pt-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={urgent}
                      onChange={(e) => setUrgent(e.target.checked)}
                      className="h-4 w-4 rounded text-[#85261e] focus:ring-[#85261e] border-[#eedfd8] cursor-pointer"
                    />
                    <span className="text-xs font-bold text-red-700 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                      Mark as Urgent Alert
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b5c58] mb-1">
                  Notice Details / Body
                </label>
                <textarea
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Provide comprehensive details, guidelines, venue, timings, or instructions..."
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-3 text-xs text-[#33110e] placeholder:text-neutral-400 focus:bg-white focus:border-[#85261e] focus:outline-none focus:ring-2 focus:ring-[#85261e]/15 transition font-medium resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b5c58] mb-1">
                  Attachment / Circular URL (Optional)
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://nith.ac.in/uploads/circulars/example.pdf"
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2 text-xs text-[#33110e] placeholder:text-neutral-400 focus:bg-white focus:border-[#85261e] focus:outline-none transition"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#eedfd8]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-[#eedfd8] bg-white hover:bg-neutral-100 px-4 py-2 text-xs font-bold text-[#6b5c58] hover:text-[#33110e] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#85261e] hover:bg-[#a63026] text-white px-5 py-2 text-xs font-bold shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Megaphone className="w-3.5 h-3.5 text-amber-300" />
                  Publish Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
