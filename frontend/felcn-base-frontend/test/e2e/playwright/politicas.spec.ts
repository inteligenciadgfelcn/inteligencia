import { expect, test } from '@playwright/test'
import { PoliticaFaker } from './faker/politicas-faker'

test.describe('Políticas', () => {
  test('crear y editar política', async ({ page, isMobile }) => {
    const politicaCreacion = PoliticaFaker()
    const politicaEdicion = PoliticaFaker()

    await test.step('Iniciar sesión', async () => {
      await page.goto(`/login`)
      await page.locator('#usuario').fill('ADMINISTRADOR-TECNICO')
      await page.locator('#contrasena').fill('123')
      await page.getByRole('button', { name: 'Iniciar sesión' }).click()
      if (isMobile) await page.getByRole('button', { name: 'menu' }).click()
    })

    await test.step('Crear nueva política', async () => {
      await page.click("[id='/admin/politicas']")
      await page.locator('#agregarPolitica').click()
      await page.locator('#sujeto').click()
      await page.getByRole('option', { name: 'ADMINISTRADOR' }).first().click()
      await page.locator('#objeto').click()
      await page.locator('#objeto').fill(politicaCreacion.objecto)
      await page.locator('#app').click()
      await page.getByRole('option', { name: 'frontend' }).click()
      await page.locator('#accion').click()
      await page.getByRole('option', { name: 'read' }).click()
      await page.getByRole('button', { name: 'Guardar' }).click()
      await page.waitForResponse((response) =>
        response.url().includes('/politicas')
      )
    })

    await test.step('Verificar creación de la política', async () => {
      await page.locator('#accionFiltrarPoliticasToggle').click()
      await page.locator('#buscar').fill(politicaCreacion.objecto)
      await page.waitForResponse((response) =>
        response.url().includes('/politicas')
      )
      await expect(
        page.getByText(politicaCreacion.objecto).first()
      ).toBeVisible()
    })

    await test.step('Editar política', async () => {
      await page.getByRole('button', { name: 'Editar' }).first().click()
      await page.locator('#objeto').click()
      await page.locator('#objeto').fill(politicaEdicion.objecto)
      await page.getByRole('button', { name: 'Guardar' }).click()
      await page.waitForResponse((response) =>
        response.url().includes('/politicas')
      )
    })

    await test.step('Verificar edición de la política', async () => {
      await page.locator('#buscar').fill(politicaEdicion.objecto)
      await expect(
        page.getByText(politicaEdicion.objecto).first()
      ).toBeVisible()
    })
  })
})
