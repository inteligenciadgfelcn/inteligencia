import { usePeticion } from '@/hooks/usePeticion'
import { Constantes } from '@/config/Constantes'

export interface Parentesco {
	idParentezco: number
	descripcion: string
	estado: string
}

const { sesionPeticion } = usePeticion()

export async function getParentescos(): Promise<Parentesco[]> {
	const response = await sesionPeticion({
		url: `${Constantes.baseUrl}/parentezco/allGeneral`,
		withCredentials: true,
	})

	return response
}
