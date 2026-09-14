import {
  ArrowLeft,
  Bookmark,
  ChevronRight,
  CirclePlay,
  Download,
} from "lucide-react";
import type { EpisodeDetail } from "../lib/api";
import { Loading } from "../components/Loading";
import { SectionHeading } from "../components/SectionHeading";

type WatchPageProps = {
  episode: EpisodeDetail | null;
  navigate: (path: string) => void;
};

export function WatchPage({ episode, navigate }: WatchPageProps) {
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
        <SectionHeading
          icon={<Download size={18} />}
          title="Download sources"
          action=""
          rightContent={
            <span className="muted">{sources.length} available</span>
          }
        />
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
