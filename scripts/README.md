# 🧹 Scripts de Mantenimiento - CONERI

Scripts de utilidad para mantener el proyecto CONERI limpio y optimizado.

---

## 📜 Scripts Disponibles

### `limpiar-imagenes-huerfanas.js`

Identifica y elimina imágenes huérfanas en Cloudinary (imágenes que ya no están referenciadas en Firestore).

**Características:**
- ✅ Compara imágenes de Cloudinary con las URLs en Firestore
- ✅ Identifica imágenes que ya no se usan
- ✅ Modo de vista previa (sin eliminar)
- ✅ Modo de eliminación con confirmación
- ✅ Reporte detallado con colores

---

## ⚙️ Configuración Inicial

### **Paso 1: Obtener Credenciales de Firebase**

Necesitas el archivo `service-account-key.json` con las credenciales de administrador de Firebase:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **proyecto-coneri**
3. Ve a **⚙️ Configuración del proyecto** (rueda dentada arriba a la izquierda)
4. Pestaña **Cuentas de servicio**
5. Haz clic en **"Generar nueva clave privada"**
6. Guarda el archivo descargado como `service-account-key.json` en la carpeta `scripts/`

**⚠️ IMPORTANTE:** Este archivo contiene credenciales sensibles. **NUNCA** lo subas a Git.

### **Paso 2: Configurar Variables de Entorno**

Ya tienes el archivo `.env` creado con tus credenciales de Cloudinary:

```env
CLOUDINARY_CLOUD_NAME=duzzxgbxa
CLOUDINARY_API_KEY=785139713761571
CLOUDINARY_API_SECRET=EmR3K4aB7FWnN0l1vWAW5jAxgSE
```

### **Paso 3: Instalar Dependencias**

```bash
cd scripts
npm install
```

---

## 🚀 Uso

### **Modo Vista Previa (Solo listar huérfanas)**

```bash
# Desde la carpeta scripts/
node limpiar-imagenes-huerfanas.js

# O usando npm script
npm run clean
```

Este modo:
- ✅ Lista todas las imágenes huérfanas encontradas
- ✅ Muestra estadísticas
- ❌ NO elimina nada

**Salida de ejemplo:**
```
╔════════════════════════════════════════════════════════╗
║     🧹 Limpieza de Imágenes Huérfanas - CONERI        ║
╚════════════════════════════════════════════════════════╝

📦 Obteniendo imágenes de Firestore...
   Productos encontrados: 15
   Proyectos encontrados: 8
   ✓ Total de URLs en Firestore: 45

☁️  Obteniendo imágenes de Cloudinary...
   ✓ Total de imágenes en Cloudinary: 52

🔍 Identificando imágenes huérfanas...
   Public IDs en uso (Firestore): 45

═══════════════════════════════════════════════════════
📊 RESUMEN:
   Imágenes en uso (Firestore): 45
   Imágenes en Cloudinary: 52
   Imágenes huérfanas: 7
═══════════════════════════════════════════════════════

Imágenes huérfanas encontradas:
   1. coneri/productos/old_image_1
   2. coneri/productos/old_image_2
   ...

💡 Para eliminar estas imágenes, ejecuta:
   node scripts/limpiar-imagenes-huerfanas.js --delete
```

---

### **Modo Eliminación (Eliminar huérfanas)**

```bash
# Desde la carpeta scripts/
node limpiar-imagenes-huerfanas.js --delete

# O usando npm script
npm run clean:delete
```

Este modo:
1. Lista las imágenes huérfanas
2. **Pide confirmación** antes de eliminar
3. Elimina las imágenes de Cloudinary
4. Muestra reporte de eliminaciones

**⚠️ ADVERTENCIA:** Esta acción es irreversible.

---

## 📋 Estructura de Archivos

```
scripts/
├── .env                              # Credenciales de Cloudinary
├── .env.example                      # Plantilla de variables
├── .gitignore                        # Ignora archivos sensibles
├── package.json                      # Dependencias
├── service-account-key.json          # Credenciales de Firebase (NO en Git)
├── limpiar-imagenes-huerfanas.js     # Script principal
└── README.md                         # Esta documentación
```

---

## 🔐 Seguridad

### **Archivos que NUNCA deben subirse a Git:**

1. ✅ `.env` - Ya está en `.gitignore`
2. ✅ `service-account-key.json` - Ya está en `.gitignore`
3. ✅ `node_modules/` - Ya está en `.gitignore`

### **Verificar que no se suban:**

```bash
# Ver qué archivos están siendo ignorados
git status --ignored
```

---

## 📊 ¿Cuándo Ejecutar Este Script?

### **Frecuencia Recomendada:**

| Actividad | Frecuencia |
|-----------|------------|
| Desarrollo activo | Semanal |
| Mantenimiento | Mensual |
| Después de eliminar muchos productos/proyectos | Inmediato |
| Optimización de storage | Cuando lo necesites |

### **Indicadores de que necesitas limpieza:**

- ⚠️ Eliminaste productos o proyectos recientemente
- ⚠️ Editaste productos/proyectos y cambiaste sus imágenes
- ⚠️ Notas que Cloudinary tiene más imágenes de las esperadas
- ⚠️ Quieres optimizar el uso de tu cuota gratuita de Cloudinary

---

## 🐛 Solución de Problemas

### **Error: "Cannot find module 'service-account-key.json'"**

**Solución:**
1. Verifica que el archivo `service-account-key.json` existe en `scripts/`
2. Sigue el **Paso 1** de la configuración inicial

### **Error: "CLOUDINARY_CLOUD_NAME is not defined"**

**Solución:**
1. Verifica que el archivo `scripts/.env` existe
2. Verifica que tiene las credenciales correctas

### **Error: "Permission denied" de Firebase**

**Solución:**
1. Regenera el archivo `service-account-key.json`
2. Asegúrate de usar el proyecto correcto (**proyecto-coneri**)

### **El script no encuentra imágenes huérfanas**

**Posibles causas:**
- ✅ Tu storage está limpio (¡excelente!)
- ⚠️ Las imágenes no están en la carpeta `coneri/` de Cloudinary
- ⚠️ Modifica el `prefix` en el script si usas otra carpeta

---

## 💡 Consejos

### **Antes de eliminar:**
1. Ejecuta primero sin `--delete` para ver qué se eliminará
2. Verifica la lista de huérfanas
3. Haz un backup si no estás seguro

### **Optimización:**
- Este script es más eficiente que Cloud Functions para limpieza periódica
- No consume recursos de Firebase
- Puedes ejecutarlo cuando quieras
- Es gratis (no requiere plan Blaze)

### **Automatización (Opcional):**

Puedes crear una tarea programada para ejecutar el script automáticamente:

**Windows (Task Scheduler):**
```bash
# Crear tarea que ejecute semanalmente
schtasks /create /tn "CONERI Cleanup" /tr "node C:\ruta\a\scripts\limpiar-imagenes-huerfanas.js --delete" /sc weekly
```

**Linux/Mac (Cron):**
```bash
# Agregar a crontab (ejecutar cada domingo a las 2 AM)
0 2 * * 0 cd /ruta/a/scripts && node limpiar-imagenes-huerfanas.js --delete
```

---

## 📞 Soporte

- [Documentación de Cloudinary API](https://cloudinary.com/documentation/admin_api)
- [Documentación de Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

---

**Última actualización:** 2024-11-27
