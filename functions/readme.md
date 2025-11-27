# 🔥 Firebase Cloud Functions - CONERI

Cloud Functions para gestión automática de imágenes en Cloudinary.

---

## ✅ Funcionalidades Implementadas

### 1. **Eliminación Manual de Imágenes Temporales**
Cuando un usuario hace clic en la "X" de una imagen durante la edición, se elimina inmediatamente de Cloudinary.

### 2. **Triggers Automáticos en Firestore**
- `onEliminarProyecto` - Cuando se elimina un proyecto, todas sus imágenes se eliminan automáticamente
- `onEliminarProducto` - Cuando se elimina un producto, todas sus imágenes se eliminan automáticamente
- `onActualizarProyecto` - Cuando se actualiza un proyecto y se remueven imágenes, las antiguas se eliminan
- `onActualizarProducto` - Cuando se actualiza un producto y se reemplazan imágenes, las antiguas se eliminan

### 3. **Funciones HTTP Callable**
- `eliminarImagenCloudinary` - Elimina una imagen específica
- `eliminarImagenesCloudinary` - Elimina múltiples imágenes en batch

---

## ⚙️ Configuración

### **Paso 1: Configurar Variables de Entorno**

Las funciones ahora usan variables de entorno desde el archivo `.env`:

```bash
# Copia el archivo de ejemplo
cp .env.example .env
```

Edita `functions/.env` con tus credenciales de Cloudinary:

```env
CLOUDINARY_CLOUD_NAME=duzzxgbxa
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

**🔐 IMPORTANTE:**
- El archivo `.env` está en `.gitignore` y NO se sube a Git
- Obtén tus credenciales en [Cloudinary Console](https://console.cloudinary.com/console)

### **Paso 2: Instalar Dependencias**

```bash
cd functions
npm install
```

### **Paso 3: Desplegar las Funciones**

```bash
# Desde la raíz del proyecto
firebase deploy --only functions
```

Firebase automáticamente cargará las variables de entorno desde `functions/.env`.

---

## 📦 Dependencias

- `firebase-admin` - SDK de Firebase para Node.js
- `firebase-functions` - Framework de Cloud Functions
- `cloudinary` - SDK de Cloudinary
- `dotenv` - Manejo de variables de entorno

---

## 🧪 Pruebas Locales

```bash
# Emulador local de funciones
cd functions
npm run serve
```

---

## 📁 Archivos del Proyecto

```
functions/
├── .env                  # Variables de entorno (NO en Git) ⚠️
├── .env.example          # Plantilla de variables
├── .gitignore            # Ignora .env y node_modules
├── package.json          # Dependencias
├── index.js              # Funciones Cloud implementadas
└── README.md             # Esta documentación
```

**Archivos relacionados en el proyecto:**
- `js/admin-cloudinary.js` - Funciones del cliente para eliminar imágenes
- `js/admin.js` - Integración con el panel de administración
- `docs/configuracion/CONFIGURAR_ELIMINACION_CLOUDINARY.md` - Guía completa

---

## 🔍 Ver Logs

```bash
# Ver logs en tiempo real
firebase functions:log

# Ver logs de una función específica
firebase functions:log --only eliminarImagenCloudinary
```

---

## ⚠️ Migración desde el Método Antiguo

### ❌ Método Antiguo (Deprecado)
```bash
# NO USAR - Ya no funciona
firebase functions:config:set cloudinary.cloud_name="..."
```

### ✅ Método Nuevo (Actual)
```env
# Usar archivo .env
CLOUDINARY_CLOUD_NAME=tu_cloud_name
```

**¿Por qué cambió?**
- El método `functions:config:set` está deprecado
- Las variables de entorno son más seguras y fáciles de gestionar
- Mejor compatibilidad con entornos locales de desarrollo

---

## 🔒 Seguridad

- ✅ Credenciales almacenadas en `.env` (nunca en Git)
- ✅ Funciones requieren autenticación de Firebase
- ✅ Validación de permisos en cada operación
- ✅ Las credenciales nunca se exponen al cliente

---

## 🚀 Scripts Disponibles

```bash
npm run serve    # Emulador local
npm run deploy   # Desplegar funciones
npm run logs     # Ver logs
npm run shell    # Shell interactivo
```

---

## 📞 Documentación Adicional

- [Guía Completa de Configuración](../docs/configuracion/CONFIGURAR_ELIMINACION_CLOUDINARY.md)
- [Documentación de Firebase Functions](https://firebase.google.com/docs/functions)
- [Documentación de Cloudinary](https://cloudinary.com/documentation)
- [Variables de Entorno en Firebase](https://firebase.google.com/docs/functions/config-env)

---

**Última actualización:** 2024-11-27
**Versión:** 2.0 (Migrado a variables de entorno)
