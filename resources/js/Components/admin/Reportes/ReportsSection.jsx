import { useState } from "react";

export default function ReportsSection() {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("diario"); // diario | semanal | mensual | anual

  const formatDate = (d) => d.toISOString().slice(0, 10);

  // Fechas base
  const hoy = new Date();
  const ayer = new Date(Date.now() - 86400000);

  // Semana actual
  const semanaActualInicio = new Date(hoy);
  semanaActualInicio.setDate(hoy.getDate() - hoy.getDay());
  const semanaActualFin = new Date(semanaActualInicio);
  semanaActualFin.setDate(semanaActualInicio.getDate() + 6);

  // Semana pasada
  const semanaPasadaInicio = new Date(semanaActualInicio);
  semanaPasadaInicio.setDate(semanaActualInicio.getDate() - 7);
  const semanaPasadaFin = new Date(semanaActualFin);
  semanaPasadaFin.setDate(semanaActualFin.getDate() - 7);

  // Mes actual
  const mesActualInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const mesActualFin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

  // Mes pasado
  const mesPasadoInicio = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
  const mesPasadoFin = new Date(hoy.getFullYear(), hoy.getMonth(), 0);

  // Año actual
  const anoActualInicio = new Date(hoy.getFullYear(), 0, 1);
  const anoActualFin = new Date(hoy.getFullYear(), 11, 31); 

  const generarReporte = async (start = null, end = null) => {
    const d = start ? formatDate(start) : desde;
    const h = end ? formatDate(end) : hasta;

    if (!d || !h) {
      alert("Debe seleccionar un rango válido.");
      return;
    }

    setLoading(true);
    setReporte(null);

    try {
      const response = await fetch(`/admin/reportes?desde=${d}&hasta=${h}`);
      const data = await response.json();
      // Guardamos lo que venga (maneja distintas estructuras)
      setReporte(data);
    } catch (err) {
      console.error("Reporte error:", err);
      alert("Error generando el reporte.");
    } finally {
      setLoading(false);
    }
  };

  const exportFile = (type) => {
    // type: 'excel' | 'csv' | 'pdf'
    // usa las rutas: /admin/reportes/excel?desde=... etc
    const d = desde;
    const h = hasta;
    if (!d || !h) {
      alert("Seleccione un rango antes de exportar.");
      return;
    }

    let url = `/admin/reportes/${type === "excel" ? "excel" : type === "csv" ? "csv" : "pdf"}?desde=${d}&hasta=${h}`;

    // Para PDF abrimos en nueva pestaña (mejor experiencia), para excel/csv forzamos descarga.
    if (type === "pdf") {
      window.open(url, "_blank");
    } else {
      // forzamos la descarga navegando a la url
      window.location.href = url;
    }
  };

const exportFileprod = (type) => {
  const url = `/admin/${type === "excel" ? "productos/excel" : type === "csv" ? "productos/csv" : "productos/pdf"}`;

  if (type === "pdf") {
    window.open(url, "_blank");
  } else {
    window.location.href = url;
  }
};



  // Helpers para leer respuesta con tolerancia a distintos formatos
  const getTotales = () => {
    if (!reporte) return { total_pedidos: 0, total_vendido: 0, total_items_vendidos: 0 };
    // algunos controladores devuelven reporte.totales, otros devuelven totales directo
    const t = reporte.totales ?? reporte.data?.totales ?? reporte;
    return {
      total_pedidos: Number(t?.total_pedidos ?? t?.totalPedidos ?? 0) || 0,
      total_vendido: Number(t?.total_vendido ?? t?.total_vendido_total ?? t?.total_vendido ?? t?.total ?? 0) || 0,
      total_items_vendidos: Number(t?.total_items_vendidos ?? t?.total_items ?? t?.items_vendidos ?? 0) || 0,
    };
  };

  const getDetalle = () => {
    if (!reporte) return [];
    return reporte.detalle ?? reporte.data?.detalle ?? reporte.details ?? reporte.detalles ?? [];
  };

  const getProductos = () => {
    if (!reporte) return [];
    return reporte.productos ?? reporte.data?.productos ?? reporte.products ?? [];
  };

  const totales = getTotales();
  const detalle = getDetalle();
  const productos = getProductos();

  const formatMoney = (n) => {
    if (isNaN(Number(n))) return n ?? "0";
    return Number(n).toLocaleString("es-BO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="flex flex-col items-center w-full pt-10 px-4">
      {/* Fullscreen Loader */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
            <svg className="animate-spin h-10 w-10" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <div className="font-semibold">Generando reporte...</div>
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Reportes de Ventas </h2>

        
        <div className="flex gap-3 mb-6">
          {["diario", "semanal", "mensual", "anual"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                tab === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* TAB CARD */}
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full mb-6">
          {tab === "diario" && (
            <>
              <h3 className="text-xl font-bold mb-3">Reportes Diarios</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 rounded bg-blue-600 text-white"
                      onClick={() => {
                        const s = new Date(hoy);
                        generarReporte(s, s);
                        setDesde(formatDate(s));
                        setHasta(formatDate(s));
                      }}
                    >
                      Hoy
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-blue-600 text-white"
                      onClick={() => {
                        const s = new Date(ayer);
                        generarReporte(s, s);
                        setDesde(formatDate(s));
                        setHasta(formatDate(s));
                      }}
                    >
                      Ayer
                    </button>
                  </div>

                  <div>
                    <label className="text-sm block mb-1">Elegir día</label>
                    <input
                      type="date"
                      className="w-full border rounded p-2"
                      onChange={(e) => {
                        setDesde(e.target.value);
                        setHasta(e.target.value);
                      }}
                    />
                  </div>

                  <button
                    className="w-full bg-blue-600 text-white py-2 rounded mt-2"
                    onClick={() => generarReporte()}
                  >
                    Generar reporte diario
                  </button>
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm text-gray-600">
                    Usa las opciones rápidas o selecciona manualmente las fechas. Luego exporta desde los botones a la derecha.
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === "semanal" && (
            <>
              <h3 className="text-xl font-bold mb-3">Reportes Semanales</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 rounded bg-blue-600 text-white"
                      onClick={() => {
                        generarReporte(semanaActualInicio, semanaActualFin);
                        setDesde(formatDate(semanaActualInicio));
                        setHasta(formatDate(semanaActualFin));
                      }}
                    >
                      Semana actual
                    </button>

                    <button
                      className="px-4 py-2 rounded bg-blue-600 text-white"
                      onClick={() => {
                        generarReporte(semanaPasadaInicio, semanaPasadaFin);
                        setDesde(formatDate(semanaPasadaInicio));
                        setHasta(formatDate(semanaPasadaFin));
                      }}
                    >
                      Semana pasada
                    </button>
                  </div>

                  <div>
                    <label className="text-sm block mb-1">Elegir fecha dentro de la semana</label>
                    <input
                      type="date"
                      className="w-full border rounded p-2"
                      onChange={(e) => {
                        const f = new Date(e.target.value);
                        const start = new Date(f);
                        start.setDate(f.getDate() - f.getDay());
                        const end = new Date(start);
                        end.setDate(start.getDate() + 6);

                        setDesde(formatDate(start));
                        setHasta(formatDate(end));
                      }}
                    />
                  </div>

                  <button
                    className="w-full bg-blue-600 text-white py-2 rounded mt-2"
                    onClick={() => generarReporte()}
                  >
                    Generar reporte semanal
                  </button>
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm text-gray-600">Selecciona una semana o usa las opciones rápidas.</div>
                </div>
              </div>
            </>
          )}

          {tab === "mensual" && (
            <>
              <h3 className="text-xl font-bold mb-3">Reportes Mensuales</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 rounded bg-blue-600 text-white"
                      onClick={() => {
                        generarReporte(mesActualInicio, mesActualFin);
                        setDesde(formatDate(mesActualInicio));
                        setHasta(formatDate(mesActualFin));
                      }}
                    >
                      Mes actual
                    </button>

                    <button
                      className="px-4 py-2 rounded bg-blue-600 text-white"
                      onClick={() => {
                        generarReporte(mesPasadoInicio, mesPasadoFin);
                        setDesde(formatDate(mesPasadoInicio));
                        setHasta(formatDate(mesPasadoFin));
                      }}
                    >
                      Mes pasado
                    </button>
                  </div>

                  <div>
                    <label className="text-sm block mb-1">Elegir mes</label>
                    <input
                      type="month"
                      className="w-full border rounded p-2"
                      onChange={(e) => {
                        const [year, month] = e.target.value.split("-");
                        const inicio = new Date(year, month - 1, 1);
                        const fin = new Date(year, month, 0);

                        setDesde(formatDate(inicio));
                        setHasta(formatDate(fin));
                      }}
                    />
                  </div>

                  <button
                    className="w-full bg-blue-600 text-white py-2 rounded mt-2"
                    onClick={() => generarReporte()}
                  >
                    Generar reporte mensual
                  </button>
                </div>

                <div className="md:col-span-2">
                  <div className="text-sm text-gray-600">Selecciona un mes o usa las plantillas rápidas.</div>
                </div>
              </div>
            </>
          )}

          {tab === "anual" && (
            <>
              <h3 className="text-xl font-bold mb-3">Reportes Anuales</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-3">
                  <div>
                    <button
                      className="px-4 py-2 rounded bg-blue-600 text-white"
                      onClick={() => {
                        generarReporte(anoActualInicio, anoActualFin);
                        setDesde(formatDate(anoActualInicio));
                        setHasta(formatDate(anoActualFin));
                      }}
                    >
                      Año actual
                    </button>
                  </div>

                  <div>
                    <label className="text-sm block mb-1">Elegir año</label>
                    <input
                      type="number"
                      placeholder="Ej: 2024"
                      className="w-full border rounded p-2"
                      onChange={(e) => {
                        const year = Number(e.target.value);
                        const inicio = new Date(year, 0, 1);
                        const fin = new Date(year, 11, 31);

                        setDesde(formatDate(inicio));
                        setHasta(formatDate(fin));
                      }}
                    />
                  </div>

                  <button
                    className="w-full bg-blue-600 text-white py-2 rounded mt-2"
                    onClick={() => generarReporte()}
                  >
                    Generar reporte anual
                  </button>
                </div>

                <div className="md:col-span-2">
                  <div className="text-sm text-gray-600">Introduce el año deseado y genera el reporte.</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* EXPORT & RANGE SUMMARY */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              <div><strong>Desde:</strong> {desde || "—"}</div>
              <div><strong>Hasta:</strong> {hasta || "—"}</div>
            </div>
          </div>

          <div className="flex ">
      
            <button
              className="px-4 py-2 rounded bg-white border text-gray-700 hover:bg-gray-50"
              onClick={() => exportFile("pdf")}
            >
              Ver / Exportar PDF
            </button>

            <button
              className="px-4 py-2 rounded bg-white border text-gray-700 hover:bg-gray-50"
              onClick={() => exportFileprod("pdf")}
            >
              Ver / Exportar PDF de productos
            </button>
          </div>
        </div>

        {/* RESULTADOS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Totales */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h4 className="text-lg font-bold mb-4">Resumen General</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total de pedidos</span>
                <span className="font-semibold">{totales.total_pedidos}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total vendido</span>
                <span className="font-semibold">$ {formatMoney(totales.total_vendido)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Ítems vendidos</span>
                <span className="font-semibold">{totales.total_items_vendidos}</span>
              </div>
            </div>
          </div>

          {/* Productos Top */}
          <div className="bg-white p-6 rounded-2xl shadow-lg lg:col-span-2">
            <h4 className="text-lg font-bold mb-4">Productos Vendidos</h4>

            {productos.length === 0 ? (
              <div className="text-sm text-gray-600">No hubo ventas en este periodo.</div>
            ) : (
              <ul className="space-y-2 max-h-48 overflow-auto">
                {productos.map((p, i) => (
                  <li key={i} className="flex justify-between items-center border rounded p-3">
                    <div>
                      <div className="font-semibold">{p.producto ?? p.name}</div>
                      <div className="text-sm text-gray-500">{p.cantidad_total ?? p.quantity ?? 0} unidades</div>
                    </div>
                    <div className="text-sm font-semibold">$ {formatMoney(p.total_generado ?? p.total ?? 0)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Detalle (tabla) */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold">Detalle de Pedidos</h4>
            <div className="text-sm text-gray-500">Lista de items por pedido (scroll si es necesario)</div>
          </div>

          <div className="overflow-auto max-h-96 border rounded">
            <table className="min-w-full divide-y">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Pedido</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Producto</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Cantidad</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Subtotal ($)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {detalle.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-sm text-gray-500">
                      No hay registros para este periodo.
                    </td>
                  </tr>
                )}

                {detalle.map((d, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{d.pedido ?? d.order_id ?? d.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{d.producto ?? d.name ?? "-"}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">{d.cantidad ?? d.quantity ?? 0}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">$ {formatMoney(d.subtotal ?? d.total ?? 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
