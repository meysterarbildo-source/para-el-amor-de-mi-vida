# Conectar la página privada y la página pública con Supabase

## 1. Crear el proyecto

El proyecto ya está creado en Supabase con el plan **Free**:

- Proyecto: `para-el-amor-de-mi-vida`
- Región: East US
- URL: `https://welchmcywrbolrndyzpf.supabase.co`

## 2. Ejecutar el script de base de datos y Storage

Abre **Supabase → SQL Editor → New query**. Abre el archivo `supabase-setup.sql`, copia todo su contenido, pégalo directamente en el editor de Supabase y pulsa **Run**.

El script crea:

- Tabla `media`.
- Campos para imágenes y videos.
- Estado `is_published` para controlar lo que ve Ariana.
- Bucket público `media`.
- RLS para que los visitantes solo puedan leer medios publicados.
- Permisos para que los usuarios autenticados puedan subir, actualizar y eliminar.

Si el editor no acepta el pegado completo, usa la opción **Paste** del navegador o escribe primero una línea corta para activar el editor y después pega el script.

## 3. Crear tu cuenta privada

En Supabase abre **Authentication → Users → Add user**. Crea tu usuario con el correo que usarás para administrar los recuerdos. Elige una contraseña fuerte. Esta cuenta será la que utilices en `admin-recuerdos.html`.

No compartas esa contraseña ni la guardes dentro del código.

## 4. Obtener la anon key

En Supabase ve a **Project Settings → API** y copia la clave pública **anon / publishable key**. No copies la `service_role` key.

Reemplaza esta línea en `admin-recuerdos.html` y `supabase-public-gallery.js`:

```js
const SUPABASE_ANON_KEY = 'PEGA_AQUI_TU_ANON_KEY';
```

La anon key puede aparecer en el código del navegador. La protección depende de RLS. La `service_role` key nunca debe aparecer en HTML, JavaScript público, GitHub o mensajes.

## 5. Cómo funciona

1. En `admin-recuerdos.html` inicias sesión.
2. Seleccionas fotos o videos.
3. El archivo se sube al bucket `media`.
4. Se registra en la tabla `media` como borrador.
5. Pulsas **Publicar**.
6. `para-el-amor-de-mi-vida.html` consulta solo filas con `is_published = true`.
7. Ariana ve automáticamente los recuerdos publicados.

## 6. Archivos

- `admin-recuerdos.html`: panel privado de administración.
- `supabase-public-gallery.js`: carga pública de medios publicados.
- `supabase-setup.sql`: automatiza tablas, bucket y políticas.
- `para-el-amor-de-mi-vida.html`: página pública.

## 7. Videos

Se aceptan MP4, WebM y MOV en la interfaz, aunque se recomienda MP4 con códec H.264, resolución 720p o 1080p y tamaño moderado para conservar el uso gratuito de Supabase.

## Seguridad

El panel no es privado por esconder el enlace: es privado porque exige autenticación de Supabase. La página pública no tiene controles de subida. Los visitantes anónimos solo pueden consultar los recuerdos publicados.
