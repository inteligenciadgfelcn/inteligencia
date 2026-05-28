import logging
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, Response, Security, status
from fastapi.security import APIKeyHeader
from pydantic import BaseModel, Field, field_validator

from app import cache
from app.config import settings
from app.services.persona_service import consultar_persona

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/v1", tags=["Persona"])

_api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

UNLIMITED = "unlimited"
LIMITED   = "limited"


def verify_api_key(api_key: Annotated[str | None, Security(_api_key_header)]) -> str:
    """Valida la API Key y retorna el tipo: 'unlimited' o 'limited'."""
    if api_key == settings.api_key_unlimited:
        return UNLIMITED
    if api_key == settings.api_key_limited:
        return LIMITED
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="API Key inválida")


def _get_client_ip(request: Request) -> str:
    """Obtiene la IP real del cliente considerando el proxy nginx."""
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip.strip()
    return request.client.host if request.client else "unknown"


class ConsultaRequest(BaseModel):
    numero_documento: str = Field(..., min_length=1, max_length=15)
    fecha_nacimiento: str = Field(..., description="Formato dd/MM/yyyy")
    complemento: str | None = Field(None, max_length=50)
    nombre: str | None = Field(None, max_length=250)
    primer_apellido: str | None = Field(None, max_length=250)
    segundo_apellido: str | None = Field(None, max_length=250)

    @field_validator("fecha_nacimiento")
    @classmethod
    def validar_fecha(cls, v: str) -> str:
        try:
            datetime.strptime(v, "%d/%m/%Y")
        except ValueError:
            raise ValueError("La fecha debe tener formato dd/MM/yyyy")
        return v

    @field_validator("numero_documento")
    @classmethod
    def limpiar_documento(cls, v: str) -> str:
        return v.strip()


class PersonaData(BaseModel):
    numero_documento: str
    complemento: str
    complemento_visible: str
    nombres: str
    primer_apellido: str
    segundo_apellido: str
    apellido_casada: str
    fecha_nacimiento: str
    celular: str
    telefono_domicilio: str
    correo_electronico: str
    domicilio: str
    estado: str
    estado_habilitacion: str


class ConsultaResponse(BaseModel):
    fecha: str
    success: bool
    mensaje: str
    objeto: PersonaData | None


@router.post("/persona", response_model=ConsultaResponse)
async def consulta_persona(
    request: Request,
    response: Response,
    body: ConsultaRequest,
    key_type: Annotated[str, Depends(verify_api_key)],
) -> ConsultaResponse:
    now = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")

    # ── Rate limiting (solo aplica a la key limitada) ─────────────────────────
    if key_type == LIMITED:
        ip = _get_client_ip(request)
        allowed, count, reset_secs = await cache.rate_limit_use(ip)

        response.headers["X-RateLimit-Limit"]     = str(settings.rate_limit_daily)
        response.headers["X-RateLimit-Remaining"] = str(max(settings.rate_limit_daily - count, 0))
        response.headers["X-RateLimit-Reset"]     = str(reset_secs)

        if not allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail={
                    "mensaje": f"Límite de {settings.rate_limit_daily} consultas diarias alcanzado.",
                    "reset_en_segundos": reset_secs,
                },
                headers={
                    "X-RateLimit-Limit":     str(settings.rate_limit_daily),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset":     str(reset_secs),
                    "Retry-After":           str(reset_secs),
                },
            )

    # ── Consulta ──────────────────────────────────────────────────────────────
    try:
        resultado = await consultar_persona(
            numero_documento=body.numero_documento,
            fecha_nacimiento=body.fecha_nacimiento,
            complemento=body.complemento,
            nombre=body.nombre,
            primer_apellido=body.primer_apellido,
            segundo_apellido=body.segundo_apellido,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except Exception as exc:
        logger.error("Error consultando persona: %s", exc)
        return ConsultaResponse(
            fecha=now,
            success=False,
            mensaje="Error interno al procesar la solicitud",
            objeto=None,
        )

    if resultado is None:
        return ConsultaResponse(
            fecha=now,
            success=False,
            mensaje="No se encontró la persona con los datos proporcionados",
            objeto=None,
        )

    return ConsultaResponse(
        fecha=now,
        success=True,
        mensaje="Transacción satisfactoria",
        objeto=PersonaData(**resultado),
    )
