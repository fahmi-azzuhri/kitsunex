import { useEffect, useMemo, useState } from "react";
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
  type EpisodeDetail,
  type PageResponse,
  type ScheduleResponse,
  type TopResponse,
} from "./lib/api";
import { demoAnime } from "./lib/constants";
import { AppFooter } from "./components/AppFooter";
import { AppHeader } from "./components/AppHeader";
import { LoadError } from "./components/LoadError";
import { Loading } from "./components/Loading";
import { CatalogPage } from "./pages/CatalogPage";
import { DetailPage } from "./pages/DetailPage";
import { HomePage } from "./pages/HomePage";
import { LibraryPage } from "./pages/LibraryPage";
import { SchedulePage } from "./pages/SchedulePage";
import { SearchPage } from "./pages/SearchPage";
import { TopPage } from "./pages/TopPage";
import { WatchPage } from "./pages/WatchPage";

function normalizeAnime(item: Anime): Anime {
  return {
    ...item,
    image: item.image || demoAnime[0].image,
    linkId: item.linkId || item.link?.split("/").filter(Boolean).pop(),
  };
}

function App() {
  const [path, setPath] = useState(
    window.location.pathname + window.location.search,
  );
  const [home, setHome] = useState<{ season: Anime[]; latest: Anime[] }>({
    season: [],
    latest: [],
  });
  const [detail, setDetail] = useState<AnimeDetail | null>(null);
  const [episode, setEpisode] = useState<EpisodeDetail | null>(null);
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [catalog, setCatalog] = useState<PageResponse | null>(null);
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
  const [top10, setTop10] = useState<TopResponse | null>(null);
  const [catalogResults, setCatalogResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiOnline, setApiOnline] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const navigate = (next: string) => {
    window.history.pushState({}, "", next);
    setPath(next);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const onPop = () =>
      setPath(window.location.pathname + window.location.search);
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
          if (!scheduleData.days.Jumat && scheduleData.days.Jumaat)
            scheduleData.days.Jumat = scheduleData.days.Jumaat;
          if (scheduleData.days.Jadwal?.length)
            scheduleData.days.Senin = scheduleData.days.Senin?.length
              ? scheduleData.days.Senin
              : scheduleData.days.Jadwal;
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
        if (path === "/" || path === "")
          setHome({
            season: demoAnime,
            latest: demoAnime.map((item, index) => ({
              ...item,
              episode: `Episode ${24 - index}`,
            })),
          });
        if (path !== "/" && path !== "") setLoadError(true);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [path]);

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

  const content = loading ? (
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
  ) : path === "/top10" ? (
    <TopPage data={top10} navigate={navigate} />
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
  );

  return (
    <div className="app-shell">
      <AppHeader currentTitle={currentTitle} onNavigate={navigate} />
      {!apiOnline && (
        <div className="api-note">
          API belum merespons, menampilkan preview katalog.
        </div>
      )}
      {content}
      <AppFooter />
    </div>
  );
}

export default App;
