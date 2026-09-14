import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  ChevronRight,
  CirclePlay,
  Clock3,
  Download,
  Flame,
  Github,
  Home,
  Info,
  Menu,
  Search,
  Star,
  Trophy,
  Tv2,
  X,
} from "lucide-react";
import {
  getAnimeDetail,
  getBatch,
  getEpisode,
  getHome,
  getLatest,
  getLibrary,
  getMovies,
  getSchedule,
  getTop10,
  searchAnime,
  type Anime,
  type AnimeDetail,
  type Episode,
  type EpisodeDetail,
  type PageResponse,
  type ScheduleResponse,
  type TopResponse,
} from "./lib/api";
const posterFallback =
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=700&q=85";
const demoAnime: Anime[] = [
  {
    title: "Frieren: Beyond Journey’s End",
    image:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=700&q=85",
    linkId: "frieren-beyond-journeys-end",
    rating: "9.1",
    status: "Ongoing",
    episode: "Episode 28",
  },
  {
    title: "Dandadan",
    image:
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=700&q=85",
    linkId: "dandadan",
    rating: "8.8",
    status: "Ongoing",
    episode: "Episode 12",
  },
  {
    title: "The Apothecary Diaries",
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01988a5?auto=format&fit=crop&w=700&q=85",
    linkId: "kusuriya-no-hitorigoto",
    rating: "8.9",
    status: "Ongoing",
    episode: "Episode 24",
  },
  {
    title: "Jujutsu Kaisen",
    image:
      "https://images.unsplash.com/photo-1614583225154-5fcdda07019f?auto=format&fit=crop&w=700&q=85",
    linkId: "jujutsu-kaisen",
    rating: "9.0",
    status: "Completed",
    episode: "Episode 47",
  },
];

function normalizeAnime(item: Anime): Anime {
  return {
    ...item,
    image: item.image || posterFallback,
    linkId: item.linkId || item.link?.split("/").filter(Boolean).pop(),
  };
}

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [home, setHome] = useState<{ season: Anime[]; latest: Anime[] }>({
    season: [],
    latest: [],
  });
  const [detail, setDetail] = useState<AnimeDetail | null>(null);
  const [episode, setEpisode] = useState<EpisodeDetail | null>(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [catalog, setCatalog] = useState<PageResponse | null>(null);
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
  const [top10, setTop10] = useState<TopResponse | null>(null);
  const [catalogResults, setCatalogResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiOnline, setApiOnline] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (next: string) => {
    window.history.pushState({}, "", next);
    setPath(next);
    window.scrollTo(0, 0);
    setMenuOpen(false);
  };

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setLoadError(false);
      try {
        const url = new URL(path, window.location.origin);
        const page = Number(url.searchParams.get("page") || "1");
        if (url.pathname.startsWith("/anime/"))
          setDetail(await getAnimeDetail(url.pathname.replace("/anime/", "")));
        else if (url.pathname.startsWith("/watch/"))
          setEpisode(await getEpisode(url.pathname.replace("/watch/", "")));
        else if (url.pathname.startsWith("/search/"))
          setSearchResults(
            (
              await searchAnime(
                decodeURIComponent(url.pathname.replace("/search/", "")),
              )
            ).results.map(normalizeAnime),
          );
        else if (url.pathname === "/latest") {
          const data = await getLatest(page);
          setCatalog({ ...data, items: data.items.map(normalizeAnime) });
        } else if (url.pathname === "/batch") {
          const data = await getBatch(page);
          setCatalog({ ...data, items: data.items.map(normalizeAnime) });
        } else if (url.pathname === "/schedule") {
          const scheduleData = await getSchedule();
          if (!scheduleData.days.Jumat && scheduleData.days.Jumaat) {
            scheduleData.days.Jumat = scheduleData.days.Jumaat;
          }
          if (scheduleData.days.Jadwal?.length) {
            scheduleData.days.Senin = scheduleData.days.Senin?.length
              ? scheduleData.days.Senin
              : scheduleData.days.Jadwal;
          }
          setSchedule(scheduleData);
        } else if (url.pathname === "/top10") setTop10(await getTop10());
        else if (url.pathname === "/library")
          setCatalogResults((await getLibrary()).results.map(normalizeAnime));
        else if (url.pathname === "/movies")
          setCatalogResults((await getMovies()).results.map(normalizeAnime));
        else {
          const [data, topData] = await Promise.all([getHome(), getTop10()]);
          setTop10(topData);
          setHome({
            season: (data.season || []).map(normalizeAnime),
            latest: (data.latest || []).map(normalizeAnime),
          });
        }
        setApiOnline(true);
      } catch {
        setApiOnline(false);
        if (path === "/")
          setHome({
            season: demoAnime,
            latest: demoAnime.map((item, index) => ({
              ...item,
              episode: `Episode ${24 - index}`,
            })),
          });
        if (path !== "/") setLoadError(true);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [path]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim()) navigate(`/search/${encodeURIComponent(query.trim())}`);
  };
  const currentTitle = useMemo(
    () =>
      path === "/"
        ? "Home"
        : path.startsWith("/watch/")
          ? "Watch"
          : path.startsWith("/search/")
            ? "Search"
            : "Anime detail",
    [path],
  );

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="brand"
          onClick={() => navigate("/")}
          aria-label="Nganime home"
        >
          <span className="brand-mark">
            <Tv2 size={20} />
          </span>
          <span>
            Ng<span>anime</span>
          </span>
        </button>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <button
            className={currentTitle === "Home" ? "nav-link active" : "nav-link"}
            onClick={() => navigate("/")}
          >
            <Home size={16} /> Home
          </button>
          <button className="nav-link" onClick={() => navigate("/latest")}>
            <Flame size={16} /> Latest
          </button>
          <button className="nav-link" onClick={() => navigate("/schedule")}>
            <CalendarDays size={16} /> Schedule
          </button>
          <button
            className="nav-link"
            onClick={() =>
              document
                .getElementById("latest")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <Flame size={16} /> Trending
          </button>
        </nav>
        <form className="search-box" onSubmit={handleSearch}>
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search anime..."
            aria-label="Search anime"
          />
        </form>
        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {!apiOnline && (
        <div className="api-note">
          <Info size={14} /> API belum merespons, menampilkan preview katalog.
        </div>
      )}
      {loading ? (
        <Loading />
      ) : loadError ? (
        <LoadError onRetry={() => window.location.reload()} />
      ) : path.startsWith("/watch/") ? (
        <WatchPage episode={episode} navigate={navigate} />
      ) : path.startsWith("/anime/") ? (
        <DetailPage detail={detail} navigate={navigate} />
      ) : path.startsWith("/search/") ? (
        <SearchPage results={searchResults} navigate={navigate} />
      ) : path.startsWith("/latest") || path.startsWith("/batch") ? (
        <CatalogPage
          data={catalog}
          kind={path.startsWith("/batch") ? "batch" : "latest"}
          navigate={navigate}
        />
      ) : path === "/schedule" ? (
        <SchedulePage data={schedule} navigate={navigate} />
      ) : path === "/library" ? (
        <LibraryPage results={catalogResults} navigate={navigate} />
      ) : path === "/movies" ? (
        <SearchPage
          results={catalogResults}
          navigate={navigate}
          title="Latest movies"
        />
      ) : (
        <HomePage data={home} top10={top10} navigate={navigate} />
      )}
      <footer>
        <div className="footer-brand">
          <span className="brand-mark">
            <Tv2 size={18} />
          </span>
          <strong>Nganime</strong>
        </div>
        <span>Made for late-night anime sessions.</span>
        <a href="https://github.com" target="_blank" rel="noreferrer">
          <Github size={15} /> View on GitHub
        </a>
      </footer>
    </div>
  );
}

function Loading() {
  return (
    <main className="loading">
      <div className="loader" />
      <p>Menyiapkan episode pilihanmu...</p>
    </main>
  );
}

function LoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <main className="loading">
      <Info size={28} />
      <p>Data dari backend belum bisa dimuat.</p>
      <button className="button primary" onClick={onRetry}>
        Coba lagi
      </button>
    </main>
  );
}

function HomePage({
  data,
  top10,
  navigate,
}: {
  data: { season: Anime[]; latest: Anime[] };
  top10: TopResponse | null;
  navigate: (path: string) => void;
}) {
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

function LatestReleaseRow({
  anime,
  navigate,
}: {
  anime: Anime;
  navigate: (path: string) => void;
}) {
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

function SectionHeading({
  icon,
  title,
  action,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  action: string;
  onClick?: () => void;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="heading-icon">{icon}</span>
        <h2>{title}</h2>
      </div>
      <button onClick={onClick}>
        {action} <ChevronRight size={15} />
      </button>
    </div>
  );
}

function CatalogPage({
  data,
  kind,
  navigate,
}: {
  data: PageResponse | null;
  kind: "latest" | "batch";
  navigate: (path: string) => void;
}) {
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

function Pagination({
  page,
  totalPages,
  navigate,
  path,
}: {
  page: number;
  totalPages: number;
  navigate: (path: string) => void;
  path: string;
}) {
  const pages = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => Math.max(1, Math.min(page - 2, totalPages - 4)) + index,
  ).filter((item) => item <= totalPages);
  return (
    <div className="pagination">
      <button
        className="button ghost"
        disabled={page <= 1}
        onClick={() => navigate(`${path}?page=${page - 1}`)}
      >
        Previous
      </button>
      {pages.map((item) => (
        <button
          className={item === page ? "page-number active" : "page-number"}
          key={item}
          onClick={() => navigate(`${path}?page=${item}`)}
        >
          {item}
        </button>
      ))}
      <button
        className="button ghost"
        disabled={page >= totalPages}
        onClick={() => navigate(`${path}?page=${page + 1}`)}
      >
        Next
      </button>
    </div>
  );
}

function SchedulePage({
  data,
  navigate,
}: {
  data: ScheduleResponse | null;
  navigate: (path: string) => void;
}) {
  if (!data) return <Loading />;
  return (
    <main className="content-page">
      <div className="page-heading">
        <div className="eyebrow">WEEKLY CALENDAR</div>
        <h1>Release schedule</h1>
        <p>Track the next episode by release day.</p>
      </div>
      <div className="schedule-grid">
        {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map(
          (day) => {
            const items = data.days[day] || [];
            return (
              <section className="schedule-day" key={day}>
                <h2>{day}</h2>
                {items.length ? (
                  items.map((item) => (
                    <button
                      className="schedule-item"
                      key={`${day}-${item.linkId}`}
                      onClick={() => navigate(`/anime/${item.linkId}`)}
                    >
                      <span>{item.time || "--:--"}</span>
                      <strong>{item.title}</strong>
                      <small>{item.rating || "-"} rating</small>
                    </button>
                  ))
                ) : (
                  <p className="empty-state">No releases</p>
                )}
              </section>
            );
          },
        )}
      </div>
    </main>
  );
}

function TopPage({
  data,
  navigate,
}: {
  data: TopResponse | null;
  navigate: (path: string) => void;
}) {
  if (!data) return <Loading />;
  return (
    <main className="content-page">
      <div className="page-heading">
        <div className="eyebrow">COMMUNITY PICKS</div>
        <h1>Top 10 this week</h1>
        <p>Most popular titles from Samehadaku this week.</p>
      </div>
      <div className="top-list">
        {data.items.map((item) => (
          <button
            className="top-item"
            key={item.linkId}
            onClick={() => navigate(`/anime/${item.linkId}`)}
          >
            <span>{String(item.rank).padStart(2, "0")}</span>
            <div>
              <strong>{item.title}</strong>
              <small>{item.rating || "-"} rating</small>
            </div>
            <ChevronRight size={18} />
          </button>
        ))}
      </div>
    </main>
  );
}

function LibraryPage({
  results,
  navigate,
}: {
  results: Anime[];
  navigate: (path: string) => void;
}) {
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

function AnimeCard({
  anime,
  navigate,
}: {
  anime: Anime;
  navigate: (path: string) => void;
}) {
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

function DetailPage({
  detail,
  navigate,
}: {
  detail: AnimeDetail | null;
  navigate: (path: string) => void;
}) {
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
              detail.list_episode?.[detail.list_episode.length - 1] &&
              navigate(
                `/watch/${detail.list_episode[detail.list_episode.length - 1].id}`,
              )
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
        <div className="section-heading">
          <div>
            <span className="heading-icon">
              <Tv2 size={19} />
            </span>
            <h2>Episodes</h2>
          </div>
          <span className="muted">
            {detail.list_episode?.length || 0} episodes
          </span>
        </div>
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

function SearchPage({
  results,
  navigate,
  title = "Find your next story.",
}: {
  results: Anime[];
  navigate: (path: string) => void;
  title?: string;
}) {
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

function WatchPage({
  episode,
  navigate,
}: {
  episode: EpisodeDetail | null;
  navigate: (path: string) => void;
}) {
  if (!episode) return <Loading />;
  const sources =
    episode.downloadEps?.flatMap((format) =>
      format.data.map((item) => ({ ...item, format: format.format })),
    ) || [];
  return (
    <main className="watch-page">
      <button className="back-button" onClick={() => navigate("/")}>
        <ArrowLeft size={17} /> Back to home
      </button>
      <div className="video-frame">
        {episode.embedUrl ? (
          <iframe
            className="video-player"
            src={episode.embedUrl}
            title={episode.title || `Episode ${episode.eps}`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="video-placeholder">
            <CirclePlay size={58} strokeWidth={1.2} />
            <span>Streaming source belum tersedia</span>
            <small>Pilih mirror resolusi di bawah</small>
          </div>
        )}
      </div>
      <div className="watch-heading">
        <div>
          <div className="eyebrow">NOW PLAYING</div>
          <h1>{episode.title || `Episode ${episode.eps}`}</h1>
          <p>
            {episode.detail_anime?.title} <span>•</span> Uploaded{" "}
            {episode.date_uploaded || "recently"}
          </p>
        </div>
        <button className="button ghost">
          <Bookmark size={17} /> Save
        </button>
      </div>
      <section className="download-panel">
        <div className="section-heading">
          <div>
            <span className="heading-icon">
              <Download size={18} />
            </span>
            <h2>Download sources</h2>
          </div>
          <span className="muted">{sources.length} available</span>
        </div>
        <div className="source-list">
          {sources.length ? (
            sources.map((source) => (
              <a
                className="source-row"
                href={
                  source.link.gdrive ||
                  source.link.reupload ||
                  source.link.zippyshare ||
                  source.link.direct
                }
                target="_blank"
                rel="noreferrer"
                key={`${source.format}-${source.quality}`}
              >
                <span>{source.quality || "HD"}</span>
                <strong>{source.format || "Direct download"}</strong>
                <small>
                  Open source <ChevronRight size={14} />
                </small>
              </a>
            ))
          ) : (
            <p className="empty-state">
              Sumber download belum tersedia untuk episode ini.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
