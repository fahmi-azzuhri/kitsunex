import { ChevronRight } from "lucide-react";
import type { Anime } from "../lib/api";

type LibraryPageProps = { results: Anime[]; navigate: (path: string) => void };

export function LibraryPage({ results, navigate }: LibraryPageProps) {
  return (
    <main className="content-page">
      <div className="page-heading">
        <div className="eyebrow">CATALOG INDEX</div>
        <h1>All anime</h1>
        <p>{results.length} titles in the catalog.</p>
      </div>
      <div className="library-list">
        {results.map((anime) => (
          <button
            className="library-item"
            key={anime.linkId || anime.title}
            onClick={() => navigate(`/anime/${anime.linkId}`)}
          >
            <span>{anime.title.charAt(0).toUpperCase()}</span>
            <strong>{anime.title}</strong>
            <ChevronRight size={16} />
          </button>
        ))}
      </div>
    </main>
  );
}
