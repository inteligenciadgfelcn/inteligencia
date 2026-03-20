import { usePeticion } from '@/hooks/usePeticion'
import { Constantes } from '@/config/Constantes'

export interface Continente {
	idContinente: number
	descripcion: string
	estado: string
}

export interface Pais {
	idPais: number
	descripcion: string
	estado: string
	continente: Continente
}

const { sesionPeticion } = usePeticion()

export async function getPaises(): Promise<Pais[]> {
	const response = await sesionPeticion({
		url: `${Constantes.baseUrl}/pais/allGeneral`,
		withCredentials: true,
	})

	return response
}
