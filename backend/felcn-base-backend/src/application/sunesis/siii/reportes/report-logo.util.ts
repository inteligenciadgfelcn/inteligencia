import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

let _cache: string | null = null

/**
 * Lee el logo institucional desde disco y lo devuelve como base64.
 * El resultado se cachea en memoria para el ciclo de vida del proceso.
 *
 * Coloca el archivo en:
 *   src/application/sunesis/siii/reportes/assets/logo.png
 *
 * En producción (dist/) Nest lo copia automáticamente vía nest-cli.json assets.
 */
export function getLogoBase64(): string {
  if (_cache !== null) return _cache

  const filePath = join(__dirname, 'assets', 'logo.png')

  if (!existsSync(filePath)) {
    console.warn(`[report-logo] logo.png no encontrado en: ${filePath}`)
    _cache = ''
    return _cache
  }

  _cache = readFileSync(filePath).toString('base64')
  return _cache
}
