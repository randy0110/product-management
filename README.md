# Gestión de Productos — Aplicación Full Stack

Aplicación full stack de gestión de productos construida con **Ruby on Rails** (API) y **React + TypeScript** (frontend), desarrollada con **Spec Driven Development** (primero se escriben los specs, luego se implementa para que pasen).

---

## Stack Tecnológico

| Capa       | Tecnología                                                 |
|------------|------------------------------------------------------------|
| Backend    | Ruby on Rails 8, PostgreSQL, RSpec                         |
| Frontend   | React 18, TypeScript, Vite, TailwindCSS                    |
| Estado     | TanStack React Query v5                                    |
| Formularios| React Hook Form + Zod                                      |
| UI Extra   | Lucide Icons, React Hot Toast                              |

---

## Funcionalidades

- **CRUD completo** — Listar, crear, editar y eliminar productos
- **Paginación** — 10 productos por página con navegación completa
- **Búsqueda** — Búsqueda en tiempo real por nombre (ILIKE, sin distinción de mayúsculas)
- **Filtro** — Filtrar por estado: Todos / Activos / Inactivos
- **Validaciones** — En frontend (Zod) y backend (ActiveRecord)
- **Log de auditoría** — Cada cambio queda registrado mediante el gem `audited`
- **Notificaciones Toast** — Feedback inmediato en cada acción
- **Responsive** — Layouts para móvil, tablet y escritorio

---

## Estructura del Proyecto

```
product-management/
├── backend/          # API Rails 8
│   ├── app/
│   │   ├── blueprints/              # Serializadores con Blueprinter
│   │   ├── controllers/api/v1/      # Controladores REST
│   │   ├── interactors/products/    # Lógica de negocio (Interactor)
│   │   │   ├── create_product.rb
│   │   │   ├── update_product.rb
│   │   │   └── destroy_product.rb
│   │   └── models/
│   ├── spec/
│   │   ├── factories/
│   │   ├── interactors/products/    # Specs de interactors
│   │   ├── models/                  # Specs de modelo (validaciones, scopes)
│   │   └── requests/api/v1/         # Specs de peticiones (endpoints)
│   └── db/
│       ├── migrate/
│       └── seeds.rb
└── frontend/         # React + TypeScript
    └── src/
        ├── components/
        ├── hooks/           # Hooks de React Query
        ├── lib/             # Cliente Axios
        └── types/
```

---

## Inicio Rápido

### Backend

```bash
cd backend

# Instalar dependencias
bundle install

# Iniciar PostgreSQL (WSL / Linux)
sudo service postgresql start

# Crear base de datos, migrar y cargar datos de prueba
rails db:create db:migrate db:seed

# Ejecutar suite de tests
bundle exec rspec

# Iniciar servidor API (puerto 3000)
rails server
```

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (puerto 5173)
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en el navegador. El servidor Vite redirige las peticiones `/api` a `http://localhost:3000`.

---

## Endpoints de la API

| Método | Ruta                   | Descripción                               |
|--------|------------------------|-------------------------------------------|
| GET    | /api/v1/products       | Listar productos (paginado, búsqueda, filtro) |
| GET    | /api/v1/products/:id   | Obtener un producto                       |
| POST   | /api/v1/products       | Crear producto                            |
| PUT    | /api/v1/products/:id   | Actualizar producto                       |
| DELETE | /api/v1/products/:id   | Eliminar producto                         |

### Parámetros de consulta (GET /api/v1/products)

| Parámetro | Tipo    | Ejemplo          |
|-----------|---------|------------------|
| search    | string  | `?search=laptop` |
| active    | boolean | `?active=true`   |
| page      | integer | `?page=2`        |
| per_page  | integer | `?per_page=9`    |

---

## Modelo de Producto

| Campo       | Tipo    | Requerido | Validaciones                              |
|-------------|---------|-----------|-------------------------------------------|
| name        | string  | Sí        | mín. 3, máx. 100 caracteres              |
| description | text    | No        | máx. 1000 caracteres                      |
| price       | decimal | Sí        | > 0                                       |
| stock       | integer | Sí        | >= 0, entero                              |
| sku         | string  | Sí        | único, `/^[A-Z0-9]+$/`                   |
| active      | boolean | Sí        | default: true                             |

---

## Decisiones Técnicas

### Spec Driven Development (SDD)
Todo el código del backend fue escrito **después** de redactar los specs. Los specs del modelo y los specs de peticiones son la fuente de la verdad — la implementación existe únicamente para que todos los tests pasen.

### Interactor (Lógica de Negocio)
Las operaciones de escritura (`create`, `update`, `destroy`) están desacopladas del controlador mediante el patrón **Interactor**:

- `Products::CreateProduct` — valida y persiste un nuevo producto
- `Products::UpdateProduct` — aplica y persiste cambios sobre un producto existente
- `Products::DestroyProduct` — elimina el producto y captura posibles errores de BD

El controlador solo coordina la petición HTTP y la respuesta; la lógica vive en los interactors. Esto facilita reutilizar la lógica (p. ej. en workers, tareas Rake) y simplifica los tests unitarios de negocio.

### Pagy (v8.6)
Gem de paginación. Pagy 8 usa `items` (no `limit`) como nombre de variable — diferencia clave con versiones anteriores.

### Blueprinter
Elegido sobre `jbuilder` o `ActiveModelSerializers` por su serialización limpia y basada en clases con mínima sobrecarga.

### Audited
Cada creación/actualización/eliminación de producto queda registrada en la tabla `audits` con historial completo de cambios.

### TanStack React Query
Maneja el caché del estado del servidor, revalidación en segundo plano e invalidación — muy superior al patrón manual `useState + useEffect` para datos de API.

### Zod + React Hook Form
Validación de formularios con tipos seguros y errores en línea en tiempo real. El esquema de validación replica las restricciones del backend.

---

## Variables de Entorno

### Backend (`backend/.env`)
```
DATABASE_URL=postgresql://localhost/product_management
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```
VITE_API_BASE_URL=http://localhost:3000
```

---

## Mejoras con Más Tiempo

- **Autenticación** (Devise + JWT) para proteger la API
- **Borrado suave** con los gems `paranoia` o `discard`
- **Operaciones en lote** — seleccionar y eliminar múltiples productos
- **Carga de imágenes** con Active Storage + proveedor cloud
- **Documentación API** con Swagger/OpenAPI
- **Docker Compose** para levantar el entorno con un solo comando
- **CI/CD** con GitHub Actions
- **Tests de frontend** con Vitest + React Testing Library
- **Scroll infinito** como modo alternativo de paginación
