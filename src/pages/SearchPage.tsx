import type { Anime } from "../lib/api";
import { AnimeCard } from "../components/AnimeCard";

type SearchPageProps = {
  results: Anime[];
  navigate: (path: string) => void;
  title?: string;
};

export function SearchPage({
  results,
  navigate,
  title = "Find your next story.",
}: SearchPageProps) {
  return (
    <main className="content-page">
      <div className="page-heading">
        <div className="eyebrow">SEARCH RESULTS</div>
        <h1>{title}</h1>
        <p>
          {results.length
            ? `${results.length} titles found in the catalog.`
            : "No titles found. Try a different keyword."}
        </p>
      </div>
      <div className="anime-grid">
        {results.map((anime) => (
          <AnimeCard
            key={anime.linkId || anime.title}
            anime={anime}
            navigate={navigate}
          />
        ))}
      </div>
    </main>
  );
}
