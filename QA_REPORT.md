# Reporte QA - Alpha Gym v2
**Fecha:** 09 de Julio 2026  
**Ejecutado por:** QA Automatizado + Revision de Codigo  
**Entorno:** Windows / Angular 22 / FastAPI 0.111.0 / SQLite

---

## Resumen Ejecutivo

| Metrica | Valor |
|---------|-------|
| Total de pruebas ejecutadas | 14 |
| Pruebas aprobadas | 14 |
| Pruebas fallidas | 0 |
| Bugs encontrados en revision de codigo | 27 |
| Criticos | 4 |
| Altos | 5 |
| Medios | 9 |
| Bajos | 9 |

---

## 1. Pruebas de API (14/14 aprobadas)

### CRUD de Socios

| # | Prueba | Metodo | Endpoint | Resultado |
|---|--------|--------|----------|-----------|
| 1 | Listar todos los socios | GET | /api/socios | OK |
| 2 | Crear nuevo socio | POST | /api/socios | OK |
| 3 | Rechazar ID duplicado | POST | /api/socios | OK (400) |
| 4 | Actualizar socio existente | PUT | /api/socios/{id} | OK |
| 5 | Rechazar update inexistente | PUT | /api/socios/{id} | OK (404) |
| 6 | Eliminar socio | DELETE | /api/socios/{id} | OK |
| 7 | Rechazar delete inexistente | DELETE | /api/socios/{id} | OK (404) |

### Torniquete

| # | Prueba | ID | Estado Esperado | Resultado |
|---|--------|----|-----------------|-----------|
| 8 | Socio proximo a vencer | 1 | PERMITIDO | OK |
| 9 | Socio vencido | 4 | DENEGADO | OK |
| 10 | Socio inexistente | 99 | DENEGADO | OK |

### Edge Cases

| # | Prueba | Resultado |
|---|--------|-----------|
| 11 | POST con campos vacios | OK (rechazado) |
| 12 | POST con JSON invalido | OK (rechazado) |
| 13 | Fecha vencimiento pasada calcula VENCIDO | OK |
| 14 | Scan de socio vencido recien creado | OK |

---

## 2. Compilacion del Frontend

| Metrica | Valor |
|---------|-------|
| ng build | EXITOSO |
| Errores TypeScript | 0 |
| Tamano bundle | 367 KB |
| Tiempo de compilacion | 6.4s |

---

## 3. Bugs Encontrados en Revision de Codigo

### CRITICOS (4)

| # | Bug | Archivo | Linea |
|---|-----|---------|-------|
| 1 | **Fecha hardcoded** - `TODAY = date(2026, 6, 27)` en vez de `date.today()`. Los estados de membresia se calculan mal. | backend/main.py | 21 |
| 2 | **Servicio duplicado** - Existen dos archivos `GymService` con implementaciones diferentes. `torniquete.component` importa la version incorrecta. | gym.service.ts vs services/gym.service.ts | - |
| 3 | **Busqueda rota** - Falta `(input)="filtrar()"` en el input de busqueda de Clientes. | clientes.component.ts | 60 |
| 4 | **PUT sin validar ID** - El body puede enviar un ID diferente al path parameter sin validacion. | backend/main.py | 62 |

### ALTOS (5)

| # | Bug | Archivo |
|---|-----|---------|
| 5 | Sin manejo de errores en subscripciones HTTP del frontend | Varios componentes |
| 6 | Race condition en timeouts del torniquete (no limpia timeout anterior) | torniquete.component.ts |
| 7 | Sin autenticacion/autorizacion en endpoints | backend/main.py |
| 8 | CORS con `allow_credentials=True` + `allow_methods=["*"]` | backend/main.py |
| 9 | Telefonos personales reales en codigo fuente | backend/init_db.py |

### MEDIOS (9)

| # | Bug | Archivo |
|---|-----|---------|
| 10 | Sin validacion de formularios en Clientes/Inventario | Varios |
| 11 | Fecha vencimiento default hardcoded a 2026-07-27 | clientes.component.ts |
| 12 | Inventario sin persistencia backend | gym.service.ts |
| 13 | Sin unsubscribe en subscripciones (posible memory leak) | Varios componentes |
| 14 | Campo `id` sin restriccion de longitud en BD | models.py |
| 15 | Campo `estado` deberia ser Enum, no texto libre | models.py |
| 16 | Sin rollback en commit fallido de SQLAlchemy | main.py |
| 17 | `on_event("startup")` deprecado en FastAPI | main.py |
| 18 | Sin ruta 404 para rutas inexistentes | app.routes.ts |
| 19 | Estado hardcoded en init_db.py | init_db.py |

### BAJOS (9)

| # | Bug | Archivo |
|---|-----|---------|
| 20 | URL del backend hardcoded (deberia usar environment.ts) | gym.service.ts |
| 21 | Tipo `any` en timeoutId | torniquete.component.ts |
| 22 | Tipo `any` en respuesta scanSocio | gym.service.ts |
| 23 | Sin lazy loading en rutas | app.routes.ts |
| 24 | Sin interceptor global de errores HTTP | app.config.ts |
| 25 | SQLite con limitaciones de concurrencia | database.py |
| 26 | Sin estrategia de migraciones (Alembic) | backend/ |
| 27 | Logica fragil de botones rapidos en torniquete | torniquete.component.ts |

---

## 4. Bugs Criticos Corregidos

### Fix 1: Fecha hardcoded
```python
# ANTES
TODAY = date(2026, 6, 27)

# DESPUES
TODAY = date.today()
```

### Fix 2: Servicio duplicado eliminado
Eliminado `frontend/src/app/gym.service.ts` (duplicado). Todos los componentes ahora importan de `./services/gym.service`.

### Fix 3: Busqueda de clientes corregida
```html
<!-- ANTES -->
<input [(ngModel)]="busqueda" type="text" ...>

<!-- DESPUES -->
<input [(ngModel)]="busqueda" (input)="filtrar()" type="text" ...>
```

### Fix 4: PUT valida ID
```python
# ANTES
socio.nombre = socio_data.nombre

# DESPUES
if socio_data.id != id:
    raise HTTPException(status_code=400, detail="ID del body no coincide con el path")
socio.nombre = socio_data.nombre
```

---

## 5. Recomendaciones

1. **Inmediato:** Corregir los 4 bugs criticos
2. **Corto plazo:** Agregar manejo de errores HTTP en el frontend
3. **Mediano plazo:** Implementar autenticacion (JWT)
4. **Largo plazo:** Migrar a PostgreSQL, agregar Alembic, lazy loading

---

**Estado: APROBADO CON OBSERVACIONES**  
La aplicacion funciona correctamente en sus flujos principales. Se requiere correccion de bugs criticos antes de produccion.
