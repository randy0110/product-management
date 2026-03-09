# Frontend — Gestión de Productos

Interfaz de usuario construida con **React 18 + TypeScript + Vite**.

---

## Requisitos

- Node.js 20+
- npm 9+
- Backend Rails corriendo en `http://localhost:3000`

---

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (puerto 5173)
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173). Las peticiones a `/api` se redirigen automáticamente al backend en `http://localhost:3000`.

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción en `/dist` |
| `npm run preview` | Vista previa del build de producción |

---

## Estructura

```
src/
├── components/
│   ├── DeleteConfirmModal.tsx  # Modal de confirmación de borrado
│   ├── LoadingSpinner.tsx      # Indicador de carga
│   ├── Pagination.tsx          # Navegación entre páginas
│   ├── ProductCard.tsx         # Tarjeta individual de producto
│   ├── ProductForm.tsx         # Formulario crear/editar (React Hook Form + Zod)
│   ├── ProductList.tsx         # Vista principal con estado y lógica
│   └── ProductSearchBar.tsx    # Búsqueda + filtros de estado
├── hooks/
│   └── useProducts.ts          # Hooks de React Query para la API
├── lib/
│   └── api.ts                  # Cliente Axios + funciones de la API
├── types/
│   └── product.ts              # Interfaces TypeScript
├── App.tsx                     # QueryClientProvider + layout raíz
└── main.tsx                    # Punto de entrada
```

---

## Stack

| Librería | Versión | Propósito |
|----------|---------|-----------|
| React | 18 | UI framework |
| TypeScript | 5 | Tipado estático |
| Vite | 7 | Bundler + dev server |
| TailwindCSS | 4 | Estilos utilitarios |
| TanStack React Query | 5 | Estado del servidor y caché |
| Axios | — | Cliente HTTP |
| React Hook Form | — | Gestión de formularios |
| Zod | 4 | Validación de esquemas |
| React Hot Toast | — | Notificaciones toast |
| Lucide React | — | Iconografía |

---

## Variables de entorno

Crea un archivo `.env.local` en esta carpeta si necesitas sobreescribir la URL del backend:

```
VITE_API_BASE_URL=http://localhost:3000
```

> Por defecto el proxy de Vite redirige `/api` → `http://localhost:3000` en desarrollo, sin necesidad de variable de entorno.
