import { useEffect, useState } from "react";
import VariantFormModal from "./VariantFormModal";

export default function ProductVariantsModal({ product, onClose }) {
  const [attributes, setAttributes] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showVariantModal, setShowVariantModal] = useState(false);
  const [variantToEdit, setVariantToEdit] = useState(null);

  useEffect(() => {
  if (!product?.id) return;

  fetch(`/admin/products/${product.id}/attributes`, {
    credentials: 'include'
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      setAttributes(data.attributes);
      setVariants(data.variants);
    })
    .catch(err => console.error(err));
}, [product]);

  const handleDeleteVariant = async (variantId) => {
    if (!confirm("¿Eliminar variante?")) return;
    try {
      const res = await fetch(`/admin/variants/${variantId}`, {
        method: "DELETE",
        headers: { "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content }
      });
      const json = await res.json();
      if (json.status === "success") setVariants(prev => prev.filter(v => v.id !== variantId));
      else alert("Error al eliminar variante");
    } catch (err) {
      console.error(err);
      alert("Error en la solicitud");
    }
  };

  const handleSaveVariant = async ({ selectedAttribute, selectedValue, price, stock }) => {
  setShowVariantModal(false);
  setLoading(true);

  try {
    if (variantToEdit) {
      // EDITAR variante
      const res = await fetch(`/admin/variants/${variantToEdit.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({ 
          price: price !== "" ? parseFloat(price) : null, // price puede ser null
          stock: parseInt(stock) 
        })
      });
      const json = await res.json();
      if (json.status === "success") {
        setVariants(prev => prev.map(v => v.id === variantToEdit.id ? json.variant : v));
      } else alert("Error al actualizar variante");
    } else {
      // CREAR variante
      if (!selectedAttribute || !selectedValue) return alert("Selecciona atributo y valor");

      const res = await fetch(`/admin/products/${product.id}/variants`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({ 
          combinations: [[parseInt(selectedValue)]],
          price: price !== "" ? parseFloat(price) : null, // price opcional
          stock: parseInt(stock) 
        })
      });
      const json = await res.json();
      if (json.status === "success") {
        setVariants(prev => [...prev, ...json.variants]);
      } else alert("Error al crear variante");
    }
  } catch (err) {
    console.error(err);
    alert("Error en la solicitud");
  } finally {
    setLoading(false);
    setVariantToEdit(null);
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-4 overflow-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl mt-12">
        <h2 className="text-xl font-bold mb-4">Variantes de {product.name}</h2>

        {/* Tabla de variantes */}
        <div className="overflow-auto mb-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-1">SKU</th>
                <th className="border px-2 py-1">Valores</th>
                <th className="border px-2 py-1">Precio</th>
                <th className="border px-2 py-1">Stock</th>
                <th className="border px-2 py-1">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {variants.map(v => (
                <tr key={v.id}>
                  <td className="border px-2 py-1">{v.sku}</td>
                  <td className="border px-2 py-1">
                    {v.values?.map(val => val.value).join(", ") || ''}
                  </td>
                  <td className="border px-2 py-1">{v.price !== null ? v.price : "–"}</td>

                  <td className="border px-2 py-1">{v.stock}</td>
                  <td className="border px-2 py-1 flex gap-2">
                    <button
                      onClick={() => { setVariantToEdit(v); setShowVariantModal(true); }}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteVariant(v.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mb-4"
          onClick={() => { setVariantToEdit(null); setShowVariantModal(true); }}
        >
          Crear variante
        </button>

        <button
          className="px-4 py-2 bg-gray-300 rounded mt-4"
          onClick={onClose}
        >
          Cerrar
        </button>

        {/* Modal secundario */}
        <VariantFormModal
          show={showVariantModal}
          onClose={() => setShowVariantModal(false)}
          attributes={attributes}
          onSave={handleSaveVariant}
          variant={variantToEdit}
        />
      </div>
    </div>
  );
}
