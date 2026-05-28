import type { ResumenEstadistico, ResumenFabrica } from '@/services/reportes/CuadrosService'

export function PanelResumen({ resumen, fabricas }: { resumen: ResumenEstadistico; fabricas: ResumenFabrica[] }) {
  return (
    <div className="space-y-4">
      <table className="w-full text-xs border-collapse rounded-lg overflow-hidden border border-[#e0e6ed] dark:border-[#1b2e4b]">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-white bg-[#3e5f8a] border border-[#2d4a6f] font-semibold w-1/2">Descripción</th>
            <th className="px-4 py-2 text-left text-white bg-[#3e5f8a] border border-[#2d4a6f] font-semibold">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white dark:bg-transparent">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300">Clorhidrato de Cocaína</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{resumen.clorhidratoCocaina} Gramos</td>
          </tr>
          <tr className="bg-gray-50 dark:bg-[#0c1528]/40">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300">Pasta Base de Cocaína</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{resumen.cocainaBasePasta} Gramos</td>
          </tr>
          <tr className="bg-white dark:bg-transparent">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300">Agua Rica a Cocaína Base</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{resumen.drogasLiquidasLitros} Litros = {resumen.drogasLiquidasGramos} Gramos</td>
          </tr>
          <tr className="bg-gray-50 dark:bg-[#0c1528]/40">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300">Cocaína Líquida a Clorhidrato</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{resumen.cocainaLiquidaLitros} Litros = {resumen.cocainaLiquidaGramos} Gramos</td>
          </tr>
          <tr className="bg-white dark:bg-transparent">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300">Marihuana</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{resumen.marihuanaGramos} Gramos</td>
          </tr>
          <tr className="bg-gray-50 dark:bg-[#0c1528]/40">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300">Marihuana Líquida</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{resumen.marihuanaLitros} Litros</td>
          </tr>
          <tr className="bg-white dark:bg-transparent">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300 align-top">Estupefacientes y Psicotrópicos</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">
              {resumen.otrasDrogas.length > 0 ? (
                <table className="w-full text-xs border-collapse rounded overflow-hidden">
                  <thead>
                    <tr>
                      {['Tipo Droga', 'Cantidad', 'Unidad de Medida', 'Estado de la Droga'].map(h => (
                        <th key={h} className="px-3 py-1.5 text-left text-white bg-[#5a7ba8] border border-[#4a6a98] font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {resumen.otrasDrogas.map((d, i) => (
                      <tr key={i} className="bg-white dark:bg-[#0c1528]">
                        <td className="px-3 py-1.5 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-700 dark:text-gray-300">{d.descripcionTipo}</td>
                        <td className="px-3 py-1.5 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{d.cantidad}</td>
                        <td className="px-3 py-1.5 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{d.medida}</td>
                        <td className="px-3 py-1.5 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{d.descripcionEstado}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <span className="text-gray-400 italic">Sin registros</span>
              )}
            </td>
          </tr>
          <tr className="bg-gray-50 dark:bg-[#0c1528]/40">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300">Sustancias Químicas Sólidas</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{resumen.sustanciasSolidasKg} Kilos</td>
          </tr>
          <tr className="bg-white dark:bg-transparent">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300">Sustancias Sólidas a Determinar</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{resumen.sustanciasSolidasSinDet} Kilos</td>
          </tr>
          <tr className="bg-gray-50 dark:bg-[#0c1528]/40">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300">Sustancias Químicas Líquidas</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{resumen.sustanciasLiquidasLt} Litros</td>
          </tr>
          <tr className="bg-white dark:bg-transparent">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300">Sustancias Líquidas a Determinar</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{resumen.sustanciasLiquidasSinDet} Litros</td>
          </tr>
          <tr className="bg-gray-50 dark:bg-[#0c1528]/40">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300 align-top">Laboratorios - Fábricas</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">
              {fabricas.length > 0 ? (
                <table className="w-full max-w-md text-xs border-collapse rounded overflow-hidden">
                  <thead>
                    <tr>
                      <th className="px-3 py-1.5 text-left text-white bg-[#5a7ba8] border border-[#4a6a98] font-medium">Fab./Poz</th>
                      <th className="px-3 py-1.5 text-center text-white bg-[#5a7ba8] border border-[#4a6a98] font-medium w-24">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fabricas.map((f) => (
                      <tr key={f.idTipoFabrica} className="bg-white dark:bg-[#0c1528]">
                        <td className="px-3 py-1.5 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-700 dark:text-gray-300">{f.descripcion}</td>
                        <td className="px-3 py-1.5 border border-[#e0e6ed] dark:border-[#1b2e4b] text-center font-bold text-gray-700 dark:text-gray-300">{f.totalCantidad}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <span className="text-gray-400 italic">Sin registros</span>
              )}
            </td>
          </tr>
          <tr className="bg-white dark:bg-transparent">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300">Aprehendido(s)</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{resumen.totalAprehendidos}</td>
          </tr>
          <tr className="bg-gray-50 dark:bg-[#0c1528]/40">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300">Arrestado(s)</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{resumen.totalArrestados}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
