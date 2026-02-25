export const numeroAleatorio = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min

export const transformarFecha = (fecha: string) => {
  const [dia, mes, anio] = fecha.split('/')
  return `${anio}-${mes}-${dia}`
}
