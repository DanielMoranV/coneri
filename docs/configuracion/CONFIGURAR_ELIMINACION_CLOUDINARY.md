# Configurar Eliminación de Imágenes en Cloudinary

Esta guía explica cómo configurar el sistema de eliminación automática de imágenes de Cloudinary cuando se eliminan o actualizan proyectos y productos.

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación de Dependencias](#instalación-de-dependencias)
3. [Configuración de Cloudinary](#configuración-de-cloudinary)
4. [Deployment de Cloud Functions](#deployment-de-cloud-functions)
5. [Verificación](#verificación)
6. [Funcionalidades Implementadas](#funcionalidades-implementadas)
7. [Solución de Problemas](#solución-de-problemas)

---

## 🔧 Requisitos Previos

Antes de comenzar, asegúrate de tener:

- ✅ **Node.js** instalado (versión 18 o superior)
- ✅ **Firebase CLI** instalado globalmente
- ✅ **Cuenta de Cloudinary** activa
- ✅ **Proyecto de Firebase** configurado

### Instalar Firebase CLI (si no lo tienes)

```bash
npm install -g firebase-tools
```

### Iniciar sesión en Firebase

```bash
firebase login
```

---

## 📦 Instalación de Dependencias

### 1. Navegar a la carpeta de funciones

```bash
cd functions
```

### 2. Instalar las dependencias de Node.js

```bash
npm install
```

Esto instalará:
- `firebase-admin`: SDK de Firebase para backend
- `firebase-functions`: Para crear Cloud Functions
- `cloudinary`: SDK de Cloudinary para Node.js

---

## 🔑 Configuración de Cloudinary

### 1. Obtener credenciales de Cloudinary

1. Inicia sesión en [Cloudinary Dashboard](https://cloudinary.com/console)
2. En la página principal, encontrarás:
   - **Cloud Name** (nombre de tu nube)
   - **API Key** (clave API)
   - **API Secret** (secreto API)

### 2. Configurar las credenciales en Firebase

Las credenciales de Cloudinary deben guardarse de forma segura en Firebase Functions Config:

```bash
# Volver al directorio raíz del proyecto
cd ..

# Configurar las credenciales de Cloudinary
firebase functions:config:set cloudinary.cloud_name="TU_CLOUD_NAME"
firebase functions:config:set cloudinary.api_key="TU_API_KEY"
firebase functions:config:set cloudinary.api_secret="TU_API_SECRET"
```

**⚠️ IMPORTANTE:** Reemplaza `TU_CLOUD_NAME`, `TU_API_KEY`, y `TU_API_SECRET` con tus credenciales reales de Cloudinary.

### 3. Verificar la configuración

```bash
firebase functions:config:get
```

Deberías ver algo como:

```json
{
  "cloudinary": {
    "cloud_name": "tu_cloud_name",
    "api_key": "123456789012345",
    "api_secret": "tu_api_secret_aqui"
  }
}
```

---

## 🚀 Deployment de Cloud Functions

### 1. Compilar el código (si usas TypeScript)

Si no usas TypeScript, puedes saltar este paso.

```bash
cd functions
npm run build
cd ..
```

### 2. Desplegar las funciones

```bash
firebase deploy --only functions
```

Este comando desplegará las siguientes funciones:

- `eliminarImagenCloudinary` - HTTP Callable para eliminar una imagen
- `eliminarImagenesCloudinary` - HTTP Callable para eliminar múltiples imágenes
- `onEliminarProyecto` - Trigger automático al eliminar un proyecto
- `onEliminarProducto` - Trigger automático al eliminar un producto
- `onActualizarProyecto` - Trigger automático al actualizar un proyecto
- `onActualizarProducto` - Trigger automático al actualizar un producto

### 3. Esperar la confirmación

El proceso tomará unos minutos. Verás mensajes como:

```
✔  functions[eliminarImagenCloudinary(us-central1)] Successful create operation.
✔  functions[eliminarImagenesCloudinary(us-central1)] Successful create operation.
✔  functions[onEliminarProyecto(us-central1)] Successful create operation.
✔  functions[onEliminarProducto(us-central1)] Successful create operation.
✔  functions[onActualizarProyecto(us-central1)] Successful create operation.
✔  functions[onActualizarProducto(us-central1)] Successful create operation.
```

---

## ✅ Verificación

### 1. Verificar en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Functions** en el menú lateral
4. Deberías ver las 6 funciones desplegadas

### 2. Probar la funcionalidad

1. Abre `admin.html` en tu navegador
2. Inicia sesión con tu cuenta de administrador
3. Intenta realizar una de estas acciones:

   **Opción A: Eliminar una imagen individual**
   - Edita un proyecto o producto existente
   - Haz clic en la "X" de una imagen en el preview
   - Verifica en la consola del navegador que aparezca: `✅ Imagen eliminada de Cloudinary exitosamente`
   - Ve a tu [Cloudinary Media Library](https://cloudinary.com/console/media_library) y confirma que la imagen fue eliminada

   **Opción B: Eliminar un proyecto completo**
   - Elimina un proyecto que tenga imágenes
   - Verifica que aparezca la confirmación: "Las imágenes también serán eliminadas de Cloudinary"
   - Espera unos segundos
   - Ve a Cloudinary y confirma que las imágenes fueron eliminadas

   **Opción C: Actualizar y reemplazar imágenes**
   - Edita un proyecto o producto
   - Elimina algunas imágenes antiguas
   - Agrega nuevas imágenes
   - Guarda los cambios
   - Las imágenes antiguas deberían eliminarse automáticamente de Cloudinary

### 3. Verificar logs de Cloud Functions

Para ver los logs y confirmar que las funciones se ejecutan correctamente:

```bash
firebase functions:log
```

O visita: [Firebase Console > Functions > Logs](https://console.firebase.google.com/project/_/functions/logs)

Busca mensajes como:
- `🗑️ Eliminando imagen de Cloudinary: coneri/proyectos/abc123`
- `✅ Imagen eliminada: coneri/proyectos/abc123 (ok)`

---

## 🎯 Funcionalidades Implementadas

### 1. Eliminación Manual de Imágenes Temporales

**Ubicación:** `js/admin.js` - función `eliminarImagenTemporal()`

**Comportamiento:**
- Cuando el usuario hace clic en la "X" de una imagen en el preview durante la edición
- La imagen se elimina inmediatamente del array temporal
- Si es una imagen de Cloudinary, también se elimina del servidor

### 2. Eliminación Automática al Borrar Proyectos

**Ubicación:** `functions/index.js` - función `onEliminarProyecto`

**Comportamiento:**
- Trigger automático cuando se elimina un documento de la colección `proyectos`
- Extrae todas las URLs de imágenes del campo `imagenes`
- Elimina cada imagen de Cloudinary automáticamente
- No requiere intervención del usuario

### 3. Eliminación Automática al Borrar Productos

**Ubicación:** `functions/index.js` - función `onEliminarProducto`

**Comportamiento:**
- Trigger automático cuando se elimina un documento de la colección `productos`
- Extrae todas las URLs de imágenes del campo `imagenes`
- Elimina cada imagen de Cloudinary automáticamente

### 4. Eliminación al Actualizar Proyectos

**Ubicación:** `functions/index.js` - función `onActualizarProyecto`

**Comportamiento:**
- Trigger automático cuando se actualiza un proyecto
- Compara las imágenes antes y después de la actualización
- Elimina solo las imágenes que fueron removidas (no están en la nueva versión)
- Las imágenes que permanecen no se tocan

### 5. Eliminación al Actualizar Productos

**Ubicación:** `functions/index.js` - función `onActualizarProducto`

**Comportamiento:**
- Trigger automático cuando se actualiza un producto
- Compara las imágenes antes y después de la actualización
- Elimina solo las imágenes que fueron removidas

### 6. Funciones HTTP Callable

**Ubicación:** `functions/index.js` - funciones `eliminarImagenCloudinary` y `eliminarImagenesCloudinary`

**Uso:**
- Pueden ser llamadas desde el cliente para eliminar imágenes manualmente
- Requieren autenticación
- Útiles para operaciones de limpieza o gestión avanzada

---

## 🐛 Solución de Problemas

### Error: "UNAUTHENTICATED: The function must be called while authenticated"

**Causa:** El usuario no está autenticado cuando intenta eliminar una imagen.

**Solución:**
1. Asegúrate de que el usuario esté logueado en Firebase Authentication
2. Verifica que `auth.currentUser` no sea null antes de llamar a las funciones

### Error: "Invalid argument: Se requiere la URL de la imagen"

**Causa:** La función fue llamada sin pasar una URL válida.

**Solución:**
1. Verifica que la variable `url` tenga un valor antes de llamar a la función
2. Asegúrate de que la URL sea de Cloudinary (`res.cloudinary.com`)

### Error: "No se pudo extraer el public_id de la URL"

**Causa:** La URL no tiene el formato esperado de Cloudinary.

**Solución:**
1. Verifica que la URL tenga este formato: `https://res.cloudinary.com/{cloud_name}/image/upload/...`
2. Si usas transformaciones o versiones, asegúrate de que el formato sea compatible

### Las imágenes no se eliminan automáticamente

**Solución:**
1. Verifica que las Cloud Functions estén desplegadas:
   ```bash
   firebase functions:list
   ```

2. Revisa los logs para ver errores:
   ```bash
   firebase functions:log --only onEliminarProyecto
   firebase functions:log --only onEliminarProducto
   ```

3. Confirma que las credenciales de Cloudinary estén configuradas:
   ```bash
   firebase functions:config:get
   ```

### Error: "Missing Firebase configuration"

**Causa:** Las credenciales de Cloudinary no están configuradas en Firebase Functions.

**Solución:**
```bash
firebase functions:config:set cloudinary.cloud_name="TU_CLOUD_NAME"
firebase functions:config:set cloudinary.api_key="TU_API_KEY"
firebase functions:config:set cloudinary.api_secret="TU_API_SECRET"
firebase deploy --only functions
```

### Costos de Cloud Functions

**Pregunta:** ¿Cuánto cuesta usar Cloud Functions?

**Respuesta:**
- Firebase ofrece un plan gratuito generoso (Spark Plan)
- 2 millones de invocaciones por mes gratis
- 400,000 GB-segundos gratis por mes
- Para proyectos pequeños/medianos, probablemente no excederás el límite gratuito
- Consulta [Firebase Pricing](https://firebase.google.com/pricing) para más detalles

---

## 📚 Recursos Adicionales

- [Documentación de Firebase Cloud Functions](https://firebase.google.com/docs/functions)
- [Documentación de Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Firebase Functions Config](https://firebase.google.com/docs/functions/config-env)
- [Cloudinary Upload API](https://cloudinary.com/documentation/image_upload_api_reference)

---

## 🔒 Seguridad

**⚠️ NUNCA expongas tus credenciales de Cloudinary en el código del cliente:**

- ✅ **Correcto:** Usar Firebase Cloud Functions con `functions:config:set`
- ❌ **Incorrecto:** Poner API Key y API Secret en archivos JavaScript del cliente

Las Cloud Functions mantienen tus credenciales seguras en el servidor y solo ejecutan operaciones autorizadas.

---

## 📝 Notas Importantes

1. **Imágenes de Firebase Storage:** Si tienes imágenes antiguas en Firebase Storage (no Cloudinary), estas no se eliminarán automáticamente con estas funciones. Considera migrar todas las imágenes a Cloudinary o crear funciones separadas para Firebase Storage.

2. **Eliminación permanente:** Una vez que una imagen se elimina de Cloudinary, **no se puede recuperar**. Asegúrate de tener backups si es necesario.

3. **Delay en eliminación:** Los triggers de Firestore pueden tomar unos segundos en ejecutarse. Es normal que la eliminación de imágenes de Cloudinary no sea instantánea.

4. **Límites de Cloudinary:** Cloudinary tiene límites en su plan gratuito. Si tienes muchas imágenes, considera actualizar tu plan.

---

## ✨ Siguiente Paso

Una vez configurado todo, las imágenes se eliminarán automáticamente cuando:
- ✅ Elimines un proyecto o producto
- ✅ Edites un proyecto o producto y remuevas imágenes
- ✅ Hagas clic en la "X" de una imagen durante la edición

¡Tu sistema de gestión de imágenes ahora está completamente automatizado! 🎉
