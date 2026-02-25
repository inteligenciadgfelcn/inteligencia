import { expect, test } from '@playwright/test'
import { ModuloFaker } from './faker/modulo-faker'

test.describe('Módulos', () => {
  test('crear y editar módulo', async ({ page, isMobile }) => {
    const moduloCreacion = ModuloFaker()
    const moduloEdicion = ModuloFaker()

    await test.step('Iniciar sesión', async () => {
      await page.goto('/login')
      await page.locator('#usuario').fill('ADMINISTRADOR-TECNICO')
      await page.locator('#contrasena').fill('123')
      await page.getByRole('button', { name: 'Iniciar sesión' }).click()
      if (isMobile) await page.getByRole('button', { name: 'menu' }).click()
    })

    await test.step('Crear nuevo módulo', async () => {
      await page.click("[id='/admin/modulos']")
      await page.locator('#agregarModuloSeccion').click()
      await page.getByRole('menuitem', { name: 'Nuevo módulo' }).click()
      await page.locator('#seccion').click()
      await page.getByRole('option', { name: 'Configuración' }).click()
      await page.locator('#icono').fill('check')
      await page.getByRole('option', { name: 'check', exact: true }).click()
      await page.locator('#nombre').fill(moduloCreacion.nombre)
      await page.locator('#label').fill(moduloCreacion.label)
      await page.locator('#url').fill(moduloCreacion.url)
      await page.locator('#orden').fill(moduloCreacion.orden)
      await page.locator('#descripcion').fill(moduloCreacion.descripcion)
      await page.getByRole('button', { name: 'Guardar' }).click()
      await page.waitForLoadState('networkidle')
    })

    await test.step('Verificar creación del módulo', async () => {
      await page.locator('#accionFiltrarModuloToggle').click()
      await page.locator('#buscar').fill(moduloCreacion.nombre)
      await page.waitForResponse((response) =>
        response.url().includes('/modulos')
      )
      await page.waitForLoadState('networkidle')
      await expect(page.getByText(moduloCreacion.nombre).first()).toBeVisible()
    })

    await test.step('Editar módulo', async () => {
      await page.getByRole('button', { name: 'Editar' }).first().click()
      await page.locator('#icono').fill('check')
      await page.locator('#nombre').fill(moduloEdicion.nombre)
      await page.locator('#label').fill(moduloEdicion.label)
      await page.locator('#url').fill(moduloEdicion.url)
      await page.locator('#orden').fill(moduloEdicion.orden)
      await page.locator('#descripcion').fill(moduloEdicion.descripcion)
      await page.getByRole('button', { name: 'Guardar' }).click()
      await page.waitForLoadState('networkidle')
    })

    await test.step('Verificar edición del módulo', async () => {
      await page.locator('#buscar').fill(moduloEdicion.nombre)
      await page.waitForLoadState('networkidle')
      await expect(page.getByText(moduloEdicion.nombre).first()).toBeVisible()
    })
  })
})
