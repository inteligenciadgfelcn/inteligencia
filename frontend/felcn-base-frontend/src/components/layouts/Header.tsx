'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { IRootState } from '@/store'
import { toggleTheme, toggleSidebar } from '@/store/themeConfigSlice'
import Dropdown from './Dropdown'
import IconMenu from '@/components/Icon/IconMenu'
import IconSun from '@/components/Icon/IconSun'
import IconMoon from '@/components/Icon/IconMoon'
import IconLaptop from '@/components/Icon/IconLaptop'
import IconUser from '@/components/Icon/IconUser'
import IconLogout from '@/components/Icon/IconLogout'
import { useSession } from '@/hooks'
import { useRouter, usePathname } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { NavbarSearch } from '@/components/navbars/NavbarUser/NavbarSearch'
import { useAuth } from '@/context/AuthProvider'
import AppMenuHorizontal from './HorizontalMenu'
import { BASE_PATH } from '@/imageLoader'
import { RoleType } from '@/app/login/types/loginTypes'

const Header = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { rolUsuario, usuario, setRolUsuario } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [autocompleteOpen, setAutocompleteOpen] = useState(false)
  const { cerrarSesion } = useSession()

  const handleLogout = async () => {
    await cerrarSesion()
    // router.push('/login')
  }

  const normalizeText = (text: string) => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  }

  const debouncedSearch = useDebouncedCallback((term: string) => {
    const normalizedTerm = normalizeText(term)

    const results = rolUsuario?.modulos
      ?.flatMap((m: any) => m.subModulo)
      .filter((s: any) => normalizeText(s.label).includes(normalizedTerm))

    setSearchResults(results || [])
  }, 300)

  const handleInputChange = (_: any, value: string) => {
    setSearchTerm(value)

    if (!value) {
      setSearchResults([])
      setAutocompleteOpen(false)
      return
    }

    setAutocompleteOpen(true)
    debouncedSearch(value)
  }

  const handleOptionSelect = (_: any, value: any) => {
    if (value?.url) {
      router.push(value.url)
      setSearchTerm('')
      setSearchResults([])
      setAutocompleteOpen(false)
    }
  }

  useEffect(() => {
    const selector = document.querySelector(
      'ul.horizontal-menu a[href="' + window.location.pathname + '"]'
    )
    if (selector) {
      const all: any = document.querySelectorAll(
        'ul.horizontal-menu .nav-link.active'
      )
      for (let i = 0; i < all.length; i++) {
        all[0]?.classList.remove('active')
      }

      let allLinks = document.querySelectorAll('ul.horizontal-menu a.active')
      for (let i = 0; i < allLinks.length; i++) {
        const element = allLinks[i]
        element?.classList.remove('active')
      }
      selector?.classList.add('active')

      const ul: any = selector.closest('ul.sub-menu')
      if (ul) {
        let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link')
        if (ele) {
          ele = ele[0]
          setTimeout(() => {
            ele?.classList.add('active')
          })
        }
      }
    }
  }, [pathname])

  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl'
      ? true
      : false

  const themeConfig = useSelector((state: IRootState) => state.themeConfig)

  const dispatch = useDispatch()

  return (
    <header
      className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}
    >
      <div className="shadow-sm">
        <div className="relative flex w-full items-center bg-white px-5 py-2.5 dark:bg-black">
          <div className="horizontal-logo flex items-center justify-between ltr:mr-2 rtl:ml-2 lg:hidden">
            <Link href="/" className="main-logo flex shrink-0 items-center">
              <img
                className="inline w-8 ltr:-ml-1 rtl:-mr-1"
                src={`${BASE_PATH}/assets/images/sombrero.png`}
                alt="logo"
              />
              <span className="hidden align-middle text-2xl  font-semibold  transition-all duration-300 ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light md:inline">
                SUNESIS
              </span>
            </Link>
            <button
              type="button"
              className="collapse-icon flex flex-none rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary
  ltr:ml-2 rtl:mr-2 dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary lg:hidden"
              onClick={() => {
                if (themeConfig.menu === 'horizontal') {
                  dispatch(toggleSidebar())
                  dispatch(toggleTheme('vertical'))
                } else {
                  dispatch(toggleSidebar())
                }
              }}
            >
              <IconMenu className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center space-x-1.5 ltr:ml-auto rtl:mr-auto rtl:space-x-reverse dark:text-[#d0d2d6] sm:flex-1 ltr:sm:ml-0 sm:rtl:mr-0 lg:space-x-2">
            <div className="sm:ltr:mr-auto sm:rtl:ml-auto">
              <NavbarSearch
                searchTerm={searchTerm}
                searchResults={searchResults}
                handleInputChange={handleInputChange}
                handleOptionSelect={handleOptionSelect}
                open={autocompleteOpen}
                onOpen={() => setAutocompleteOpen(true)}
                onClose={() => setAutocompleteOpen(false)}
              />
            </div>
            <div>
              {themeConfig.theme === 'light' ? (
                <button
                  className={`${themeConfig.theme === 'light' &&
                    'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                    }`}
                  onClick={() => dispatch(toggleTheme('dark'))}
                >
                  <IconSun />
                </button>
              ) : (
                ''
              )}
              {themeConfig.theme === 'dark' && (
                <button
                  className={`${themeConfig.theme === 'dark' &&
                    'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                    }`}
                  onClick={() => dispatch(toggleTheme('system'))}
                >
                  <IconMoon />
                </button>
              )}
              {themeConfig.theme === 'system' && (
                <button
                  className={`${themeConfig.theme === 'system' &&
                    'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                    }`}
                  onClick={() => dispatch(toggleTheme('light'))}
                >
                  <IconLaptop />
                </button>
              )}
            </div>
            <div className="dropdown flex shrink-0">
              <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                btnClassName="relative group block"
                button={
                  <img
                    className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100"
                    src={`${BASE_PATH}/assets/images/user-profile.jpeg`}
                    alt="userProfile"
                  />
                }
              >
                <ul className="w-[230px] !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                  <li>
                    <div className="flex items-center px-4 py-4">
                      {usuario?.urlFoto ? (
                        <img
                          className="h-9 w-9 rounded-full object-cover"
                          src={usuario.urlFoto}
                          alt="userProfile"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                          {usuario?.persona?.nombres?.[0]}
                        </div>
                      )}

                      <div className="truncate ltr:pl-4 rtl:pr-4">
                        <h4 className="text-base">
                          {usuario?.persona?.nombres}  {usuario?.persona?.primerApellido}
                        </h4>
                        <button
                          type="button"
                          className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white"
                        >
                          {usuario?.correoElectronico}
                        </button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <Link
                      href="/users/profile"
                      className="dark:hover:text-white"
                    >
                      <IconUser className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                      Perfil
                    </Link>
                  </li>
                  {(usuario?.roles?.length ?? 0) > 1 && (
                    <li className="border-t border-white-light dark:border-white-light/10 px-4 py-2">
                      <p className="text-xs text-gray-400 mb-2">Cambiar rol</p>
                      <div className="flex flex-col gap-1">
                        {usuario?.roles.map((rol: RoleType) => (
                          <button
                            key={rol.idRol}
                            onClick={() => setRolUsuario({ idRol: rol.idRol })}
                            className={`w-full text-left px-3 py-1.5 text-xs rounded border transition-colors ${
                              rolUsuario?.idRol === rol.idRol
                                ? 'bg-primary text-white border-primary'
                                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {rol.nombre}
                          </button>
                        ))}
                      </div>
                    </li>
                  )}
                  <li className="border-t border-white-light dark:border-white-light/10">
                    <button
                      onClick={handleLogout}
                      className="!py-3 text-danger flex items-center w-full"
                    >
                      <IconLogout className="h-4.5 w-4.5 shrink-0 rotate-90 ltr:mr-2 rtl:ml-2" />
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </Dropdown>
            </div>
          </div>
        </div>

        {themeConfig.menu === 'horizontal' && (
          <ul className="horizontal-menu hidden border-t border-[#ebedf2] bg-white px-6 py-1.5 font-semibold text-black rtl:space-x-reverse dark:border-[#191e3a] dark:bg-black dark:text-white-dark lg:flex lg:space-x-1.5 xl:space-x-8">
            <AppMenuHorizontal />
          </ul>
        )}
      </div>
    </header>
  )
}

export default Header
