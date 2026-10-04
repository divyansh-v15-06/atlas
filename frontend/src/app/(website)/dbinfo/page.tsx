"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Database,
  Layers,
  Table as TableIcon,
  Workflow,
  Search,
  Key,
  Link2,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu,
  Sparkles,
  Server,
  ArrowRight,
  BookOpen,
  Users,
  Award,
  Calendar,
  Building2,
  Lock,
} from "lucide-react";
import MermaidViewer from "@/components/dbinfo/MermaidViewer";
import {
  DATABASE_SCHEMA_TABLES,
  MERMAID_DIAGRAMS,
  SchemaTable,
} from "@/lib/database-schema-data";

type TabMode = "diagrams" | "dictionary" | "architecture" | "sql";
type DiagramDomain = "core" | "organisation" | "faculty" | "research";

export default function DatabaseInfoPage() {
  const [activeTab, setActiveTab] = useState<TabMode>("diagrams");
  const [selectedDomain, setSelectedDomain] = useState<DiagramDomain>("core");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({
    faculty: true,
    publications: true,
    publication_authors: true,
  });

  const toggleTableExpand = (tableName: string) => {
    setExpandedTables((prev) => ({
      ...prev,
      [tableName]: !prev[tableName],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    DATABASE_SCHEMA_TABLES.forEach((t) => (all[t.name] = true));
    setExpandedTables(all);
  };

  const collapseAll = () => {
    setExpandedTables({});
  };

  const filteredTables = useMemo(() => {
    return DATABASE_SCHEMA_TABLES.filter((table) => {
      const matchesCategory =
        categoryFilter === "ALL" || table.category === categoryFilter;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const inTableName = table.name.toLowerCase().includes(q);
      const inTableDesc = table.description.toLowerCase().includes(q);
      const inColumns = table.columns.some(
        (col) =>
          col.name.toLowerCase().includes(q) ||
          col.type.toLowerCase().includes(q) ||
          col.description.toLowerCase().includes(q)
      );

      return inTableName || inTableDesc || inColumns;
    });
  }, [categoryFilter, searchQuery]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(DATABASE_SCHEMA_TABLES.map((t) => t.category))
    );
  }, []);

  const totalColumns = useMemo(() => {
    return DATABASE_SCHEMA_TABLES.reduce((acc, t) => acc + t.columns.length, 0);
  }, []);

  const totalForeignKeys = useMemo(() => {
    return DATABASE_SCHEMA_TABLES.reduce((acc, t) => acc + t.foreignKeys.length, 0);
  }, []);

  const getDomainDiagramCode = () => {
    switch (selectedDomain) {
      case "organisation":
        return MERMAID_DIAGRAMS.organisation;
      case "faculty":
        return MERMAID_DIAGRAMS.faculty;
      case "research":
        return MERMAID_DIAGRAMS.research;
      default:
        return MERMAID_DIAGRAMS.core;
    }
  };

  const getDomainTitle = () => {
    switch (selectedDomain) {
      case "organisation":
        return "1. Institutional Hierarchy & Organizational Structure";
      case "faculty":
        return "2. Faculty Entity & Satellite CV Modules";
      case "research":
        return "3. Research, Publications & M:N Co-Authorship";
      default:
        return "High-Level Core Entity-Relationship Diagram";
    }
  };

  return (
    <div className="min-h-screen bg-[#faf6f3] text-[#1c110c] font-sans selection:bg-[#85261e] selection:text-white pb-20">
      {/* 1. HERO HEADER */}
      <section className="bg-gradient-to-b from-[#33110e] via-[#4a1914] to-[#85261e] text-white pt-16 pb-14 px-4 sm:px-6 relative overflow-hidden shadow-md">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-white/15 border border-white/20 text-amber-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-xs">
              <Database className="w-3.5 h-3.5 text-amber-300" />
              PostgreSQL 16 Engine
            </span>
            <span className="bg-white/10 text-white/90 text-xs font-medium px-3 py-1 rounded-full border border-white/15">
              Strict 3NF Normalization
            </span>
            <span className="bg-white/10 text-white/90 text-xs font-medium px-3 py-1 rounded-full border border-white/15">
              UUIDv4 Primary Keys
            </span>
            <span className="bg-emerald-500/20 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-400/30">
              ACID Compliant & Dual-Sync
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight">
              Database Schema &amp; ER Architecture
            </h1>
            <p className="text-sm sm:text-base text-neutral-200 max-w-3xl leading-relaxed">
              Explore the complete relational data model powering the National Institute of Technology Hamirpur portal. 
              Featuring interactive Mermaid ER diagrams, a comprehensive searchable data dictionary, and dual-persistence synchronization specifications.
            </p>
          </div>

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-2xs">
              <p className="text-xs uppercase font-bold text-neutral-300 tracking-wider">Cataloged Tables</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-200 mt-1">{DATABASE_SCHEMA_TABLES.length}</p>
              <p className="text-[11px] text-neutral-300 mt-0.5">Core &amp; Satellite Entities</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-2xs">
              <p className="text-xs uppercase font-bold text-neutral-300 tracking-wider">Schema Columns</p>
              <p className="text-2xl sm:text-3xl font-black text-white mt-1">{totalColumns}</p>
              <p className="text-[11px] text-neutral-300 mt-0.5">Fully Typed Attributes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-2xs">
              <p className="text-xs uppercase font-bold text-neutral-300 tracking-wider">Foreign Keys</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-300 mt-1">{totalForeignKeys}</p>
              <p className="text-[11px] text-neutral-300 mt-0.5">Relational Constraints</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-2xs">
              <p className="text-xs uppercase font-bold text-neutral-300 tracking-wider">Audit Security</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-300 mt-1">100%</p>
              <p className="text-[11px] text-neutral-300 mt-0.5">Automated Triggers</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NAVIGATION BAR / VIEW TABS */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#eedfd8] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between overflow-x-auto no-scrollbar py-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("diagrams")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === "diagrams"
                  ? "bg-[#33110e] text-white shadow-xs"
                  : "text-neutral-600 hover:text-[#33110e] hover:bg-[#fff9f6]"
              }`}
            >
              <Layers className="w-4 h-4 text-amber-300" />
              <span>Mermaid ER Diagrams</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("dictionary")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === "dictionary"
                  ? "bg-[#33110e] text-white shadow-xs"
                  : "text-neutral-600 hover:text-[#33110e] hover:bg-[#fff9f6]"
              }`}
            >
              <TableIcon className="w-4 h-4 text-[#85261e]" />
              <span>Data Dictionary</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                {DATABASE_SCHEMA_TABLES.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("architecture")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === "architecture"
                  ? "bg-[#33110e] text-white shadow-xs"
                  : "text-neutral-600 hover:text-[#33110e] hover:bg-[#fff9f6]"
              }`}
            >
              <Workflow className="w-4 h-4 text-[#85261e]" />
              <span>Dual-Sync Pipeline</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("sql")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === "sql"
                  ? "bg-[#33110e] text-white shadow-xs"
                  : "text-neutral-600 hover:text-[#33110e] hover:bg-[#fff9f6]"
              }`}
            >
              <FileCode className="w-4 h-4 text-[#85261e]" />
              <span>Migration Specs</span>
            </button>
          </div>

          <Link
            href="/"
            className="text-xs font-bold text-[#85261e] hover:underline flex items-center gap-1 shrink-0 ml-4"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* 3. MAIN CONTENT CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        {/* ========================================================================= */}
        {/* TAB 1: MERMAID ER DIAGRAMS */}
        {/* ========================================================================= */}
        {activeTab === "diagrams" && (
          <div className="space-y-6">
            {/* Domain Switcher Pill Strip */}
            <div className="bg-white rounded-2xl border border-[#eedfd8] p-2 shadow-xs flex flex-wrap items-center gap-2 justify-between">
              <span className="text-xs font-bold text-neutral-500 uppercase px-3 tracking-wider">
                Select Architecture Subdomain:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: "core", label: "Core Schema Overview", icon: Sparkles },
                  { id: "organisation", label: "Organization & Depts", icon: Building2 },
                  { id: "faculty", label: "Faculty & CV Satellites", icon: Users },
                  { id: "research", label: "Research & M:N Co-Authors", icon: BookOpen },
                ].map((item) => {
                  const isSelected = selectedDomain === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedDomain(item.id as DiagramDomain)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        isSelected
                          ? "bg-[#85261e] text-white shadow-xs"
                          : "text-neutral-700 hover:bg-[#fff9f6] hover:text-[#85261e]"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Mermaid Canvas */}
            <MermaidViewer
              code={getDomainDiagramCode()}
              title={getDomainTitle()}
              id={`er-${selectedDomain}`}
            />

            {/* Architecture Highlights Callout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-[#eedfd8] p-5 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#fff9f6] border border-[#eedfd8] flex items-center justify-center text-[#85261e]">
                  <Key className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#33110e] uppercase">Normalized 3NF Entities</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Eliminates transitive anomalies. Faculty CVs are separated into distinct satellite tables (qualifications, experiences, honors, exposures) referencing a single immutable <code className="text-[#85261e] font-mono">faculty.id</code>.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#eedfd8] p-5 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#fff9f6] border border-[#eedfd8] flex items-center justify-center text-[#85261e]">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#33110e] uppercase">M:N Multi-Author Joins</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Publications, patents, and projects link to multiple faculty members via junction tables (<code className="text-[#85261e] font-mono">publication_authors</code>, <code className="text-[#85261e] font-mono">project_members</code>) preserving author order.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#eedfd8] p-5 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#fff9f6] border border-[#eedfd8] flex items-center justify-center text-[#85261e]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#33110e] uppercase">Cascade &amp; Soft Deletes</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Referential integrity enforced with <code className="text-[#85261e] font-mono">ON DELETE CASCADE</code> for dependent children and <code className="text-[#85261e] font-mono">deleted_at</code> timestamps for reversible auditing.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: INTERACTIVE DATA DICTIONARY */}
        {/* ========================================================================= */}
        {activeTab === "dictionary" && (
          <div className="space-y-6">
            {/* Search & Filter Toolbar */}
            <div className="bg-white rounded-2xl border border-[#eedfd8] p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search table, column name, or description..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#eedfd8] bg-[#fff9f6]/40 focus:outline-none focus:border-[#85261e] focus:bg-white"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="text-xs border border-[#eedfd8] rounded-xl px-3 py-2 bg-white text-neutral-700 focus:outline-none focus:border-[#85261e]"
                >
                  <option value="ALL">All Categories ({DATABASE_SCHEMA_TABLES.length})</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={expandAll}
                  className="px-3 py-2 text-xs font-bold text-neutral-600 hover:text-[#85261e] border border-[#eedfd8] rounded-xl bg-white hover:bg-[#fff9f6] transition cursor-pointer"
                >
                  Expand All
                </button>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="px-3 py-2 text-xs font-bold text-neutral-600 hover:text-[#85261e] border border-[#eedfd8] rounded-xl bg-white hover:bg-[#fff9f6] transition cursor-pointer"
                >
                  Collapse All
                </button>
              </div>
            </div>

            {/* Tables List */}
            <div className="space-y-4">
              {filteredTables.map((table) => {
                const isExpanded = !!expandedTables[table.name];
                return (
                  <div
                    key={table.name}
                    className="bg-white rounded-2xl border border-[#eedfd8] shadow-xs overflow-hidden transition"
                  >
                    {/* Table Card Header */}
                    <div
                      onClick={() => toggleTableExpand(table.name)}
                      className="p-4 sm:p-5 bg-[#fff9f6] border-b border-[#eedfd8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-[#faeee9] transition select-none"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <code className="text-base sm:text-lg font-black font-mono text-[#33110e]">
                            {table.name}
                          </code>
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#85261e] text-white">
                            {table.category}
                          </span>
                          <span className="text-xs font-mono text-neutral-500 bg-white px-2 py-0.5 rounded border border-[#eedfd8]">
                            PK: {table.primaryKey}
                          </span>
                          {table.foreignKeys.length > 0 && (
                            <span className="text-xs font-mono text-neutral-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              {table.foreignKeys.length} FK Constraints
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-600 leading-snug">
                          {table.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <span className="text-xs font-bold text-[#85261e] bg-white px-2.5 py-1 rounded-xl border border-[#eedfd8]">
                          {table.columns.length} Columns
                        </span>
                        <div className="p-1 rounded-lg text-neutral-500 hover:text-[#33110e]">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>
                    </div>

                    {/* Table Columns Details */}
                    {isExpanded && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-neutral-50 text-neutral-600 uppercase font-mono tracking-wider border-b border-[#eedfd8]">
                            <tr>
                              <th className="py-2.5 px-4">Column Name</th>
                              <th className="py-2.5 px-4">PostgreSQL Type</th>
                              <th className="py-2.5 px-4">Constraints</th>
                              <th className="py-2.5 px-4">Default Value</th>
                              <th className="py-2.5 px-4">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#eedfd8]/60 font-sans">
                            {table.columns.map((col) => (
                              <tr key={col.name} className="hover:bg-[#fff9f6]/40 transition">
                                <td className="py-2.5 px-4 font-mono font-bold text-[#33110e]">
                                  <div className="flex items-center gap-1.5">
                                    {col.isPk && (
                                      <Key className="w-3.5 h-3.5 text-amber-600 shrink-0" title="Primary Key" />
                                    )}
                                    {col.isFk && (
                                      <Link2 className="w-3.5 h-3.5 text-blue-600 shrink-0" title="Foreign Key" />
                                    )}
                                    <span>{col.name}</span>
                                  </div>
                                </td>
                                <td className="py-2.5 px-4 font-mono text-neutral-700">
                                  <span className="bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">
                                    {col.type}
                                  </span>
                                </td>
                                <td className="py-2.5 px-4 font-mono">
                                  <div className="flex flex-wrap gap-1">
                                    {col.isPk && (
                                      <span className="bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded text-[10px] font-bold">
                                        PK
                                      </span>
                                    )}
                                    {col.isFk && (
                                      <span className="bg-blue-100 text-blue-900 border border-blue-300 px-1.5 py-0.2 rounded text-[10px] font-bold" title={col.fkTarget}>
                                        FK → {col.fkTarget}
                                      </span>
                                    )}
                                    {col.isUnique && (
                                      <span className="bg-purple-100 text-purple-900 border border-purple-300 px-1.5 py-0.2 rounded text-[10px] font-bold">
                                        UNIQUE
                                      </span>
                                    )}
                                    {!col.isNullable && !col.isPk && (
                                      <span className="bg-neutral-100 text-neutral-700 border border-neutral-200 px-1.5 py-0.2 rounded text-[10px]">
                                        NOT NULL
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-2.5 px-4 font-mono text-neutral-500 text-[11px]">
                                  {col.defaultValue || "—"}
                                </td>
                                <td className="py-2.5 px-4 text-neutral-700">
                                  {col.description}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: DUAL-SYNC PIPELINE ARCHITECTURE */}
        {/* ========================================================================= */}
        {activeTab === "architecture" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-[#eedfd8] p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-xl font-black text-[#33110e] uppercase tracking-tight flex items-center gap-2">
                  <Workflow className="w-6 h-6 text-[#85261e]" />
                  Dual-Persistence Synchronization Model
                </h3>
                <p className="text-xs text-neutral-600 mt-1 max-w-2xl leading-relaxed">
                  The portal implements a hybrid architecture combining offline-first client resilience with full PostgreSQL ACID compliance.
                </p>
              </div>

              {/* Mermaid Flowchart */}
              <MermaidViewer
                code={MERMAID_DIAGRAMS.syncFlow}
                title="Client-to-Database Synchronization State Machine"
                id="flowchart-sync"
              />
            </div>

            {/* Step-by-Step Mechanism Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-[#eedfd8] p-5 shadow-xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#85261e] text-white text-xs font-bold flex items-center justify-center">1</span>
                  <h4 className="text-sm font-bold text-[#33110e] uppercase">Optimistic Client Mutation</h4>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  When a faculty member adds or edits a publication, patent, or CV entry, changes are immediately written to browser storage via <code className="font-mono text-[#85261e]">saveFacultyRecord()</code>. The UI and sidebar badge counters update instantly with zero perceived latency.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#eedfd8] p-5 shadow-xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#85261e] text-white text-xs font-bold flex items-center justify-center">2</span>
                  <h4 className="text-sm font-bold text-[#33110e] uppercase">Canonical Key Resolution</h4>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Keys are normalized through <code className="font-mono text-[#85261e]">getFacultyCanonicalCode()</code>. Whether a component uses an employee code (<code className="font-mono">CS012</code>), UUID (<code className="font-mono">550e8400...</code>), or email, the exact same persistent storage key (<code className="font-mono">nith_faculty_publications_cs012</code>) is resolved.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#eedfd8] p-5 shadow-xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#85261e] text-white text-xs font-bold flex items-center justify-center">3</span>
                  <h4 className="text-sm font-bold text-[#33110e] uppercase">PostgreSQL ACID Transaction</h4>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  The client dispatches an authenticated JSON payload to the Go backend API (<code className="font-mono text-[#85261e]">POST /api/v1/publications</code>). The backend persists the record and updates junction tables (<code className="font-mono">publication_authors</code>, <code className="font-mono">publication_departments</code>) within a single atomic database transaction.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#eedfd8] p-5 shadow-xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#85261e] text-white text-xs font-bold flex items-center justify-center">4</span>
                  <h4 className="text-sm font-bold text-[#33110e] uppercase">Co-Author Fan-out &amp; Audit</h4>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Multi-faculty synchronization automatically links co-authored papers across internal faculty members. An automated immutable audit entry is written to <code className="font-mono text-[#85261e]">audit_logs</code> recording the actor ID, timestamp, IP, and diff state.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: MIGRATION SPECS & CLI CHEATSHEET */}
        {/* ========================================================================= */}
        {activeTab === "sql" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-[#eedfd8] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#eedfd8] pb-3">
                <div>
                  <h3 className="text-xl font-black text-[#33110e] uppercase tracking-tight flex items-center gap-2">
                    <FileCode className="w-6 h-6 text-[#85261e]" />
                    PostgreSQL Migration Suite &amp; Tooling
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1">
                    Managed with <code className="font-mono text-[#85261e]">golang-migrate</code> and declarative SQL files in <code className="font-mono">backend/migrations/</code>.
                  </p>
                </div>
                <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold px-3 py-1 rounded-full font-mono">
                  8 Migrations Applied
                </span>
              </div>

              {/* Migration Steps List */}
              <div className="space-y-3">
                {[
                  { file: "000001_initial_schema.up.sql", desc: "Core tables: institutions, departments, users, faculty, publications, patents, projects, courses." },
                  { file: "000002_materialized_views.up.sql", desc: "Materialized views for NIRF/NBA research aggregation by department and year." },
                  { file: "000003_seed_data.up.sql", desc: "NIT Hamirpur departments registry, admin roles, and default credentials." },
                  { file: "000004_add_faculty_cv_fields.up.sql", desc: "Publons/Web of Science, Vidwan, ORCID, and profile badges." },
                  { file: "000005_form_parity_fields.up.sql", desc: "Parity attributes matching tempcsebase for consultancies, events, and supervisions." },
                  { file: "000006_set_default_passwords.up.sql", desc: "Pre-hashed default credentials for all 27 CSE faculty members." },
                  { file: "000007_seed_from_tempcse.up.sql", desc: "Historical seed records for publications, patents, projects, and PhD scholars." },
                  { file: "000008_add_faculty_visibility.up.sql", desc: "Public visibility flags (is_visible) for guest/adjunct faculty hiding." },
                ].map((mig, idx) => (
                  <div
                    key={mig.file}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl border border-[#eedfd8] bg-[#fff9f6]/40 hover:bg-[#fff9f6] transition gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#33110e] text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <code className="text-xs font-bold font-mono text-[#85261e]">{mig.file}</code>
                        <p className="text-xs text-neutral-600">{mig.desc}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 self-end sm:self-center shrink-0">
                      Applied ✓
                    </span>
                  </div>
                ))}
              </div>

              {/* CLI Command Cheatsheet */}
              <div className="pt-4 border-t border-[#eedfd8] space-y-3">
                <h4 className="text-xs font-bold uppercase text-neutral-500 tracking-wider">
                  Terminal Commands (Makefile / CLI)
                </h4>
                <div className="bg-neutral-900 text-neutral-100 rounded-2xl p-4 font-mono text-xs space-y-2 overflow-x-auto shadow-inner">
                  <p className="text-neutral-400"># Run all pending migrations on production PostgreSQL:</p>
                  <p className="text-amber-300">migrate -path backend/migrations -database &quot;$DATABASE_URL&quot; up</p>
                  <p className="text-neutral-400 pt-2"># Create a new versioned migration:</p>
                  <p className="text-amber-300">migrate create -ext sql -dir backend/migrations -seq add_new_feature</p>
                  <p className="text-neutral-400 pt-2"># Check current migration schema version:</p>
                  <p className="text-amber-300">migrate -path backend/migrations -database &quot;$DATABASE_URL&quot; version</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
