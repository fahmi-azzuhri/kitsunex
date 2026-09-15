import { ArrowLeft, Bookmark, CirclePlay, Star, Tv2 } from "lucide-react";
import type { AnimeDetail } from "../lib/api";
import { posterFallback } from "../lib/constants";
import { Loading } from "../components/Loading";
import { SectionHeading } from "../components/SectionHeading";

type DetailPageProps = {
  detail: AnimeDetail | null;
  navigate: (path: string) => void;
};

export function DetailPage({ detail, navigate }: DetailPageProps) {
  if (!detail) return <Loading />;
  const genres = (detail.genre || detail.genres || []).map((genre) =>
    typeof genre === "string" ? genre : genre.text,
  );
  return (
    <main className="detail-page">
      <button className="back-button" onClick={() => navigate("/")}>
        <ArrowLeft size={17} /> Back to home
      </button>
      <section className="detail-hero">
        <img
          className="detail-poster"
          src={detail.image || posterFallback}
          alt={detail.title}
        />
        <div className="detail-copy">
          <div className="eyebrow">ANIME PROFILE</div>
          <h1>{detail.title}</h1>
          <div className="detail-stats">
            <span className="rating">
              <Star size={15} fill="currentColor" />{" "}
              {detail.ratingValue || detail.rating || "8.9"}
            </span>
            <span>{detail.status || "Ongoing"}</span>
            <span>
              <Tv2 size={14} /> {detail.list_episode?.length || 12} eps
            </span>
          </div>
          <p>
            {detail.sinopsis ||
              "A story that stays with you long after the credits roll."}
          </p>
          <div className="genre-list">
            {genres.map((genre) => (
              <span key={genre}>{genre}</span>
            ))}
          </div>
          <button
            className="button primary"
            onClick={() =>
              detail.list_episode?.[0] &&
              navigate(`/watch/${detail.list_episode[0].id}`)
            }
          >
            <CirclePlay size={18} fill="currentColor" /> Watch latest
          </button>
        </div>
        <button className="save-button" aria-label="Save anime">
          <Bookmark size={19} />
        </button>
      </section>
      <section className="episode-section">
        <SectionHeading
          icon={<Tv2 size={19} />}
          title="Episodes"
          action=""
          rightContent={
            <span className="muted">
              {detail.list_episode?.length || 0} episodes
            </span>
          }
        />
        <div className="episode-grid">
          {(detail.list_episode || []).map((item) => (
            <button
              className="episode-item"
              key={item.id}
              onClick={() => navigate(`/watch/${item.id}`)}
            >
              <span>EP {item.episode}</span>
              <strong>{item.title || `Episode ${item.episode}`}</strong>
              <small>{item.date_uploaded || "Recently added"}</small>
              <CirclePlay size={17} />
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
