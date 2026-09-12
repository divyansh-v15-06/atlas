"use client";

import { useState, useMemo } from "react";
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
  ChevronDown,
  ChevronUp,
  Info,
  Laptop,
} from "lucide-react";
import { useDepartment } from "@/context/department-context";
import { DepartmentEmptyState } from "@/components/common/department-empty-state";

export default function LabsPage() {
  const { activeDepartment } = useDepartment();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedLabId, setExpandedLabId] = useState<string | null>("lab-1");
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

  const tapeMetrics = [
    { label: "Active Lab Workstations", value: "350+", icon: Laptop },
    { label: "Gigabit Fiber Backbone", value: "10 Gbps", icon: Network },
    { label: "Doctoral Uptime Access", value: "24/7", icon: Clock },
    { label: "Total Infrastructure Value", value: "₹12.5 Cr+", icon: Zap },
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
      hardware: "NVIDIA DGX Station, Tesla V100 GPU nodes, dual Intel Xeon Scalable processors, 128GB RAM per node.",
      software: "CUDA 12.x, PyTorch, TensorFlow, OpenMPI, Slurm Workload Manager, TensorRT.",
      description: "Dedicated to high-concurrency parallel algorithms, large-scale deep learning model training, climate simulations, and distributed cloud computing.",
      icon: Cpu,
      gradient: "from-amber-600 via-orange-600 to-amber-800",
      activeProjects: ["Multilingual LLM Training for Himalayan Dialects", "Distributed Genome Sequencing Accelerators"],
    },
    {
      id: "lab-2",
      name: "Artificial Intelligence & Robotics Lab",
      category: "supercomputing",
      location: "Lab Room 102, Ground Floor",
      floor: "Ground Floor",
      head: "Dr. Mohammad Khalid Pandit",
      workstations: "30 AI Workstations + Robotic Kits",
      hardware: "NVIDIA RTX 4090 Workstations, TurtleBot3 mobile robots, LiDAR sensors, and Intel RealSense D435 3D cameras.",
      software: "ROS2 Humble, Gazebo Sim, OpenCV, YOLOv8, MoveIt2, PyBullet.",
      description: "Supports advanced research in autonomous robotic navigation, spatial computing, computer vision transformers, and drone swarms.",
      icon: Sparkles,
      gradient: "from-purple-600 via-indigo-600 to-purple-800",
      activeProjects: ["Autonomous Mountain Rescue Drone Navigation", "Vision Transformer Defect Detectors"],
    },
    {
      id: "lab-3",
      name: "Cyber Security & Cryptography Lab",
      category: "cybersecurity",
      location: "Lab Room 201, First Floor",
      floor: "First Floor",
      head: "Dr. Kamlesh Dutta",
      workstations: "32 Isolated Network Nodes",
      hardware: "Isolated network racks, Hardware Security Modules (HSM), Wireshark packet analyzers, and air-gapped sandboxes.",
      software: "Kali Linux Suite, Ghidra Reverse Engineering, Snort IDS, Metasploit Pro, Hyperledger Fabric.",
      description: "Focuses on network intrusion detection, blockchain protocols, zero-trust architectures, post-quantum cryptographic primitives, and smart contract security.",
      icon: ShieldCheck,
      gradient: "from-rose-600 via-red-600 to-rose-800",
      activeProjects: ["Zero-Trust Himalayan Telemetry Protocol", "Post-Quantum Lattice-Based Encryption"],
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
      software: "ThingsBoard IoT Server, Mosquitto MQTT Broker, Node-RED, AWS IoT Greengrass, Docker Swarm.",
      description: "Smart edge computing architectures, wireless sensor networks, telemetry data pipelines, and disaster-resilient Himalayan IoT networks.",
      icon: Server,
      gradient: "from-emerald-600 via-teal-600 to-emerald-800",
      activeProjects: ["Flash Flood Warning LoRa Sensor Mesh", "Smart Agriculture Microclimate Nodes"],
    },
    {
      id: "lab-5",
      name: "Virtual Reality & Human Computer Interaction Lab",
      category: "software",
      location: "Lab Room 203, First Floor",
      floor: "First Floor",
      head: "Dr. Siddhartha Chauhan",
      workstations: "25 VR Stations + HMDs",
      hardware: "Meta Quest Pro & HTC Vive Focus 3 Headsets, full-body motion capture trackers, and haptic feedback gloves.",
      software: "Unity 3D Engine, Unreal Engine 5.3, Blender 4.x, OpenXR SDK, SteamVR.",
      description: "Spatial computing, metaverse environments, 3D anatomical surgical simulations, and accessible gesture-based user interfaces.",
      icon: Monitor,
      gradient: "from-blue-600 via-indigo-600 to-blue-800",
      activeProjects: ["Haptic-Assisted Tele-Surgical Simulators", "Immersive Himalayan Heritage VR Museum"],
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
      software: "Apache Spark, Apache Kafka, Neo4j Graph DB, Elasticsearch, Tableau Server, PostgreSQL.",
      description: "Dedicated to large-scale data mining, NLP information retrieval, sentiment analysis of legal documents, and knowledge graph engineering.",
      icon: Database,
      gradient: "from-cyan-600 via-blue-600 to-cyan-800",
      activeProjects: ["Legal Knowledge Graph Construction", "Multilingual Indian Sentiment Extractors"],
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
      software: "GitLab Enterprise, SonarQube Code Quality Server, Jenkins CI/CD, Visual Studio Code Enterprise, Docker.",
      description: "Facilitates undergraduate software design projects, agile software engineering, test-driven development, and enterprise architectures.",
      icon: Laptop,
      gradient: "from-amber-700 via-yellow-700 to-amber-900",
      activeProjects: ["Automated Vulnerability Static Analyzers", "Microservices Fault Tolerance Testbed"],
    },
    {
      id: "lab-8",
      name: "Computer Networks & Wireless Communication Lab",
      category: "networks",
      location: "Lab Room 303, Second Floor",
      floor: "Second Floor",
      head: "Dr. Pardeep Singh",
      workstations: "36 Network Stations",
      hardware: "Cisco managed Catalyst switches & routers, Software-Defined Networking (SDN) controllers, NS-3 and Mininet testbeds.",
      software: "Wireshark, NS-3 Network Simulator, Mininet OpenFlow, Cisco Packet Tracer, OMNeT++.",
      description: "Covers routing protocol verification, 5G/6G network simulation, wireless ad-hoc networks (VANET/MANET), and QoS optimization.",
      icon: Network,
      gradient: "from-slate-700 via-neutral-700 to-slate-900",
      activeProjects: ["6G Terahertz Propagation Modeling", "Vehicular Edge Computing Protocols"],
    },
    {
      id: "lab-9",
      name: "Microprocessor & Embedded Systems Lab",
      category: "iot",
      location: "Lab Room 104, Ground Floor",
      floor: "Ground Floor",
      head: "Dr. Rajeev Kumar",
      workstations: "30 Embedded Kits & Oscilloscopes",
      hardware: "ARM Cortex-M development boards, 8086/8051 microprocessor kits, FPGA development boards (Xilinx Artix-7), and digital storage oscilloscopes.",
      software: "Keil uVision, Xilinx Vivado ML, STM32CubeIDE, Proteus Design Suite, FreeRTOS.",
      description: "Embedded firmware development, hardware-software co-design, real-time operating systems (FreeRTOS), and VLSI interface prototyping.",
      icon: HardDrive,
      gradient: "from-stone-700 via-amber-800 to-stone-900",
      activeProjects: ["FPGA Deep Neural Network Accelerators", "Ultra-Low-Power RISC-V SoC Prototyping"],
    },
    {
      id: "lab-10",
      name: "PG & Doctoral Research Laboratory",
      category: "research",
      location: "Lab Room 401, Third Floor",
      floor: "Third Floor",
      head: "Dr. Sangeeta Sharma",
      workstations: "50 Dedicated Research Cubicles",
      hardware: "Dual-monitor dedicated workstations for M.Tech and Ph.D. scholars with Gigabit LAN connectivity and central cluster access.",
      software: "MATLAB R2024b with Toolboxes, Overleaf Pro, Mendeley Institutional, Gurobi Optimizer, OriginPro.",
      description: "Dedicated full-time research environment for postgraduate dissertation work and doctoral research projects.",
      icon: UserCheck,
      gradient: "from-[#85261e] via-[#4a1814] to-[#33110e]",
      activeProjects: ["Doctoral Theses & Dissertations", "Sponsored SERB & DST Core Research"],
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

  const toggleExpand = (id: string) => {
    setExpandedLabId(expandedLabId === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 bg-white min-h-[85vh] font-sans">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#eedfd8] pb-4">
        <div className="space-y-1">
          <Link
            href={`/aboutus?dept=${activeDepartment.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#85261e] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to About Department
          </Link>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#33110e] text-white shadow-sm">
              <Cpu className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#33110e] tracking-tight uppercase">
                Specialized Laboratories &amp; Research Rigs
              </h1>
              <p className="text-xs text-neutral-600 font-medium">
                Department of {activeDepartment.name} • National Institute of Technology Hamirpur
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            10 Dedicated Lab Spaces
          </span>
          <span className="bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            NVIDIA Supercompute Facility
          </span>
        </div>
      </div>

      {!hasData ? (
        <DepartmentEmptyState sectionTitle="Laboratory & Research Facilities" />
      ) : (
        <>
          {/* ========================================================================= */}
          {/* 1. HERO BANNER: Compact & High-Impact (Without Bloated Bottom Section) */}
          {/* ========================================================================= */}
          <section className="relative rounded-3xl overflow-hidden border border-[#eedfd8] shadow-md bg-gradient-to-br from-[#2a0e0c] via-[#4a1814] to-[#1c110c] text-white">
            {/* Background Texture & Overlay */}
            <div className="absolute inset-0 opacity-15 mix-blend-luminosity pointer-events-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/aboutusimg.jpg"
                alt="NIT Hamirpur Laboratories"
                className="w-full h-full object-cover object-center scale-105 filter blur-[1px]"
                onError={(e: any) => {
                  e.target.src = "/cseDepartmentPhoto.png";
                }}
              />
            </div>

            {/* Glowing Accent Orbs */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#85261e]/40 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 p-6 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left Text */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1 rounded-full text-xs font-bold text-amber-300 tracking-wide uppercase shadow-sm">
                    <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    High-End Computing Testbeds
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-[1.2] text-white">
                    Powering Next-Gen{" "}
                    <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-amber-100 bg-clip-text text-transparent">
                      Computing, AI &amp; Robotics
                    </span>
                  </h2>

                  <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed max-w-2xl font-normal">
                    10 specialized computing facilities equipped with NVIDIA DGX Stations, multi-GPU clusters, isolated cyber-defense sandboxes, LoRaWAN testbeds, and dedicated doctoral suites.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <a
                      href="#labs-directory"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-[#1c110c] text-xs font-bold px-4 py-2 rounded-xl shadow-md transition"
                    >
                      <Laptop className="w-3.5 h-3.5" />
                      Explore All 10 Labs
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>

                    <Link
                      href="/academics/programsoffered"
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
                    >
                      <Info className="w-3.5 h-3.5 text-amber-300" />
                      Curriculum
                    </Link>
                  </div>
                </div>

                {/* Right Spotlight Mini Card */}
                <div className="lg:col-span-5">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-xl text-white relative overflow-hidden group hover:border-amber-300/40 transition">
                    <div className="flex items-center gap-3 border-b border-white/15 pb-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-0.5 shadow-md flex items-center justify-center">
                        <div className="w-full h-full bg-[#33110e] rounded-[10px] flex items-center justify-center">
                          <Cpu className="w-5 h-5 text-amber-300" />
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
                          Flagship Supercomputing Hub
                        </span>
                        <h3 className="text-sm font-bold text-white leading-tight">
                          NVIDIA DGX &amp; V100 GPU Cluster
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-200 leading-relaxed">
                      Accelerating transformer inference, deep reinforcement learning, and large-scale parallel simulations with multi-teraflop throughput.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* 2. SLEEK THIN TAPE / RIBBON STRIP (Compact & Crisp Number Bar) */}
          {/* ========================================================================= */}
          <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-2xl px-4 py-3 shadow-2xs">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#eedfd8] gap-y-2">
              {tapeMetrics.map((item, idx) => (
                <div key={idx} className="flex items-center justify-center gap-3 px-3 py-1 text-left">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#eedfd8] text-[#85261e] flex items-center justify-center shadow-2xs flex-shrink-0">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-base sm:text-lg font-black text-[#33110e] leading-none block">
                      {item.value}
                    </span>
                    <span className="text-[11px] font-semibold text-neutral-600 block mt-0.5">
                      {item.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. SEARCH & INTERACTIVE CATEGORY FILTER BAR */}
          {/* ========================================================================= */}
          <div id="labs-directory" className="space-y-4 pt-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#fff9f6] border border-[#eedfd8] rounded-2xl p-4 shadow-xs">
              {/* Search Bar */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by lab name, faculty lead, hardware, or room..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#eedfd8] bg-white text-[#33110e] placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-[#85261e] shadow-2xs"
                />
              </div>

              {/* Status Counter */}
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#85261e]" />
                <span>Showing <strong className="text-[#33110e]">{filteredLabs.length}</strong> of {labs.length} Laboratories</span>
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

          {/* ========================================================================= */}
          {/* 4. DYNAMIC LAB CARDS (3D Interactive Cards with Expandable Drawer) */}
          {/* ========================================================================= */}
          <div className="grid gap-6 md:grid-cols-2">
            {filteredLabs.map((lab) => {
              const Icon = lab.icon;
              const isExpanded = expandedLabId === lab.id;

              return (
                <div
                  key={lab.id}
                  className="bg-white border-2 border-[#eedfd8] hover:border-[#85261e]/50 rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 group"
                >
                  <div>
                    {/* Header Row: Icon, Category Badge & Capacity */}
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

                    {/* Lab Title */}
                    <h2 className="text-base sm:text-lg font-bold text-[#1c110c] mt-4 leading-snug group-hover:text-[#85261e] transition">
                      {lab.name}
                    </h2>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed mt-2">
                      {lab.description}
                    </p>

                    {/* Key Hardware Box */}
                    <div className="mt-4 bg-[#fff9f6] border border-[#eedfd8] rounded-2xl p-3.5 text-xs text-neutral-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#33110e] uppercase tracking-wider">
                        <Cpu className="w-3.5 h-3.5 text-[#85261e]" /> Key Hardware &amp; Compute Rigs
                      </div>
                      <p className="text-[11px] text-neutral-700 leading-relaxed">
                        {lab.hardware}
                      </p>
                    </div>

                    {/* Expandable Deep Tech Details (Software & Projects) */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-[#eedfd8] space-y-3 animate-in fade-in duration-200">
                        {/* Software stack */}
                        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs">
                          <strong className="text-[#1c110c] font-bold block mb-1">Software Stacks &amp; SDKs:</strong>
                          <p className="text-[11px] text-neutral-600 font-mono">{lab.software}</p>
                        </div>

                        {/* Active Projects */}
                        <div className="space-y-1.5">
                          <strong className="text-xs font-bold text-[#1c110c] block">Current Research Thrusts:</strong>
                          {lab.activeProjects.map((proj, pIdx) => (
                            <div key={pIdx} className="flex items-start gap-2 text-[11px] text-neutral-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#85261e] flex-shrink-0 mt-0.5" />
                              <span>{proj}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Bar: Faculty Lead & Expand Action */}
                  <div className="pt-4 border-t border-[#eedfd8] flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-neutral-700">
                      <UserCheck className="w-4 h-4 text-[#85261e]" />
                      <span>Lab In-Charge: <strong className="text-[#1c110c]">{lab.head}</strong></span>
                    </div>

                    <button
                      onClick={() => toggleExpand(lab.id)}
                      className="inline-flex items-center gap-1 font-bold text-[#85261e] hover:text-[#33110e] hover:underline"
                    >
                      <span>{isExpanded ? "Show Less" : "Specs & Projects"}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* 5. STUDENT ACCESS, CLUSTER ALLOCATION & GUIDELINES CARD */}
          {/* ========================================================================= */}
          <section className="bg-gradient-to-br from-[#fff9f6] via-white to-[#faf6f3] border-2 border-[#eedfd8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#eedfd8] pb-4">
              <div>
                <span className="bg-[#33110e] text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                  Operational Guidelines
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1c110c] mt-1">
                  Lab Access Protocols &amp; GPU Resource Allocation
                </h2>
              </div>
              <span className="text-xs font-semibold text-[#85261e]">
                Updated for Academic Session 2025-26
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Protocol 1 */}
              <div className="bg-white border border-[#eedfd8] rounded-2xl p-5 shadow-xs space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#1c110c]">Undergraduate Lab Schedules</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Scheduled during regular academic time slots from 9:00 AM to 5:00 PM under designated faculty instructors and lab technical staff.
                </p>
              </div>

              {/* Protocol 2 */}
              <div className="bg-white border border-[#eedfd8] rounded-2xl p-5 shadow-xs space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#1c110c]">GPU Slurm Allocation</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Doctoral &amp; M.Tech researchers can request multi-day GPU job quotas on the DGX cluster through the Department Server Portal.
                </p>
              </div>

              {/* Protocol 3 */}
              <div className="bg-white border border-[#eedfd8] rounded-2xl p-5 shadow-xs space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#1c110c]">Air-Gapped Sandbox Security</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Cybersecurity and malware experiments must strictly run within designated VLANs with no external physical USB insertions allowed.
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
