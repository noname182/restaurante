/**
 * Convierte un string en un slug seguro para URLs
 * @param {string} text - Texto a convertir
 * @returns {string} - Slug limpio
 */
export function slugify(text) {
  return text
    .toString()
    .normalize('NFD')                   // Normaliza caracteres Unicode
    .replace(/[\u0300-\u036f]/g, '')    // Elimina diacríticos (acentos)
    .toLowerCase()                       // Convierte a minúsculas
    .trim()                             // Elimina espacios al inicio y final
    .replace(/[^a-z0-9\s-]/g, '')       // Elimina caracteres especiales (solo permite letras, números, espacios y guiones)
    .replace(/\s+/g, '-')               // Reemplaza espacios por guiones
    .replace(/-+/g, '-');               // Reemplaza múltiples guiones por uno solo
}
