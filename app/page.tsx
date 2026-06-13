import Image from "next/image";
import Link from "next/link";
import { formatPostDate } from "@/lib/date";
import { getAllPosts } from "@/lib/posts";

const POSTS_PER_PAGE = 8;

type HomeProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const posts = getAllPosts();
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params?.page ?? "1") || 1);
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedPosts = posts.slice((safePage - 1) * POSTS_PER_PAGE, safePage * POSTS_PER_PAGE);

  return (
    <main>
      <header className="site-header">
        <Link href="/" className="brand">
          Lemur VB
        </Link>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <h1>
            Okosabb tippek.
            <br />
            <em>Kevesebb kapkodás.</em>
          </h1>
          <p className="lead">
            Tippfogadási gondolatok, meccselemzések és letisztult döntési szempontok
            érthetően. Nem biztos tippeket ígérünk, hanem átgondolt logikát minden
            bejegyzés mögött.
          </p>
        </div>

        <div className="hero-image-wrap">
          <Image
            src="/front.webp"
            alt="Lemur VB tippfogadási blog nyitókép"
            width={1536}
            height={1024}
            priority
            className="hero-image"
          />
        </div>
      </section>

      <section className="blog-section" id="blog">
        <div className="section-heading">
          <p className="eyebrow">Tippek</p>
          <h2>Legfrissebb tippfogadási jegyzetek.</h2>
        </div>

        <div className="post-grid">
          {paginatedPosts.map((post) => (
            <Link href={`/blog/${post.slug}`} className="post-card" key={post.slug}>
              <div className="card-meta">
                <span>{formatPostDate(post.date)}</span>
                <span>{post.readingTime}</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <div className="tag-row">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 ? (
          <nav className="pagination" aria-label="Blog oldalak">
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              return (
                <Link
                  href={page === 1 ? "/" : `/?page=${page}`}
                  className={page === safePage ? "active" : ""}
                  key={page}
                >
                  {page}
                </Link>
              );
            })}
          </nav>
        ) : null}
      </section>
    </main>
  );
}
