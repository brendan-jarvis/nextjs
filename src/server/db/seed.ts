import fs from "fs";
import path from "path";
import { db } from "./index";
import { posts, comments, projects } from "./schema";

interface Frontmatter {
  title: string;
  description?: string;
  date: string;
  published?: boolean;
  image?: string;
  authors?: string[];
  url?: string;
  tags?: string;
}

function parseFrontmatter(content: string): {
  frontmatter: Frontmatter;
  body: string;
} {
  const match = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/.exec(content);
  if (!match) {
    return { frontmatter: {} as Frontmatter, body: content };
  }
  const yaml = match[1];
  const body = match[2].trim();
  const frontmatter: Record<string, unknown> = {};
  const lines = yaml.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const colonIndex = line.indexOf(":");
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      if (value === "" || value === "[]") {
        // multi-line list coming
        const list: string[] = [];
        let j = i + 1;
        while (j < lines.length) {
          const next = lines[j].trim();
          if (next.startsWith("-")) {
            const item = next
              .slice(1)
              .trim()
              .replace(/^["']|["']$/g, "");
            if (item) list.push(item);
            j++;
          } else if (next === "" || next.startsWith("#")) {
            j++;
          } else {
            break;
          }
        }
        frontmatter[key] = list;
        i = j - 1;
        continue;
      }
      if (value.startsWith("[") && value.endsWith("]")) {
        frontmatter[key] = value
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replace(/^["']|["']$/g, ""));
      } else {
        frontmatter[key] = value.replace(/^["']|["']$/g, "");
      }
    }
  }
  return { frontmatter: frontmatter as Frontmatter, body };
}

function readMdxFiles(
  dir: string,
): Array<{ frontmatter: Frontmatter; body: string; filename: string }> {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  return files.map((file) => {
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { frontmatter, body } = parseFrontmatter(raw);
    return { frontmatter, body, filename: file };
  });
}

async function seed() {
  console.log("Seeding database with full MDX content...");

  // Clean slate (for demo purposes)
  await db.delete(comments);
  await db.delete(posts);
  await db.delete(projects);

  const blogDir = path.join(process.cwd(), "content", "blog");
  const projectsDir = path.join(process.cwd(), "content", "projects");

  const blogFiles = readMdxFiles(blogDir);
  const projectFiles = readMdxFiles(projectsDir);

  // Seed Posts (blog)
  let motorcyclePostId: number | null = null;

  for (const { frontmatter, body, filename } of blogFiles) {
    const date = new Date(frontmatter.date);
    const [inserted] = await db
      .insert(posts)
      .values({
        authorId: (frontmatter.authors?.[0] ?? "brendanjarvis")
          .toLowerCase()
          .replace(/\s+/g, ""),
        title: frontmatter.title,
        description: frontmatter.description,
        content: body, // full MDX body
        image: frontmatter.image,
        published: frontmatter.published ?? true,
        authors: frontmatter.authors ?? [],
        date,
        createdAt: date,
        updatedAt: date,
        tags: frontmatter.tags,
      })
      .returning();

    console.log(`Inserted post: ${inserted.title} (id: ${inserted.id})`);

    if (filename.includes("restricted-licence")) {
      motorcyclePostId = inserted.id;
    }
  }

  // Seed Projects
  for (const { frontmatter, body } of projectFiles) {
    const date = new Date(frontmatter.date);
    const [inserted] = await db
      .insert(projects)
      .values({
        authorId: (frontmatter.authors?.[0] ?? "brendanjarvis")
          .toLowerCase()
          .replace(/\s+/g, ""),
        title: frontmatter.title,
        description: frontmatter.description,
        content: body, // full MDX body
        image: frontmatter.image,
        url: frontmatter.url!,
        published: frontmatter.published ?? true,
        authors: frontmatter.authors ?? [],
        date,
        createdAt: date,
        updatedAt: date,
      })
      .returning();

    console.log(`Inserted project: ${inserted.title} (id: ${inserted.id})`);
  }

  // Add test comment from Grok on the motorcycle post
  if (motorcyclePostId) {
    const [comment] = await db
      .insert(comments)
      .values({
        postId: motorcyclePostId,
        authorId: "grok",
        authorName: "Grok X",
        content:
          "Hey from Grok! This is a test comment added via the seed script to demonstrate the restored Supabase + Drizzle + tRPC database functionality. The restricted licence test tips are excellent — especially the advice on u-turns and handling the radio. Ride safe! 🤖🏍️",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    console.log(
      `Inserted test comment from Grok on post ${motorcyclePostId} (comment id: ${comment.id})`,
    );
  }

  console.log("Seeding complete! Tables now contain full MDX content.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
