from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from datetime import date, timedelta
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import Socio
from schemas import Socio as SocioSchema, SocioCreate

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TODAY = date.today()


def calcular_estado(vencimiento: date) -> str:
    if vencimiento < TODAY:
        return "VENCIDO"
    elif vencimiento <= TODAY + timedelta(days=18):
        return "PROX_VENCER"
    return "ACTIVO"


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)


@app.get("/api/socios", response_model=List[SocioSchema])
def get_socios(db: Session = Depends(get_db)):
    return db.query(Socio).all()


@app.post("/api/socios", response_model=SocioSchema)
def create_socio(socio: SocioCreate, db: Session = Depends(get_db)):
    existing = db.query(Socio).filter(Socio.id == socio.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="ID ya existe")

    nuevo_socio = Socio(
        id=socio.id,
        nombre=socio.nombre,
        tel=socio.tel,
        tipo=socio.tipo,
        vencimiento=socio.vencimiento,
        estado=calcular_estado(socio.vencimiento)
    )
    db.add(nuevo_socio)
    db.commit()
    db.refresh(nuevo_socio)
    return nuevo_socio


@app.put("/api/socios/{id}", response_model=SocioSchema)
def update_socio(id: str, socio_data: SocioCreate, db: Session = Depends(get_db)):
    if socio_data.id != id:
        raise HTTPException(status_code=400, detail="ID del body no coincide con el path")

    socio = db.query(Socio).filter(Socio.id == id).first()
    if not socio:
        raise HTTPException(status_code=404, detail="Socio no encontrado")

    socio.nombre = socio_data.nombre
    socio.tel = socio_data.tel
    socio.tipo = socio_data.tipo
    socio.vencimiento = socio_data.vencimiento
    socio.estado = calcular_estado(socio_data.vencimiento)
    db.commit()
    db.refresh(socio)
    return socio


@app.delete("/api/socios/{id}")
def delete_socio(id: str, db: Session = Depends(get_db)):
    socio = db.query(Socio).filter(Socio.id == id).first()
    if not socio:
        raise HTTPException(status_code=404, detail="Socio no encontrado")
    db.delete(socio)
    db.commit()
    return {"mensaje": "Socio eliminado"}


@app.get("/api/torniquete/scan/{id}", response_model=dict)
def scan_torniquete(id: str, db: Session = Depends(get_db)):
    socio = db.query(Socio).filter(Socio.id == id).first()

    if not socio:
        return {"acceso": "DENEGADO", "mensaje": "Socio no encontrado"}

    socio.estado = calcular_estado(socio.vencimiento)
    db.commit()
    db.refresh(socio)

    socio_dict = {
        "id": socio.id,
        "nombre": socio.nombre,
        "tel": socio.tel,
        "tipo": socio.tipo,
        "vencimiento": str(socio.vencimiento),
        "estado": socio.estado,
    }

    if socio.estado == "VENCIDO":
        return {"acceso": "DENEGADO", "mensaje": "Membresia vencida", "socio": socio_dict}

    return {"acceso": "PERMITIDO", "mensaje": "Acceso concedido", "socio": socio_dict}
