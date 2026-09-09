"use client";

import React, { createContext, useContext, useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import departmentsRegistry from "@/lib/departments-registry.json";

export interface DepartmentInfo {
  id: string;
  code: string;
  name: string;
  hindi_name: string;
  slug: string;
  contact_email: string;
  contact_phone: string;
  about: string;
  hod_name: string;
}

interface DepartmentContextType {
  departments: DepartmentInfo[];
  activeDepartment: DepartmentInfo;
  setActiveDepartment: (dept: DepartmentInfo) => void;
  selectDepartmentBySlug: (slug: string) => void;
  isAllInstitute: boolean;
  setIsAllInstitute: (val: boolean) => void;
}

const defaultDepartment: DepartmentInfo = departmentsRegistry[0];

const DepartmentContext = createContext<DepartmentContextType>({
  departments: departmentsRegistry as DepartmentInfo[],
  activeDepartment: defaultDepartment,
  setActiveDepartment: () => {},
  selectDepartmentBySlug: () => {},
  isAllInstitute: false,
  setIsAllInstitute: () => {},
});

function DepartmentSync({
  onSync,
}: {
  onSync: (slug: string | null) => void;
}) {
  const searchParams = useSearchParams();
  const deptParam = searchParams.get("dept");

  useEffect(() => {
    onSync(deptParam);
  }, [deptParam, onSync]);

  return null;
}

export function DepartmentProvider({ children }: { children: React.ReactNode }) {
  const [activeDepartment, setActiveDepartmentState] = useState<DepartmentInfo>(defaultDepartment);
  const [isAllInstitute, setIsAllInstitute] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check localStorage on mount
    const saved = localStorage.getItem("active_department_slug");
    if (saved) {
      const found = departmentsRegistry.find((d) => d.slug.toLowerCase() === saved.toLowerCase());
      if (found) {
        setActiveDepartmentState(found as DepartmentInfo);
      }
    }
    setIsInitialized(true);
  }, []);

  const handleUrlSync = (deptParam: string | null) => {
    if (deptParam) {
      const found = departmentsRegistry.find((d) => d.slug.toLowerCase() === deptParam.toLowerCase());
      if (found) {
        setActiveDepartmentState(found as DepartmentInfo);
        localStorage.setItem("active_department_slug", found.slug);
      }
    }
  };

  const setActiveDepartment = (dept: DepartmentInfo) => {
    setActiveDepartmentState(dept);
    localStorage.setItem("active_department_slug", dept.slug);
    setIsAllInstitute(false);
    // Push or update query param seamlessly
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set("dept", dept.slug);

    // If viewing an individual faculty profile and switching departments, navigate to the target department's faculty directory
    if (pathname.startsWith("/people/faculty/") && pathname !== "/people/faculty") {
      router.push(`/people/faculty?dept=${dept.slug}`);
      return;
    }

    router.push(`${pathname}?${currentParams.toString()}`);
  };

  const selectDepartmentBySlug = (slug: string) => {
    const found = departmentsRegistry.find((d) => d.slug.toLowerCase() === slug.toLowerCase());
    if (found) {
      setActiveDepartment(found as DepartmentInfo);
    }
  };

  return (
    <DepartmentContext.Provider
      value={{
        departments: departmentsRegistry as DepartmentInfo[],
        activeDepartment,
        setActiveDepartment,
        selectDepartmentBySlug,
        isAllInstitute,
        setIsAllInstitute,
      }}
    >
      <Suspense fallback={null}>
        <DepartmentSync onSync={handleUrlSync} />
      </Suspense>
      {children}
    </DepartmentContext.Provider>
  );
}

export function useDepartment() {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error("useDepartment must be used within a DepartmentProvider");
  }
  return context;
}
