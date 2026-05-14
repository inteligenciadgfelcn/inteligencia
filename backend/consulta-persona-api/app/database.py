import asyncpg
from datetime import date
from app.config import settings

_pool: asyncpg.Pool | None = None


async def get_pool() -> asyncpg.Pool:
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(
            host=settings.app_host_db,
            port=settings.app_port_db,
            user=settings.app_user_db,
            password=settings.app_password_db,
            database=settings.app_name_database,
            min_size=settings.db_min_size,
            max_size=settings.db_max_size,
            command_timeout=settings.db_command_timeout,
            server_settings={"search_path": "public"},
        )
    return _pool


async def close_pool() -> None:
    global _pool
    if _pool:
        await _pool.close()
        _pool = None


QUERY_PERSONA = """
SELECT
    nrodocumento,
    complemento,
    complemento_visible,
    nombres,
    primerapellido,
    segundoapellido,
    apellido_casada,
    fechanacimiento,
    celular,
    telefonodomicilio,
    correoelectronico,
    domicilio,
    TRIM(estado) AS estado,
    estado_habilitacion
FROM public.personas
WHERE nrodocumento = $1
  AND fechanacimiento = $2
LIMIT 1
"""

QUERY_PERSONA_CON_COMPLEMENTO = """
SELECT
    nrodocumento,
    complemento,
    complemento_visible,
    nombres,
    primerapellido,
    segundoapellido,
    apellido_casada,
    fechanacimiento,
    celular,
    telefonodomicilio,
    correoelectronico,
    domicilio,
    TRIM(estado) AS estado,
    estado_habilitacion
FROM public.personas
WHERE nrodocumento = $1
  AND fechanacimiento = $2
  AND UPPER(TRIM(complemento)) = UPPER(TRIM($3))
LIMIT 1
"""


async def query_persona(
    nrodocumento: str,
    fechanacimiento: str,
    complemento: str | None = None,
) -> asyncpg.Record | None:
    fecha = date.fromisoformat(fechanacimiento)
    pool = await get_pool()
    async with pool.acquire() as conn:
        if complemento:
            return await conn.fetchrow(
                QUERY_PERSONA_CON_COMPLEMENTO,
                nrodocumento,
                fecha,
                complemento,
            )
        return await conn.fetchrow(QUERY_PERSONA, nrodocumento, fecha)
