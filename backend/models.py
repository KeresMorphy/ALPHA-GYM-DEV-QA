from sqlalchemy import Column, String, Date
from database import Base


class Socio(Base):
    __tablename__ = "socios"

    id = Column(String, primary_key=True)
    nombre = Column(String, nullable=False)
    tel = Column(String, nullable=True)
    tipo = Column(String, nullable=False)
    vencimiento = Column(Date, nullable=False)
    estado = Column(String, nullable=False)
