import { useState, useEffect } from "react";

export default function VariantFormModal({
    show,
    onClose,
    attributes,
    onSave,
    variant = null
}) {
    const [selectedAttribute, setSelectedAttribute] = useState("");
    const [selectedValue, setSelectedValue] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");

 useEffect(() => {
  if (variant) {
    const attrId = variant.values[0]?.attribute_id || "";
    const valId = variant.values[0]?.id || "";
    setSelectedAttribute(attrId);
    setSelectedValue(valId);
    setPrice(variant.price ?? ""); // aquí
    setStock(variant.stock ?? ""); // y aquí
  } else {
    setSelectedAttribute("");
    setSelectedValue("");
    setPrice("");
    setStock("");
  }
}, [variant]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-4 overflow-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mt-12">
                <h2 className="text-xl font-bold mb-4">
                    {variant ? "Editar Variante" : "Crear Variante"}
                </h2>

                <div className="grid gap-4 mb-4">
                    {/* Combo de Atributos */}
                    <div>
                        <p className="font-semibold">Atributo</p>
                        <select
                            className="w-full mt-1 border rounded px-2 py-1"
                            value={selectedAttribute || ""}
                            onChange={e => {
                                setSelectedAttribute(e.target.value);
                                setSelectedValue("");
                            }}
                        >
                            <option value="">-- Selecciona un atributo --</option>
                            {attributes.map(attr => (
                                <option key={attr.id} value={attr.id}>{attr.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Combo de Valores */}
                    <div>
                        <p className="font-semibold">Valor</p>
                        <select
                            className="w-full mt-1 border rounded px-2 py-1"
                            value={selectedValue || ""}
                            onChange={e => setSelectedValue(e.target.value)}
                            disabled={!selectedAttribute}
                        >
                            <option value="">-- Selecciona un valor --</option>
                            {selectedAttribute &&
                                attributes.find(attr => attr.id == selectedAttribute)?.values.map(val => (
                                    <option key={val.id} value={val.id}>{val.value}</option>
                                ))}
                        </select>
                    </div>

                    <input
                        type="number"
                        placeholder="Precio"
                        value={price ?? ""} // reemplaza null con string vacío
                        onChange={e => setPrice(e.target.value)}
                        className="w-full border rounded px-2 py-1"
                    />
                    <input
                        type="number"
                        placeholder="Stock"
                        value={stock ?? ""} // reemplaza null con string vacío
                        onChange={e => setStock(e.target.value)}
                        className="w-full border rounded px-2 py-1"
                    />
                </div>

                <div className="flex gap-2 justify-end">
                    <button
                        className="px-4 py-2 bg-gray-300 rounded"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() => onSave({ selectedAttribute, selectedValue, price, stock })}
                    >
                        {variant ? "Guardar cambios" : "Crear"}
                    </button>
                </div>
            </div>
        </div>
    );
}
