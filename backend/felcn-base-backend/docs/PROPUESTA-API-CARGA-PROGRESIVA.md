# PROPUESTA: API CON CARGA PROGRESIVA (LAZY LOADING)

## 🎯 OBJETIVO

Optimizar la carga del formulario FRM-OP dividiendo en **secciones independientes** que se cargan:
1. **Bajo demanda** (cuando el usuario llega a la sección)
2. **En segundo plano** (prefetching mientras trabaja en otra sección)
3. **Sin bloquear la UI** (puede empezar a trabajar inmediatamente)

---

## ⚠️ PROBLEMA DEL ENDPOINT `/completo`

### Análisis de peso de datos (estimado):

```
┌─────────────────────────────────────────────────────────┐
│ SECCIÓN                     │ REGISTROS  │ PESO EST.   │
├─────────────────────────────┼────────────┼─────────────┤
│ SEC0: Caso + Operativo      │ 1          │ ~5 KB       │
│ SEC1: Drogas                │ ~10        │ ~10 KB      │
│ SEC2: Sustancias Sólidas    │ ~5         │ ~5 KB       │
│ SEC3: Sustancias Líquidas   │ ~5         │ ~5 KB       │
│ SEC4: Fábricas              │ ~3         │ ~5 KB       │
│ SEC5: Detenidos (con fotos) │ ~5         │ ~500 KB ⚠️  │
│ SEC6: Bienes                │ ~10        │ ~15 KB      │
│ SEC7: Galería (fotos)       │ ~20        │ ~2 MB ⚠️⚠️  │
│ SEC8: Logotipos (fotos)     │ ~5         │ ~500 KB ⚠️  │
├─────────────────────────────┼────────────┼─────────────┤
│ TOTAL                       │            │ ~3+ MB      │
└─────────────────────────────────────────────────────────┘
```

**Problemas:**
- ⚠️ **3+ MB** de descarga inicial → Usuario espera 5-10 segundos (conexión lenta)
- ⚠️ **Timeout** en redes lentas o servidor cargado
- ⚠️ **Bloqueo de UI** → No puede empezar a trabajar
- ⚠️ **Desperdicio de recursos** → Usuario puede que nunca llegue a SEC7

---

## ✅ ARQUITECTURA PROPUESTA: LAZY LOADING POR SECCIONES

### Principios:
1. **Carga inicial mínima** (~5-10 KB)
2. **Lazy loading por sección** (solo cuando se necesita)
3. **Prefetching inteligente** (siguiente sección en background)
4. **Imágenes separadas** (no en base64, usar URLs)
5. **Caché en frontend** (no volver a pedir lo ya cargado)

---

## 🏗️ DISEÑO DE APIs POR SECCIÓN

### **1. API INICIAL - DATOS MÍNIMOS**
```http
GET /api/operativos/{id}/resumen
```

**Propósito:** Carga instantánea para renderizar el formulario vacío + datos básicos

**Response (~5-10 KB):**
```json
{
  "finalizado": true,
  "mensaje": "Resumen del operativo",
  "datos": {
    "caso": {
      "casosId": 123,
      "numeroCaso": "CASO-2024-001",
      "nombreCaso": "Operación Alfa",
      "numeroOperativo": "OP-2024-001",
      "solicitud": {
        "nombre": "Crnl. José García",
        "telefono": "77712345"
      },
      "asignado": {
        "nombre": "Cmdte. María López",
        "telefono": "77798765"
      },
      "fiscal": {
        "nombre": "Dr. Juan Pérez",
        "telefono": "77755555"
      }
    },
    "operativo": {
      "id": 456,
      "casosId": 123,
      "numeroOperativo": "OP-2024-001",
      "fechaOperativo": "2024-01-15",
      "tipoOperacion": "Intervención",
      "ubicacion": {
        "departamento": "La Paz",
        "provincia": "Murillo",
        "localidad": "La Paz",
        "lugar": "Zona Norte"
      },
      "coordenadas": {
        "latitud": "-16.513056",
        "longitud": "-68.258333"
      },
      // ... campos básicos del operativo
      "revisado": false
    },
    "estadisticas": {
      "totalDrogas": 10,
      "totalGramosDrogas": 5000.5,
      "totalSustanciasSolidas": 5,
      "totalSustanciasLiquidas": 5,
      "totalFabricas": 3,
      "totalBienes": 10,
      "totalDetenidos": 5,
      "totalFotosGaleria": 20,
      "totalLogotipos": 5
    },
    "seccionesCargadas": {
      "sec0": true,  // Ya incluida en este response
      "sec1": false,
      "sec2": false,
      "sec3": false,
      "sec4": false,
      "sec5": false,
      "sec6": false,
      "sec7": false,
      "sec8": false
    }
  }
}
```

**Uso:**
- Se carga **inmediatamente** al abrir el formulario
- Permite renderizar la estructura completa del formulario
- Muestra estadísticas (badges con contadores)
- Usuario puede empezar a editar SEC0 mientras se cargan las demás

---

### **2. SEC1 - DROGAS**
```http
GET /api/operativos/{id}/drogas
```

**Response (~10-20 KB):**
```json
{
  "finalizado": true,
  "mensaje": "Drogas del operativo",
  "datos": {
    "drogas": [
      {
        "id": 1,
        "tipoDroga": "Cocaína",
        "estadoDroga": "Polvo",
        "cantidadGramos": 5000.5,
        "cantidadPaquetes": 5,
        "formaTransporte": "Vehículo",
        "paisOrigen": "Bolivia",
        "paisDestino": "Chile",
        "descripcion": "Alta pureza",
        "observaciones": "Empaque plástico"
      }
      // ... más drogas
    ],
    "resumen": {
      "totalGramos": 5000.5,
      "totalRegistros": 10,
      "totalPaquetes": 25
    }
  }
}
```

**Ya existe:** ✅ Implementado

---

### **3. SEC2 - SUSTANCIAS SÓLIDAS**
```http
GET /api/operativos/{id}/sustancias-solidas
```

**Ya existe:** ✅ Implementado

---

### **4. SEC3 - SUSTANCIAS LÍQUIDAS**
```http
GET /api/operativos/{id}/sustancias-liquidas
```

**Ya existe:** ✅ Implementado

---

### **5. SEC4 - FÁBRICAS**
```http
GET /api/operativos/{id}/fabricas
```

**Ya existe:** ✅ Implementado

---

### **6. SEC5 - DETENIDOS** ⚠️ CON FOTOS
```http
GET /api/operativos/{id}/detenidos
```

**Response OPTIMIZADO (~15-20 KB sin imágenes):**
```json
{
  "finalizado": true,
  "mensaje": "Detenidos del operativo",
  "datos": {
    "detenidos": [
      {
        "id": 1,
        "nombres": "Juan Carlos",
        "apellidoPaterno": "Pérez",
        "apellidoMaterno": "López",
        "numeroDocumento": "1234567",
        "edad": 34,
        "nacionalidad": "Bolivia",
        // ... datos personales
        "caracteristicasFisicas": {
          "colorPiel": "Moreno",
          "estatura": 175,
          "peso": 70
        },
        "fotos": {
          // ✅ URLs en lugar de base64
          "frente": "/api/operativos/456/detenidos/1/fotos/frente",
          "perfilDerecho": "/api/operativos/456/detenidos/1/fotos/perfil-derecho",
          "perfilIzquierdo": "/api/operativos/456/detenidos/1/fotos/perfil-izquierdo"
        }
      }
    ]
  }
}
```

**Endpoints de fotos (lazy loading):**
```http
GET /api/operativos/{id}/detenidos/{idDetenido}/fotos/frente
GET /api/operativos/{id}/detenidos/{idDetenido}/fotos/perfil-derecho
GET /api/operativos/{id}/detenidos/{idDetenido}/fotos/perfil-izquierdo
```
**Response:** Imagen binaria (JPEG/PNG) con headers de caché

**Ya existe (parcial):** ✅ GET detenidos implementado, ⚠️ Verificar si fotos son URLs o base64

---

### **7. SEC6 - BIENES SECUESTRADOS**
```http
GET /api/operativos/{id}/bienes
```

**Response con características anidadas:**
```json
{
  "finalizado": true,
  "mensaje": "Bienes del operativo",
  "datos": {
    "bienes": [
      {
        "id": 1,
        "bien": "Vehículos",
        "clase": "Automóviles",
        "tipo": "Camioneta",
        "cantidad": 1,
        "valorEstimado": 15000,
        "descripcion": "Toyota Hilux 2020",
        "placa": "ABC-123",
        "color": "Blanco",
        "caracteristicas": [
          {
            "id": 1,
            "nombreCaracteristica": "Marca",
            "valor": "Toyota"
          },
          {
            "id": 2,
            "nombreCaracteristica": "Modelo",
            "valor": "Hilux"
          }
        ],
        "foto": "/api/operativos/456/bienes/1/foto" // ✅ URL
      }
    ]
  }
}
```

**Endpoint de foto del bien:**
```http
GET /api/operativos/{id}/bienes/{idBien}/foto
```

**Ya existe (parcial):** ✅ GET bienes implementado, ⚠️ Falta APIs de características

---

### **8. SEC7 - GALERÍA FOTOGRÁFICA** ⚠️⚠️ MUY PESADA
```http
GET /api/operativos/{id}/galeria
```

**Response OPTIMIZADO (~5 KB - solo metadatos):**
```json
{
  "finalizado": true,
  "mensaje": "Galería del operativo",
  "datos": {
    "fotos": [
      {
        "id": 1,
        "descripcion": "Vista general del operativo",
        "fechaSubida": "2024-01-15T10:30:00",
        "urlThumbnail": "/api/operativos/456/galeria/1/thumbnail",  // ✅ 50x50 px
        "urlMedium": "/api/operativos/456/galeria/1/medium",        // ✅ 400x400 px
        "urlFull": "/api/operativos/456/galeria/1/full"             // ✅ Original
      }
      // ... 20 fotos = solo URLs, no las imágenes
    ],
    "total": 20
  }
}
```

**Endpoints de imágenes (lazy loading):**
```http
GET /api/operativos/{id}/galeria/{idFoto}/thumbnail  → ~5 KB (50x50)
GET /api/operativos/{id}/galeria/{idFoto}/medium     → ~50 KB (400x400)
GET /api/operativos/{id}/galeria/{idFoto}/full       → ~200 KB (original)
```

**Uso en Frontend:**
```html
<!-- Carga thumbnail instantáneamente (lazy loading nativo) -->
<img
  src="/api/operativos/456/galeria/1/thumbnail"
  loading="lazy"
  onclick="openModal('/api/operativos/456/galeria/1/full')"
/>
```

**Ya existe (parcial):** ✅ GET galeria implementado, ⚠️ Verificar si retorna URLs o base64

---

### **9. SEC8 - LOGOTIPOS** ⚠️ CON FOTOS
```http
GET /api/operativos/{id}/logotipos
```

**Response OPTIMIZADO (~10 KB):**
```json
{
  "finalizado": true,
  "mensaje": "Logotipos del operativo",
  "datos": {
    "logotipos": [
      {
        "id": 1,
        "descripcionLogo": "Logo del cartel X",
        "tipoDroga": "Cocaína",
        "paisOrigen": "Bolivia",
        "organizacion": "Cartel X",
        "urlThumbnail": "/api/operativos/456/logotipos/1/thumbnail",
        "urlFull": "/api/operativos/456/logotipos/1/foto"
      }
    ]
  }
}
```

**Ya existe:** ✅ Implementado

---

## 🚀 ESTRATEGIA DE CARGA EN EL FRONTEND

### **Paso 1: Carga Inicial (Inmediata)**
```javascript
// Al abrir /operativos/:id
async function cargarOperativo(id) {
  setLoading(true);

  // 1. Carga solo resumen (~5 KB)
  const { datos } = await fetch(`/api/operativos/${id}/resumen`);

  // 2. Renderizar formulario completo con:
  //    - SEC0: Datos llenos ✅
  //    - SEC1-8: Vacías con spinners/skeletons
  renderFormulario(datos);

  setLoading(false); // ✅ Usuario ya puede trabajar

  // 3. Iniciar carga progresiva
  cargarSecciones(id, datos.estadisticas);
}
```

**Resultado:** Usuario ve el formulario en **< 500ms** y puede empezar a trabajar

---

### **Paso 2: Carga Progresiva (Background)**

#### **Estrategia A: LAZY LOADING (On-Demand)**
```javascript
// Solo carga cuando el usuario llega a la sección
function cargarSecciones(id, estadisticas) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const seccion = entry.target.dataset.seccion;
        cargarSeccion(id, seccion);
        observer.unobserve(entry.target); // Solo una vez
      }
    });
  });

  // Observar cada sección
  document.querySelectorAll('[data-seccion]').forEach(el => {
    observer.observe(el);
  });
}

async function cargarSeccion(id, seccion) {
  const endpoints = {
    'sec1': `/api/operativos/${id}/drogas`,
    'sec2': `/api/operativos/${id}/sustancias-solidas`,
    'sec3': `/api/operativos/${id}/sustancias-liquidas`,
    'sec4': `/api/operativos/${id}/fabricas`,
    'sec5': `/api/operativos/${id}/detenidos`,
    'sec6': `/api/operativos/${id}/bienes`,
    'sec7': `/api/operativos/${id}/galeria`,
    'sec8': `/api/operativos/${id}/logotipos`
  };

  const { datos } = await fetch(endpoints[seccion]);
  renderizarSeccion(seccion, datos);
}
```

**Resultado:**
- Usuario en SEC0 → Solo esa sección cargada
- Usuario scrollea a SEC1 → Se carga automáticamente
- Usuario nunca llega a SEC7 → Nunca se carga (ahorro de 2 MB)

---

#### **Estrategia B: PREFETCHING INTELIGENTE (Híbrido)**
```javascript
// Combinación: Lazy + Prefetch siguiente
function cargarSeccionesConPrefetch(id, estadisticas) {
  const prioridades = {
    // PRIORIDAD 1: Ya cargado
    'sec0': true,

    // PRIORIDAD 2: Cargar inmediatamente (usuario probablemente irá aquí)
    'sec1': estadisticas.totalDrogas > 0,  // Solo si hay datos

    // PRIORIDAD 3: Prefetch (cargar en background)
    'sec2': estadisticas.totalSustanciasSolidas > 0,
    'sec3': estadisticas.totalSustanciasLiquidas > 0,
    'sec4': estadisticas.totalFabricas > 0,
    'sec5': estadisticas.totalDetenidos > 0,
    'sec6': estadisticas.totalBienes > 0,

    // PRIORIDAD 4: Lazy loading (solo cuando llegue)
    'sec7': false, // Galería pesada → solo on-demand
    'sec8': false  // Logotipos → solo on-demand
  };

  // Cargar prioridad 2 inmediatamente
  Object.entries(prioridades).forEach(([seccion, cargar]) => {
    if (cargar === true && seccion !== 'sec0') {
      cargarSeccion(id, seccion);
    }
  });

  // Prefetch prioridad 3 (2 segundos después)
  setTimeout(() => {
    Object.entries(prioridades).forEach(([seccion, cargar]) => {
      if (cargar && !seccionesCargadas[seccion]) {
        cargarSeccion(id, seccion);
      }
    });
  }, 2000);

  // Lazy loading para prioridad 4
  setupIntersectionObserver(['sec7', 'sec8']);
}
```

**Resultado:**
- **T=0s:** Resumen cargado, formulario visible
- **T=0.5s:** SEC1 (Drogas) cargada si tiene datos
- **T=2s:** SEC2-6 cargándose en background
- **T=Usuario llega a SEC7:** Galería se carga en ese momento

---

### **Paso 3: Caché en Frontend**
```javascript
// Caché simple con Map
const cache = new Map();

async function cargarSeccion(id, seccion) {
  // ✅ Verificar caché primero
  const cacheKey = `${id}-${seccion}`;
  if (cache.has(cacheKey)) {
    console.log(`✅ Usando caché para ${seccion}`);
    renderizarSeccion(seccion, cache.get(cacheKey));
    return;
  }

  // Cargar desde API
  const { datos } = await fetch(endpoints[seccion]);

  // ✅ Guardar en caché
  cache.set(cacheKey, datos);

  renderizarSeccion(seccion, datos);
}

// Invalidar caché al modificar
async function agregarDroga(idOperativo, droga) {
  await fetch(`/api/operativos/${idOperativo}/drogas`, {
    method: 'POST',
    body: JSON.stringify(droga)
  });

  // ✅ Invalidar caché de esa sección
  cache.delete(`${idOperativo}-sec1`);

  // ✅ Recargar
  cargarSeccion(idOperativo, 'sec1');
}
```

---

### **Paso 4: Imágenes con Lazy Loading Nativo**
```html
<!-- Galería con lazy loading -->
<div class="galeria">
  <div class="foto" v-for="foto in galeria" :key="foto.id">
    <!-- Thumbnail carga inmediatamente -->
    <img
      :src="foto.urlThumbnail"
      loading="lazy"
      @click="abrirModal(foto.urlFull)"
      class="thumbnail"
    />
  </div>
</div>

<!-- Modal con imagen full -->
<div v-if="modalAbierto" class="modal">
  <img :src="imagenFullActual" loading="lazy" />
</div>
```

**Resultado:**
- 20 thumbnails (50x50) = 20 × 5 KB = ~100 KB total
- Imágenes full (200 KB c/u) solo se cargan al hacer clic
- Lazy loading nativo del navegador optimiza automáticamente

---

## 📊 COMPARACIÓN: ANTES vs DESPUÉS

### ❌ ANTES (Endpoint `/completo`)
```
Usuario abre formulario
  ↓
GET /api/operativos/123/completo
  ↓ Espera 5-10 segundos (3+ MB)
  ↓
Formulario visible ✅
```
**Timeline:**
- T=0s: Click en "Ver operativo"
- T=5-10s: Formulario cargado (usuario esperando ⏳)
- T=10s: Usuario puede trabajar

**Problemas:**
- ❌ 10 segundos de espera
- ❌ Descarga 3 MB aunque no vea galería
- ❌ Puede fallar en redes lentas

---

### ✅ DESPUÉS (Carga Progresiva)
```
Usuario abre formulario
  ↓
GET /api/operativos/123/resumen (~5 KB)
  ↓ 300-500ms
  ↓
Formulario visible ✅ (puede trabajar)
  ↓
Background: Cargar SEC1-6
  ↓
Lazy: Cargar SEC7 cuando llegue
```
**Timeline:**
- T=0s: Click en "Ver operativo"
- T=0.3s: Formulario visible, SEC0 llena ✅
- T=0.5s: SEC1 (Drogas) cargada
- T=2s: SEC2-6 cargadas en background
- T=Usuario llega a SEC7: Galería carga on-demand

**Beneficios:**
- ✅ 300ms hasta formulario interactivo
- ✅ Descarga solo lo necesario
- ✅ Funciona en redes lentas
- ✅ Mejor UX

---

## 🏗️ IMPLEMENTACIÓN EN BACKEND

### **Nuevo Endpoint: `/resumen`**
```typescript
@Get(':id/resumen')
async obtenerResumen(@Param('id') id: string) {
  const operativo = await this.operativoRepo.findOne({
    where: { id },
    relations: ['caso'] // Solo ASIGNACION
  });

  // Obtener estadísticas con COUNT queries eficientes
  const estadisticas = {
    totalDrogas: await this.drogaRepo.count({ where: { operativoId: id } }),
    totalGramosDrogas: await this.drogaRepo
      .createQueryBuilder()
      .select('SUM(cantidadGramos)', 'total')
      .where('operativoId = :id', { id })
      .getRawOne()
      .then(r => r.total || 0),
    totalSustanciasSolidas: await this.sustanciaSolidaRepo.count({ where: { operativoId: id } }),
    // ... resto de conteos
  };

  return {
    finalizado: true,
    mensaje: 'Resumen del operativo',
    datos: {
      caso: this.mapearCaso(operativo.caso),
      operativo: this.mapearOperativoBasico(operativo),
      estadisticas,
      seccionesCargadas: {
        sec0: true,
        sec1: false,
        // ...
      }
    }
  };
}
```

### **Endpoints de Imágenes**
```typescript
@Get(':id/galeria/:idFoto/thumbnail')
async obtenerThumbnail(
  @Param('id') id: string,
  @Param('idFoto') idFoto: string,
  @Res() res: Response
) {
  const foto = await this.galeriaRepo.findOne({ where: { id: idFoto } });

  // Generar thumbnail (50x50) con sharp/jimp
  const thumbnail = await sharp(foto.buffer)
    .resize(50, 50, { fit: 'cover' })
    .jpeg({ quality: 80 })
    .toBuffer();

  res
    .set('Content-Type', 'image/jpeg')
    .set('Cache-Control', 'public, max-age=31536000') // 1 año
    .send(thumbnail);
}

@Get(':id/galeria/:idFoto/medium')
async obtenerMedium(...) {
  // Similar, resize 400x400
}

@Get(':id/galeria/:idFoto/full')
async obtenerFull(...) {
  // Imagen original
}
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### Backend:
- [ ] Crear endpoint `GET /api/operativos/{id}/resumen`
- [ ] Modificar endpoints existentes para retornar URLs en lugar de base64:
  - [ ] `/detenidos` → fotos como URLs
  - [ ] `/galeria` → fotos como URLs
  - [ ] `/bienes` → foto como URL
  - [ ] `/logotipos` → fotografia como URL
- [ ] Crear endpoints de imágenes:
  - [ ] `GET /api/operativos/{id}/detenidos/{idDetenido}/fotos/{tipo}`
  - [ ] `GET /api/operativos/{id}/galeria/{idFoto}/{tamaño}`
  - [ ] `GET /api/operativos/{id}/bienes/{idBien}/foto`
  - [ ] `GET /api/operativos/{id}/logotipos/{idLogotipo}/foto`
- [ ] Implementar generación de thumbnails (sharp/jimp)
- [ ] Configurar headers de caché para imágenes
- [ ] Optimizar queries de estadísticas (usar COUNT en lugar de traer todos los registros)

### Frontend:
- [ ] Implementar carga inicial con `/resumen`
- [ ] Crear hook `useSeccionLazyLoad(operativoId, seccion)`
- [ ] Implementar IntersectionObserver para lazy loading
- [ ] Implementar prefetching inteligente
- [ ] Implementar caché de secciones
- [ ] Usar `<img loading="lazy">` para imágenes
- [ ] Crear componente de Skeleton/Shimmer para secciones no cargadas
- [ ] Manejo de errores por sección (no bloquear todo el formulario)
- [ ] Indicadores visuales de carga por sección

### Testing:
- [ ] Test de performance: Carga inicial < 500ms
- [ ] Test de carga progresiva en diferentes velocidades de red
- [ ] Test de lazy loading de imágenes
- [ ] Test de caché (no repetir peticiones)
- [ ] Test de invalidación de caché al modificar
- [ ] Test con operativos sin datos (estadísticas en 0)
- [ ] Test con operativos con muchas fotos (50+ en galería)

---

## 💡 EJEMPLO COMPLETO EN REACT/VUE

### React Hook para Carga Progresiva
```typescript
// useOperativoProgresivo.ts
import { useState, useEffect } from 'react';

export function useOperativoProgresivo(operativoId: string) {
  const [resumen, setResumen] = useState(null);
  const [secciones, setSecciones] = useState({});
  const [loading, setLoading] = useState(true);

  // 1. Carga inicial
  useEffect(() => {
    async function cargarResumen() {
      const res = await fetch(`/api/operativos/${operativoId}/resumen`);
      const { datos } = await res.json();
      setResumen(datos);
      setLoading(false);

      // 2. Iniciar prefetching
      prefetchSecciones(operativoId, datos.estadisticas);
    }
    cargarResumen();
  }, [operativoId]);

  // 3. Cargar sección on-demand
  const cargarSeccion = async (seccion: string) => {
    if (secciones[seccion]) return; // Ya cargada

    const endpoints = {
      sec1: `/api/operativos/${operativoId}/drogas`,
      sec2: `/api/operativos/${operativoId}/sustancias-solidas`,
      // ...
    };

    const res = await fetch(endpoints[seccion]);
    const { datos } = await res.json();

    setSecciones(prev => ({ ...prev, [seccion]: datos }));
  };

  return { resumen, secciones, loading, cargarSeccion };
}
```

### Componente de Sección con Lazy Loading
```tsx
// SeccionLazy.tsx
import { useEffect, useRef } from 'react';

function SeccionLazy({ seccion, datos, onCargar, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onCargar(seccion);
        observer.disconnect();
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [seccion, onCargar]);

  return (
    <div ref={ref} className="seccion">
      {datos ? children(datos) : <SkeletonSeccion />}
    </div>
  );
}
```

### Uso en el Formulario
```tsx
// FormularioOperativo.tsx
function FormularioOperativo({ operativoId }) {
  const { resumen, secciones, loading, cargarSeccion } = useOperativoProgresivo(operativoId);

  if (loading) return <Spinner />;

  return (
    <form>
      {/* SEC0: Siempre cargada */}
      <SeccionDatosGenerales caso={resumen.caso} operativo={resumen.operativo} />

      {/* SEC1: Lazy loading */}
      <SeccionLazy seccion="sec1" datos={secciones.sec1} onCargar={cargarSeccion}>
        {(drogas) => <SeccionDrogas datos={drogas} />}
      </SeccionLazy>

      {/* SEC2-6: Similar */}
      <SeccionLazy seccion="sec2" datos={secciones.sec2} onCargar={cargarSeccion}>
        {(sustancias) => <SeccionSustanciasSolidas datos={sustancias} />}
      </SeccionLazy>

      {/* SEC7: Galería con lazy loading de imágenes */}
      <SeccionLazy seccion="sec7" datos={secciones.sec7} onCargar={cargarSeccion}>
        {(galeria) => (
          <div className="galeria">
            {galeria.fotos.map(foto => (
              <img
                key={foto.id}
                src={foto.urlThumbnail}
                loading="lazy"
                onClick={() => openModal(foto.urlFull)}
              />
            ))}
          </div>
        )}
      </SeccionLazy>
    </form>
  );
}
```

---

## 🎯 RESUMEN EJECUTIVO

### Problema:
- Formulario con 8 secciones, algunas con imágenes pesadas (3+ MB total)
- Carga completa en 1 petición → Usuario espera 5-10 segundos

### Solución:
1. **API `/resumen`** → Carga inicial mínima (5 KB, <500ms)
2. **APIs por sección** → Carga on-demand o background
3. **Imágenes como URLs** → No en base64, con lazy loading
4. **Prefetching inteligente** → Siguiente sección en background
5. **Caché frontend** → No repetir peticiones

### Resultado:
- ✅ Formulario visible en **<500ms**
- ✅ Usuario puede trabajar inmediatamente
- ✅ Descarga solo lo necesario
- ✅ Funciona en redes lentas
- ✅ Mejor performance y UX

---

**Recomendación:** Implementar esta arquitectura para todos los formularios extensos del sistema.
