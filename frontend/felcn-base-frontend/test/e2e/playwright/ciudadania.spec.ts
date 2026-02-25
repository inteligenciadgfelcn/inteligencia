import { expect, test } from '@playwright/test'
import { numeroAleatorio } from './utils/generador'
import { delay } from '@/utils'
import { loadCiudadanosData, CiudadanosPruebaType } from './utils/testData'
import { imprimir } from '@/utils/imprimir'

test.describe('Ciudadanía', () => {
  let ciudadanos: CiudadanosPruebaType[]

  test.beforeAll(() => {
    ciudadanos = loadCiudadanosData()
  })

  test('Inicio de sesión', async ({ page, isMobile }) => {
    test.skip(ciudadanos.length === 0, 'No hay datos de prueba disponibles')

    const indice = Math.floor(Math.random() * ciudadanos.length)
    const algunCiudadano = ciudadanos[indice]

    const numero6Digitos = String(numeroAleatorio(100000, 999999))

    imprimir(algunCiudadano)

    await test.step('Iniciar sesión', async () => {
      await page.goto('/login')
      await page.getByRole('button', { name: 'Ingresa con Ciudadanía' }).click()
      await page.locator('#username').fill(algunCiudadano.ci)
      await page.locator('#password').fill('Agepic135')

      await Promise.all([
        delay(500), // TODO: eliminar delay cuando el proveedor de identidad no tenga rate limit
        page.getByRole('button', { name: 'Continuar' }).click(),
        delay(500),
      ])

      // Verificar si aparece el mensaje de error
      const errorMessage = await page
        .locator('text=No se pudo encontrar tu cuenta o está inactiva')
        .isVisible()
      if (errorMessage) {
        imprimir(
          `El usuario ${algunCiudadano.ci} no se encontró o está inactivo. Saltando el test.`
        )
        test.skip()
      }
    })

    await test.step('Verificación de segundo factor', async () => {
      await delay(500)
      const segundoFactor = await page
        .getByRole('heading', { name: 'Verificación' })
        .isVisible()

      if (segundoFactor) {
        await page.locator('#code').fill(`${numero6Digitos}`)
        await page.getByRole('button', { name: 'Continuar' }).click()
      }
    })

    await test.step('Autorización', async () => {
      await delay(500)
      const autorizar = await page
        .getByRole('heading', { name: 'Autorización' })
        .isVisible()

      if (autorizar) {
        await page.getByRole('button', { name: 'Continuar' }).click()
      }
    })

    await test.step('Verificar perfil', async () => {
      if (isMobile) await page.getByRole('button', { name: 'menu' }).click()
      await page.click("[id='/admin/perfil']")
      const locator = page.getByText(`CI ${algunCiudadano.ci}`)
      await expect(locator).toContainText(`CI ${algunCiudadano.ci}`)
    })

    await test.step('Cerrar sesión', async () => {
      if (isMobile) {
        await page.getByRole('banner').getByRole('button').nth(3).click()
      } else {
        await page.getByRole('banner').getByRole('button').nth(2).click()
      }
      await page.getByText('Cerrar sesión').click()
      await page.getByRole('button', { name: 'Aceptar' }).click()
      await delay(500)
    })
  })
})
