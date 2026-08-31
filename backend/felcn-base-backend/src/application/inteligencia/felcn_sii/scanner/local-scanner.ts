export async function
getLocalScanner()
{
  try
  {
    const response =
      await fetch(
        'http://localhost:5055/scanner',
      )

    if (!response.ok)
    {
      throw new Error(
        'No se pudo conectar al Agent',
      )
    }

    return await response.json()
  }
  catch (error)
  {
    console.error(error)

    throw new Error(
      'Pandora Agent no iniciado',
    )
  }
}