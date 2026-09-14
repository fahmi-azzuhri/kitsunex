import { Github } from "lucide-react";
import logo from "../assets/nganime.png";

export function AppFooter() {
  return (
    <footer>
      <div className="footer-brand">
        <span className="brand-mark">
          <img src={logo} alt="" />
        </span>
        <strong>Nganime</strong>
      </div>
      <span>Press play. Enter another world.</span>
      <a
        href="https://github.com/fahmi-azzuhri/nganime"
        target="_blank"
        rel="noreferrer"
      >
        <Github size={15} /> View on GitHub
      </a>
    </footer>
  );
}
