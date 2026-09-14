"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Image as ImageIcon, ExternalLink, RefreshCw, Loader2, Upload, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/lib/utils";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import "@reach/dialog/styles.css";

interface Department {
  id: string;
  name: string;
  code: string;
}

interface HomeSlide {
  id: string;
  department_id: string;
  title: string | null;
  link_url: string | null;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

const DEFAULT_DEPARTMENTS: Department[] = [
  { id: "22222222-2222-2222-2222-222222222222", name: "Computer Science & Engineering", code: "CSE" },
  { id: "33333333-3333-3333-3333-333333333333", name: "Electronics & Communication Engineering", code: "ECE" },
  { id: "44444444-4444-4444-4444-444444444444", name: "Electrical Engineering", code: "EE" },
  { id: "55555555-5555-5555-5555-555555555555", name: "Mechanical Engineering", code: "ME" },
  { id: "66666666-6666-6666-6666-666666666666", name: "Civil Engineering", code: "CE" },
  { id: "77777777-7777-7777-7777-777777777777", name: "Chemical Engineering", code: "CHE" },
];

export default function AdminCarouselPage() {
  const [departments, setDepartments] = useState<Department[]>(DEFAULT_DEPARTMENTS);
  const [selectedDeptId, setSelectedDeptId] = useState<string>("22222222-2222-2222-2222-222222222222");
  const [slides, setSlides] = useState<HomeSlide[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    link_url: "",
    sort_order: 0,
    department_id: "22222222-2222-2222-2222-222222222222",
  });

  // Fetch departments list from API if available
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    fetch(`${apiUrl}/departments`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.data) && data.data.length > 0) {
          setDepartments(data.data);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch slides for selected department
  const fetchSlides = async (deptId: string) => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
      const res = await fetch(`${apiUrl}/cms/home-slides?department_id=${encodeURIComponent(deptId)}`);
      if (res.ok) {
        const json = await res.json();
        const data = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
        setSlides(data);
      } else {
        setSlides([]);
      }
    } catch (err) {
      console.error("Failed to load slides:", err);
      toast.error("Could not load slides from server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides(selectedDeptId);
    setFormData((prev) => ({ ...prev, department_id: selectedDeptId }));
  }, [selectedDeptId]);

  // Handle image file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // Submit new slide
  const handleCreateSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select an image for the slide");
      return;
    }

    try {
      setIsSubmitting(true);
      // 1. Upload to Cloudinary (eqvhqx5q / nith)
      const uploadedImageUrl = await uploadToCloudinary(selectedFile);

      // 2. Post to Go backend API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
      const token = localStorage.getItem("token") || localStorage.getItem("auth_token");

      const payload = {
        department_id: formData.department_id || selectedDeptId,
        title: formData.title.trim() ? formData.title.trim() : null,
        link_url: formData.link_url.trim() ? formData.link_url.trim() : null,
        image_url: uploadedImageUrl,
        sort_order: Number(formData.sort_order) || 0,
        is_active: true,
      };

      const res = await fetch(`${apiUrl}/cms/home-slides`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Server rejected new slide creation");
      }

      toast.success("New event slide uploaded and published to homepage!");
      setIsModalOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setFormData({
        title: "",
        link_url: "",
        sort_order: 0,
        department_id: selectedDeptId,
      });

      // Refresh slide gallery
      fetchSlides(selectedDeptId);
    } catch (err: any) {
      console.error("Slide creation error:", err);
      toast.error(err?.message || "Failed to create slide");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete slide
  const handleDeleteSlide = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide from the homepage?")) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
      const token = localStorage.getItem("token") || localStorage.getItem("auth_token");

      const res = await fetch(`${apiUrl}/cms/home-slides/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        toast.success("Slide removed successfully");
        setSlides((prev) => prev.filter((s) => s.id !== id));
      } else {
        toast.error("Failed to delete slide from server");
      }
    } catch (err) {
      console.error("Delete slide error:", err);
      toast.error("Error deleting slide");
    }
  };

  const currentDept = departments.find((d) => d.id === selectedDeptId);

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Homepage Hero Carousel
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage dynamic event banners and photo highlights shown on the landing page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Department Switcher */}
          <div className="flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-xl shadow-xs">
            <span className="text-xs font-semibold text-muted-foreground">Dept:</span>
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="bg-transparent text-xs font-bold text-foreground focus:outline-hidden cursor-pointer"
            >
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id} className="bg-popover text-popover-foreground">
                  {dept.code} - {dept.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Event Slide
          </button>
        </div>
      </div>

      {/* Info Notice */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          Images added here are stored in <strong>PostgreSQL</strong> and your Cloudinary media library (
          <code>eqvhqx5q/nith</code>). They update in real-time on the public homepage for{" "}
          <strong>{currentDept?.name || "the selected department"}</strong>.
        </span>
      </div>

      {/* Gallery / List of Slides */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading departmental slides...</p>
        </div>
      ) : slides.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-border bg-card/50 flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground">
            <ImageIcon className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-foreground">No slides published yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            There are currently no custom event banners for this department. Click below to add your first photo.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-2 flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-xl transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add First Slide
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className="group rounded-2xl border border-border bg-card overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col"
            >
              {/* Image Preview Banner */}
              <div className="relative aspect-16/9 w-full bg-black/90 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image_url}
                  alt={slide.title || "Event slide"}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/nithbg12.jpg";
                  }}
                />
                <span className="absolute top-2.5 left-2.5 bg-black/70 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                  Slide #{idx + 1}
                </span>

                {/* Delete Button overlay */}
                <button
                  onClick={() => handleDeleteSlide(slide.id)}
                  title="Delete slide"
                  className="absolute top-2.5 right-2.5 bg-red-600/90 hover:bg-red-700 text-white p-1.5 rounded-lg shadow-sm transition active:scale-90 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Slide Meta */}
              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-foreground line-clamp-1">
                    {slide.title || "Untitled Department Event"}
                  </h4>
                  {slide.link_url ? (
                    <a
                      href={slide.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-xs text-primary hover:underline flex items-center gap-1 line-clamp-1"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      {slide.link_url}
                    </a>
                  ) : (
                    <p className="mt-1 text-[11px] text-muted-foreground">No target URL</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[10px] text-muted-foreground font-mono">
                  <span>Order: {slide.sort_order}</span>
                  <span>{new Date(slide.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Slide Modal */}
      <Dialog isOpen={isModalOpen} onDismiss={() => !isSubmitting && setIsModalOpen(false)}>
        <DialogOverlay className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[1500] flex items-center justify-center p-4">
          <DialogContent
            aria-label="Add Event Slide"
            className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full border border-gray-100 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Add New Event Slide</h3>
                <p className="text-xs text-gray-500">Upload a photo to appear on the department landing page.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSlide} className="p-6 space-y-4">
              {/* Image Upload Area */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Event Photo / Banner Image <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-2xl p-4 text-center cursor-pointer transition bg-gray-50/50 hover:bg-blue-50/20"
                >
                  {previewUrl ? (
                    <div className="relative aspect-16/9 w-full rounded-xl overflow-hidden shadow-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewUrl} alt="Upload preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-xs font-semibold opacity-0 hover:opacity-100 transition">
                        Click to change photo
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-semibold text-gray-700">Click to select photo from device</p>
                      <p className="text-[10px] text-gray-400">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Title / Caption */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Slide Title / Event Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5th International Conference on AI (MIND 2023)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Link URL */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Target Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://nith.ac.in/events/... or /news/announcements"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>

              {/* Department & Order Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Department</label>
                  <select
                    value={formData.department_id}
                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden bg-white"
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.code} - {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Sort Priority</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading to Cloudinary...
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" /> Publish Slide
                    </>
                  )}
                </button>
              </div>
            </form>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
    </div>
  );
}
