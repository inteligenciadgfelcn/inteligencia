
export function cleanText(value?: string | null): string {
  if (!value) return ''
  return value
    .trim()
    .replace(/\s+/g, ' ') // colapsa espacios múltiples
}