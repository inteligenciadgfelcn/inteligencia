import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IRootState } from '../../store'
import {
  toggleAnimation,
  toggleLayout,
  toggleMenu,
  toggleRTL,
  toggleTheme,
  toggleSemidark,
} from '../../store/themeConfigSlice'
import IconSettings from '@/components/Icon/IconSettings'
import IconX from '@/components/Icon/IconX'
import IconSun from '@/components/Icon/IconSun'
import IconMoon from '@/components/Icon/IconMoon'
import IconLaptop from '@/components/Icon/IconLaptop'

const Setting = () => {
  const themeConfig = useSelector((state: IRootState) => state.themeConfig)
  const dispatch = useDispatch()

  const [showCustomizer, setShowCustomizer] = useState(false)

  return (
    <div>
      <div
        className={`${(showCustomizer && '!block') || ''} fixed inset-0 z-[51] hidden bg-[black]/60 px-4 transition-[display]`}
        onClick={() => setShowCustomizer(false)}
      ></div>

      <nav
        className={`${
          (showCustomizer && 'ltr:!right-0 rtl:!left-0') || ''
        } fixed top-0 bottom-0 z-[51] w-full max-w-[400px] bg-white p-4 shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-[right] duration-300 ltr:-right-[400px] rtl:-left-[400px] dark:bg-black`}
      >
        <button
          type="button"
          className="absolute top-0 bottom-0 my-auto flex h-10 w-12 cursor-pointer items-center justify-center bg-primary text-white ltr:-left-12 ltr:rounded-tl-full ltr:rounded-bl-full rtl:-right-12 rtl:rounded-tr-full rtl:rounded-br-full"
          onClick={() => setShowCustomizer(!showCustomizer)}
        >
          <IconSettings className="animate-[spin_3s_linear_infinite] w-5 h-5" />
        </button>

        <div className="perfect-scrollbar h-full overflow-y-auto overflow-x-hidden">
          <div className="relative pb-5 text-center">
            <button
              type="button"
              className="absolute top-0 opacity-30 hover:opacity-100 ltr:right-0 rtl:left-0 dark:text-white"
              onClick={() => setShowCustomizer(false)}
            >
              <IconX className="w-5 h-5" />
            </button>

            <h4 className="mb-1 dark:text-white">PERSONALIZADOR PANDORA</h4>
            <p className="text-white-dark">
              Configura las preferencias que se guardarán para tu vista previa.
            </p>
          </div>

          {/* ESQUEMA DE COLOR */}
          <div className="mb-3 rounded-md border border-dashed border-white-light p-3 dark:border-[#1b2e4b]">
            <h5 className="mb-1 text-base leading-none dark:text-white">
              Esquema de Color
            </h5>
            <p className="text-xs text-white-dark">
              Presentación clara u oscura del sistema.
            </p>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <button
                type="button"
                className={`${
                  themeConfig.theme === 'light'
                    ? 'btn-primary'
                    : 'btn-outline-primary'
                } btn`}
                onClick={() => dispatch(toggleTheme('light'))}
              >
                <IconSun className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                Claro
              </button>

              <button
                type="button"
                className={`${
                  themeConfig.theme === 'dark'
                    ? 'btn-primary'
                    : 'btn-outline-primary'
                } btn`}
                onClick={() => dispatch(toggleTheme('dark'))}
              >
                <IconMoon className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                Oscuro
              </button>

              <button
                type="button"
                className={`${
                  themeConfig.theme === 'system'
                    ? 'btn-primary'
                    : 'btn-outline-primary'
                } btn`}
                onClick={() => dispatch(toggleTheme('system'))}
              >
                <IconLaptop className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                Sistema
              </button>
            </div>
          </div>

          {/* POSICIÓN DE NAVEGACIÓN */}
          <div className="mb-3 rounded-md border border-dashed border-white-light p-3 dark:border-[#1b2e4b]">
            <h5 className="mb-1 text-base leading-none dark:text-white">
              Posición de Navegación
            </h5>
            <p className="text-xs text-white-dark">
              Selecciona el tipo de menú principal.
            </p>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <button
                type="button"
                className={`${
                  themeConfig.menu === 'horizontal'
                    ? 'btn-primary'
                    : 'btn-outline-primary'
                } btn`}
                onClick={() => dispatch(toggleMenu('horizontal'))}
              >
                Horizontal
              </button>

              <button
                type="button"
                className={`${
                  themeConfig.menu === 'vertical'
                    ? 'btn-primary'
                    : 'btn-outline-primary'
                } btn`}
                onClick={() => dispatch(toggleMenu('vertical'))}
              >
                Vertical
              </button>

              <button
                type="button"
                className={`${
                  themeConfig.menu === 'collapsible-vertical'
                    ? 'btn-primary'
                    : 'btn-outline-primary'
                } btn`}
                onClick={() => dispatch(toggleMenu('collapsible-vertical'))}
              >
                Colapsable
              </button>
            </div>

            <div className="mt-5 text-primary">
              <label className="mb-0 inline-flex">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={themeConfig.semidark}
                  onChange={(e) => dispatch(toggleSemidark(e.target.checked))}
                />
                <span>Modo Semi Oscuro (Sidebar y Header)</span>
              </label>
            </div>
          </div>

          {/* ESTILO DE LAYOUT */}
          <div className="mb-3 rounded-md border border-dashed border-white-light p-3 dark:border-[#1b2e4b]">
            <h5 className="mb-1 text-base leading-none dark:text-white">
              Estilo de Diseño
            </h5>
            <p className="text-xs text-white-dark">
              Selecciona el tipo de diseño.
            </p>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                className={`${
                  themeConfig.layout === 'boxed-layout'
                    ? 'btn-primary'
                    : 'btn-outline-primary'
                } btn flex-auto`}
                onClick={() => dispatch(toggleLayout('boxed-layout'))}
              >
                Caja
              </button>

              <button
                type="button"
                className={`${
                  themeConfig.layout === 'full'
                    ? 'btn-primary'
                    : 'btn-outline-primary'
                } btn flex-auto`}
                onClick={() => dispatch(toggleLayout('full'))}
              >
                Completo
              </button>
            </div>
          </div>

          {/* DIRECCIÓN */}
          <div className="mb-3 rounded-md border border-dashed border-white-light p-3 dark:border-[#1b2e4b]">
            <h5 className="mb-1 text-base leading-none dark:text-white">
              Dirección
            </h5>
            <p className="text-xs text-white-dark">Dirección de lectura.</p>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                className={`${
                  themeConfig.rtlClass === 'ltr'
                    ? 'btn-primary'
                    : 'btn-outline-primary'
                } btn flex-auto`}
                onClick={() => dispatch(toggleRTL('ltr'))}
              >
                Izquierda a Derecha
              </button>

              <button
                type="button"
                className={`${
                  themeConfig.rtlClass === 'rtl'
                    ? 'btn-primary'
                    : 'btn-outline-primary'
                } btn flex-auto`}
                onClick={() => dispatch(toggleRTL('rtl'))}
              >
                Derecha a Izquierda
              </button>
            </div>
          </div>

          {/* TRANSICIÓN */}
          <div className="mb-3 rounded-md border border-dashed border-white-light p-3 dark:border-[#1b2e4b]">
            <h5 className="mb-1 text-base leading-none dark:text-white">
              Transición entre Páginas
            </h5>
            <p className="text-xs text-white-dark">
              Animación del contenido principal.
            </p>

            <select
              className="form-select border-primary text-primary"
              value={themeConfig.animation}
              onChange={(e) => dispatch(toggleAnimation(e.target.value))}
            >
              <option value=" ">Ninguna</option>
              <option value="animate__fadeIn">Desvanecer</option>
              <option value="animate__fadeInDown">Desvanecer Abajo</option>
              <option value="animate__fadeInUp">Desvanecer Arriba</option>
              <option value="animate__fadeInLeft">Desvanecer Izquierda</option>
              <option value="animate__fadeInRight">Desvanecer Derecha</option>
              <option value="animate__slideInDown">Deslizar Abajo</option>
              <option value="animate__slideInLeft">Deslizar Izquierda</option>
              <option value="animate__slideInRight">Deslizar Derecha</option>
              <option value="animate__zoomIn">Zoom</option>
            </select>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Setting
