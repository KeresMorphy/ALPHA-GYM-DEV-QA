from pydantic import BaseModel
from typing import Optional
from datetime import date

class SocioBase(BaseModel):
    id: str
    nombre: str
    tel: Optional[str] = None
    tipo: str
    vencimiento: date

class SocioCreate(SocioBase):
    pass

class Socio(SocioBase):
    estado: str

    class Config:
        from_attributes = True
