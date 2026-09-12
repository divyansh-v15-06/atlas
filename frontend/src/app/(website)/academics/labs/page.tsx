"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  Cpu,
  UserCheck,
  Search,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Server,
  Monitor,
  Database,
  Network,
  ArrowLeft,
  Flame,
  Activity,
  Zap,
  HardDrive,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  MapPin,
  Laptop,
} from "lucide-react";
import { useDepartment } from "@/context/department-context";
import { DepartmentEmptyState } from "@/components/common/department-empty-state";

export default function AcademicsLabsPage() {
  const { activeDepartment } = useDepartment();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const hasData = activeDepartment.slug === "cse";

  const categories = [
    { id: "all", label: "All Laboratories", count: 10 },
    { id: "supercomputing", label: "Supercomputing & AI", count: 2 },
    { id: "cybersecurity", label: "Cyber & Security", count: 1 },
    { id: "iot", label: "IoT & Embedded", count: 2 },
    { id: "software", label: "Software & Data", count: 3 },
    { id: "networks", label: "Networks & Systems", count: 1 },
    { id: "research", label: "Doctoral Research", count: 1 },
  ];

  const labs = [
    {
      id: "lab-1",
      name: "High Performance Computing & GPU Research Lab",
      category: "supercomputing",
      location: "Lab Room 101, Ground Floor",
      floor: "Ground Floor",
      head: "Prof. Lalit Kumar Awasthi",
      workstations: "35 GPU Workstations",
      hardware: "NVIDIA DGX Station, Tesla V100 GPU nodes, dual Intel Xeon processors, 128GB RAM per node.",
      description: "Dedicated to parallel algorithms, deep learning model training, climate simulations, and distributed cloud computing.",
      icon: Cpu,
      gradient: "from-amber-600 via-orange-600 to-amber-800",
    },
    {
      id: "lab-2",
      name: "Artificial Intelligence & Robotics Lab",
      category: "supercomputing",
      location: "Lab Room 102, Ground Floor",
      floor: "Ground Floor",
      head: "Dr. Mohammad Khalid Pandit",
      workstations: "30 AI Workstations + Robotic Kits",
      hardware: "NVIDIA RTX 4090 Workstations, TurtleBot3 mobile robots, LiDAR sensors, and Intel RealSense 3D cameras.",
      description: "Supports advanced research in autonomous robotic navigation, spatial computing, and transformer architectures.",
      icon: Sparkles,
      gradient: "from-purple-600 via-indigo-600 to-purple-800",
    },
    {
      id: "lab-3",
      name: "Cyber Security & Cryptography Lab",
      category: "cybersecurity",
      location: "Lab Room 201, First Floor",
      floor: "First Floor",
      head: "Dr. Kamlesh Dutta",
      workstations: "32 Isolated Network Nodes",
      hardware: "Isolated network racks, Hardware Security Modules (HSM), Wireshark analyzers, and air-gapped sandboxes.",
      description: "Focuses on network intrusion detection, blockchain protocols, zero-trust architectures, and cryptographic benchmarking.",
      icon: ShieldCheck,
      gradient: "from-rose-600 via-red-600 to-rose-800",
    },
    {
      id: "lab-4",
      name: "Cloud Computing & Internet of Things (IoT) Lab",
      category: "iot",
      location: "Lab Room 202, First Floor",
      floor: "First Floor",
      head: "Dr. Naveen Chauhan",
      workstations: "30 IoT Workstations + Sensor Kits",
      hardware: "Raspberry Pi 4 / 5 clusters, ESP32 development boards, LoRaWAN long-range gateways, and Zigbee sensor grids.",
      description: "Smart edge computing architectures, wireless sensor networks, telemetry data pipelines, and disaster-resilient networks.",
      icon: Server,
      gradient: "from-emerald-600 via-teal-600 to-emerald-800",
    },
    {
      id: "lab-5",
      name: "Virtual Reality & Human Computer Interaction Lab",
      category: "software",
      location: "Lab Room 203, First Floor",
      floor: "First Floor",
      head: "Dr. Siddhartha Chauhan",
      workstations: "25 VR Stations + HMDs",
      hardware: "Meta Quest Pro & HTC Vive VR Headsets, motion capture trackers, and haptic feedback gloves.",
      description: "Spatial computing, metaverse environments, 3D anatomical simulations, and accessible gesture-based user interfaces.",
      icon: Monitor,
      gradient: "from-blue-600 via-indigo-600 to-blue-800",
    },
    {
      id: "lab-6",
      name: "Data Analytics & Knowledge Engineering Lab",
      category: "software",
      location: "Lab Room 301, Second Floor",
      floor: "Second Floor",
      head: "Dr. Arun Kumar Yadav",
      workstations: "35 Enterprise Workstations",
      hardware: "Apache Hadoop / Spark distributed cluster nodes, high-speed NVMe storage arrays, and enterprise DBMS servers.",
      description: "Dedicated to large-scale data mining, NLP information retrieval, sentiment analysis, and knowledge graph engineering.",
      icon: Database,
      gradient: "from-cyan-600 via-blue-600 to-cyan-800",
    },
    {
      id: "lab-7",
      name: "Software Engineering & Systems Development Lab",
      category: "software",
      location: "Lab Room 302, Second Floor",
      floor: "Second Floor",
      head: "Dr. T P Sharma",
      workstations: "45 Development Workstations",
      hardware: "CI/CD testing servers, automated code profiling testbeds, and cross-platform mobile test devices.",
      description: "Facilitates undergraduate software design projects, agile software engineering, and test-driven development.",
      icon: Laptop,
      gradient: "from-amber-700 via-yellow-700 to-amber-900",
    },
    {
      id: "lab-8",
      name: "Computer Networks & Wireless Communication Lab",
      category: "networks",
      location: "Lab Room 303, Second Floor",
      floor: "Second Floor",
      head: "Dr. Pardeep Singh",
      workstations: "36 Network Stations",
      hardware: "Cisco managed Catalyst switches & routers, Software-Defined Networking (SDN) controllers, and NS-3 testbeds.",
      description: "Covers routing protocol verification, 5G/6G network simulation, wireless ad-hoc networks, and QoS optimization.",
      icon: Network,
      gradient: "from-slate-700 via-neutral-700 to-slate-900",
    },
    {
      id: "lab-9",
      name: "Microprocessor & Embedded Systems Lab",
      category: "iot",
      location: "Lab Room 104, Ground Floor",
      floor: "Ground Floor",
      head: "Dr. Rajeev Kumar",
      workstations: "30 Embedded Kits & Oscilloscopes",
      hardware: "ARM Cortex-M development boards, 8086/8051 microprocessor kits, FPGA development boards (Xilinx Artix-7).",
      description: "Embedded firmware development, hardware-software co-design, real-time operating systems (FreeRTOS), and VLSI prototyping.",
      icon: HardDrive,
      gradient: "from-stone-700 via-amber-800 to-stone-900",
    },
    {
      id: "lab-10",
      name: "PG & Doctoral Research Laboratory",
      category: "research",
      location: "Lab Room 401, Third Floor",
      floor: "Third Floor",
      head: "Dr. Sangeeta Sharma",
      workstations: "50 Dedicated Research Cubicles",
      hardware: "Dual-monitor dedicated workstations for M.Tech and Ph.D. scholars with Gigabit LAN connectivity.",
      description: "Dedicated full-time research environment for postgraduate dissertation work and doctoral research projects.",
      icon: UserCheck,
      gradient: "from-[#85261e] via-[#4a1814] to-[#33110e]",
    },
  ];

  const filteredLabs = useMemo(() => {
    if (!hasData) return [];
    return labs.filter((l) => {
      const matchesCategory = selectedCategory === "all" || l.category === selectedCategory;
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        l.name.toLowerCase().includes(q) ||
        l.head.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.hardware.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory, hasData]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 bg-white min-h-[85vh] font-sans">
      {/* Title Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#33110e] text-white shadow-sm">
              <Cpu className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#33110e] tracking-tight uppercase">
                Academic Laboratories
              </h1>
              <p className="text-xs text-neutral-600 font-medium">
                Department of {activeDepartment.name} • National Institute of Technology Hamirpur
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/aboutus/labs?dept=${activeDepartment.slug}`}
            className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5 hover:bg-[#33110e] hover:text-white transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Detailed Research Lab Specs
          </Link>
        </div>
      </div>

      {!hasData ? (
        <DepartmentEmptyState sectionTitle="Academic Laboratories" />
      ) : (
        <>
          {/* Search & Category Filter Bar */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#fff9f6] border border-[#eedfd8] rounded-2xl p-4 shadow-xs">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search lab name, equipment, faculty lead..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#eedfd8] bg-white text-[#33110e] placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-[#85261e]"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#85261e]" />
                <span>Showing <strong className="text-[#33110e]">{filteredLabs.length}</strong> of {labs.length} Facilities</span>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-[#33110e] text-white shadow-sm"
                        : "bg-white text-neutral-700 border border-[#eedfd8] hover:bg-[#fff9f6] hover:text-[#85261e]"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? "bg-amber-400 text-[#1c110c]" : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Labs Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {filteredLabs.map((lab) => {
              const Icon = lab.icon;
              return (
                <div
                  key={lab.id}
                  className="bg-white border-2 border-[#eedfd8] hover:border-[#85261e]/50 rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 border-b border-[#eedfd8] pb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${lab.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#85261e] bg-[#fff9f6] border border-[#eedfd8] px-2 py-0.5 rounded">
                            {lab.floor}
                          </span>
                          <p className="text-[11px] font-mono text-neutral-500 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#85261e]" /> {lab.location}
                          </p>
                        </div>
                      </div>

                      <span className="bg-[#fff9f6] border border-[#eedfd8] text-[#33110e] text-xs font-bold px-2.5 py-1 rounded-xl shadow-2xs">
                        {lab.workstations}
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-[#1c110c] mt-4 leading-snug group-hover:text-[#85261e] transition">
                      {lab.name}
                    </h2>

                    <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed mt-2">
                      {lab.description}
                    </p>

                    <div className="mt-4 bg-[#fff9f6] border border-[#eedfd8] rounded-2xl p-3.5 text-xs text-neutral-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#33110e] uppercase tracking-wider">
                        <Cpu className="w-3.5 h-3.5 text-[#85261e]" /> Key Equipment &amp; Rigs
                      </div>
                      <p className="text-[11px] text-neutral-700 leading-relaxed">
                        {lab.hardware}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#eedfd8] flex items-center justify-between text-xs text-neutral-700">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-[#85261e]" />
                      <span>Lab In-Charge: <strong className="text-[#1c110c]">{lab.head}</strong></span>
                    </div>

                    <Link
                      href={`/aboutus/labs?dept=${activeDepartment.slug}`}
                      className="inline-flex items-center gap-1 text-[#85261e] font-bold hover:underline"
                    >
                      Deep Specs <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
