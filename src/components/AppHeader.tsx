import { useState } from "react";
import { CalendarDays, Flame, Home, Menu, Search, Tv2, X } from "lucide-react";
import logo from "../assets/nganime.png";

type AppHeaderProps = {
  currentTitle: string;
  onNavigate: (path: string) => void;
};

export function AppHeader({ currentTitle, onNavigate }: AppHeaderProps) {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (path: string) => {
    onNavigate(path);
    setMenuOpen(false);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim()) navigate(`/search/${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="topbar">
      <button
        className="brand"
        onClick={() => navigate("/")}
        aria-label="Nganime home"
      >
        <span className="brand-mark">
          <img src={logo} alt="" />
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
  );
}
