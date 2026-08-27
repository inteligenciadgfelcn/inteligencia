import { redirect } from 'next/navigation'

// La página de listado se movió a /seguimientos/listado. Se mantiene este
// stub para no romper accesos existentes (menú lateral configurado en BD,
// marcadores/bookmarks, etc.) mientras se actualiza esa configuración.
export default function SeguimientosRedirect() {
  redirect('/seguimientos/listado')
}
