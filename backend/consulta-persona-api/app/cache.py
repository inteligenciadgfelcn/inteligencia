import json
from datetime import datetime, timedelta

import redis.asyncio as aioredis

from app.config import settings

_client: aioredis.Redis | None = None


def get_client() -> aioredis.Redis:
    global _client
    if _client is None:
        _client = aioredis.Redis(
            host=settings.redis_host,
            port=settings.redis_port,
            password=settings.redis_password or None,
            decode_responses=True,
        )
    return _client


async def close_client() -> None:
    global _client
    if _client:
        await _client.aclose()
        _client = None


# ── Caché de persona ──────────────────────────────────────────────────────────

def build_key(nrodocumento: str, fechanacimiento: str, complemento: str) -> str:
    return f"persona:{nrodocumento}:{fechanacimiento}:{complemento or ''}"


async def get_cached(key: str) -> dict | None:
    try:
        value = await get_client().get(key)
        return json.loads(value) if value else None
    except Exception:
        return None


async def set_cached(key: str, data: dict) -> None:
    try:
        await get_client().setex(key, settings.redis_ttl_seconds, json.dumps(data))
    except Exception:
        pass


# ── Rate limiting diario por IP ───────────────────────────────────────────────

def _seconds_until_midnight() -> int:
    now = datetime.now()
    midnight = (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
    return int((midnight - now).total_seconds())


async def rate_limit_use(ip: str) -> tuple[bool, int, int]:
    """
    Incrementa el contador diario para la IP. Operación atómica con Redis INCR.

    Retorna:
        allowed        — True si está dentro del límite
        current_count  — número de consultas usadas hoy (incluyendo esta)
        reset_seconds  — segundos hasta que el contador se resetea (medianoche)
    """
    date_str = datetime.now().strftime("%Y-%m-%d")
    key = f"rl:{ip}:{date_str}"
    client = get_client()

    try:
        count = await client.incr(key)
        if count == 1:
            reset_secs = _seconds_until_midnight()
            await client.expire(key, reset_secs)
        else:
            reset_secs = await client.ttl(key)

        allowed = count <= settings.rate_limit_daily
        return allowed, count, max(reset_secs, 0)
    except Exception:
        # Si Redis falla, permite la consulta para no bloquear el servicio
        return True, 0, 0


async def rate_limit_status(ip: str) -> tuple[int, int]:
    """Consulta el estado actual sin incrementar. Retorna (count, reset_seconds)."""
    date_str = datetime.now().strftime("%Y-%m-%d")
    key = f"rl:{ip}:{date_str}"
    client = get_client()
    try:
        count = await client.get(key)
        ttl = await client.ttl(key)
        return int(count or 0), max(ttl, 0)
    except Exception:
        return 0, 0
