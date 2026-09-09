from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError

from app.db.db import check_database_connection, create_database_tables
from app.routes import admin, counselor, victim


@asynccontextmanager
async def lifespan(_app: FastAPI):
    create_database_tables()
    yield


app = FastAPI(
    title="AI Mental Health Monitoring System",
    description="Backend API for mental health monitoring and distress prediction",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(victim.router)
app.include_router(counselor.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {"message": "Mental Health Monitoring API is running"}


@app.get("/health")
def health_check():
    try:
        check_database_connection()
    except SQLAlchemyError as error:
        raise HTTPException(
            status_code=503,
            detail="Database is unavailable. Check DATABASE_URI and PostgreSQL.",
        ) from error
    return {"status": "healthy", "database": "connected"}
