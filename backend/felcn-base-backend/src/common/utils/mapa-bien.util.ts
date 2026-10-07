import { get } from 'node:https'
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import sharp = require('sharp')

const PNG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

function coordenada(valor: unknown): number | null {
    if (valor == null || String(valor).trim() === '') return null
    const numero = Number(valor)
    return Number.isFinite(numero) ? numero : null
}

function descargar(url: string): Promise<{ imagen: Buffer; maxAge: number }> {
    return new Promise((resolve, reject) => {
        const peticion = get(url, {
            headers: { 'User-Agent': 'LGIReportes/1.0', Accept: 'image/png' },
        }, (respuesta) => {
            if (respuesta.statusCode !== 200) {
                respuesta.resume()
                reject(new Error(`Servidor cartográfico HTTP ${respuesta.statusCode}`))
                return
            }
            const bloques: Buffer[] = []
            let bytes = 0
            respuesta.on('data', (bloque: Buffer) => {
                bytes += bloque.length
                if (bytes > 2 * 1024 * 1024) {
                    respuesta.destroy(new Error('La imagen supera el tamaño permitido'))
                    return
                }
                bloques.push(bloque)
            })
            respuesta.on('error', reject)
            respuesta.on('end', () => {
                const imagen = Buffer.concat(bloques)
                if (!imagen.subarray(0, 8).equals(PNG)) {
                    reject(new Error('El servidor no devolvió una imagen PNG válida'))
                    return
                }
                const maxAge = Number(
                    String(respuesta.headers['cache-control'] ?? '').match(/max-age=(\d+)/)?.[1] ?? 0,
                )
                resolve({ imagen, maxAge })
            })
        })
        peticion.setTimeout(10000, () => peticion.destroy(new Error('Tiempo de espera del mapa agotado')))
        peticion.on('error', reject)
    })
}

export async function generarMapaBien(latitud: unknown, longitud: unknown) {
    const lat = coordenada(latitud)
    const lon = coordenada(longitud)
    if (lat === null || lon === null || lat < -85.05112878 || lat > 85.05112878 || lon < -180 || lon > 180) {
        return { mapaImagen: null, googleMapsUrl: null, mapaError: 'Sin coordenadas válidas para el mapa' }
    }
    const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(`${lat},${lon}`)
    try {
        // Una única tesela para el pequeño mapa solicitado; no descarga áreas ni varios zooms.
        const zoom = 15
        const n = 2 ** zoom
        const worldX = ((lon + 180) / 360 * n) % n
        const rad = lat * Math.PI / 180
        const worldY = (1 - Math.asinh(Math.tan(rad)) / Math.PI) / 2 * n
        const x = Math.floor(worldX)
        const y = Math.min(n - 1, Math.max(0, Math.floor(worldY)))
        const px = (worldX - x) * 256
        const py = (worldY - y) * 256
        const cacheDir = process.env.OSM_TILE_CACHE_DIR || join(process.cwd(), 'cache', 'osm-tiles')
        await mkdir(cacheDir, { recursive: true })
        const archivo = join(cacheDir, `${zoom}-${x}-${y}.png`)
        const metadata = `${archivo}.json`
        let tesela: Buffer | null = null
        try {
            const info = JSON.parse(await readFile(metadata, 'utf8'))
            const estado = await stat(archivo)
            if (Date.now() - estado.mtimeMs < info.ttlMs) tesela = await readFile(archivo)
        } catch { /* Cache ausente o vencida. */ }
        if (!tesela) {
            const baseUrl = process.env.OSM_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            const url = baseUrl.replace('{z}', String(zoom)).replace('{x}', String(x)).replace('{y}', String(y))
            const resultado = await descargar(url)
            tesela = resultado.imagen
            const ttlMs = Math.max(7 * 24 * 3600, resultado.maxAge) * 1000
            await writeFile(archivo, tesela)
            await writeFile(metadata, JSON.stringify({ ttlMs }))
        }
        // Marcador en la posición exacta dentro de la tesela. No inventa calles ni límites.
        // Pin rojo grande. La punta coincide con las coordenadas del bien.
        const marcador = Buffer.from(`
  <svg width="256" height="256"
       xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(${px}, ${py})">
      <path
        d="M0 0
           C-5 -10 -18 -23 -18 -36
           A18 18 0 1 1 18 -36
           C18 -23 5 -10 0 0 Z"
        fill="#e11919"
        stroke="#ffffff"
        stroke-width="3"
        stroke-linejoin="round"
      />
      <circle cx="0" cy="-36" r="6" fill="#ffffff" />
    </g>
  </svg>
`)

        const imagen = await sharp(tesela)
            .composite([{ input: marcador, left: 0, top: 0 }])
            .png()
            .toBuffer()
        return { mapaImagen: `data:image/png;base64,${imagen.toString('base64')}`, googleMapsUrl, mapaError: null }
    } catch (error) {
        // La falta de mapa no impide generar los datos del reporte.
        console.warn('Mapa del reporte no disponible:', error instanceof Error ? error.message : 'Error de mapa')
        return { mapaImagen: null, googleMapsUrl, mapaError: 'Mapa no disponible en este momento' }
    }
}
