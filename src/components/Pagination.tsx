type PaginationProps = {
  page: number;
  totalPages: number;
  navigate: (path: string) => void;
  path: string;
};

export function Pagination({
  page,
  totalPages,
  navigate,
  path,
}: PaginationProps) {
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
