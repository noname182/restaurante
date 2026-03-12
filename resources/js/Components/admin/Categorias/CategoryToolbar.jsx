import { useState } from "react";

export default function CategoryToolbar({
  selectionMode,
  setSelectionMode,
  selectedIds,
  setSelectedIds,
  openCreate,
  refresh
}) {

  const [deleting, setDeleting] = useState(false);

  const handleDeleteSelected = async () => {
    if (!confirm("¿Eliminar las categorías seleccionadas?")) return;

    setDeleting(true);

    await fetch("/admin/categories/bulk-delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({ ids: selectedIds })
    });

    setDeleting(false);
    setSelectedIds([]);
    setSelectionMode(false);
    refresh();
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6 ">
      <button
        onClick={openCreate}
        className="px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow hover:bg-pink-600"
      >
        + Crear categoría
      </button>

      <button
        onClick={() => setSelectionMode(prev => !prev)}
        className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600"
      >
        {selectionMode ? "Cancelar selección" : "Eliminar Categorías"}
      </button>

      {selectionMode && (
        <button
          disabled={selectedIds.length === 0 || deleting}
          onClick={handleDeleteSelected}
          className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white font-semibold rounded-lg shadow hover:bg-red-800 disabled:opacity-50"
        >
          {deleting && (
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          )}
          {deleting ? "Eliminando..." : "Eliminar seleccionadas"}
        </button>
      )}
    </div>
  );
}
