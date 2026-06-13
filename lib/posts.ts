import fs from "node:fs";
import path from "node:path";

const postsDirectory = path.join(process.cwd(), "posts");

export type PostMeta = {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  slug: string;
  readingTime: string;
};

export type Post = PostMeta & {
  contentHtml: string;
};

type FrontMatter = {
  title?: string;
  date?: string;
  excerpt?: string;
  tags?: string | string[];
};

function ensurePostsDirectory() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }
}

function parseFrontMatter(fileContent: string) {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    return { data: {} as FrontMatter, content: fileContent };
  }

  const data = match[1].split(/\r?\n/).reduce<FrontMatter>((frontMatter, line) => {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      return frontMatter;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");

    if (key === "tags") {
      frontMatter.tags = value
        .replace(/^\[|\]$/g, "")
        .split(",")
        .map((tag) => tag.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
      return frontMatter;
    }

    if (key === "title" || key === "date" || key === "excerpt") {
      frontMatter[key] = value;
    }

    return frontMatter;
  }, {});

  return { data, content: match[2] };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function inlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

function markdownToHtml(markdown: string) {
  const lines = markdown.trim().split(/\r?\n/);
  const html: string[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length) {
      html.push(`<ul>${listItems.join("")}</ul>`);
      listItems = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    const bulletMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      listItems.push(`<li>${inlineMarkdown(bulletMatch[1])}</li>`);
      continue;
    }

    flushList();

    if (trimmed.startsWith("### ")) {
      html.push(`<h3>${inlineMarkdown(trimmed.slice(4))}</h3>`);
    } else if (trimmed.startsWith("## ")) {
      html.push(`<h2>${inlineMarkdown(trimmed.slice(3))}</h2>`);
    } else if (trimmed.startsWith("# ")) {
      html.push(`<h1>${inlineMarkdown(trimmed.slice(2))}</h1>`);
    } else {
      html.push(`<p>${inlineMarkdown(trimmed)}</p>`);
    }
  }

  flushList();
  return html.join("\n");
}

function estimateReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} perc`;
}

function getSlug(filename: string) {
  return filename.replace(/\.md$/i, "");
}

export function getAllPosts(): PostMeta[] {
  ensurePostsDirectory();

  return fs
    .readdirSync(postsDirectory)
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      const slug = getSlug(filename);
      const fullPath = path.join(postsDirectory, filename);
      const fileContent = fs.readFileSync(fullPath, "utf8");
      const { data, content } = parseFrontMatter(fileContent);

      return {
        slug,
        title: data.title ?? slug.replace(/-/g, " "),
        date: data.date ?? "Dátum nélkül",
        excerpt: data.excerpt ?? content.split(/\r?\n/).find(Boolean) ?? "",
        tags: Array.isArray(data.tags) ? data.tags : [],
        readingTime: estimateReadingTime(content)
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post {
  ensurePostsDirectory();

  const fullPath = path.join(postsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found: ${slug}`);
  }

  const fileContent = fs.readFileSync(fullPath, "utf8");
  const { data, content } = parseFrontMatter(fileContent);

  return {
    slug,
    title: data.title ?? slug.replace(/-/g, " "),
    date: data.date ?? "Dátum nélkül",
    excerpt: data.excerpt ?? content.split(/\r?\n/).find(Boolean) ?? "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    readingTime: estimateReadingTime(content),
    contentHtml: markdownToHtml(content)
  };
}
