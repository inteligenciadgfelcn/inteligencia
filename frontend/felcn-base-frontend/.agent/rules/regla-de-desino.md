---
trigger: always_on
---

# 📐 Design Rules – React + Vristo

## 1. Objetivo

Este documento define las **reglas oficiales de diseño y desarrollo UI** para el proyecto en **React** usando **Vristo** como sistema base de componentes.

El objetivo es garantizar:

* Consistencia visual
* Escalabilidad
* Mantenibilidad
* Accesibilidad

Estas reglas son **obligatorias** para todo el equipo.

---

## 2. Principios de Diseño

1. **Consistencia antes que creatividad**

   * No estilos inline
   * No CSS aislado por vista
   * Todo se basa en tokens y componentes

2. **Component‑First**

   * Toda UI debe ser un componente reutilizable
   * No se crean estilos directamente en `pages`

3. **Responsive por defecto**

   * Mobile → Tablet → Desktop
   * Uso correcto de breakpoints

4. **Accesibilidad**

   * Contraste WCAG AA
   * Focus visible
   * Labels obligatorios

---

## 3. Design Tokens (Vristo + Tailwind)

Los tokens se definen y consumen exclusivamente vía **Tailwind** extendido por **Vristo**.

Todos los estilos deben resolverse usando clases Tailwind configuradas en el theme.

---

### 3.1 Colores

Colores base definidos en `tailwind.config.js` (Vristo Theme):

```ts
colors: {
  primary: { DEFAULT: '#4361ee' },
  secondary: { DEFAULT: '#805dca' },
  success: { DEFAULT: '#00ab55' },
  warning: { DEFAULT: '#e2a03f' },
  danger: { DEFAULT: '#e7515a' },
  info: { DEFAULT: '#2196f3' },
  dark: { DEFAULT: '#0e1726' },
  light: { DEFAULT: '#fafafa' }
}
```

**Reglas:**

* ❌ No usar colores hexadecimales directos en JSX
* ❌ No `style={{ color: ... }}`
* ✅ Usar clases Tailwind (`bg-primary`, `text-danger`, etc.)

---

### 3.2 Tipografía

Tipografía controlada por Tailwind + Vristo:

```ts
fontFamily: {
  sans: ['Nunito', 'sans-serif']
}
```

Jerarquía estándar:

| Uso              | Clases Tailwind                                    |
| ---------------- | -------------------------------------------------- |
| Título principal | `text-2xl font-semibold text-dark dark:text-white` |
| Subtítulo        | `text-xl font-medium`                              |
| Texto normal     | `text-sm text-gray-600 dark:text-gray-300`         |
| Texto secundario | `text-xs text-gray-400`                            |

---

### 3.2 Tipografía

* Fuente base: definida por Vristo
* No se permite cambiar tipografía por vista

Jerarquía estándar:

| Uso              | Clase                    |
| ---------------- | ------------------------ |
| Título principal | `text-2xl font-semibold` |
| Subtítulo        | `text-xl font-medium`    |
| Texto normal     | `text-sm`                |
| Texto secundario | `text-xs text-muted`     |

---

## 4. Componentes UI (Vristo + Tailwind)

Todos los componentes UI deben ser **wrappers de Vristo** usando **Tailwind**.

---

### 4.1 Botones

Uso obligatorio del componente `Button` de Vristo.

Ejemplo:

```tsx
<Button variant="primary" className="w-full">
  Guardar
</Button>
```

Variants permitidos:

* `primary`
* `secondary`
* `outline`
* `danger`

**Reglas:**

* ❌ No usar `<button>` nativo
* ❌ No clases Tailwind que rompan el diseño base

---

### 4.2 Inputs y Formularios

Todos los formularios usan componentes Vristo + Tailwind:

```tsx
<Input
  label="Correo"
  placeholder="correo@ejemplo.com"
  error={errors.email}
  className="mb-4"
/>
```

Estados controlados por clases Tailwind internas:

* `focus:ring-primary`
* `border-danger`
* `bg-gray-100` (disabled)

Reglas:

* Siempre usar `label`
* Errores visibles y consistentes

---

### 4.3 Tablas y Datatables

Uso exclusivo de `DataTable` Vristo.

```tsx
<DataTable
  highlightOnHover
  className="table-hover"
/>
```

Reglas:

* Acciones alineadas a la derecha
* Padding y spacing estándar de Vristo

---

### 4.2 Inputs y Formularios

* Todos los formularios deben usar componentes Vristo
* Estados visuales permitidos:

  * default
  * focus
  * error
  * disabled

Reglas:

* Labels siempre visibles
* Mensajes de error claros

---

### 4.3 Tablas y Datatables

* Usar `DataTable` de Vristo
* Acciones siempre alineadas a la derecha
* Paginación y filtros estándar

No se permiten tablas HTML customizadas.

---

## 5. Layout de Aplicación (Vristo)

Layout base alineado a Vristo + Tailwind:

```tsx
<AppLayout>
  <Sidebar />
  <div className="main-content">
    <Header />
    <main className="p-6">
      <Outlet />
    </main>
  </div>
</AppLayout>
```

Estructura:

```
AppLayout
 ├─ Sidebar (fixed)
 ├─ Header (sticky)
 └─ MainContent (max-w-screen-xl mx-auto)
```

Reglas:

* Sidebar fija
* Header sticky
* Espaciados con Tailwind (`p-6`, `gap-4`)

---

## 6. Estructura de Carpetas

```
src/
 ├─ components/
 │   ├─ ui/          # Wrappers de Vristo
 │   ├─ layout/
 │   └─ common/
 ├─ pages/
 ├─ hooks/
 ├─ services/
 ├─ styles/
 │   ├─ tokens.css
 │   └─ globals.css
 └─ theme/
     └─ vristo.config.ts
```

**Regla:** no se definen estilos dentro de `pages`.

---

## 7. Extensión de Vristo (Tailwind-first)

Si un componente no existe en Vristo:

1. Crear wrapper en `components/ui`
2. Usar solo clases Tailwind del theme
3. Mantener naming y API de Vristo

Ejemplo:

```tsx
export function AppBadge(props) {
  return (
    <span className="badge badge-outline-primary">
      {props.children}
    </span>
  )
}
```

❌ No se permiten estilos CSS aislados

---

## 8. Dark Mode

* Se hereda del theme de Vristo
* No overrides manuales
* Todo debe funcionar en light y dark

---

## 9. Checklist antes de Merge

* [ ] Uso exclusivo de componentes Vristo
* [ ] Sin estilos inline
* [ ] Responsive validado
* [ ] Dark mode correcto
* [ ] Accesibilidad básica cumplida

---

## 10. Regla Final

> **Si no existe en Vristo, no se implementa hasta definirlo en el Design System**

---

**Este documento es la referencia oficial de diseño del proyecto.**
