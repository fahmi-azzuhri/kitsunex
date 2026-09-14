import { CirclePlay, Flame, Info, Star, Trophy } from "lucide-react";
import type { Anime, TopResponse } from "../lib/api";
import { demoAnime, posterFallback } from "../lib/constants";
import { LatestReleaseRow } from "../components/LatestReleaseRow";
import { SectionHeading } from "../components/SectionHeading";

type HomePageProps = {
  data: { season: Anime[]; latest: Anime[] };
  top10: TopResponse | null;
  navigate: (path: string) => void;
};

export function HomePage({ data, top10, navigate }: HomePageProps) {
  const featured = data.latest[0] || data.season[0] || demoAnime[0];
  return (
    <main>
      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(16,19,18,.96) 12%, rgba(16,19,18,.72) 47%, rgba(16,19,18,.15)), url(${featured.image})`,
        }}
      >
        <div className="hero-copy">
          <div className="eyebrow">
            <span /> FEATURED THIS WEEK
          </div>
          <h1>{featured.title}</h1>
          <p className="hero-meta">
            <span className="rating">
              <Star size={15} fill="currentColor" />{" "}
              {featured.rating || featured.score || "8.9"}
            </span>
            <span>{featured.status || "Ongoing"}</span>
            <span>•</span>
            <span>Japanese audio</span>
          </p>
          <p className="hero-text">
            Your next obsession is waiting. Stream the latest episodes and
            explore stories worth staying up late for.
          </p>
          <div className="hero-actions">
            <button
              className="button primary"
              onClick={() => navigate(`/anime/${featured.linkId}`)}
            >
              <CirclePlay size={18} fill="currentColor" /> Start watching
            </button>
            <button
              className="button ghost"
              onClick={() => navigate(`/anime/${featured.linkId}`)}
            >
              <Info size={17} /> Details
            </button>
          </div>
        </div>
        <div className="hero-side">
          <span>01</span>
          <div className="hero-line" />
          <span>04</span>
        </div>
      </section>
      <section className="content-section" id="latest">
        <SectionHeading
          icon={<Flame size={19} />}
          title="Latest releases"
          action="View all"
          onClick={() => navigate("/latest")}
        />
        <div className="latest-list">
          {(data.latest.length ? data.latest : demoAnime)
            .slice(0, 5)
            .map((anime) => (
              <LatestReleaseRow
                key={anime.linkId || anime.title}
                anime={anime}
                navigate={navigate}
              />
            ))}
        </div>
      </section>
      <section className="content-section top-home-section">
        <SectionHeading
          icon={<Trophy size={19} />}
          title="Top 10 minggu ini"
          action=""
        />
        <div className="top-home-grid">
          {(top10?.items || []).slice(0, 10).map((item) => (
            <button
              className="top-home-card"
              key={item.linkId}
              onClick={() => navigate(`/anime/${item.linkId}`)}
            >
              <span className="top-home-rank">
                {String(item.rank).padStart(2, "0")}
              </span>
              <img src={item.image || posterFallback} alt="" />
              <div className="top-home-copy">
                <strong>{item.title}</strong>
                <small>
                  <Star size={12} fill="currentColor" /> {item.rating || "-"}
                </small>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
