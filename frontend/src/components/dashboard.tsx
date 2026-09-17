"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import PublicationsChart, { PublicationItem } from "./charts/publications-chart";
import ProjectsChart, { ProjectItem } from "./charts/projects-chart";
import PatentsChart, { PatentItem } from "./charts/patents-chart";
import EventsChart, { EventItem } from "./charts/events-chart";
import { FacultyFilter } from "./faculty-filter";
import { FundingFilter } from "./funding-filter";
import {
  MOCK_FACULTY,
  MOCK_PUBLICATIONS,
  MOCK_PROJECTS,
  MOCK_PATENTS,
  MOCK_EVENTS,
} from "@/lib/mock-data";
import {
  BookOpen,
  FolderGit2,
  Award,
  Calendar,
  Users,
  RotateCcw,
  Sparkles,
  TrendingUp,
  BarChart2,
  Filter,
} from "lucide-react";

interface AnalyticsData {
  facultyData: { id: number; name: string }[];
  publicationsData: PublicationItem[];
  projectsData: ProjectItem[];
  patentsData: PatentItem[];
  eventsData: EventItem[];
}

function buildFallbackAnalytics(): AnalyticsData {
  const facultyData = MOCK_FACULTY.map((f, idx) => ({
    id: idx + 1,
    name: f.full_name,
  }));

  const facultyIdToNum = new Map<string, number>();
  const facultyLegacyToNum = new Map<number, number>();
  MOCK_FACULTY.forEach((f, idx) => {
    const num = idx + 1;
    if (f.id) facultyIdToNum.set(String(f.id), num);
    if (f.legacy_id) facultyLegacyToNum.set(Number(f.legacy_id), num);
  });

  const publicationsData: PublicationItem[] = MOCK_PUBLICATIONS.map((p, idx) => {
    const matchedFac: number[] = [];
    if (Array.isArray(p.faculty_ids)) {
      p.faculty_ids.forEach((fid: string) => {
        if (facultyIdToNum.has(String(fid))) matchedFac.push(facultyIdToNum.get(String(fid))!);
      });
    }
    if (Array.isArray(p.faculty_legacy_ids)) {
      p.faculty_legacy_ids.forEach((lid: number) => {
        if (facultyLegacyToNum.has(Number(lid))) matchedFac.push(facultyLegacyToNum.get(Number(lid))!);
      });
    }
    return {
      year: Number(p.year) || 2024,
      type: p.publication_type,
      indexing: p.indexing || (p.journal_quartile && ["Q1", "Q2", "Q3", "Q4"].includes(p.journal_quartile.toUpperCase().trim()) ? p.journal_quartile.toUpperCase().trim() : "Scopus"),
      facultyIds: matchedFac.length > 0 ? Array.from(new Set(matchedFac)) : [(idx % MOCK_FACULTY.length) + 1],
    };
  });

  const projectsData: ProjectItem[] = MOCK_PROJECTS.map((p, idx) => {
    const matchedFac: number[] = [];
    if (Array.isArray(p.faculty_ids)) {
      p.faculty_ids.forEach((fid: string) => {
        if (facultyIdToNum.has(String(fid))) matchedFac.push(facultyIdToNum.get(String(fid))!);
      });
    }
    if (Array.isArray(p.faculty_legacy_ids)) {
      p.faculty_legacy_ids.forEach((lid: number) => {
        if (facultyLegacyToNum.has(Number(lid))) matchedFac.push(facultyLegacyToNum.get(Number(lid))!);
      });
    }
    return {
      id: idx + 1,
      year: Number(p.year) || 2024,
      status: p.status,
      funding: Number(p.total_sanctioned_amount ?? p.sanctioned_amount ?? 0),
      facultyIds: matchedFac.length > 0 ? Array.from(new Set(matchedFac)) : [(idx % MOCK_FACULTY.length) + 1],
    };
  });

  const patentsData: PatentItem[] = MOCK_PATENTS.map((p, idx) => {
    const matchedFac: number[] = [];
    if (Array.isArray(p.faculty_ids)) {
      p.faculty_ids.forEach((fid: string) => {
        if (facultyIdToNum.has(String(fid))) matchedFac.push(facultyIdToNum.get(String(fid))!);
      });
    }
    if (Array.isArray(p.faculty_legacy_ids)) {
      p.faculty_legacy_ids.forEach((lid: number) => {
        if (facultyLegacyToNum.has(Number(lid))) matchedFac.push(facultyLegacyToNum.get(Number(lid))!);
      });
    }
    return {
      id: idx + 1,
      year: Number(p.year) || 2024,
      status: p.status,
      facultyIds: matchedFac.length > 0 ? Array.from(new Set(matchedFac)) : [(idx % MOCK_FACULTY.length) + 1],
    };
  });

  const eventsData: EventItem[] = MOCK_EVENTS.map((e: any, idx: number) => {
    const matchedFac: number[] = [];
    if (Array.isArray(e.faculty_ids)) {
      e.faculty_ids.forEach((fid: string) => {
        if (facultyIdToNum.has(String(fid))) matchedFac.push(facultyIdToNum.get(String(fid))!);
      });
    }
    if (Array.isArray(e.faculty_legacy_ids)) {
      e.faculty_legacy_ids.forEach((lid: number) => {
        if (facultyLegacyToNum.has(Number(lid))) matchedFac.push(facultyLegacyToNum.get(Number(lid))!);
      });
    }
    return {
      id: idx + 1,
      year: Number(e.year) || 2024,
      type: e.event_type || "Workshop",
      facultyIds: matchedFac.length > 0 ? Array.from(new Set(matchedFac)) : [(idx % MOCK_FACULTY.length) + 1],
    };
  });

  return {
    facultyData,
    publicationsData,
    projectsData,
    patentsData,
    eventsData,
  };
}

export default function Dashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [startYear, setStartYear] = useState<number | null>(null);
  const [endYear, setEndYear] = useState<number | null>(null);
  const [projectStatus, setProjectStatus] = useState("all");
  const [eventType, setEventType] = useState("all");
  const [patentStatus, setPatentStatus] = useState("all");
  const [selectedFaculty, setSelectedFaculty] = useState<number | null>(null);
  const [publicationType, setPublicationType] = useState("all");
  const [fundingRange, setFundingRange] = useState<[number, number]>([0, 10000000]);
  const [allYears, setAllYears] = useState<number[]>([]);
  const [minFunding, setMinFunding] = useState<number>(0);
  const [maxFunding, setMaxFunding] = useState<number>(10000000);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const baseUrl = rawApiUrl.replace(/\/api\/v1\/?$/, "");
        const res = await fetch(`${baseUrl}/api/v1/analytics/get`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.publicationsData) {
            if (isMounted) processIncomingData(json.data);
            return;
          }
        }
      } catch (err) {
        // Fallback gracefully
      }
      if (isMounted) {
        processIncomingData(buildFallbackAnalytics());
      }
    }

    function processIncomingData(incoming: AnalyticsData) {
      const yearsSet = new Set<number>();
      incoming.publicationsData?.forEach((p) => p.year && yearsSet.add(p.year));
      incoming.projectsData?.forEach((p) => p.year && yearsSet.add(p.year));
      incoming.patentsData?.forEach((p) => p.year && yearsSet.add(p.year));
      incoming.eventsData?.forEach((e) => e.year && yearsSet.add(e.year));

      const sortedYears = Array.from(yearsSet).sort((a, b) => a - b);
      const minYear = sortedYears.length > 0 ? sortedYears[0] : 2018;
      const maxYear = sortedYears.length > 0 ? sortedYears[sortedYears.length - 1] : 2026;
      const defaultStart = Math.max(minYear, maxYear - 6);

      const fundings = incoming.projectsData?.map((p) => p.funding || 0) || [0];
      const minF = Math.min(...fundings, 0);
      const maxF = Math.max(...fundings, 10000000);

      setData(incoming);
      setAllYears(sortedYears.length > 0 ? sortedYears : [2020, 2021, 2022, 2023, 2024, 2025, 2026]);
      setStartYear(defaultStart);
      setEndYear(maxYear);
      setMinFunding(minF);
      setMaxFunding(maxF);
      setFundingRange([minF, maxF]);
      setLoading(false);
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleResetFilters = () => {
    if (allYears.length > 0) {
      const minYear = allYears[0];
      const maxYear = allYears[allYears.length - 1];
      setStartYear(Math.max(minYear, maxYear - 6));
      setEndYear(maxYear);
    }
    setPublicationType("all");
    setProjectStatus("all");
    setEventType("all");
    setPatentStatus("all");
    setSelectedFaculty(null);
    setFundingRange([minFunding, maxFunding]);
  };

  const {
    publicationsData = [],
    projectsData = [],
    patentsData = [],
    eventsData = [],
    facultyData = [],
  } = data || {};

  // Filtered publications
  const filteredPublications = useMemo(() => {
    if (!data || startYear === null || endYear === null) return [];
    return publicationsData.filter((item) => {
      const yearMatch = item.year >= startYear && item.year <= endYear;
      const facultyMatch = selectedFaculty ? item.facultyIds?.includes(selectedFaculty) : true;
      const t = (item.type || "").toLowerCase();
      let typeMatch = true;
      if (publicationType === "journal") typeMatch = t.includes("journal");
      else if (publicationType === "conference") typeMatch = t.includes("conf");
      else if (publicationType === "book") typeMatch = t === "book";
      else if (publicationType === "bookchapter") typeMatch = t.includes("chapter");
      return yearMatch && facultyMatch && typeMatch;
    });
  }, [publicationsData, startYear, endYear, selectedFaculty, publicationType, data]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (!data || startYear === null || endYear === null) return [];
    return projectsData.filter((item) => {
      const yearMatch = item.year >= startYear && item.year <= endYear;
      const st = (item.status || "").toLowerCase();
      let statusMatch = true;
      if (projectStatus !== "all") {
        statusMatch = st.includes(projectStatus.toLowerCase());
      }
      const facultyMatch = selectedFaculty ? item.facultyIds?.includes(selectedFaculty) : true;
      const fund = item.funding || 0;
      const fundingMatch = fund >= fundingRange[0] && fund <= fundingRange[1];
      return yearMatch && statusMatch && facultyMatch && fundingMatch;
    });
  }, [projectsData, startYear, endYear, projectStatus, selectedFaculty, fundingRange, data]);

  // Filtered patents
  const filteredPatents = useMemo(() => {
    if (!data || startYear === null || endYear === null) return [];
    return patentsData.filter((item) => {
      const yearMatch = item.year >= startYear && item.year <= endYear;
      const st = (item.status || "").toLowerCase();
      let statusMatch = true;
      if (patentStatus !== "all") {
        statusMatch = st.includes(patentStatus.toLowerCase());
      }
      const facultyMatch = selectedFaculty ? item.facultyIds?.includes(selectedFaculty) : true;
      return yearMatch && statusMatch && facultyMatch;
    });
  }, [patentsData, startYear, endYear, patentStatus, selectedFaculty, data]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    if (!data || startYear === null || endYear === null) return [];
    return eventsData.filter((item) => {
      const yearMatch = item.year >= startYear && item.year <= endYear;
      const t = (item.type || "").toLowerCase();
      let typeMatch = true;
      if (eventType === "workshop") typeMatch = t.includes("workshop");
      else if (eventType === "conference") typeMatch = t.includes("conf");
      else if (eventType === "gian") typeMatch = t.includes("gian");
      else if (eventType === "stc") typeMatch = t.includes("stc") || t.includes("fdp");
      const facultyMatch = selectedFaculty ? item.facultyIds?.includes(selectedFaculty) : true;
      return yearMatch && facultyMatch && typeMatch;
    });
  }, [eventsData, startYear, endYear, selectedFaculty, eventType, data]);

  const selectedFacultyObj = selectedFaculty ? facultyData.find((f) => f.id === selectedFaculty) : null;
  const facultyName = selectedFacultyObj ? selectedFacultyObj.name : "All Department Faculty";

  const totalFundingINR = useMemo(() => {
    return filteredProjects.reduce((sum, p) => sum + (p.funding || 0), 0);
  }, [filteredProjects]);

  function formatLakhs(val: number): string {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakhs`;
    return `₹${val.toLocaleString("en-IN")}`;
  }

  if (loading || !data || startYear === null || endYear === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-12 text-center">
        <div className="w-10 h-10 border-3 border-[#eedfd8] border-t-[#85261e] rounded-full animate-spin mb-4" />
        <p className="text-base font-bold text-[#33110e]">Loading Department Analytics Engine...</p>
        <p className="text-xs text-neutral-500 mt-1">Aggregating research publications, grants, patents &amp; events</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#33110e] to-[#85261e] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xs border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-[#eedfd8] mb-3">
              <BarChart2 className="w-3.5 h-3.5" />
              Institutional Research &amp; Academic Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Department Analytics &amp; Research Visualizations
            </h1>
            <p className="mt-1.5 text-sm text-[#eedfd8] max-w-2xl">
              Multi-dimensional analysis across publications, research grants, patents, and academic programs.
              Currently viewing: <span className="font-bold text-white underline decoration-amber-400">{facultyName}</span> ({startYear} - {endYear}).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={handleResetFilters}
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 border-white/30 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl border border-[#eedfd8] p-4 shadow-xs">
          <div className="flex items-center gap-2 text-neutral-500 mb-1">
            <BookOpen className="w-4 h-4 text-[#85261e]" />
            <span className="text-xs font-semibold uppercase tracking-wider">Publications</span>
          </div>
          <div className="text-2xl font-extrabold text-[#33110e]">{filteredPublications.length}</div>
          <p className="text-[11px] text-neutral-500 mt-1">
            {filteredPublications.filter((p) => (p.indexing || "").toLowerCase().includes("sci")).length} SCI /{" "}
            {filteredPublications.filter((p) => (p.indexing || "").toLowerCase().includes("scopus")).length} Scopus
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#eedfd8] p-4 shadow-xs">
          <div className="flex items-center gap-2 text-neutral-500 mb-1">
            <FolderGit2 className="w-4 h-4 text-[#0d9488]" />
            <span className="text-xs font-semibold uppercase tracking-wider">Research Grants</span>
          </div>
          <div className="text-2xl font-extrabold text-[#0d9488]">{formatLakhs(totalFundingINR)}</div>
          <p className="text-[11px] text-neutral-500 mt-1">{filteredProjects.length} Sponsored Projects</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#eedfd8] p-4 shadow-xs">
          <div className="flex items-center gap-2 text-neutral-500 mb-1">
            <Award className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold uppercase tracking-wider">Patents</span>
          </div>
          <div className="text-2xl font-extrabold text-[#33110e]">{filteredPatents.length}</div>
          <p className="text-[11px] text-neutral-500 mt-1">
            {filteredPatents.filter((p) => (p.status || "").toLowerCase().includes("grant")).length} Granted
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#eedfd8] p-4 shadow-xs">
          <div className="flex items-center gap-2 text-neutral-500 mb-1">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold uppercase tracking-wider">Events &amp; FDPs</span>
          </div>
          <div className="text-2xl font-extrabold text-[#33110e]">{filteredEvents.length}</div>
          <p className="text-[11px] text-neutral-500 mt-1">STC, Conferences &amp; GIAN</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#eedfd8] p-4 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 text-neutral-500 mb-1">
            <Users className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-semibold uppercase tracking-wider">Scope</span>
          </div>
          <div className="text-lg font-bold text-[#33110e] truncate">{facultyName}</div>
          <p className="text-[11px] text-neutral-500 mt-1">
            {selectedFaculty ? "Individual Faculty View" : `${facultyData.length} Total Faculty`}
          </p>
        </div>
      </div>

      {/* Filter Control Console */}
      <div className="bg-white rounded-2xl border border-[#eedfd8] shadow-xs p-6">
        <Tabs defaultValue="filters" className="w-full">
          <div className="flex items-center justify-between border-b border-[#eedfd8] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#85261e]" />
              <h2 className="text-sm font-bold text-[#33110e] uppercase tracking-wider">Analytics Filter Console</h2>
            </div>
            <TabsList className="bg-[#faf8f6] p-1 rounded-xl border border-[#eedfd8]">
              <TabsTrigger
                value="filters"
                className="data-[state=active]:bg-[#85261e] data-[state=active]:text-white text-xs font-semibold rounded-lg px-3 py-1.5"
              >
                Time &amp; Publication Filters
              </TabsTrigger>
              <TabsTrigger
                value="advanced"
                className="data-[state=active]:bg-[#85261e] data-[state=active]:text-white text-xs font-semibold rounded-lg px-3 py-1.5"
              >
                Faculty &amp; Funding Filters
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="filters" className="mt-0 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Year Range */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Academic Year Range</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-neutral-400 block mb-1">From Year</span>
                    <Select
                      value={startYear.toString()}
                      onValueChange={(val) => {
                        const y = Number(val);
                        setStartYear(y);
                        if (y > endYear) setEndYear(y);
                      }}
                    >
                      <SelectTrigger className="w-full rounded-xl border-[#eedfd8] bg-[#fff9f6]/50 text-sm font-medium">
                        <SelectValue placeholder="Start Year" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-[#eedfd8]">
                        {allYears.map((y) => (
                          <SelectItem key={`start-${y}`} value={y.toString()}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-400 block mb-1">To Year</span>
                    <Select
                      value={endYear.toString()}
                      onValueChange={(val) => {
                        const y = Number(val);
                        setEndYear(y);
                        if (y < startYear) setStartYear(y);
                      }}
                    >
                      <SelectTrigger className="w-full rounded-xl border-[#eedfd8] bg-[#fff9f6]/50 text-sm font-medium">
                        <SelectValue placeholder="End Year" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-[#eedfd8]">
                        {allYears.map((y) => (
                          <SelectItem key={`end-${y}`} value={y.toString()}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Publication Type */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Publication Type</label>
                <div className="pt-1">
                  <ToggleGroup
                    type="single"
                    value={publicationType}
                    onValueChange={(val) => val && setPublicationType(val)}
                    className="flex flex-wrap bg-[#faf8f6] p-1 rounded-xl border border-[#eedfd8] justify-start"
                  >
                    <ToggleGroupItem
                      value="all"
                      className="data-[state=on]:bg-[#85261e] data-[state=on]:text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                    >
                      All
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="journal"
                      className="data-[state=on]:bg-[#85261e] data-[state=on]:text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                    >
                      Journals
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="conference"
                      className="data-[state=on]:bg-[#85261e] data-[state=on]:text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                    >
                      Conferences
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="book"
                      className="data-[state=on]:bg-[#85261e] data-[state=on]:text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                    >
                      Books
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="bookchapter"
                      className="data-[state=on]:bg-[#85261e] data-[state=on]:text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                    >
                      Chapters
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>

              {/* Project Status */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Project Status</label>
                <div className="pt-1">
                  <ToggleGroup
                    type="single"
                    value={projectStatus}
                    onValueChange={(val) => val && setProjectStatus(val)}
                    className="flex bg-[#faf8f6] p-1 rounded-xl border border-[#eedfd8] justify-start"
                  >
                    <ToggleGroupItem
                      value="all"
                      className="data-[state=on]:bg-[#85261e] data-[state=on]:text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                    >
                      All Statuses
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="Ongoing"
                      className="data-[state=on]:bg-[#0d9488] data-[state=on]:text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                    >
                      Ongoing
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="Completed"
                      className="data-[state=on]:bg-[#85261e] data-[state=on]:text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                    >
                      Completed
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>

              {/* Patent Status */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Patent Status</label>
                <div className="pt-1">
                  <ToggleGroup
                    type="single"
                    value={patentStatus}
                    onValueChange={(val) => val && setPatentStatus(val)}
                    className="flex bg-[#faf8f6] p-1 rounded-xl border border-[#eedfd8] justify-start"
                  >
                    <ToggleGroupItem
                      value="all"
                      className="data-[state=on]:bg-[#85261e] data-[state=on]:text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                    >
                      All Patents
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="Granted"
                      className="data-[state=on]:bg-[#85261e] data-[state=on]:text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                    >
                      Granted
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="Published"
                      className="data-[state=on]:bg-amber-600 data-[state=on]:text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                    >
                      Published / Filed
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="mt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Faculty Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  Filter by Individual Faculty Member
                </label>
                <FacultyFilter
                  selectedFaculty={selectedFaculty}
                  onSelectFaculty={setSelectedFaculty}
                  facultyData={facultyData}
                />
                <p className="text-[11px] text-neutral-400">
                  Select a faculty member to isolate their personal research output and grants across all charts.
                </p>
              </div>

              {/* Funding Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  Project Sanctioned Funding Range
                </label>
                <FundingFilter
                  fundingRange={fundingRange}
                  onFundingRangeChange={setFundingRange}
                  min={minFunding}
                  max={maxFunding}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Publications Chart */}
        <Card className="rounded-2xl border border-[#eedfd8] shadow-xs bg-white overflow-hidden">
          <CardHeader className="border-b border-[#eedfd8] bg-[#fff9f6] py-4 px-6 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-[#33110e] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#85261e]" />
                {selectedFaculty ? `${facultyName}'s Publications` : "Research Publications Trend"}
              </CardTitle>
              <p className="text-xs text-neutral-500">
                {publicationType === "journal" ? "Journal output by indexing" : "Volume breakdown across types"}
              </p>
            </div>
            <span className="text-xs font-bold text-[#85261e] bg-[#fcf2ef] px-2.5 py-1 rounded-full border border-[#eedfd8]">
              {filteredPublications.length} Records
            </span>
          </CardHeader>
          <CardContent className="p-6">
            <PublicationsChart
              data={filteredPublications}
              facfilter={facultyName}
              startYear={startYear}
              endYear={endYear}
              isJ={publicationType === "journal"}
            />
          </CardContent>
        </Card>

        {/* Projects Chart */}
        <Card className="rounded-2xl border border-[#eedfd8] shadow-xs bg-white overflow-hidden">
          <CardHeader className="border-b border-[#eedfd8] bg-[#fff9f6] py-4 px-6 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-[#33110e] flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-[#0d9488]" />
                {selectedFaculty ? `${facultyName}'s Projects` : "Sponsored Research Projects & Grants"}
              </CardTitle>
              <p className="text-xs text-neutral-500">Active vs completed grants and volume trajectory</p>
            </div>
            <span className="text-xs font-bold text-[#0d9488] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              {formatLakhs(totalFundingINR)}
            </span>
          </CardHeader>
          <CardContent className="p-6">
            <ProjectsChart
              data={filteredProjects}
              facfilter={facultyName}
              startYear={startYear}
              endYear={endYear}
            />
          </CardContent>
        </Card>

        {/* Patents Chart */}
        <Card className="rounded-2xl border border-[#eedfd8] shadow-xs bg-white overflow-hidden">
          <CardHeader className="border-b border-[#eedfd8] bg-[#fff9f6] py-4 px-6 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-[#33110e] flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                {selectedFaculty ? `${facultyName}'s Patents` : "Intellectual Property & Patents"}
              </CardTitle>
              <p className="text-xs text-neutral-500">Granted vs published patent filings</p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              {filteredPatents.length} Patents
            </span>
          </CardHeader>
          <CardContent className="p-6">
            <PatentsChart
              data={filteredPatents}
              facfilter={facultyName}
              startYear={startYear}
              endYear={endYear}
            />
          </CardContent>
        </Card>

        {/* Events Chart */}
        <Card className="rounded-2xl border border-[#eedfd8] shadow-xs bg-white overflow-hidden">
          <CardHeader className="border-b border-[#eedfd8] bg-[#fff9f6] py-4 px-6 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-[#33110e] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                {selectedFaculty ? `${facultyName}'s Events` : "Academic Events, FDPs & Workshops"}
              </CardTitle>
              <p className="text-xs text-neutral-500">Short term courses, conferences and symposiums</p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
              {filteredEvents.length} Events
            </span>
          </CardHeader>
          <CardContent className="p-6">
            <EventsChart
              data={filteredEvents}
              facfilter={facultyName}
              startYear={startYear}
              endYear={endYear}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
