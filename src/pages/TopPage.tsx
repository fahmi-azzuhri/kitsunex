import { ChevronRight } from "lucide-react";
import type { TopResponse } from "../lib/api";
import { Loading } from "../components/Loading";

type TopPageProps = {
  data: TopResponse | null;
  navigate: (path: string) => void;
};

export function TopPage({ data, navigate }: TopPageProps) {
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
