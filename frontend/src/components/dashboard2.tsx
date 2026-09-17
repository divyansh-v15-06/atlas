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
import { FundingFilter } from "./funding-filter";
import {
  MOCK_FACULTY,
  MOCK_PUBLICATIONS,
  MOCK_PROJECTS,
  MOCK_PATENTS,
  MOCK_EVENTS,
} from "@/lib/mock-data";
import { getStoredData } from "@/lib/faculty-storage";
import {
  BookOpen,
  FolderGit2,
  Award,
  Calendar,
  FileDown,
  RotateCcw,
  Sparkles,
  BarChart2,
  UserCheck,
  CheckCircle2,
  Filter,
} from "lucide-react";

interface AnalyticsData {
  publicationsData: PublicationItem[];
  projectsData: ProjectItem[];
  patentsData: PatentItem[];
  eventsData: EventItem[];
}

function buildFacultyFallbackAnalytics(faculty: any): AnalyticsData {
  if (!faculty) {
    return {
      publicationsData: [],
      projectsData: [],
      patentsData: [],
      eventsData: [],
    };
  }

  const legacyId = faculty.legacy_id;
  const facId = faculty.id;

  // 1. Personal Publications
  const basePubs = Array.isArray(faculty.publications) && faculty.publications.length > 0 
    ? faculty.publications 
    : [];

  const matchedPubs = MOCK_PUBLICATIONS.filter((p: any) => {
    if (facId && p.faculty_ids?.includes(facId)) return true;
    if (legacyId && p.faculty_legacy_ids?.includes(legacyId)) return true;
    return false;
  });

  const combinedPubs = basePubs.length > 0 ? basePubs : matchedPubs;
  const storedPubs = getStoredData(faculty, "publications", combinedPubs);

  const publicationsData: PublicationItem[] = storedPubs.map((p: any) => ({
    year: Number(p.year) || 2024,
    type: p.publication_type || p.type || "Journal",
    indexing: p.indexing || (p.journal_quartile && ["Q1", "Q2", "Q3", "Q4"].includes(p.journal_quartile.toUpperCase().trim()) ? p.journal_quartile.toUpperCase().trim() : "Scopus"),
  }));

  // 2. Personal Projects
  const baseProjects = Array.isArray(faculty.projects) && faculty.projects.length > 0 
    ? faculty.projects 
    : [];

  const matchedProjects = MOCK_PROJECTS.filter((p: any) => {
    if (facId && p.faculty_ids?.includes(facId)) return true;
    if (legacyId && p.faculty_legacy_ids && p.faculty_legacy_ids.includes(legacyId)) return true;
    return false;
  });

  const combinedProjects = baseProjects.length > 0 ? baseProjects : matchedProjects;
  const storedProjects = getStoredData(faculty, "projects", combinedProjects);

  const projectsData: ProjectItem[] = storedProjects.map((p: any, idx: number) => ({
    id: p.id || idx + 1,
    year: Number(p.year || (p.start_date ? p.start_date.split("-")[0] : 2024)) || 2024,
    status: p.status || "Ongoing",
    funding: Number(p.total_sanctioned_amount || p.funding || 1500000),
  }));

  // 3. Personal Patents
  const basePatents = Array.isArray(faculty.patents) && faculty.patents.length > 0 
    ? faculty.patents 
    : [];

  const matchedPatents = MOCK_PATENTS.filter((p: any) => {
    if (facId && p.faculty_ids?.includes(facId)) return true;
    if (legacyId && p.faculty_legacy_ids && p.faculty_legacy_ids.includes(legacyId)) return true;
    return false;
  });

  const combinedPatents = basePatents.length > 0 ? basePatents : matchedPatents;
  const storedPatents = getStoredData(faculty, "patents", combinedPatents);

  const patentsData: PatentItem[] = storedPatents.map((p: any, idx: number) => ({
    id: p.id || idx + 1,
    year: Number(p.year || (p.filing_date ? p.filing_date.split("-")[0] : 2023)) || 2023,
    status: p.status || "Granted",
  }));

  // 4. Personal Events
  const baseEvents = Array.isArray(faculty.events) && faculty.events.length > 0 
    ? faculty.events 
    : [];

  const matchedEvents = MOCK_EVENTS.filter((e: any) => {
    if (facId && e.faculty_ids?.includes(facId)) return true;
    if (legacyId && e.faculty_legacy_ids && e.faculty_legacy_ids.includes(legacyId)) return true;
    return false;
  });

  const combinedEvents = baseEvents.length > 0 ? baseEvents : matchedEvents;
  const storedEvents = getStoredData(faculty, "events", combinedEvents);

  const eventsData: EventItem[] = storedEvents.map((e: any, idx: number) => ({
    id: e.id || idx + 1,
    year: Number(e.year || (e.start_date ? e.start_date.split("-")[0] : 2024)) || 2024,
    type: e.event_type || e.type || "Workshop",
  }));

  return {
    publicationsData,
    projectsData,
    patentsData,
    eventsData,
  };
}

export default function Dashboard2({ faculty }: { faculty?: any }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [startYear, setStartYear] = useState<number | null>(null);
  const [endYear, setEndYear] = useState<number | null>(null);
  const [projectStatus, setProjectStatus] = useState("all");
  const [eventType, setEventType] = useState("all");
  const [patentStatus, setPatentStatus] = useState("all");
  const [publicationType, setPublicationType] = useState("all");
  const [fundingRange, setFundingRange] = useState<[number, number]>([0, 10000000]);
  const [allYears, setAllYears] = useState<number[]>([]);
  const [minFunding, setMinFunding] = useState<number>(0);
  const [maxFunding, setMaxFunding] = useState<number>(10000000);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("auth_user");
      if (raw) {
        try {
          setCurrentUser(JSON.parse(raw));
        } catch {}
      }
    }
  }, []);

  const activeFaculty = useMemo(() => {
    if (faculty) return faculty;
    if (currentUser) {
      const match = MOCK_FACULTY.find(
        (f) =>
          f.employee_code?.toLowerCase() === currentUser.employee_code?.toLowerCase() ||
          f.email?.toLowerCase() === currentUser.email?.toLowerCase() ||
          f.id === currentUser.faculty_id ||
          f.id === currentUser.id
      );
      if (match) return match;
    }
    return MOCK_FACULTY[0];
  }, [faculty, currentUser]);

  const username = activeFaculty.full_name || "Faculty Member";
  const userId = activeFaculty.employee_code || activeFaculty.id || "101";

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const baseUrl = rawApiUrl.replace(/\/api\/v1\/?$/, "");
        const res = await fetch(`${baseUrl}/api/v1/analytics/get?name=${encodeURIComponent(username)}&id=${encodeURIComponent(userId)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.publicationsData && json.data.publicationsData.length > 0) {
            const facEntry = json.data.facultyData?.find(
              (f: any) =>
                f.name?.toLowerCase() === activeFaculty.full_name?.toLowerCase() ||
                String(f.id) === String(activeFaculty.legacy_id)
            );
            const mySeqId = facEntry?.id;

            const filteredPubs = mySeqId
              ? json.data.publicationsData.filter((p: any) => p.facultyIds?.includes(mySeqId))
              : json.data.publicationsData;
            const filteredProjects = mySeqId
              ? json.data.projectsData?.filter((p: any) => p.facultyIds?.includes(mySeqId)) || []
              : json.data.projectsData || [];
            const filteredPatents = mySeqId
              ? json.data.patentsData?.filter((p: any) => p.facultyIds?.includes(mySeqId)) || []
              : json.data.patentsData || [];
            const filteredEvents = mySeqId
              ? json.data.eventsData?.filter((e: any) => e.facultyIds?.includes(mySeqId)) || []
              : json.data.eventsData || [];

            if (filteredPubs.length > 0 || filteredProjects.length > 0 || filteredPatents.length > 0) {
              if (isMounted) {
                processIncomingData({
                  publicationsData: filteredPubs,
                  projectsData: filteredProjects,
                  patentsData: filteredPatents,
                  eventsData: filteredEvents,
                });
              }
              return;
            }
          }
        }
      } catch (err) {
        // Fallback gracefully
      }
      if (isMounted) {
        processIncomingData(buildFacultyFallbackAnalytics(activeFaculty));
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
      const defaultStart = minYear;

      const fundings = incoming.projectsData?.map((p) => p.funding || 0) || [0];
      const minF = Math.min(...fundings, 0);
      const maxF = Math.max(...fundings, 10000000);

      setData(incoming);
      setAllYears(sortedYears.length > 0 ? sortedYears : [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]);
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
  }, [username, userId, activeFaculty]);

  const handleDownloadCV = (format: "docx" | "pdf") => {
    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const baseUrl = rawApiUrl.replace(/\/api\/v1\/?$/, "");
    const downloadUrl = `${baseUrl}/api/v1/resume/download-resume?uniqueId=${encodeURIComponent(activeFaculty.employee_code || activeFaculty.id)}&format=${format}`;
    window.open(downloadUrl, "_blank");
  };

  const handleResetFilters = () => {
    if (allYears.length > 0) {
      setStartYear(allYears[0]);
      setEndYear(allYears[allYears.length - 1]);
    }
    setPublicationType("all");
    setProjectStatus("all");
    setEventType("all");
    setPatentStatus("all");
    setFundingRange([minFunding, maxFunding]);
  };

  const {
    publicationsData = [],
    projectsData = [],
    patentsData = [],
    eventsData = [],
  } = data || {};

  // Filtered publications
  const filteredPublications = useMemo(() => {
    if (!data || startYear === null || endYear === null) return [];
    return publicationsData.filter((item) => {
      const yearMatch = item.year >= startYear && item.year <= endYear;
      const t = (item.type || "").toLowerCase();
      let typeMatch = true;
      if (publicationType === "journal") typeMatch = t.includes("journal");
      else if (publicationType === "conference") typeMatch = t.includes("conf");
      else if (publicationType === "book") typeMatch = t === "book";
      else if (publicationType === "bookchapter") typeMatch = t.includes("chapter");
      return yearMatch && typeMatch;
    });
  }, [publicationsData, startYear, endYear, publicationType, data]);

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
      const fund = item.funding || 0;
      const fundingMatch = fund >= fundingRange[0] && fund <= fundingRange[1];
      return yearMatch && statusMatch && fundingMatch;
    });
  }, [projectsData, startYear, endYear, projectStatus, fundingRange, data]);

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
      return yearMatch && statusMatch;
    });
  }, [patentsData, startYear, endYear, patentStatus, data]);

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
      return yearMatch && typeMatch;
    });
  }, [eventsData, startYear, endYear, eventType, data]);

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
        <p className="text-base font-bold text-[#33110e]">Loading Faculty Research Intelligence...</p>
        <p className="text-xs text-neutral-500 mt-1">Aggregating career publication trajectory and grant metrics</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 lg:p-8 bg-[#faf8f6] min-h-screen">
      {/* Faculty Hero Banner */}
      <div className="bg-gradient-to-r from-[#33110e] to-[#85261e] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xs border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-[#eedfd8] mb-3">
              <UserCheck className="w-3.5 h-3.5" />
              Faculty Personal Analytics Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Research Dashboard &amp; Career Trajectory
            </h1>
            <p className="mt-1.5 text-sm text-[#eedfd8] max-w-2xl">
              Welcome back, <span className="font-bold text-white underline decoration-amber-400">{username}</span>.
              Tracking publications, funded research grants, patents, and academic development from {startYear} to {endYear}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              onClick={() => handleDownloadCV("pdf")}
              variant="outline"
              size="sm"
              className="bg-white hover:bg-neutral-100 text-[#85261e] font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs border-0"
            >
              <FileDown className="w-3.5 h-3.5" />
              Download CV (PDF)
            </Button>
            <Button
              onClick={() => handleDownloadCV("docx")}
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 border-white/30 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5"
            >
              <FileDown className="w-3.5 h-3.5" />
              Download CV (DOCX)
            </Button>
            <Button
              onClick={handleResetFilters}
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white text-xs font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset
            </Button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#eedfd8] p-5 shadow-xs">
          <div className="flex items-center gap-2 text-neutral-500 mb-1.5">
            <BookOpen className="w-4 h-4 text-[#85261e]" />
            <span className="text-xs font-bold uppercase tracking-wider">Publications</span>
          </div>
          <div className="text-3xl font-extrabold text-[#33110e]">{filteredPublications.length}</div>
          <p className="text-xs text-neutral-500 mt-1">
            {filteredPublications.filter((p) => (p.indexing || "").toLowerCase().includes("sci")).length} SCI /{" "}
            {filteredPublications.filter((p) => (p.indexing || "").toLowerCase().includes("scopus")).length} Scopus
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#eedfd8] p-5 shadow-xs">
          <div className="flex items-center gap-2 text-neutral-500 mb-1.5">
            <FolderGit2 className="w-4 h-4 text-[#0d9488]" />
            <span className="text-xs font-bold uppercase tracking-wider">Research Grants</span>
          </div>
          <div className="text-3xl font-extrabold text-[#0d9488]">{formatLakhs(totalFundingINR)}</div>
          <p className="text-xs text-neutral-500 mt-1">{filteredProjects.length} Sponsored Projects</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#eedfd8] p-5 shadow-xs">
          <div className="flex items-center gap-2 text-neutral-500 mb-1.5">
            <Award className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold uppercase tracking-wider">Patents</span>
          </div>
          <div className="text-3xl font-extrabold text-[#33110e]">{filteredPatents.length}</div>
          <p className="text-xs text-neutral-500 mt-1">
            {filteredPatents.filter((p) => (p.status || "").toLowerCase().includes("grant")).length} Granted
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#eedfd8] p-5 shadow-xs">
          <div className="flex items-center gap-2 text-neutral-500 mb-1.5">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-wider">FDPs &amp; Events</span>
          </div>
          <div className="text-3xl font-extrabold text-[#33110e]">{filteredEvents.length}</div>
          <p className="text-xs text-neutral-500 mt-1">Organized / Attended</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#eedfd8] shadow-xs p-6">
        <div className="flex items-center gap-2 border-b border-[#eedfd8] pb-3 mb-4">
          <Filter className="w-4 h-4 text-[#85261e]" />
          <h2 className="text-sm font-bold text-[#33110e] uppercase tracking-wider">Filter Personal Trajectory</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Year Range */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Academic Year Span</label>
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={startYear.toString()}
                onValueChange={(val) => {
                  const y = Number(val);
                  setStartYear(y);
                  if (y > endYear) setEndYear(y);
                }}
              >
                <SelectTrigger className="w-full rounded-xl border-[#eedfd8] bg-[#fff9f6]/50 text-sm font-medium">
                  <SelectValue placeholder="From Year" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-[#eedfd8]">
                  {allYears.map((y) => (
                    <SelectItem key={`start-${y}`} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={endYear.toString()}
                onValueChange={(val) => {
                  const y = Number(val);
                  setEndYear(y);
                  if (y < startYear) setStartYear(y);
                }}
              >
                <SelectTrigger className="w-full rounded-xl border-[#eedfd8] bg-[#fff9f6]/50 text-sm font-medium">
                  <SelectValue placeholder="To Year" />
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

          {/* Publication Type */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Publication Type</label>
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
      </div>

      {/* 4 Interactive Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Publications Chart */}
        <Card className="rounded-2xl border border-[#eedfd8] shadow-xs bg-white overflow-hidden">
          <CardHeader className="border-b border-[#eedfd8] bg-[#fff9f6] py-4 px-6 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-[#33110e] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#85261e]" />
                Publications Output Growth
              </CardTitle>
              <p className="text-xs text-neutral-500">Peer-reviewed publications over career</p>
            </div>
            <span className="text-xs font-bold text-[#85261e] bg-[#fcf2ef] px-2.5 py-1 rounded-full border border-[#eedfd8]">
              {filteredPublications.length} Papers
            </span>
          </CardHeader>
          <CardContent className="p-6">
            <PublicationsChart
              data={filteredPublications}
              facfilter={username}
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
                Sponsored Research Grants
              </CardTitle>
              <p className="text-xs text-neutral-500">Project funding acquired across agencies</p>
            </div>
            <span className="text-xs font-bold text-[#0d9488] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              {formatLakhs(totalFundingINR)}
            </span>
          </CardHeader>
          <CardContent className="p-6">
            <ProjectsChart
              data={filteredProjects}
              facfilter={username}
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
                Patents &amp; Intellectual Property
              </CardTitle>
              <p className="text-xs text-neutral-500">Patents published and granted</p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              {filteredPatents.length} Patents
            </span>
          </CardHeader>
          <CardContent className="p-6">
            <PatentsChart
              data={filteredPatents}
              facfilter={username}
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
                Faculty Events &amp; Academic Leadership
              </CardTitle>
              <p className="text-xs text-neutral-500">FDPs, STCs, workshops organized/participated</p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
              {filteredEvents.length} Events
            </span>
          </CardHeader>
          <CardContent className="p-6">
            <EventsChart
              data={filteredEvents}
              facfilter={username}
              startYear={startYear}
              endYear={endYear}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
