import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { usePopper } from 'react-popper'

const Dropdown = (props: any, forwardedRef: any) => {
  const [visibility, setVisibility] = useState<any>(false)

  // Elementos como estado (no useRef): usePopper necesita re-renderizar cuando
  // el nodo del DOM aparece para poder calcular la posición. Con useRef leído
  // en el render, el primer cálculo puede quedarse con estilos sin resolver
  // (menú abierto en el estado pero invisible / mal posicionado).
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null)
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)

  const { styles, attributes, update } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: props.placement || 'bottom-end',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: props.offset || [0],
          },
        },
      ],
    }
  )

  // Popper.js solo recalcula posición automáticamente en scroll/resize de la
  // ventana, no cuando el contenido del popper cambia de tamaño (el div pasa
  // de vacío a menú completo al abrirse). Sin este forceUpdate, la primera
  // apertura usa la posición calculada para un popper de 0x0 y el menú queda
  // fuera de lugar o no visible hasta que un resize fuerza el recálculo.
  useEffect(() => {
    if (visibility) {
      update?.()
    }
  }, [visibility, update])

  useEffect(() => {
    const handleDocumentClick = (event: any) => {
      if (
        referenceElement?.contains(event.target) ||
        popperElement?.contains(event.target)
      ) {
        return
      }

      setVisibility(false)
    }

    document.addEventListener('mousedown', handleDocumentClick)
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick)
    }
  }, [referenceElement, popperElement])

  useImperativeHandle(forwardedRef, () => ({
    close() {
      setVisibility(false)
    },
  }))

  return (
    <>
      <button
        ref={setReferenceElement}
        type="button"
        className={props.btnClassName}
        onClick={() => setVisibility(!visibility)}
      >
        {props.button}
      </button>

      <div
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
        className="z-50"
        onClick={() => setVisibility(!visibility)}
      >
        {visibility && props.children}
      </div>
    </>
  )
}

export default forwardRef(Dropdown)
