import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ExternalLink, Globe } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-[#1c110c] text-white border-t-4 border-[#85261e] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Institute Branding */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 flex-shrink-0">
                <Image
                  src="/nith.png"
                  alt="NIT Hamirpur Official Emblem"
                  fill
                  className="object-contain filter brightness-110"
                />
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight text-neutral-100">
                  National Institute of Technology Hamirpur
                </h3>
                <p className="text-sm text-neutral-400">Himachal Pradesh - 177005, India</p>
              </div>
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Empowering innovators and technical leaders through world-class computer science education, research, and industry collaboration.
            </p>
            <div className="flex items-center gap-3 pt-2 text-neutral-400 text-xs">
              <span className="bg-[#33110e] px-3 py-1 rounded text-amber-300 font-semibold text-xs">
                NIRF Top Ranked
              </span>
              <span className="bg-[#33110e] px-3 py-1 rounded text-amber-300 font-semibold text-xs">
                NBA Accredited
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm tracking-wider uppercase text-amber-400 border-b border-neutral-800 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <Link href="/aboutus" className="hover:text-amber-300 transition">
                  About Department
                </Link>
              </li>
              <li>
                <Link href="/academics/programsoffered" className="hover:text-amber-300 transition">
                  Programmes Offered
                </Link>
              </li>
              <li>
                <Link href="/academics/syllabus" className="hover:text-amber-300 transition">
                  Courses & Syllabus
                </Link>
              </li>
              <li>
                <Link href="/people/faculty" className="hover:text-amber-300 transition">
                  Faculty Directory
                </Link>
              </li>
              <li>
                <Link href="/placementpage" className="hover:text-amber-300 transition">
                  Placement Statistics
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Research & Portals */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm tracking-wider uppercase text-amber-400 border-b border-neutral-800 pb-2">
              Research & Portals
            </h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <Link href="/research/publications" className="hover:text-amber-300 transition">
                  Research Publications (110+)
                </Link>
              </li>
              <li>
                <Link href="/research/patents" className="hover:text-amber-300 transition">
                  Patents & Inventions
                </Link>
              </li>
              <li>
                <Link href="/research/projects" className="hover:text-amber-300 transition">
                  Sponsored R&D Projects
                </Link>
              </li>
              <li>
                <Link href="/faculty/login" className="hover:text-amber-300 transition flex items-center gap-1.5">
                  Faculty Login Portal <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-amber-300 transition flex items-center gap-1.5">
                  Admin Control Panel <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm tracking-wider uppercase text-amber-400 border-b border-neutral-800 pb-2">
              Contact Department
            </h4>
            <div className="space-y-2.5 text-sm text-neutral-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-1" />
                <span>Department of Computer Science & Engineering, NIT Hamirpur, Himachal Pradesh – 177005, India</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>head.cse@nith.ac.in</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>+91-1972-254400 / 254420</span>
              </p>
              <p className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <a href="https://nith.ac.in" target="_blank" rel="noreferrer" className="hover:underline">
                  www.nith.ac.in
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-neutral-800 text-center text-sm text-neutral-400 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} National Institute of Technology Hamirpur. All Rights Reserved.</p>
          <p className="text-xs text-neutral-500">
            Maintained by Department of Computer Science & Engineering, NIT Hamirpur.
          </p>
        </div>
      </div>
    </footer>
  );
}
