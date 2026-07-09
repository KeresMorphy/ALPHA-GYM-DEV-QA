# Alpha Gym v2

Sistema de gestion y control de accesos para gimnasios. Arquitectura moderna con Angular, Tailwind CSS, Python FastAPI y SQLite.

## Descripcion

Alpha Gym es una aplicacion web diseñada para la gestion integral de un gimnasio, incluyendo control de socios, registro de membresias, control de acceso por torniquete e inventario de productos. El sistema calcula automaticamente el estado de cada socio (Activo, Proximo a Vencer, Vencido) basado en las fechas de vencimiento de sus membresias.

## Arquitectura

```
alpha_gym_v2/
├── backend/                    # Python + FastAPI
│   ├── main.py                 # Endpoints REST y logica de negocio
│   ├── database.py             # Configuracion SQLite + SQLAlchemy
│   ├── models.py               # Modelo ORM de SQLAlchemy
│   ├── schemas.py              # Modelos Pydantic (validacion)
│   ├── init_db.py              # Script de inicializacion de datos
│   ├── requirements.txt        # Dependencias Python
│   └── alpha_gym.db            # Base de datos SQLite (generada)
└── frontend/                   # Angular 22 + Tailwind CSS
    └── src/app/
        ├── app.component.ts    # Layout principal (sidebar + router)
        ├── app.routes.ts       # Configuracion de rutas
        ├── services/
        │   └── gym.service.ts  # Servicio central de datos
        ├── dashboard.component.ts
        ├── clientes.component.ts
        ├── torniquete.component.ts
        └── inventario.component.ts
```

## Stack Tecnologico

| Capa | Tecnologia | Version |
|------|-----------|---------|
| Frontend | Angular | 22 |
| Estilos | Tailwind CSS | 4.x (CDN) |
| Backend | Python FastAPI | 0.111.0 |
| ORM | SQLAlchemy | 2.0 |
| Base de datos | SQLite | - |
| Validacion | Pydantic | 2.7 |

## Instalacion

### Requisitos previos
- Node.js 18+ 
- Python 3.10+
- Git

### Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno (Windows)
.\venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Inicializar base de datos con datos de prueba
python init_db.py

# Iniciar servidor
uvicorn main:app --reload
```

El backend estara disponible en `http://localhost:8000`
Documentacion Swagger: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
ng serve
```

El frontend estara disponible en `http://localhost:4200`

## Modulos

### 1. Dashboard
- Estadisticas en tiempo real: Socios Activos, Vencidos, Proximos a Vencer
- Tabla de alertas con socios que requieren atencion
- Calculo automatico basado en fechas de vencimiento

### 2. Gestion de Clientes (CRUD)
- **Crear:** Formulario con validacion de campos (ID, Nombre, Telefono, Tipo, Vencimiento)
- **Leer:** Tabla con busqueda en tiempo real por nombre o ID
- **Actualizar:** Boton de edicion que carga datos en el formulario
- **Eliminar:** Boton de borrado con confirmacion
- **Estado automatico:** Se calcula segun la fecha de vencimiento

### 3. Control de Acceso (Torniquete)
- Simulador de escaneo de tarjeta
- Feedback visual: Verde ( Permitido ) / Rojo ( Denegado )
- Reset automatico despues de 4 segundos
- Botones de prueba rapida con diferentes escenarios

### 4. Inventario de Productos
- CRUD completo de productos
- Alertas visuales cuando el stock es menor o igual al minimo
- Busqueda por nombre o codigo

## API Endpoints

### Socios

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/socios` | Obtener todos los socios |
| POST | `/api/socios` | Crear nuevo socio |
| PUT | `/api/socios/{id}` | Actualizar socio existente |
| DELETE | `/api/socios/{id}` | Eliminar socio |

### Torniquete

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/torniquete/scan/{id}` | Escanear tarjeta y verificar acceso |

### Ejemplo de peticion POST

```json
POST /api/socios
{
  "id": "7",
  "nombre": "JUAN PEREZ",
  "tel": "4691234567",
  "tipo": "MENSUALIDAD",
  "vencimiento": "2026-08-15"
}
```

### Respuesta del torniquete

```json
{
  "acceso": "PERMITIDO",
  "mensaje": "Acceso concedido",
  "socio": {
    "id": "1",
    "nombre": "PEDRO MANUEL MORALES",
    "tipo": "MENSUALIDAD Amigo",
    "vencimiento": "2026-07-09",
    "estado": "PROX_VENCER"
  }
}
```

## Base de Datos

### Modelo Socio (SQLite)

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | String (PK) | Codigo de tarjeta |
| nombre | String | Nombre completo |
| tel | String | Telefono |
| tipo | String | Tipo de membresia |
| vencimiento | Date | Fecha de vencimiento |
| estado | String | ACTIVO / PROX_VENCER / VENCIDO |

### Reglas de negocio

- **VENCIDO:** Si la fecha actual es posterior al vencimiento
- **PROX_VENCER:** Si faltan 5 dias o menos para vencer
- **ACTIVO:** En cualquier otro caso

## Configuracion

### CORS
El backend permite peticiones desde `http://localhost:4200` (Angular).

### Puerto del backend
Por defecto: `8000`. Para cambiarlo, modifica el comando de inicio:
```bash
uvicorn main:app --reload --port 8001
```

### Puerto del frontend
Por defecto: `4200`. Para cambiarlo:
```bash
ng serve --port 4201
```

## Desarrollo

### Agregar nuevo campo al modelo

1. Actualizar `models.py` (SQLAlchemy)
2. Actualizar `schemas.py` (Pydantic)
3. Actualizar `main.py` (endpoints)
4. Actualizar `GymService` en el frontend
5. Actualizar el componente correspondiente

### Reiniciar base de datos

```bash
cd backend
del alpha_gym.db
python init_db.py
```

## Autor

- **KeresMorphy** - [GitHub](https://github.com/KeresMorphy)

## Licencia

Proyecto privado - Alpha Gym v2
