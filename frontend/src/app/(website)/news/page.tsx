import Link from "next/link";
import { Megaphone, Award, ArrowRight } from "lucide-react";
import { MOCK_ANNOUNCEMENTS, MOCK_POSTS } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function NewsOverviewPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Updates &amp; Highlights</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          News &amp; Announcements
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Stay updated with latest departmental circulars, faculty honors, and student achievements.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Announcements Column */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <Megaphone className="h-5 w-5 text-primary" /> Recent Announcements
            </h2>
            <Link href="/news/announcements" className="text-xs font-semibold text-primary hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-4">
            {MOCK_ANNOUNCEMENTS.map((ann) => (
              <div key={ann.id} className="rounded-xl border border-border/80 bg-background p-4">
                <span className="text-xs font-mono text-muted-foreground">{formatDate(ann.publish_date)}</span>
                <h3 className="mt-1 text-sm font-bold text-foreground">{ann.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{ann.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Column */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <Award className="h-5 w-5 text-chart-2" /> Achievements
            </h2>
            <Link href="/news/achievements" className="text-xs font-semibold text-primary hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-4">
            {MOCK_POSTS.map((post) => (
              <div key={post.id} className="rounded-xl border border-border/80 bg-background p-4">
                <span className="rounded bg-chart-2/10 px-2 py-0.5 text-xs font-bold text-chart-2">
                  {post.category}
                </span>
                <h3 className="mt-2 text-sm font-bold text-foreground">{post.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{post.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
