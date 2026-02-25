import { expect, test } from '@playwright/test'
import { loadSegipData, SegipPruebaType } from './utils/testData'
import { UsuarioFaker } from './faker/usuario-faker'
import { imprimir } from '@/utils/imprimir'

test.describe('Registro y activación de cuenta', () => {
  let usuariosSegipPrueba: SegipPruebaType[]
  const { email, password } = UsuarioFaker()

  test.beforeAll(() => {
    usuariosSegipPrueba = loadSegipData()
  })

  test('Proceso completo de registro y activación', async ({
    page,
    request,
  }) => {
    test.skip(
      usuariosSegipPrueba.length === 0,
      'No hay datos de prueba disponibles'
    )

    const usuarios = usuariosSegipPrueba.filter(
      (value) => value.Observacion == null
    )
    const indice = Math.floor(Math.random() * usuarios.length)

    const usuarioSegip = usuarios[indice]

    test.skip(!usuarioSegip, 'No se encontró un usuario válido para la prueba')

    await test.step('Registro de cuenta', async () => {
      await page.goto('/login')
      await page
        .getByRole('button', { name: 'Regístrate', exact: true })
        .click()
      await page.locator('#nroDocumento').fill(usuarioSegip.NumeroDocumento)
      await page.locator('#nombres').fill(String(usuarioSegip.Nombres))
      await page
        .locator('#primerApellido')
        .fill(usuarioSegip.PrimerApellido ?? '')
      await page
        .locator('#segundoApellido')
        .fill(usuarioSegip.SegundoApellido ?? '')
      await page.locator('#fechaNacimiento').fill(usuarioSegip.FechaNacimiento)
      await page.getByLabel('Correo electrónico').fill(email)
      await page
        .getByLabel('Contraseña', { exact: true })
        .fill(String(password))
      await page.getByLabel('Repita su contraseña').fill(String(password))
    })

    let data: any
    await test.step('Crear cuenta y esperar respuesta', async () => {
      const responsePromise = page.waitForResponse(
        (response) => response.url().includes('/usuarios/crear-cuenta'),
        { timeout: 30000 } // Aumentamos el tiempo de espera a 30 segundos
      )

      await page.getByRole('button', { name: 'Crear cuenta' }).click()

      const response = await responsePromise
      data = await response.json()

      // Verificar que la respuesta contiene los datos necesarios
      expect(data.datos).toBeDefined()
      expect(data.datos.id).toBeDefined()
    })

    await test.step('Obtener código de activación', async () => {
      // Añadir un pequeño retraso antes de solicitar el código
      await page.waitForTimeout(2000)

      let respuestaCodigo
      let intentos = 0
      const maxIntentos = 3

      while (intentos < maxIntentos) {
        try {
          const response = await request.get(
            `${process.env.BASE_SERVER_URL}/usuarios/test/codigo/${data.datos.id}`
          )
          respuestaCodigo = await response.json()
          if (respuestaCodigo.datos && respuestaCodigo.datos.codigoActivacion) {
            break
          }
        } catch (error) {
          imprimir(`Intento ${intentos + 1} fallido: ${error}`)
        }
        intentos++
        if (intentos < maxIntentos) {
          await page.waitForTimeout(2000) // Esperar 2 segundos antes de reintentar
        }
      }

      if (!respuestaCodigo || !respuestaCodigo.datos.codigoActivacion) {
        throw new Error(
          'No se pudo obtener el código de activación después de varios intentos'
        )
      }

      await page.waitForLoadState('networkidle')
      await page.goto(`/activacion?q=${respuestaCodigo.datos.codigoActivacion}`)
    })

    await test.step('Verificar activación de cuenta', async () => {
      await page.waitForLoadState('networkidle')
      const locator = page.getByText(`Cuenta Activa`)
      await expect(locator).toContainText(`Cuenta Activa`, { timeout: 10000 })
    })
  })
})
