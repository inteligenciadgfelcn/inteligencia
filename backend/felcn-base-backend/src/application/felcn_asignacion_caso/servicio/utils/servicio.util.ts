export function generarCodigoServicio(
  fechaIngreso: Date,
  fechaSalida: Date,
  ahora: Date
) {
  return (
    `ICIA-${fechaIngreso.getDate().toString().padStart(2, '0')}` +
    `${fechaSalida.getDate().toString().padStart(2, '0')}` +
    `${(ahora.getMonth() + 1).toString().padStart(2, '0')}` +
    `${ahora.getFullYear()}`
  )
}