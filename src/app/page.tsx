import Link from "next/link";
import { allPosts, allProjects } from "contentlayer/generated";
import { compareDesc, format } from "date-fns";

export default async function Home() {
  const posts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .slice(0, 4);

  const projects = allProjects
    .filter((project) => project.published)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      {/* Hero */}
      <section className="mb-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          Brendan Jarvis
        </h1>

        <p className="text-muted-foreground mt-4 text-xs">
          New Zealand-based • Eligible for Australian Special Category visa
        </p>

        <p className="mx-auto mt-4 max-w-2xl text-xl">
          <span className="bg-citrus-blaze p-1 text-slate-100">Kia ora</span>, I
          am a full-stack web developer with commercial C#/.NET and JavaScript
          experience.
        </p>

        <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-base">
          I build and maintain production systems for the New Zealand Department
          of Corrections and New Zealand Parole Board.
        </p>
      </section>

      {/* What I bring (directly echoes CV) */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">
          What I bring
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-card rounded-lg border p-6">
            <h3 className="font-medium">
              Production systems in regulated environments
            </h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Own and support the NZ Parole Board Hearing Management System
              (PBHS) on Microsoft Dynamics 365 — C# plugins, Azure Logic Apps
              integration to legacy systems, Cloud Flows, and L2/L3 incident
              response under real compliance obligations.
            </p>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <h3 className="font-medium">
              Responsible AI-augmented development
            </h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Use Claude Code daily for code navigation, defect investigation,
              and rapid remediation. Every AI-generated output is reviewed and
              validated before it ships to production.
            </p>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <h3 className="font-medium">
              End-to-end ownership &amp; integration
            </h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Full-stack work across C#/.NET (MVC, WCF, Dataverse plugins),
              Azure services, Oracle PL/SQL, and frontend (Kendo UI, React).
              Delivered fixes and features through go-live and ongoing support
              with tight release cadences.
            </p>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <h3 className="font-medium">Self-directed modern portfolio</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Active work in TypeScript, React/Next.js (this site), Python
              tooling, and interactive 3D (Three.js). Career-changer who brings
              structured thinking from law and science into engineering.
            </p>
          </div>
        </div>
      </section>

      {/* Recent writing */}
      <section className="mb-16">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            Recent writing
          </h2>
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-foreground text-sm font-medium"
          >
            All posts →
          </Link>
        </div>

        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <article key={post._id} className="group">
                <Link href={post.slug} className="block">
                  <h3 className="decoration-soft-lilac text-lg font-semibold underline group-hover:decoration-2">
                    {post.title}
                  </h3>
                  <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                    <time>{format(new Date(post.date), "dd MMM yyyy")}</time>
                    {post.description && (
                      <>
                        <span>•</span>
                        <span className="line-clamp-1">{post.description}</span>
                      </>
                    )}
                  </div>
                </Link>
              </article>
            ))
          ) : (
            <p className="text-muted-foreground">No published posts yet.</p>
          )}
        </div>
      </section>

      {/* Featured projects */}
      <section>
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            Featured projects
          </h2>
          <Link
            href="/projects"
            className="text-muted-foreground hover:text-foreground text-sm font-medium"
          >
            All projects →
          </Link>
        </div>

        {projects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((project) => (
              <Link
                key={project._id}
                href={project.slug}
                className="group bg-card hover:border-foreground/20 block rounded-lg border p-6 transition"
              >
                <h3 className="bg-seafoam-green p-1 text-lg font-semibold text-gray-700 group-hover:underline">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-muted-foreground mt-2 line-clamp-3 text-sm">
                    {project.description}
                  </p>
                )}
                <div className="bg-sunny-yellow mt-4 p-1 text-xs font-light text-gray-700">
                  {format(new Date(project.date), "MMM yyyy")}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No published projects yet.</p>
        )}
      </section>
    </div>
  );
}
