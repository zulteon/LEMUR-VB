import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPostDate } from "@/lib/date";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;

  try {
    const post = getPostBySlug(slug);
    return {
      title: `${post.title} | Lemur VB`,
      description: post.excerpt
    };
  } catch {
    return {
      title: "Cikk nem található | Lemur VB"
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  let post;

  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <main>
      <header className="site-header">
        <Link href="/" className="brand">
          Lemur VB
        </Link>
      </header>

      <article className="article-shell">
        <Link href="/#blog" className="back-link">
          ← Vissza a bloghoz
        </Link>
        <p className="eyebrow">Lemur VB</p>
        <h1>{post.title}</h1>
        <div className="article-meta">
          <span>{formatPostDate(post.date)}</span>
          <span>{post.readingTime}</span>
          {post.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="article-content" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>
    </main>
  );
}
