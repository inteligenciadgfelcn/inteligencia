/**
 * Formato de error RFC 9457 (Problem Details for HTTP APIs).
 * Se responde con Content-Type: application/problem+json.
 * Docs: docs/fiscalia/PROPUESTA-APIS-FISCALIA.md
 */
export interface ProblemDetails {
  type: string
  title: string
  status: number
  detail?: string
  /** Extensión: errores de validación por campo */
  errores?: Record<string, string[]>
}

export const PROBLEM_JSON_CONTENT_TYPE = 'application/problem+json'
