// Formateo y validación de RUT — helper compartido.
// S4 (refinamiento — arquitectura de información): se extrae de PostulacionPage.jsx
// para que /perfil y /postulacion validen el RUT del estudiante con la misma regla,
// sin duplicar la lógica. Comportamiento idéntico al que tenía PostulacionPage.

/* Agrega puntos y guión mientras se escribe. Acepta hasta 8 dígitos + 1 dígito
   verificador (0-9 o K). Ej.: "123456789" -> "12.345.678-9". */
export function formatearRut(valor) {
  const limpio = valor.replace(/[^0-9kK]/g, '').slice(0, 9)
  if (limpio.length < 2) return limpio
  const cuerpo = limpio.slice(0, -1)
  const dv = limpio.slice(-1)
  return cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv
}

/* Valida solo el formato visible (con puntos y guión), no el dígito verificador —
   es un prototipo pedagógico, no un validador oficial. */
export function rutValido(rut) {
  return /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/.test(rut)
}
