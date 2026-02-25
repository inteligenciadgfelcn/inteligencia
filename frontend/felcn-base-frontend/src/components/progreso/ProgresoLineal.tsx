interface ProgresoLinealType {
  mostrar?: boolean
}

export default function ProgresoLineal({ mostrar = true }: ProgresoLinealType) {
  return mostrar ? (
    <div className="w-full">
      <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div className="bg-primary h-2 rounded-full animate-pulse"></div>
      </div>
    </div>
  ) : null
}
