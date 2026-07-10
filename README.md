# Proyecto Backend — API REST con Node.js, Express, MongoDB y Cloudinary
 
## Introducción
 
API REST desarrollada como proyecto del módulo de Backend en [**The Powerd**](https://thepower.education/). Implementa un sistema de autenticación con JWT, control de acceso basado en roles (`user`/`admin`), gestión de usuarios con imagen de perfil almacenada en Cloudinary, y un CRUD completo de cursos. Los usuarios pueden guardar cursos en una lista personal (`cursosGuardados`) sin duplicados y manteniendo el historial completo.
 
## Tecnologías
 
- **Node.js** — entorno de ejecución
- **Express 5** — framework del servidor
- **MongoDB Atlas** + **Mongoose 9** — base de datos y ODM
- **JSON Web Token (JWT)** — autenticación basada en tokens
- **bcryptjs** — hasheo de contraseñas
- **Cloudinary** — almacenamiento de imágenes en la nube
- **Multer 2** — procesamiento de archivos multipart/form-data
- **express-validator** — validación de datos de entrada
- **Helmet, CORS, Morgan** — seguridad y logging
## Instalación
 
```bash
git clone <https://github.com/rubenferbu/Proyecto-Backend>
cd proyecto-backend
npm install
```
 
## Variables de entorno (`.env`)
 
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
 
```env
PORT=3000
NODE_ENV=development
 
MONGO_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/proyecto-backend?retryWrites=true&w=majority
 
JWT_SECRET=tu_secreto_largo_y_aleatorio
JWT_EXPIRES_IN=7d
 
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```
 
> ⚠️ Nota: en un proyecto real, el `.env` nunca debería subirse a un repositorio público. En este caso se incluye deliberadamente para facilitar la corrección académica del proyecto.
 
Para generar un `JWT_SECRET` seguro:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
 
## Scripts disponibles
 
| Comando | Descripción |
|---|---|
| `npm run dev` | Arranca el servidor en modo desarrollo con recarga automática (nodemon) |
| `npm start` | Arranca el servidor en modo producción |
| `npm run seed` | Vacía y rellena la colección `cursos` con 10 cursos de ejemplo |
 
## Colecciones (modelos de datos)
 
### User
 
| Campo | Tipo | Notas |
|---|---|---|
| `nombre` | String | Obligatorio |
| `email` | String | Obligatorio, único |
| `password` | String | Obligatorio, mínimo 8 caracteres, hasheado con bcrypt, oculto por defecto en las consultas |
| `role` | String | `user` (por defecto) o `admin`. Nunca se puede establecer como `admin` en el registro |
| `image` | Object | `{ url, public_id }` — imagen de perfil en Cloudinary |
| `cursosGuardados` | Array de ObjectId | Referencias a `Curso`. Sin duplicados (`$addToSet`), append-only |
 
### Curso
 
| Campo | Tipo | Notas |
|---|---|---|
| `titulo` | String | Obligatorio |
| `descripcion` | String | Obligatorio |
| `categoria` | String | Obligatorio |
| `duracion` | Number | Horas, mínimo 1 |
| `nivel` | String | `principiante` / `intermedio` / `avanzado` |
| `instructor` | String | Obligatorio |
| `precio` | Number | Mínimo 0 |
 
**Relación**: `User.cursosGuardados` almacena referencias (`ObjectId`) a documentos de `Curso`, en vez de embeber el curso completo. Esto garantiza que los datos de un curso (precio, descripción, etc.) tengan una única fuente de verdad — si un curso cambia, todos los usuarios que lo tienen guardado ven la información actualizada automáticamente al hacer `.populate()`, sin necesidad de sincronizar copias duplicadas.
 
## Autenticación
 
- **Registro** (`POST /api/auth/register`): crea un usuario con rol `user` fijo. Acepta una imagen opcional (`multipart/form-data`).
- **Login** (`POST /api/auth/login`): valida credenciales y devuelve un JWT.
- El token se envía en cada petición protegida mediante el header:
```
  Authorization: Bearer <token>
```
- El middleware `protect` verifica el token y **vuelve a consultar la base de datos** en cada petición (no confía en los datos del token) para reflejar cambios de rol o eliminación de cuenta en tiempo real.
- El middleware `isAdmin` restringe rutas exclusivas para administradores.
- **El primer administrador se crea manualmente** editando el campo `role` a `"admin"` directamente desde MongoDB Atlas (Browse Collections → `users`).
## Cloudinary
 
Al subir una imagen (registro o edición de perfil), el buffer en memoria (Multer con `memoryStorage`) se convierte a base64 y se envía a Cloudinary mediante `cloudinary.uploader.upload()`. La respuesta de Cloudinary incluye un campo `public_id`, que se guarda junto a la `url` en el documento del usuario. Este `public_id` es el identificador necesario para eliminar la imagen posteriormente con `cloudinary.uploader.destroy(public_id)` — operación que se ejecuta automáticamente al eliminar la cuenta del usuario (ya sea por el propio usuario o por un admin).
 
## Seed
 
Para poblar la colección `cursos` con 10 cursos de ejemplo:
 
```bash
npm run seed
```
 
El script elimina primero todos los cursos existentes (`deleteMany`) antes de insertar los nuevos, garantizando que la operación sea repetible sin generar duplicados.
 
## Endpoints
 
### Auth (`/api/auth`)
 
| Método | Ruta | Descripción | Protegida |
|---|---|---|---|
| POST | `/register` | Registrar usuario (imagen opcional) | No |
| POST | `/login` | Iniciar sesión | No |
 
### Users (`/api/users`)
 
| Método | Ruta | Descripción | Protegida |
|---|---|---|---|
| GET | `/me` | Obtener mi perfil | Sí |
| PATCH | `/me` | Editar mi perfil (nombre, email, imagen) | Sí |
| DELETE | `/me` | Eliminar mi propia cuenta | Sí |
| POST | `/me/cursos/:cursoId` | Guardar un curso en mi lista (sin duplicados) | Sí |
| GET | `/` | Listar todos los usuarios | Sí (admin) |
| DELETE | `/:id` | Eliminar cualquier cuenta | Sí (admin) |
| PATCH | `/:id/role` | Cambiar el rol de un usuario | Sí (admin) |
 
### Cursos (`/api/cursos`)
 
| Método | Ruta | Descripción | Protegida |
|---|---|---|---|
| GET | `/` | Listar todos los cursos | Sí |
| GET | `/:id` | Obtener un curso por id | Sí |
| POST | `/` | Crear curso | Sí (admin) |
| PUT | `/:id` | Actualizar curso | Sí (admin) |
| DELETE | `/:id` | Eliminar curso | Sí (admin) |
 
## Formato de respuesta
 
Todas las respuestas siguen un formato consistente:
 
```json
{ "success": true, "message": "...", "data": { ... } }
```
o en caso de error:
```json
{ "success": false, "message": "...", "error": "..." }
```
 
## Postman
 
La colección completa con todos los endpoints está disponible en `postman/coleccion.postman_collection.json`. Impórtala en Postman y configura la variable `base_url` (por defecto `http://localhost:3000`) y `token` (se rellena tras hacer login).

## Cuentas de prueba
 
Para facilitar la corrección, se deja disponible una cuenta con rol `admin` ya creada en la base de datos:
 
| Email | Password | Rol |
|---|---|---|
| `ruben@test.com` | `12345678` | admin |
 
> ⚠️ Recomendación: usa esta cuenta para probar rutas de solo lectura o de gestión (crear/editar cursos, listar usuarios, cambiar roles). Si necesitas probar el endpoint de **eliminación de usuarios**, prueba con una cuenta distinta a esta (por ejemplo, registrando un usuario nuevo desde `/api/auth/register` y eliminándolo después), para no dejar el proyecto sin ninguna cuenta admin disponible para seguir probando el resto de endpoints.
 
## Autor
 
**Rubén Fernández** ([@rubenferbu](https://github.com/rubenferbu))
Proyecto — Backend, [**The Powerd**](https://thepower.education/).
 