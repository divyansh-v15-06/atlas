"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Trophy,
  Plus,
  Trash2,
  Edit,
  Search,
  X,
  Award,
  Calendar,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_POSTS } from "@/lib/mock-data";
import { Post } from "@/lib/types";

export default function AdminAchievementsPage() {
  const [posts, setPosts] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nith_admin_achievements");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return MOCK_POSTS.map((p, i) => ({
      ...p,
      recipient: i === 0 ? "Prof. Lalit Kumar Awasthi" : "Student Hackathon Team",
      date: "2024-11-20",
    }));
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("nith_admin_achievements", JSON.stringify(posts));
    }
  }, [posts]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Faculty Achievement",
    recipient: "",
    body: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleOpenAdd = () => {
    setModalMode("add");
    setEditingItem(null);
    setFormData({
      title: "",
      category: "Faculty Achievement",
      recipient: "",
      body: "",
      date: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setModalMode("edit");
    setEditingItem(p);
    setFormData({
      title: p.title || "",
      category: p.category || "Faculty Achievement",
      recipient: p.recipient || "",
      body: p.body || "",
      date: p.date || p.publish_date || new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Achievement Title is required");
      return;
    }

    if (modalMode === "add") {
      const newPost = {
        id: `post-${Date.now()}`,
        department_id: "22222222-2222-2222-2222-222222222222",
        title: formData.title.trim(),
        category: formData.category,
        recipient: formData.recipient.trim(),
        body: formData.body.trim(),
        date: formData.date,
        is_published: true,
      };
      setPosts([newPost, ...posts]);
      toast.success("Achievement posted successfully");
    } else if (editingItem) {
      setPosts(
        posts.map((p) =>
          p.id === editingItem.id
            ? {
                ...p,
                title: formData.title.trim(),
                category: formData.category,
                recipient: formData.recipient.trim(),
                body: formData.body.trim(),
                date: formData.date,
              }
            : p
        )
      );
      toast.success("Achievement updated");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to remove "${title}"?`)) {
      setPosts(posts.filter((p) => p.id !== id));
      toast.success("Achievement record removed");
    }
  };

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        p.title?.toLowerCase().includes(q) ||
        p.body?.toLowerCase().includes(q) ||
        p.recipient?.toLowerCase().includes(q);

      const matchesCat = categoryFilter === "ALL" || p.category === categoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [posts, search, categoryFilter]);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5" /> Institutional Pride
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#1c110c] tracking-tight">
            News &amp; Achievements
          </h1>
          <p className="mt-1 text-sm text-[#5c4033]">
            Highlight prominent faculty honors, student competition wins, and national recognitions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#33110e] hover:bg-[#85261e] px-4 py-2.5 text-xs font-bold text-white transition shadow-2xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Post Achievement
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="rounded-2xl border border-[#eedfd8] bg-white p-4 shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#85261e]/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, recipient, or keyword..."
            className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] pl-10 pr-4 py-2 text-sm text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-none focus:ring-1 focus:ring-[#85261e]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto">
          <span className="text-xs font-bold text-[#5c4033]">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-[#eedfd8] bg-white px-3 py-1.5 text-xs font-bold text-[#1c110c] focus:outline-none focus:border-[#85261e]"
          >
            <option value="ALL">All Categories</option>
            <option value="Faculty Achievement">Faculty Achievement</option>
            <option value="Student Achievement">Student Achievement</option>
            <option value="Research & Grants">Research &amp; Grants</option>
            <option value="Department Recognition">Department Recognition</option>
          </select>
        </div>
      </div>

      {/* Achievements List */}
      <div className="space-y-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-[#eedfd8] bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:border-[#85261e]/50 transition"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] px-3 py-0.5 text-xs font-bold">
                  {p.category}
                </span>
                {p.date && (
                  <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {p.date}
                  </span>
                )}
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-[#1c110c] leading-snug">
                {p.title}
              </h3>
              {p.recipient && (
                <p className="text-xs font-bold text-[#85261e]">
                  Conferred To / Recipient: {p.recipient}
                </p>
              )}
              <p className="text-xs sm:text-sm text-[#5c4033] leading-relaxed line-clamp-3">
                {p.body}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start">
              <button
                type="button"
                onClick={() => handleOpenEdit(p)}
                className="p-1.5 rounded-lg border border-[#eedfd8] text-neutral-600 hover:bg-[#33110e] hover:text-white transition cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(p.id, p.title)}
                className="p-1.5 rounded-lg border border-[#eedfd8] text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT MODAL (Parity with adminModalAchievements) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#eedfd8] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-[#fff9f6] border-b border-[#eedfd8] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-[#85261e] tracking-wider">
                  Achievement Showcase
                </span>
                <h3 className="text-lg font-black text-[#1c110c]">
                  {modalMode === "add" ? "Publish Achievement" : "Edit Achievement"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:bg-[#eedfd8] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                  Achievement Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Best Paper Award at IEEE INFOCOM 2024"
                  className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                  >
                    <option value="Faculty Achievement">Faculty Achievement</option>
                    <option value="Student Achievement">Student Achievement</option>
                    <option value="Research & Grants">Research &amp; Grants</option>
                    <option value="Department Recognition">Department Recognition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                  Recipient / Conferred To
                </label>
                <input
                  type="text"
                  value={formData.recipient}
                  onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                  placeholder="e.g. Prof. Lalit Kumar Awasthi / Team Algorun"
                  className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                  Description &amp; Citation Details
                </label>
                <textarea
                  rows={4}
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Key highlights, organizing body, and significance of the recognition..."
                  className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#eedfd8]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#eedfd8] text-xs font-bold text-[#5c4033] hover:bg-[#fff9f6] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  {modalMode === "add" ? "Post Achievement" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
