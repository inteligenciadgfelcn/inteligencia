import { parsearFechaPura } from './date.util'

describe('parsearFechaPura', () => {
  it.each([
    ['1912-12-12', 1912, 12, 12],
    ['2000-01-01', 2000, 1, 1],
    ['2026-09-24', 2026, 9, 24],
  ])('%s conserva el día calendario en hora local', (valor, anio, mes, dia) => {
    const fecha = parsearFechaPura(valor)

    expect(fecha.getFullYear()).toBe(anio)
    expect(fecha.getMonth() + 1).toBe(mes)
    expect(fecha.getDate()).toBe(dia)
    expect(fecha.getHours()).toBe(0)
    expect(fecha.getMinutes()).toBe(0)
  })

  it('mantiene el comportamiento de new Date() para valores con hora', () => {
    const valor = '2026-09-24T15:30:00.000Z'

    expect(parsearFechaPura(valor).getTime()).toBe(new Date(valor).getTime())
  })
})
