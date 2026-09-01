import { Constantes } from '@/config/Constantes'

const BANNER_POR_AMBIENTE: Record<string, { label: string; color: string }> = {
  development: { label: 'DEV', color: '#B71C1C' },
  staging: { label: 'STAGING', color: '#1B5E20' },
  test: { label: 'TEST', color: '#B71C1C' },
}

export default function DebugBanner() {
  const entorno = Constantes.appEnv

  if (entorno === 'production') {
    return null
  }

  const config = BANNER_POR_AMBIENTE[entorno]

  return (
    <div
      style={{
        background: config?.color ?? '#B71C1C',
        position: 'fixed',
        color: 'white',
        transform: 'rotate(45deg)',
        fontFamily: 'system-ui, serif',
        fontWeight: 'bold',
        width: '100px',
        textAlign: 'center',
        right: '-23px',
        top: '15px',
        zIndex: 9999,
      }}
    >
      {config?.label ?? entorno}
    </div>
  )
}
