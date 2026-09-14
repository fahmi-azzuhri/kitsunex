import { Info } from "lucide-react";

export function LoadError({ onRetry }: { onRetry: () => void }) {
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
