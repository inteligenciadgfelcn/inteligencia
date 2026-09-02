import PerfectScrollbar from 'react-perfect-scrollbar'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { toggleSidebar } from '@/store/themeConfigSlice'
import AnimateHeight from 'react-animate-height'
import { IRootState } from '@/store'
import { useState, useEffect } from 'react'
import IconCaretsDown from '@/components/Icon/IconCaretsDown'
import IconCaretDown from '@/components/Icon/IconCaretDown'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthProvider'
import { menuIconMap } from '@/components/sidebar/menuIconMap'
import { BASE_PATH } from '@/imageLoader'

const Sidebar = () => {
  const { rolUsuario } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const modulos = mounted ? (rolUsuario?.modulos || []) : []

  const pathname = usePathname()
  const [currentMenu, setCurrentMenu] = useState<string>('')
  const themeConfig = useSelector((state: IRootState) => state.themeConfig)
  const semidark = useSelector(
    (state: IRootState) => state.themeConfig.semidark
  )
  const toggleMenu = (value: string) => {
    setCurrentMenu((oldValue) => {
      return oldValue === value ? '' : value
    })
  }

  useEffect(() => {
    const selector = document.querySelector(
      '.sidebar ul a[href="' + window.location.pathname + '"]'
    )
    if (selector) {
      selector.classList.add('active')
      const ul: any = selector.closest('ul.sub-menu')
      if (ul) {
        let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || []
        if (ele.length) {
          ele = ele[0]
          setTimeout(() => {
            ele.click()
          })
        }
      }
    }
  }, [])

  useEffect(() => {
    setActiveRoute()
    if (window.innerWidth < 1024 && themeConfig.sidebar) {
      dispatch(toggleSidebar())
    }
  }, [pathname])

  const setActiveRoute = () => {
    let allLinks = document.querySelectorAll('.sidebar ul a.active')
    for (let i = 0; i < allLinks.length; i++) {
      const element = allLinks[i]
      element?.classList.remove('active')
    }
    const selector = document.querySelector(
      '.sidebar ul a[href="' + window.location.pathname + '"]'
    )
    selector?.classList.add('active')
  }

  const dispatch = useDispatch()
  const { t } = useTranslation()

  return (
    <div className={semidark ? 'dark' : ''}>
      <nav
        className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
      >
        <div className="h-full bg-white dark:bg-black">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/" className="main-logo flex shrink-0 items-center">
              <img
                className="ml-[5px] w-8 flex-none"
                src={`${BASE_PATH}/assets/images/sombrero.png`}
                alt="logo"
              />
              <span className="align-middle text-2xl font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline">
                {t('SUNESIS')}
              </span>
            </Link>

            <button
              type="button"
              className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
              onClick={() => dispatch(toggleSidebar())}
            >
              <IconCaretsDown className="m-auto rotate-90" />
            </button>
          </div>
          <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
            <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
              {modulos.map((modulo: any) => (
                <li key={modulo.id} className="menu nav-item">
                  <button
                    type="button"
                    className={`${currentMenu === modulo.id ? 'active' : ''} nav-link group w-full`}
                    onClick={() => toggleMenu(modulo.id)}
                  >
                    <div className="flex items-center">
                      {/* ICONO DEL MODULO */}
                      {(() => {
                        const Icon =
                          menuIconMap[modulo.propiedades?.icono] ||
                          menuIconMap.default
                        return (
                          <Icon className="shrink-0 group-hover:!text-primary" />
                        )
                      })()}

                      <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                        {modulo.label}
                      </span>
                    </div>

                    <div
                      className={
                        currentMenu !== modulo.id
                          ? '-rotate-90 rtl:rotate-90'
                          : ''
                      }
                    >
                      <IconCaretDown />
                    </div>
                  </button>

                  <AnimateHeight
                    duration={300}
                    height={currentMenu === modulo.id ? 'auto' : 0}
                  >
                    <ul className="sub-menu text-gray-500">
                      {modulo.subModulo.map((sub: any) => {
                        const SubIcon =
                          menuIconMap[sub.propiedades?.icono] ||
                          menuIconMap.default

                        return (
                          <li key={sub.id}>
                            <Link href={sub.url} className="group">
                              <div className="flex items-center">
                                <SubIcon className="shrink-0 group-hover:!text-primary" />

                                <span className="ltr:pl-3 rtl:pr-3">
                                  {sub.label}
                                </span>
                              </div>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </AnimateHeight>
                </li>
              ))}
            </ul>
          </PerfectScrollbar>
        </div>
      </nav>
    </div>
  )
}

export default Sidebar
