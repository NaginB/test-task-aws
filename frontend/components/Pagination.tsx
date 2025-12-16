"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-40">
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="px-4 py-2 text-white hover:text-primary transition-colors"
        >
          Prev
        </button>
      )}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            page === currentPage
              ? "bg-primary text-white"
              : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}
      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="px-4 py-2 text-white hover:text-primary transition-colors"
        >
          Next
        </button>
      )}
    </div>
  );
}
