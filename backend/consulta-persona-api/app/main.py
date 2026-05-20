from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.database import close_pool, get_pool
from app.cache import close_client, get_client
from app.routers import persona


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Redis se conecta de forma lazy al primer uso; pool DB ídem
    get_client()
    yield
    await close_pool()
    await close_client()


app = FastAPI(
    title="Consulta Persona API",
    description="Microservicio de consulta de personas por datos biográficos",
    version="1.0.0",
    lifespan=lifespan,
)

app.include_router(persona.router)


@app.get("/health", tags=["Health"])
async def health() -> dict:
    return {"status": "ok"}
