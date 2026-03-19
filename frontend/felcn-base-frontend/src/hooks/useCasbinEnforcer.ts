import { Enforcer } from 'casbin'
import { imprimir } from '@/utils/imprimir'
import { basicModel, basicPolicy } from '@/utils/casbin'
import { PoliticaType } from '@/app/login/types/loginTypes'

interface InterpretarPermisoParams {
  routerName: string
  enforcer?: Enforcer
  rol?: string
}

interface PermisoSobreAccionParams {
  enforcer?: Enforcer
  rol: string
  objeto: string
  accion: string
}

export const useCasbinEnforcer = () => {
  interface VerificarAutorizacionType {
    enforcer?: Enforcer
    politica?: PoliticaType
  }

  const inicializarCasbin = async (politicas: string[][]) => {
    const casbinLib = await import('casbin')
    imprimir(`casbinLib 🪄`, casbinLib)

    const model = casbinLib.newModelFromString(basicModel)
    const policy = new casbinLib.StringAdapter(basicPolicy)
    const enforcerTemp: Enforcer = await casbinLib.newEnforcer(model, policy)
    for await (const p of politicas) {
      await enforcerTemp.addPolicy(p[0], p[1], p[2], p[3], p[4], p[5])
    }
    return enforcerTemp
  }

  const verificarAutorizacion = async ({
    enforcer,
    politica,
  }: VerificarAutorizacionType): Promise<boolean> => {
    return (
      (await enforcer?.enforce(
        politica?.sujeto,
        politica?.objeto,
        politica?.accion
      )) ?? false
    )
  }

  const permisoSobreAccion = ({
    enforcer,
    rol,
    objeto,
    accion,
  }: PermisoSobreAccionParams) => {
    return verificarAutorizacion({
      enforcer,
      politica: {
        sujeto: rol,
        objeto: objeto,
        accion: accion,
      },
    })
  }

  const interpretarPermiso = async ({
    routerName,
    enforcer,
    rol,
  }: InterpretarPermisoParams) => {
    // Next.js con trailingSlash:true agrega '/' al final — normalizamos para que keyMatch2 coincida
    const ruta =
      routerName.length > 1 && routerName.endsWith('/')
        ? routerName.slice(0, -1)
        : routerName

    return {
      read: await verificarAutorizacion({
        enforcer: enforcer,
        politica: {
          sujeto: rol ?? '',
          objeto: ruta,
          accion: 'read',
        },
      }),
      create: await verificarAutorizacion({
        enforcer: enforcer,
        politica: {
          sujeto: rol ?? '',
          objeto: ruta,
          accion: 'create',
        },
      }),
      update: await verificarAutorizacion({
        enforcer: enforcer,
        politica: {
          sujeto: rol ?? '',
          objeto: ruta,
          accion: 'update',
        },
      }),
      delete: await verificarAutorizacion({
        enforcer: enforcer,
        politica: {
          sujeto: rol ?? '',
          objeto: ruta,
          accion: 'delete',
        },
      }),
    }
  }
  return { inicializarCasbin, interpretarPermiso, permisoSobreAccion }
}
