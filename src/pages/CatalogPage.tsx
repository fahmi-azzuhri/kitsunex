import type { PageResponse } from "../lib/api";
import { AnimeCard } from "../components/AnimeCard";
import { Loading } from "../components/Loading";
import { Pagination } from "../components/Pagination";

type CatalogPageProps = {
  data: PageResponse | null;
  kind: "latest" | "batch";
  navigate: (path: string) => void;
};

export function CatalogPage({ data, kind, navigate }: CatalogPageProps) {
  if (!data) return <Loading />;
  const title = kind === "latest" ? "Latest releases" : "Anime batch";
  return (
    <main className="content-page">
      <div className="page-heading">
        <div className="eyebrow">
          {kind === "latest" ? "NEW EPISODES" : "BATCH ARCHIVE"}
        </div>
        <h1>{title}</h1>
        <p>
          Page {data.page} of {data.totalPages}
        </p>
      </div>
      <div className="anime-grid catalog-grid">
        {data.items.map((anime) => (
          <AnimeCard
            key={anime.linkId || anime.title}
            anime={anime}
            navigate={navigate}
          />
        ))}
      </div>
      <Pagination
        page={data.page}
        totalPages={data.totalPages}
        navigate={navigate}
        path={`/${kind}`}
      />
    </main>
  );
}
