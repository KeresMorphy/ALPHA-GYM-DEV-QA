from datetime import date
from database import engine, SessionLocal, Base
from models import Socio


def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    existing = db.query(Socio).count()
    if existing > 0:
        print(f"Base de datos ya tiene {existing} socios. Omitiendo insercion inicial.")
        db.close()
        return

    socios_iniciales = [
        Socio(
            id="1",
            nombre="PEDRO MANUEL MORALES",
            tel="469-121-7170",
            tipo="MENSUALIDAD Amigo",
            vencimiento=date(2026, 7, 9),
            estado="PROX_VENCER"
        ),
        Socio(
            id="2",
            nombre="JAZMIN ESCOBAR",
            tel="4691417880",
            tipo="MENSUALIDAD",
            vencimiento=date(2026, 7, 9),
            estado="PROX_VENCER"
        ),
        Socio(
            id="3",
            nombre="RAUL ISRAEL TAFOYA DUARTE",
            tel="4691212247",
            tipo="Mensualidad estudiante",
            vencimiento=date(2026, 7, 9),
            estado="PROX_VENCER"
        ),
        Socio(
            id="4",
            nombre="CRUZ VEGA CRISTHOPER ROMAN",
            tel="4731808571",
            tipo="Mensualidad Estudiante",
            vencimiento=date(2026, 5, 15),
            estado="VENCIDO"
        ),
        Socio(
            id="5",
            nombre="MARTINEZ VEGA RIGOBERTO",
            tel="4691334372",
            tipo="Mensualidad estudiante",
            vencimiento=date(2026, 7, 9),
            estado="PROX_VENCER"
        ),
    ]

    db.add_all(socios_iniciales)
    db.commit()
    print(f"Base de datos inicializada con {len(socios_iniciales)} socios.")
    db.close()


if __name__ == "__main__":
    init_db()
