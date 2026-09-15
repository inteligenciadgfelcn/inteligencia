import IconUsers from '@/components/Icon/IconUsers'
import IconClipboardText from '@/components/Icon/IconClipboardText'
import IconCashBanknotes from '@/components/Icon/IconCashBanknotes'
import IconUsersGroup from '@/components/Icon/IconUsersGroup'
import IconChecks from '@/components/Icon/IconChecks'

export type MenuOption =
  | 'personas-investigadas'
  | 'actuaciones-realizadas'
  | 'bienes-identificados'
  | 'personas-juridicas'
  | 'conclusion-caso'

type Props = {
  activeOption: MenuOption
  onSelect: (option: MenuOption) => void
}

const options: Array<{
  key: MenuOption
  label: string
  icon: typeof IconUsers
}> = [
  { key: 'personas-investigadas', label: 'Personas Investigadas', icon: IconUsers },
  { key: 'actuaciones-realizadas', label: 'Actuaciones Realizadas', icon: IconClipboardText },
  { key: 'bienes-identificados', label: 'Bienes Identificados', icon: IconCashBanknotes },
  { key: 'personas-juridicas', label: 'Personas Jurídicas', icon: IconUsersGroup },
  { key: 'conclusion-caso', label: 'Conclusión del Caso', icon: IconChecks },
]

export function MenuVertical({ activeOption, onSelect }: Props) {
  return (
    <>
      {/* Desktop: vertical */}
      <nav className="hidden w-64 shrink-0 lg:block">
        <div className="panel p-2">
          {options.map((opt) => {
            const active = activeOption === opt.key
            const Icon = opt.icon
            return (
              <button
                key={opt.key}
                type="button"
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-[#1b2e4b]'
                }`}
                onClick={() => onSelect(opt.key)}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-primary' : ''}`} />
                {opt.label}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Mobile: horizontal scrollable */}
      <nav className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
        {options.map((opt) => {
          const active = activeOption === opt.key
          const Icon = opt.icon
          return (
            <button
              key={opt.key}
              type="button"
              className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                active
                  ? 'bg-primary/10 text-primary'
                  : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-[#0f172a] dark:text-gray-400 dark:hover:bg-[#1b2e4b]'
              }`}
              onClick={() => onSelect(opt.key)}
            >
              <Icon className={`h-4 w-4 ${active ? 'text-primary' : ''}`} />
              {opt.label}
            </button>
          )
        })}
      </nav>
    </>
  )
}
