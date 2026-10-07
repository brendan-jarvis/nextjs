import type { MetadataRoute } from "next";
import { allPosts, allProjects } from "contentlayer/generated";

import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/blog", "/projects", "/privacy"].map((path) => ({
    (path) => ({
      url: `${siteUrl}${path}`,
    }),
  );

  const posts = allPosts
    .filter((post) => post.published)
    .map((post) => ({
      url: `${siteUrl}${post.slug}`,
      lastModified: new Date(post.date),
    }));

  const projects = allProjects
    .filter((project) => project.published)
    .map((project) => ({
      url: `${siteUrl}${project.slug}`,
      lastModified: new Date(project.date),
    }));

  return [...staticRoutes, ...posts, ...projects];
}
