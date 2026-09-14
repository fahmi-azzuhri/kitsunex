import type { ScheduleResponse } from "../lib/api";
import { Loading } from "../components/Loading";

type SchedulePageProps = {
  data: ScheduleResponse | null;
  navigate: (path: string) => void;
};

export function SchedulePage({ data, navigate }: SchedulePageProps) {
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
