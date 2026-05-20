from datetime import date, datetime
from app import cache, database


def _parse_fecha(fecha_str: str) -> str:
    """Convierte dd/MM/yyyy → YYYY-MM-DD para PostgreSQL."""
    dt = datetime.strptime(fecha_str, "%d/%m/%Y")
    return dt.strftime("%Y-%m-%d")


def _format_fecha(d: date) -> str:
    """Convierte date de PostgreSQL → dd/MM/yyyy para la respuesta."""
    return d.strftime("%d/%m/%Y")


def _normalizar_complemento(complemento: str | None) -> str | None:
    if complemento:
        c = complemento.strip().upper()
        return c if c else None
    return None


async def consultar_persona(
    numero_documento: str,
    fecha_nacimiento: str,
    complemento: str | None = None,
    nombre: str | None = None,
    primer_apellido: str | None = None,
    segundo_apellido: str | None = None,
) -> dict | None:
    complemento_norm = _normalizar_complemento(complemento)
    fecha_iso = _parse_fecha(fecha_nacimiento)
    cache_key = cache.build_key(numero_documento, fecha_iso, complemento_norm or "")

    # 1. Cache hit
    cached = await cache.get_cached(cache_key)
    if cached is not None:
        return cached

    # 2. Query PostgreSQL
    record = await database.query_persona(numero_documento, fecha_iso, complemento_norm)
    if record is None:
        return None

    # 3. Validaciones opcionales adicionales (nombre/apellidos)
    if nombre and nombre.strip().upper() not in record["nombres"].upper():
        return None
    if primer_apellido and primer_apellido.strip().upper() not in record["primerapellido"].upper():
        return None
    if segundo_apellido and segundo_apellido.strip().upper() not in record["segundoapellido"].upper():
        return None

    # 4. Serializar resultado
    resultado = {
        "numero_documento": record["nrodocumento"],
        "complemento": record["complemento"] or "",
        "complemento_visible": str(record["complemento_visible"]) if record["complemento_visible"] is not None else "",
        "nombres": record["nombres"],
        "primer_apellido": record["primerapellido"],
        "segundo_apellido": record["segundoapellido"],
        "apellido_casada": record["apellido_casada"] or "",
        "fecha_nacimiento": _format_fecha(record["fechanacimiento"]),
        "celular": record["celular"] or "",
        "telefono_domicilio": record["telefonodomicilio"] or "",
        "correo_electronico": record["correoelectronico"] or "",
        "domicilio": record["domicilio"] or "",
        "estado": record["estado"] or "",
        "estado_habilitacion": record["estado_habilitacion"] or "",
    }

    # 5. Guardar en caché
    await cache.set_cached(cache_key, resultado)

    return resultado
