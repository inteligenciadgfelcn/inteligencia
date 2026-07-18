/**
 * Aplica trim() a todos los campos string de un objeto, salvo los indicados en `excluir`.
 * No es recursivo: solo procesa las propiedades de primer nivel.
 */
export function trimPayload<T extends object>(
  payload: T,
  excluir: (keyof T)[] = []
): T {
  const resultado = { ...payload } as Record<keyof T, unknown>
  for (const key of Object.keys(resultado) as (keyof T)[]) {
    if (excluir.includes(key)) continue
    const valor = resultado[key]
    if (typeof valor === 'string') {
      resultado[key] = valor.trim()
    }
  }
  return resultado as T
}
