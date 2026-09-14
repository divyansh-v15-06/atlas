"use client";

import { useState, useEffect, useCallback } from "react";
import { useDepartment, Department } from "@/context/department-context";

export interface HodMessageData {
  name: string;
  designation: string;
  department: string;
  departmentCode: string;
  email: string;
  phone: string;
  office: string;
  qualifications: string;
  message: string;
  paragraphs: string[];
  imageUrl: string;
  isLoading: boolean;
  source: "database" | "cms_storage" | "seed";
  refetch: () => Promise<void>;
}

const CSE_SEED_MESSAGE =
  "It is with great pleasure that I write this in the capacity of the Head of the Department (HOD) of the Computer Science and Engineering (CSE) Department at NIT Hamirpur. I thank all the faculty members, students, and staff of our esteemed department for their continuous efforts every day in maintaining the excellence and reputation of our department.";

const CSE_SEED_PARAGRAPHS = [
  "It is with great pleasure and pride that I write this in the capacity of the Head of the Department (HOD) of the Computer Science and Engineering (CSE) Department at NIT Hamirpur. I thank all the faculty members, students, and staff of our esteemed department for their continuous efforts every day in maintaining the excellence and reputation of our department.",
  "In an era characterized by rapid digital transformation, artificial intelligence, cyber-physical systems, and quantum breakthroughs, our curriculum is carefully curated to bridge core theoretical foundations with state-of-the-art technological practices as per NEP-2020.",
  "We warmly invite prospective students, academic collaborators, and industry partners to join us in advancing the frontiers of computing sciences and fostering ethical technological innovation.",
];

export function useHodMessage(overrideDepartment?: Department): HodMessageData {
  const { activeDepartment: contextDept } = useDepartment();
  const dept = overrideDepartment || contextDept;
  const isCse = dept.slug === "cse";

  const getFallbackData = useCallback((): Omit<HodMessageData, "isLoading" | "refetch"> => {
    // 1. Check local CMS override
    if (typeof window !== "undefined") {
      const scopedKey = `nith_admin_hod_details_${dept.slug}`;
      const saved = localStorage.getItem(scopedKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && (parsed.name || parsed.message)) {
            const rawMsg = parsed.message || "";
            const paras = rawMsg
              .split(/\n\s*\n/)
              .map((p: string) => p.trim())
              .filter(Boolean);

            return {
              name: parsed.name || (isCse ? "Dr. Siddhartha Chauhan" : dept.hod_name || "Head of Department"),
              designation: parsed.designation || `Head of Department, ${dept.code}`,
              department: `Department of ${dept.name}`,
              departmentCode: dept.code,
              email: parsed.email || `${dept.slug}.hod@nith.ac.in`,
              phone: parsed.phone || "+91-1972-254424",
              office: `Room 204, ${dept.code} Building, NIT Hamirpur`,
              qualifications: isCse
                ? "Ph.D. (NIT Hamirpur), M.Tech (CSE), B.Tech (CSE)"
                : "Ph.D., M.Tech / M.E.",
              message: rawMsg || (isCse ? CSE_SEED_MESSAGE : `Welcome to the Department of ${dept.name} at NIT Hamirpur.`),
              paragraphs: paras.length > 0 ? paras : [rawMsg || CSE_SEED_MESSAGE],
              imageUrl: parsed.imageUrl || (isCse ? "https://portfolios.nith.ac.in/uploads/member_details/62.jpg" : "/hod.jpg"),
              source: "cms_storage",
            };
          }
        } catch {}
      }

      if (isCse) {
        const legacy = localStorage.getItem("nith_admin_hod_details");
        if (legacy) {
          try {
            const parsed = JSON.parse(legacy);
            if (parsed && (parsed.name || parsed.message)) {
              return {
                name: parsed.name || "Dr. Siddhartha Chauhan",
                designation: parsed.designation || `Head of Department, ${dept.code}`,
                department: `Department of ${dept.name}`,
                departmentCode: dept.code,
                email: parsed.email || "siddhartha@nith.ac.in",
                phone: parsed.phone || "+91-1972-254424",
                office: "Room 204, Department of CSE Building, NIT Hamirpur",
                qualifications: "Ph.D. (NIT Hamirpur), M.Tech (CSE), B.Tech (CSE)",
                message: parsed.message || CSE_SEED_MESSAGE,
                paragraphs: parsed.message ? [parsed.message] : CSE_SEED_PARAGRAPHS,
                imageUrl: parsed.imageUrl || "https://portfolios.nith.ac.in/uploads/member_details/62.jpg",
                source: "cms_storage",
              };
            }
          } catch {}
        }
      }
    }

    // 2. Default Seed / Registry fallback
    if (isCse) {
      return {
        name: "Dr. Siddhartha Chauhan",
        designation: "Head of Department & Associate Professor",
        department: `Department of ${dept.name}`,
        departmentCode: dept.code,
        email: "siddhartha@nith.ac.in",
        phone: "+91-1972-254424",
        office: "Room 204, Department of CSE Building, NIT Hamirpur",
        qualifications: "Ph.D. (NIT Hamirpur), M.Tech (CSE), B.Tech (CSE)",
        message: CSE_SEED_MESSAGE,
        paragraphs: CSE_SEED_PARAGRAPHS,
        imageUrl: "https://portfolios.nith.ac.in/uploads/member_details/62.jpg",
        source: "seed",
      };
    }

    const defaultMsg = `Welcome to the Department of ${dept.name} at National Institute of Technology Hamirpur. Our department strives for academic excellence, innovative multidisciplinary research, and nurturing ethical engineering leaders for global societal impact.`;
    return {
      name: dept.hod_name || "Head of Department",
      designation: `Head of Department (${dept.code})`,
      department: `Department of ${dept.name}`,
      departmentCode: dept.code,
      email: `${dept.slug}.hod@nith.ac.in`,
      phone: "+91-1972-254400",
      office: `HOD Office, ${dept.code} Building, NIT Hamirpur`,
      qualifications: "Ph.D., M.Tech / M.E.",
      message: defaultMsg,
      paragraphs: [
        defaultMsg,
        `Our curriculum is designed to balance strong core foundations with emerging technologies, empowering our students to address complex technological and societal challenges.`,
        `We invite students, scholars, and industry partners to collaborate with us in building a future driven by innovation and excellence.`,
      ],
      imageUrl: "/hod.jpg",
      source: "seed",
    };
  }, [dept.code, dept.hod_name, dept.name, dept.slug, isCse]);

  const [hodData, setHodData] = useState<Omit<HodMessageData, "isLoading" | "refetch">>(getFallbackData);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchHodFromApi = useCallback(async () => {
    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    let found = false;

    // Try department-specific endpoint
    const queryParam = dept.id || dept.slug || dept.code;
    const endpoints = [
      `${apiUrl}/cms/hod-message?department_id=${encodeURIComponent(queryParam)}`,
      `${apiUrl}/hod/get?department_id=${encodeURIComponent(queryParam)}`,
    ];

    if (isCse) {
      endpoints.push(`${apiUrl}/cms/hod-message`);
      endpoints.push(`${apiUrl}/hod/get`);
    }

    for (const url of endpoints) {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) continue;
        const json = await res.json();
        const data = json?.data || json;

        if (data && (data.hod_name || data.name || data.message)) {
          const name = data.hod_name || data.name || (isCse ? "Dr. Siddhartha Chauhan" : dept.hod_name);
          const rawMessage = data.message || CSE_SEED_MESSAGE;
          const imageUrl =
            data.image_url ||
            data.image ||
            data.imageUrl ||
            (isCse ? "https://portfolios.nith.ac.in/uploads/member_details/62.jpg" : "/hod.jpg");

          const paras = rawMessage
            .split(/\n\s*\n/)
            .map((p: string) => p.trim())
            .filter(Boolean);

          setHodData({
            name,
            designation: `Head of Department, ${dept.code}`,
            department: `Department of ${dept.name}`,
            departmentCode: dept.code,
            email: `${dept.slug}.hod@nith.ac.in`,
            phone: "+91-1972-254424",
            office: `Room 204, ${dept.code} Building, NIT Hamirpur`,
            qualifications: isCse
              ? "Ph.D. (NIT Hamirpur), M.Tech (CSE), B.Tech (CSE)"
              : "Ph.D., M.Tech / M.E.",
            message: rawMessage,
            paragraphs: paras.length > 0 ? paras : [rawMessage],
            imageUrl,
            source: "database",
          });
          found = true;
          break;
        }
      } catch {
        // Network/backend offline, will fallback gracefully
      }
    }

    if (!found) {
      setHodData(getFallbackData());
    }
    setIsLoading(false);
  }, [dept.code, dept.id, dept.hod_name, dept.name, dept.slug, isCse, getFallbackData]);

  useEffect(() => {
    // Initial fetch when department changes
    fetchHodFromApi();

    // Listen for custom CMS update events
    const handleUpdate = () => {
      fetchHodFromApi();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("hod-message-updated", handleUpdate);
      window.addEventListener("storage", handleUpdate);
      return () => {
        window.removeEventListener("hod-message-updated", handleUpdate);
        window.removeEventListener("storage", handleUpdate);
      };
    }
  }, [fetchHodFromApi]);

  return {
    ...hodData,
    isLoading,
    refetch: fetchHodFromApi,
  };
}
