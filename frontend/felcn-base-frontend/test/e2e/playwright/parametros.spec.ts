import { expect, test } from '@playwright/test'
import { ParametroFaker } from './faker/parametro-faker'

test.describe('Parámetros', () => {
  test('crear y editar parámetro', async ({ page, isMobile }) => {
    const parametroCreacion = ParametroFaker()
    const parametroEdicion = ParametroFaker()

    await test.step('Iniciar sesión', async () => {
      await page.goto(`/login`)
      await page.locator('#usuario').fill('ADMINISTRADOR-TECNICO')
      await page.locator('#contrasena').fill('123')
      await page.getByRole('button', { name: 'Iniciar sesión' }).click()
      if (isMobile) await page.getByRole('button', { name: 'menu' }).click()
    })

    await test.step('Crear nuevo parámetro', async () => {
      await page.click("[id='/admin/parametros']")
      await page.locator('#agregarParametro').click()
      await page.locator('#codigo').fill(parametroCreacion.codigo)
      await page.locator('#nombre').fill(parametroCreacion.nombre)
      await page.locator('#grupo').fill(parametroCreacion.grupo)
      await page.locator('#descripcion').fill(parametroCreacion.descripcion)
      await page.getByRole('button', { name: 'Guardar' }).click()
      await page.waitForLoadState('networkidle')
    })

    await test.step('Verificar creación del parámetro', async () => {
      await page.locator('#accionFiltrarParametrosToggle').click()
      await page.locator('#parametro').fill(parametroCreacion.nombre)
      await page.waitForResponse((response) =>
        response.url().includes('/parametros')
      )
      await expect(
        page.getByText(parametroCreacion.nombre).first()
      ).toBeVisible()
    })

    await test.step('Editar parámetro', async () => {
      await page.getByRole('button', { name: 'Editar' }).first().click()
      await page.locator('#codigo').fill(parametroEdicion.codigo)
      await page.locator('#nombre').fill(parametroEdicion.nombre)
      await page.locator('#grupo').fill(parametroEdicion.grupo)
      await page.locator('#descripcion').fill(parametroEdicion.descripcion)
      await page.getByRole('button', { name: 'Guardar' }).click()
      await page.waitForLoadState('networkidle')
    })

    await test.step('Verificar edición del parámetro', async () => {
      await page.locator('#parametro').fill(parametroEdicion.nombre)
      await expect(
        page.getByText(parametroEdicion.nombre).first()
      ).toBeVisible()
    })
  })
})
