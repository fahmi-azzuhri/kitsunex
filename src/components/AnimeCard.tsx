import { CirclePlay, Star } from "lucide-react";
import type { Anime } from "../lib/api";
import { posterFallback } from "../lib/constants";

type AnimeCardProps = { anime: Anime; navigate: (path: string) => void };

export function AnimeCard({ anime, navigate }: AnimeCardProps) {
  return (
    <article
      className="anime-card"
      onClick={() => navigate(`/anime/${anime.linkId}`)}
    >
      <div className="poster-wrap">
        <img src={anime.image || posterFallback} alt={anime.title} />
        <span className="poster-badge">
          {anime.episode || anime.status || "HD"}
        </span>
        <button className="poster-play" aria-label={`Play ${anime.title}`}>
          <CirclePlay size={22} fill="currentColor" />
        </button>
      </div>
      <div className="card-info">
        <h3>{anime.title}</h3>
        <div>
          <span>
            <Star size={13} fill="currentColor" />{" "}
            {anime.rating || anime.score || "8.6"}
          </span>
          <small>{anime.status || "Ongoing"}</small>
        </div>
      </div>
    </article>
  );
}
