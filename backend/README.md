# Backend — API de Gestión de Productos

API REST construida con **Ruby on Rails 8** en modo API-only.

---

## Requisitos

- Ruby 3.4+
- PostgreSQL 12+
- Bundler 2+

---

## Instalación

```bash
# Instalar gems
bundle install

# Iniciar PostgreSQL
sudo service postgresql start

# Crear base de datos, ejecutar migraciones y cargar seeds
rails db:create db:migrate db:seed
```

---

## Ejecutar Tests

```bash
bundle exec rspec
```

Resultado esperado: **49 specs, 0 fallos**.

---

## Arquitectura

### Capas

```
app/
├── controllers/api/v1/     # Capa HTTP: recibe petición, delega, responde
├── interactors/products/   # Lógica de negocio desacoplada (gem interactor)
│   ├── create_product.rb
│   ├── update_product.rb
│   └── destroy_product.rb
├── models/                 # ActiveRecord: validaciones, scopes, auditoría
├── blueprints/             # Serialización JSON (gem blueprinter)
└── controllers/
    └── application_controller.rb  # Pagy::Backend + manejo de errores
```

### Patrón Interactor

Cada operación de escritura tiene su propio interactor en `app/interactors/products/`:

| Interactor                   | Contexto entrada                   | Contexto salida          |
|------------------------------|------------------------------------|--------------------------|
| `Products::CreateProduct`    | `product_params`                   | `product`                |
| `Products::UpdateProduct`    | `product`, `product_params`        | `product`                |
| `Products::DestroyProduct`   | `product`                          | `product_name`           |

En caso de fallo, cada interactor llama a `context.fail!(errors: [...])` y el controlador responde con HTTP 422.

---

## Endpoints

| Método | Ruta                 | Acción    | Interactor usado              |
|--------|----------------------|-----------|-------------------------------|
| GET    | /api/v1/products     | index     | —                             |
| GET    | /api/v1/products/:id | show      | —                             |
| POST   | /api/v1/products     | create    | `Products::CreateProduct`     |
| PUT    | /api/v1/products/:id | update    | `Products::UpdateProduct`     |
| DELETE | /api/v1/products/:id | destroy   | `Products::DestroyProduct`    |

---

## Gems Clave

| Gem         | Versión | Propósito                            |
|-------------|---------|--------------------------------------|
| rails       | ~> 8.0  | Framework principal                  |
| pg          | —       | Adaptador PostgreSQL                 |
| interactor  | —       | Patrón de caso de uso                |
| blueprinter | —       | Serialización JSON                   |
| pagy        | ~> 8.0  | Paginación eficiente                 |
| audited     | ~> 5.4  | Log de auditoría de cambios          |
| rack-cors   | —       | CORS para el frontend                |
| rspec-rails | —       | Framework de tests                   |
| factory_bot | —       | Fábricas para tests                  |
| faker        | —       | Datos falsos para seeds y tests      |

---

## Iniciar el Servidor

```bash
rails server -p 3000
```

La API queda disponible en `http://localhost:3000`.
