import { ChevronRight } from "lucide-react";
import type { Anime } from "../lib/api";
import { posterFallback } from "../lib/constants";

type LatestReleaseRowProps = { anime: Anime; navigate: (path: string) => void };

export function LatestReleaseRow({ anime, navigate }: LatestReleaseRowProps) {
  return (
    <button
      className="latest-release-row"
      onClick={() => navigate(`/anime/${anime.linkId}`)}
    >
      <div className="latest-release-thumb">
        <img src={anime.image || posterFallback} alt="" />
      </div>
      <div className="latest-release-copy">
        <strong>{anime.title}</strong>
        <span>{anime.episode || "Episode terbaru"}</span>
      </div>
      <small>{anime.release_time || "Recently released"}</small>
      <ChevronRight size={17} />
    </button>
  );
}
