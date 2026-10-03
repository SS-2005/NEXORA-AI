from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.db.session import engine, Base
from backend.app.api.v1.endpoints import reports, projects

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS middleware to allow the Next.js frontend to request the PDF
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event to initialize the database tables (SQLite by default)
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        # Create all tables if they don't already exist
        await conn.run_sync(Base.metadata.create_all)

# Register routes
app.include_router(
    reports.router,
    prefix=f"{settings.API_V1_STR}/reports",
    tags=["reports"]
)

app.include_router(
    projects.router,
    prefix=f"{settings.API_V1_STR}/projects",
    tags=["projects"]
)

@app.get("/")
async def root():
    return {"message": "NEXORA Pre-Feasibility Intelligence API is online"}

@app.get("/api/v1/health")
async def health():
    return {"status": "healthy"}
