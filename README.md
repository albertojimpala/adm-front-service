# adm-front-service

Front de administración de clientes y cobranza. Consume la API [`api-base-service`](../api-base-service).

El código está en [`site/`](site/). Su [README](site/README.md) describe las pantallas, la estructura y los scripts.

## Requisitos

- Node.js 20.19 o superior (22 LTS recomendado)
- Yarn 1: `npm install -g yarn`
- Docker y Docker Compose, para la base de datos de la API

Se asume que los dos repos están en la misma carpeta:

```
account/
├── api-base-service/     API (NestJS + PostgreSQL)
└── adm-front-service/    este repo
    └── site/             front (React + Ant Design 6)
```

## Levantar todo en local

### 1. API

```bash
cd api-base-service
cp .env.template .env     # llenar DB_PASSWORD, JWT_SECRET y JWT_REFRESH_SECRET
yarn install
docker-compose up -d      # PostgreSQL en el puerto 3001
yarn start:dev            # API en http://localhost:3000/api, crea las tablas al arrancar
```

En el `.env` de la API, `CORS_ORIGIN` debe incluir la URL del front (`http://localhost:5173`). Si no, el navegador bloquea las peticiones.

### 2. Datos de prueba

```bash
cd api-base-service
yarn seed           # base vacía; yarn seed:reset borra todo y vuelve a sembrar
```

Crea compañías, empleados, clientes, 10 meses de cargos y pagos, y estos usuarios (contraseña `Demo1234!`):

| Email | Qué ve |
|---|---|
| super@example.com | Todo el sistema |
| admin@example.com | Administrador |
| cobranza@example.com | Auxiliar de cobranza: consulta y registra pagos |
| espiga@example.com | Portal de cliente: solo su información |

Si prefieres empezar sin datos, el [README de la API](../api-base-service/README.md#4-crear-el-usuario-super-a-mano-sin-semillas) explica cómo crear solo el usuario super con SQL.

### 3. Front

```bash
cd adm-front-service/site
cp .env.example .env      # ajustar VITE_API_URL si la API no está en localhost:3000
yarn install
yarn dev                  # http://localhost:5173
```

Entra con el usuario super del paso 2.

## Variables de entorno del front

Van en `site/.env`. Vite las lee al arrancar, así que hay que reiniciar `yarn dev` después de cambiarlas.

| Variable | Requerida | Ejemplo | Descripción |
|---|---|---|---|
| `VITE_API_URL` | Sí | `http://localhost:3000/api` | URL de la API, con el prefijo `/api`. |
| `VITE_SECURE_TOKEN` | Sí | cadena aleatoria | Llave para cifrar la sesión que se guarda en el navegador. Si se cambia, se cierran las sesiones abiertas. |

Las variables de la API están en el [README de api-base-service](../api-base-service/README.md#variables-de-entorno).

Para generar valores aleatorios:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Producción

```bash
cd site
yarn build                # genera site/build/
```

- `VITE_API_URL` se fija en la compilación. Hay que definirla con la URL pública de la API **antes** de `yarn build`.
- `site/build/` es un sitio estático. Cualquier ruta que no sea un archivo debe responder con `index.html`, para que funcionen las rutas de React Router. En Netlify ya existe `public/_redirects`; en Nginx se usa `try_files $uri /index.html;`.
- En la API, `CORS_ORIGIN` debe tener el dominio del front.

## Problemas comunes

| Síntoma | Causa y solución |
|---|---|
| "No se pudo conectar con el servidor" | La API no está corriendo, o `VITE_API_URL` es incorrecta. |
| Error de CORS en la consola del navegador | Falta la URL del front en `CORS_ORIGIN` de la API. Reinicia la API después de cambiarla. |
| "Correo o contraseña incorrectos" con datos correctos | El usuario no existe en esta base. Corre `yarn seed` (paso 2) y revisa que `DB_NAME` sea la misma. |
| Un cliente entra y solo ve "Mi cuenta" | Es lo esperado: los usuarios con rol `client` solo usan el portal. |
| Te regresa al login cada cierto tiempo | El token venció (`JWT_EXPIRATION` en la API). Hoy no se renueva automáticamente. |
| Un menú no aparece, o sale "Sin acceso" | El rol no tiene permiso de lectura para ese módulo. Edítalo en **Administración › Roles**. |
| Errores 403 aunque el rol tiene permisos | La API también exige que el `tag` del rol sea `admin` o `users`. |
| La API no conecta a Postgres después de cambiar `DB_PASSWORD` | Postgres solo toma la contraseña la primera vez que crea la carpeta `api-base-service/postgres`. Usa la contraseña original, o borra esa carpeta (se pierden los datos) y vuelve a correr `docker-compose up -d`. |
