export default function CategoryPagination({ current, last, goToPage }) {
  if (last <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-4 flex-wrap">
      {Array.from({ length: last }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => goToPage(i + 1)}
          className={`px-3 py-1 rounded-lg border 
            ${current === i + 1 ? "bg-pink-500 text-white" : "bg-white text-gray-700"}`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
