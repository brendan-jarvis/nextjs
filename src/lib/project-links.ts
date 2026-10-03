export interface ProjectLink {
  href: string;
  label: string;
  kind: "live" | "repo" | "internal";
  external: boolean;
}

function isGitHub(url: string) {
  try {
    return new URL(url).hostname === "github.com";
  } catch {
    return false;
  }
}

function classify(url: string): ProjectLink {
  if (url.startsWith("/")) {
    return {
      href: url,
      label: "Try it on this site",
      kind: "internal",
      external: false,
    };
  }
  if (isGitHub(url)) {
    return {
      href: url,
      label: "Source on GitHub",
      kind: "repo",
      external: true,
    };
  }
  return { href: url, label: "Live site", kind: "live", external: true };
}

/**
 * Links for a project, taken only from its frontmatter: `url` (required)
 * and `repo` (optional). A GitHub `url` is shown as the source link; a
 * site-relative `url` such as `/asteroids` stays an in-site link.
 */
export function getProjectLinks(project: { url: string; repo?: string }) {
  const links = [classify(project.url)];
  if (project.repo && project.repo !== project.url) {
    links.push({
      href: project.repo,
      label: "Source on GitHub",
      kind: "repo",
      external: true,
    });
  }
  return links;
}
