import { useState } from "react";
import { router } from "@inertiajs/react";

export default function ChildrenModal({ category, onClose, onEdit, refresh }) {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleting, setDeleting] = useState(false);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!confirm("¿Eliminar las subcategorías seleccionadas?")) return;

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
    if (refresh) refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl">

        {/* Título */}
        <h2 className="text-2xl font-bold mb-4">
          Subcategorías de {category.name}
        </h2>

        {/* Toolbar dentro del modal */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setSelectionMode((prev) => !prev)}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600"
          >
            {selectionMode ? "Cancelar selección" : "Eliminar Subcategorías"}
          </button>

          {selectionMode && (
            <button
              disabled={selectedIds.length === 0 || deleting}
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white font-semibold rounded-lg shadow hover:bg-red-800 disabled:opacity-50"
            >
              {deleting && (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              )}
              {deleting ? "Eliminando..." : "Eliminar seleccionadas"}
            </button>
          )}
        </div>

       {/* Contenedor scrollable */}
<div className="max-h-[400px] overflow-y-auto pr-2">

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {category.children.map((child) => (
      <div
        key={child.id}
        className="p-4 bg-gray-100 rounded-lg shadow flex flex-col justify-between"
      >
        <div className="flex items-start gap-2">

          {selectionMode && (
            <input
              type="checkbox"
              checked={selectedIds.includes(child.id)}
              onChange={() => toggleSelect(child.id)}
            />
          )}

          <div>
            <p className="font-semibold text-lg">{child.name}</p>
            <p className="text-sm text-gray-500">
              {child.products_count} productos
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <button
            className="text-yellow-600 hover:text-yellow-800 font-semibold"
            onClick={() => onEdit(child)}
          >
            Editar
          </button>

          <button
            className="text-blue-600 hover:text-blue-800 font-semibold"
            onClick={() =>
              router.get(`/admin/categories/${child.id}/products`)
            }
          >
            Ver productos →
          </button>
        </div>
      </div>
    ))}
  </div>

</div>


        {/* Cerrar */}
        <button
          className="mt-6 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 font-semibold"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
