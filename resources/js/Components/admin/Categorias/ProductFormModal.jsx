import { useState } from "react";

export default function ProductFormModal({ categoryId, product, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    files: [], // archivos nuevos
  });

  const [existingMedia, setExistingMedia] = useState(product?.multimedia || []);
  const [previews, setPreviews] = useState([]); // objetos {file, url}
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "files") {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setFormData((prev) => ({ ...prev, files: [...prev.files, ...newFiles] }));
      setPreviews((prev) => [...prev, ...newPreviews]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveExisting = (id) => {
    setExistingMedia((prev) => prev.filter((m) => m.id !== id));
  };

  const handleRemoveNewFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
    setPreviews((prev) => {
      // liberar URL.createObjectURL
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "files") {
          value.forEach((file) => data.append("files[]", file));
        } else if (value !== null) {
          data.append(key, value);
        }
      });

      const removedIds = product?.multimedia
        ?.filter((m) => !existingMedia.find((em) => em.id === m.id))
        .map((m) => m.id);
      if (removedIds?.length) {
        removedIds.forEach((id) => data.append("removed_media_ids[]", id));
      }

      let url = "/admin/products";
      let method = "POST";

      if (product) {
        url = `/admin/products/${product.id}`;
        data.append("_method", "PUT");
      } else {
        data.append("category_id", categoryId);
      }

      const res = await fetch(url, {
        method,
        headers: {
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
          "Accept": "application/json", // clave para evitar HTML
        },
        body: data,
      });

      if (!res.ok) {
        const text = await res.text();
        try {
          const jsonErr = JSON.parse(text);
          setErrors(jsonErr.errors || {});
        } catch {
          console.error("Error inesperado:", text);
          alert("Error inesperado del servidor");
        }
        setLoading(false);
        return;
      }

      const json = await res.json();

      if (json.status === "success") {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onSave(json.product, !!product);
        }, 1500);
      } else {
        alert("Error al guardar producto");
      }
    } catch (err) {
      console.error(err);
      alert("Error en la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="w-24 h-24 border-4 border-gray-200 border-t-pink-600 rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && !success && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 grid gap-6 overflow-auto max-h-[90vh]"
          >
            <h2 className="text-2xl font-bold text-center text-gray-800">
              {product ? "Editar" : "Agregar"} Producto
            </h2>

            {Object.keys(errors).length > 0 && (
              <div className="bg-red-100 text-red-700 p-2 rounded">
                {Object.entries(errors).map(([field, msgs]) => (
                  <p key={field}>{field}: {msgs.join(", ")}</p>
                ))}
              </div>
            )}

            {/* Multimedia existente */}
            {existingMedia.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {existingMedia.map((media) => (
                  <div key={media.id} className="relative">
                    {media.type === "image" ? (
                      <img src={media.url} className="w-full h-24 object-cover rounded border" />
                    ) : (
                      <video src={media.url} className="w-full h-24 rounded" controls />
                    )}
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white rounded px-1"
                      onClick={() => handleRemoveExisting(media.id)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Previews de archivos nuevos */}
            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {previews.map(({ file, url }, i) => {
                  const isVideo = file.type.startsWith("video");
                  return (
                    <div key={i} className="relative">
                      {isVideo ? (
                        <video src={url} className="w-full h-24 rounded" controls />
                      ) : (
                        <img src={url} className="w-full h-24 object-cover rounded border" />
                      )}
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded px-1"
                        onClick={() => handleRemoveNewFile(i)}
                      >
                        X
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* INPUTS */}
            <div className="grid gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Precio ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Agregar Multimedia</label>
                <input
                  type="file"
                  name="files"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* BOTONES */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={onClose}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-pink-600 text-white rounded"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
