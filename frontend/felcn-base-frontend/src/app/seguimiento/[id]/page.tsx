import { FormSeguimiento } from './ui/FormSeguimiento'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ tab?: string }>
}

export default async function SeguimientoDetallePage({ params, searchParams }: Props) {
  const { id } = await params
  const { tab = 'casos' } = await searchParams
  return <FormSeguimiento idCaso={id} tabInicial={tab as 'casos' | 'personas' | 'bienes'} />
}
