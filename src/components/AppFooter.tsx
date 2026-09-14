import { Github, Tv2 } from "lucide-react";

export function AppFooter() {
  return (
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
  );
}
