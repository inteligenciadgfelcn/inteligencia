import { sesionPeticion } from '@/utils/peticion'
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


export async function getPaises(): Promise<Pais[]> {
	const response = await sesionPeticion({
		url: `${Constantes.baseUrl}/pais/allGeneral`,
		withCredentials: true,
	})

	return response
}
