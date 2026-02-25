import { expect, test } from '@playwright/test'
import { loadSegipData, SegipPruebaType } from './utils/testData'
import { UsuarioFaker } from './faker/usuario-faker'

test.describe('Usuarios', () => {
  let testData: SegipPruebaType[]
  const { email, phone } = UsuarioFaker()

  test.beforeAll(() => {
    testData = loadSegipData()
  })

  test('crear y editar usuario', async ({ page, isMobile }) => {
    test.skip(testData.length === 0, 'No hay datos de prueba disponibles')

    const usuarios = testData.filter((value) => value.Observacion == null)
    const indice = Math.floor(Math.random() * usuarios.length)

    const algunUsuario = usuarios[indice]

    test.skip(!algunUsuario, 'No se encontró un usuario válido para la prueba')

    await test.step('Iniciar sesión', async () => {
      await page.goto(`/login`)
      await page.locator('#usuario').fill('ADMINISTRADOR-TECNICO')
      await page.locator('#contrasena').fill('123')
      await page.getByRole('button', { name: 'Iniciar sesión' }).click()
      if (isMobile) await page.getByRole('button', { name: 'menu' }).click()
    })

    await test.step('Crear nuevo usuario', async () => {
      await page.click("[id='/admin/usuarios']")
      await page.locator('#agregarUsuario').click()
      await page.locator('#nroDocumento').fill(algunUsuario.NumeroDocumento)
      await page.locator('#nombre').fill(algunUsuario.Nombres)
      await page
        .locator('#primerApellido')
        .fill(algunUsuario.PrimerApellido ?? '')
      await page
        .locator('#segundoApellido')
        .fill(algunUsuario.SegundoApellido ?? '')
      await page.locator('#fechaNacimiento').fill(algunUsuario.FechaNacimiento)
      await page.locator('#roles').first().click()
      await page.getByRole('option', { name: 'Usuario' }).click()
      await page.getByRole('option', { name: 'Usuario' }).press('Escape')
      await page.locator('#correoElectronico').fill(email)
      await page.locator('#telefono').fill(phone)
      await page.getByRole('button', { name: 'Guardar' }).click()
      await page.waitForLoadState('networkidle')
    })

    await test.step('Verificar creación del usuario', async () => {
      await page.locator('#accionFiltrarUsuarioToggle').click()
      await page.locator('#nombre').fill(algunUsuario.NumeroDocumento)
      await page.waitForLoadState('networkidle')
      await expect(
        page.getByText(algunUsuario.NumeroDocumento).first()
      ).toBeVisible()
    })
  })
})
