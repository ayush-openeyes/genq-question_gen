from fastapi import APIRouter

from app.api.v1.endpoints import assets, auth, generation, resources

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(resources.router, tags=["resources"])
api_router.include_router(generation.router, prefix="/generation", tags=["generation"])
api_router.include_router(assets.router, prefix="/assets", tags=["assets"])
