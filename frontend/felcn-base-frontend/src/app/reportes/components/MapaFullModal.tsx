'use client'

import React from 'react'

export interface CoordenadaBase {
  idOperativo: string
  numeroCaso: string
  numeroOperativo: string
  coordX: number | null
  coordY: number | null
}

function generarKML(coordenadas: CoordenadaBase[]): string {
  const validas = coordenadas.filter(
    c => c.coordX != null && c.coordY != null &&
      !isNaN(parseFloat(String(c.coordX))) &&
      !isNaN(parseFloat(String(c.coordY)))
  )

  const placemarks = validas.map(c => `
    <Placemark>
      <name>Caso: ${c.numeroCaso}</name>
      <description>Operativo: ${c.numeroOperativo}</description>
      <Point>
        <coordinates>${parseFloat(String(c.coordY))},${parseFloat(String(c.coordX))},0</coordinates>
      </Point>
    </Placemark>`).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Operativos FELCN</name>
    <description>Exportación de coordenadas GPS de operativos</description>${placemarks}
  </Document>
</kml>`
}

export function descargarCSV(coordenadas: CoordenadaBase[]) {
  const validas = coordenadas.filter(
    c => c.coordX != null && c.coordY != null &&
      !isNaN(parseFloat(String(c.coordX))) &&
      !isNaN(parseFloat(String(c.coordY)))
  )
  const encabezado = 'Numero de Caso,Numero de Operativo,Latitud,Longitud'
  const filas = validas.map(c =>
    `${c.numeroCaso},${c.numeroOperativo},${parseFloat(String(c.coordX))},${parseFloat(String(c.coordY))}`
  )
  const contenido = [encabezado, ...filas].join('\n')
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `operativos_felcn_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function descargarKML(coordenadas: CoordenadaBase[]) {
  const contenido = generarKML(coordenadas)
  const blob = new Blob([contenido], { type: 'application/vnd.google-earth.kml+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `operativos_felcn_${new Date().toISOString().slice(0, 10)}.kml`
  a.click()
  URL.revokeObjectURL(url)
}

function generateMapaOperativosSrcDoc(coordenadas: CoordenadaBase[], origin: string) {
  const coordFiltradas = coordenadas.filter(c => c.coordX != null && c.coordY != null && !isNaN(parseFloat(String(c.coordX))) && !isNaN(parseFloat(String(c.coordY))))
  const markersJson = JSON.stringify(
    coordFiltradas.map(c => ({
      lat: parseFloat(String(c.coordX)),
      lng: parseFloat(String(c.coordY)),
      caso: c.numeroCaso,
      operativo: c.numeroOperativo,
    }))
  )
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link rel="stylesheet" href="${origin}/leaflet/leaflet.css"/>
      <script src="${origin}/leaflet/leaflet.js"></script>
      <style>
        html, body, #map { height: 100%; margin: 0; padding: 0; }
        .custom-popup .leaflet-popup-content-wrapper {
          background: #0f172a;
          color: #f8fafc;
          border-radius: 8px;
          font-family: 'Nunito', sans-serif;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        .custom-popup .leaflet-popup-tip {
          background: #0f172a;
        }
        .leaflet-tooltip-own {
          background: #0f172a !important;
          color: #f8fafc !important;
          border: 1px solid #3b82f6 !important;
          border-radius: 6px !important;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3) !important;
          font-family: 'Nunito', sans-serif !important;
          padding: 4px 8px !important;
        }
        .leaflet-tooltip-own::before {
          border-top-color: #3b82f6 !important;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const markersData = ${markersJson};
        const map = L.map('map').setView([0, 0], 2);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }).addTo(map);

        if (markersData.length > 0) {
          const bounds = [];
          markersData.forEach(m => {
            const marker = L.marker([m.lat, m.lng]).addTo(map);
            
            // Tooltip que se muestra al pasar el puntero (hover)
            marker.bindTooltip(\`
              <div style="font-size: 11px; line-height: 1.3;">
                <strong style="color: #38bdf8; font-weight: 700;">Caso: \${m.caso}</strong><br/>
                <span style="color: #cbd5e1; font-weight: 500;">Op: \${m.operativo}</span>
              </div>
            \`, {
              direction: 'top',
              className: 'leaflet-tooltip-own',
              opacity: 0.95
            });

            // Popup al hacer clic
            marker.bindPopup(\`
              <div class="custom-popup" style="font-size: 12px; line-height: 1.4;">
                <strong style="color: #38bdf8; font-size: 13px;">Caso: \${m.caso}</strong><br/>
                <span style="color: #cbd5e1;">Operativo: \${m.operativo}</span><br/>
                <span style="color: #94a3b8; font-family: monospace; font-size: 10px;">Coordenadas: \${String(m.lat).replace('.', ',')}, \${String(m.lng).replace('.', ',')}</span>
              </div>
            \`);
            bounds.push([m.lat, m.lng]);
          });
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      </script>
    </body>
    </html>
  `
}

function generateMapaCalorSrcDoc(coordenadas: CoordenadaBase[], origin: string) {
  const coordFiltradas = coordenadas.filter(c => c.coordX != null && c.coordY != null && !isNaN(parseFloat(String(c.coordX))) && !isNaN(parseFloat(String(c.coordY))))
  const pointsJson = JSON.stringify(
    coordFiltradas.map(c => [parseFloat(String(c.coordX)), parseFloat(String(c.coordY)), 1.0])
  )
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link rel="stylesheet" href="${origin}/leaflet/leaflet.css"/>
      <script src="${origin}/leaflet/leaflet.js"></script>
      <script src="${origin}/leaflet/leaflet-heat.js"></script>
      <style>
        html, body, #map { height: 100%; margin: 0; padding: 0; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const pointsData = ${pointsJson};
        const map = L.map('map').setView([0, 0], 2);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }).addTo(map);

        if (pointsData.length > 0) {
          const heat = L.heatLayer(pointsData, {
            radius: 35,
            blur: 20,
            maxZoom: 10,
            max: 1.0,
            gradient: {
              0.4: 'blue',
              0.6: 'cyan',
              0.7: 'lime',
              0.8: 'yellow',
              1.0: 'red'
            }
          }).addTo(map);
          
          const bounds = pointsData.map(p => [p[0], p[1]]);
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      </script>
    </body>
    </html>
  `
}

interface MapaFullModalProps {
  tipo: 'mapa' | 'calor'
  coordenadas: CoordenadaBase[]
  onClose: () => void
}

export function MapaFullModal({ tipo, coordenadas, onClose }: MapaFullModalProps) {
  const basePath = process.env.NEXT_PUBLIC_PATH ? `/${process.env.NEXT_PUBLIC_PATH}` : ''
  const origin = typeof window !== 'undefined' ? `${window.location.origin}${basePath}` : ''
  const validas = coordenadas.filter(c => c.coordX != null && c.coordY != null && !isNaN(parseFloat(String(c.coordX))) && !isNaN(parseFloat(String(c.coordY))))
  
  return (
    <div className="fixed inset-0 z-[99999] bg-white dark:bg-[#0e1726] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#e0e6ed] dark:border-[#1b2e4b] bg-gray-50 dark:bg-[#0c1528]/90 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {tipo === 'mapa' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-primary">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
              <line x1="9" x2="9" y1="3" y2="18"></line>
              <line x1="15" x2="15" y1="6" y2="21"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#805dca]">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
            </svg>
          )}
          <h3 className="text-sm font-bold text-[#3e5f8a] dark:text-[#5a7ba8] truncate">
            {tipo === 'mapa'
              ? 'Mapa de Distribución Geográfica de Operativos'
              : 'Mapa de Calor y Densidad de Operativos'}
          </h3>
          <span className="badge badge-outline-primary text-xs shrink-0">
            {validas.length} punto{validas.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline text-xs text-gray-400 dark:text-gray-600">ESC para cerrar</span>
          {validas.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => descargarCSV(coordenadas)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold
                  text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200
                  hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-blue-300 dark:border-blue-700
                  transition-colors"
                title="Descargar coordenadas en formato CSV"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" x2="12" y1="15" y2="3"></line>
                </svg>
                Descargar CSV
              </button>
              <button
                type="button"
                onClick={() => descargarKML(coordenadas)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold
                  text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200
                  hover:bg-green-50 dark:hover:bg-green-900/20 border border-green-300 dark:border-green-700
                  transition-colors"
                title="Descargar coordenadas en formato KML (Google Earth)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" x2="12" y1="15" y2="3"></line>
                </svg>
                Descargar KML
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold
              text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white
              hover:bg-gray-100 dark:hover:bg-[#1b2e4b] transition-colors"
            title="Cerrar (ESC)"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cerrar
          </button>
        </div>
      </div>

      {/* Mapa de borde a borde */}
      <div className="flex-1 min-h-0">
        <iframe
          srcDoc={tipo === 'mapa'
            ? generateMapaOperativosSrcDoc(coordenadas, origin)
            : generateMapaCalorSrcDoc(coordenadas, origin)}
          title={tipo === 'mapa' ? 'Mapa de Operativos' : 'Mapa de Calor'}
          className="w-full h-full border-0"
        />
      </div>
    </div>
  )
}
