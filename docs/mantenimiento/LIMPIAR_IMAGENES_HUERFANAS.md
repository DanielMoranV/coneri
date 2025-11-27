# 🧹 Guía: Limpiar Imágenes Huérfanas de Cloudinary

Guía paso a paso para limpiar imágenes que ya no se usan en tu proyecto CONERI.

---

## 🎯 ¿Qué son las Imágenes Huérfanas?

**Imágenes huérfanas** son archivos que:
- ✅ Existen en Cloudinary
- ❌ Ya NO están referenciadas en tu base de datos (Firestore)

**¿Cómo se crean?**
- Eliminaste un producto/proyecto pero la imagen quedó en Cloudinary
- Editaste un producto/proyecto y cambiaste su imagen
- Subiste imágenes de prueba que nunca usaste

**¿Por qué limpiarlas?**
- 💰 Liberar espacio en tu cuota gratuita de Cloudinary
- 🚀 Optimizar rendimiento
- 🧹 Mantener el proyecto organizado

---

## ⚡ Guía Rápida

### **1. Configurar el Script (Solo la primera vez)**

```bash
# 1. Ve a Firebase Console y descarga las credenciales
# https://console.firebase.google.com/project/proyecto-coneri/settings/serviceaccounts

# 2. Guarda el archivo como:
# scripts/service-account-key.json

# 3. Instala dependencias
cd scripts
npm install
```

### **2. Ejecutar Limpieza**

```bash
# Ver qué imágenes se eliminarían (sin eliminar)
npm run clean

# Eliminar imágenes huérfanas (con confirmación)
npm run clean:delete
```

---

## 📖 Guía Detallada

### **Paso 1: Obtener Credenciales de Firebase**

1. **Ir a Firebase Console:**
   - Ve a https://console.firebase.google.com/
   - Selecciona **proyecto-coneri**

2. **Descargar Credenciales:**
   - Haz clic en ⚙️ (rueda dentada) → **Configuración del proyecto**
   - Pestaña **Cuentas de servicio**
   - Botón **"Generar nueva clave privada"**
   - Se descargará un archivo JSON

3. **Guardar Archivo:**
   - Renombra el archivo a: `service-account-key.json`
   - Muévelo a: `C:\Users\Daniel\Desktop\DesarrolloWeb\coneri-1\scripts\`

**⚠️ IMPORTANTE:** Este archivo contiene credenciales sensibles. **NO lo compartas ni lo subas a Git.**

---

### **Paso 2: Verificar Configuración**

```bash
cd C:\Users\Daniel\Desktop\DesarrolloWeb\coneri-1\scripts
```

**Verifica que existan estos archivos:**
```
scripts/
├── .env                      ✅ (Ya existe con tus credenciales)
├── service-account-key.json  ⚠️ (Debes crearlo)
├── package.json              ✅
└── limpiar-imagenes-huerfanas.js ✅
```

---

### **Paso 3: Instalar Dependencias**

```bash
# Desde la carpeta scripts/
npm install
```

Esto instalará:
- `firebase-admin` - Para acceder a Firestore
- `cloudinary` - Para gestionar imágenes
- `dotenv` - Para cargar variables de entorno

---

### **Paso 4: Ejecutar en Modo Vista Previa**

Primero ejecuta el script **sin eliminar** para ver qué encontró:

```bash
node limpiar-imagenes-huerfanas.js
```

**Salida esperada:**
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

═══════════════════════════════════════════════════════
📊 RESUMEN:
   Imágenes en uso (Firestore): 45
   Imágenes en Cloudinary: 52
   Imágenes huérfanas: 7
═══════════════════════════════════════════════════════

Imágenes huérfanas encontradas:
   1. coneri/productos/imagen_antigua_xyz
   2. coneri/proyectos/foto_eliminada_abc
   ...

💡 Para eliminar estas imágenes, ejecuta:
   node limpiar-imagenes-huerfanas.js --delete
```

**Analiza la lista:**
- ✅ ¿Son imágenes que ya no usas?
- ✅ ¿Reconoces los nombres?
- ⚠️ ¿Hay alguna imagen que todavía necesites?

---

### **Paso 5: Eliminar Imágenes Huérfanas**

Si estás seguro de que quieres eliminar las imágenes:

```bash
node limpiar-imagenes-huerfanas.js --delete
```

**El script te pedirá confirmación:**
```
⚠️  ADVERTENCIA: Estás a punto de eliminar 7 imágenes de Cloudinary.
¿Deseas continuar? (s/n):
```

Escribe `s` y presiona Enter para confirmar.

**Resultado:**
```
🗑️  Eliminando imágenes huérfanas...
   ✓ Eliminada: coneri/productos/imagen_antigua_xyz
   ✓ Eliminada: coneri/proyectos/foto_eliminada_abc
   ...

═══════════════════════════════════════════════════════
✓ COMPLETADO
   Eliminadas: 7
   Errores: 0
═══════════════════════════════════════════════════════
```

---

## 📅 ¿Cuándo Ejecutar la Limpieza?

### **Recomendaciones:**

| Situación | Acción |
|-----------|--------|
| **Después de eliminar productos/proyectos** | Ejecutar inmediatamente |
| **Desarrollo activo** | Una vez por semana |
| **Mantenimiento regular** | Una vez al mes |
| **Optimización de storage** | Cuando lo necesites |

### **Buenas Prácticas:**

1. **Ejecuta primero sin `--delete`** para ver qué se eliminará
2. **Haz backups** si no estás 100% seguro
3. **Ejecuta regularmente** para mantener el proyecto limpio
4. **Documenta** las ejecuciones importantes

---

## 🔐 Seguridad

### **Archivos Sensibles (NO subir a Git):**

```
scripts/
├── .env                      ⚠️ Credenciales de Cloudinary
├── service-account-key.json  ⚠️ Credenciales de Firebase
└── .gitignore                ✅ Ya configurado para ignorar estos archivos
```

### **Verificar que están ignorados:**

```bash
cd scripts
git status

# NO deberías ver .env ni service-account-key.json en la lista
```

---

## 🐛 Solución de Problemas

### **"Cannot find module 'service-account-key.json'"**

❌ **Problema:** El archivo de credenciales no existe

✅ **Solución:**
1. Descarga las credenciales de Firebase (ver Paso 1)
2. Guárdalo como `scripts/service-account-key.json`

---

### **"CLOUDINARY_CLOUD_NAME is not defined"**

❌ **Problema:** El archivo `.env` no existe o está mal configurado

✅ **Solución:**
1. Verifica que `scripts/.env` existe
2. Verifica que contiene:
   ```env
   CLOUDINARY_CLOUD_NAME=duzzxgbxa
   CLOUDINARY_API_KEY=785139713761571
   CLOUDINARY_API_SECRET=EmR3K4aB7FWnN0l1vWAW5jAxgSE
   ```

---

### **"Permission denied" en Firebase**

❌ **Problema:** Las credenciales no tienen permisos

✅ **Solución:**
1. Regenera las credenciales en Firebase Console
2. Asegúrate de descargar la clave del proyecto **proyecto-coneri**

---

### **El script dice "0 imágenes huérfanas"**

✅ **¡Excelente!** Tu storage está limpio

Esto significa:
- Todas las imágenes en Cloudinary están siendo usadas
- No hay imágenes huérfanas que limpiar

---

## 💡 Consejos Avanzados

### **Limpieza Automática (Opcional)**

Puedes programar el script para que se ejecute automáticamente:

**Windows (Task Scheduler):**
```powershell
# Crear tarea semanal
$action = New-ScheduledTaskAction -Execute "node" -Argument "C:\Users\Daniel\Desktop\DesarrolloWeb\coneri-1\scripts\limpiar-imagenes-huerfanas.js --delete"
$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At 2am
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "CONERI Cleanup"
```

**Linux/Mac (Cron):**
```bash
# Agregar a crontab (ejecutar cada domingo a las 2 AM)
0 2 * * 0 cd /ruta/a/scripts && node limpiar-imagenes-huerfanas.js --delete
```

---

### **Script Personalizado**

Puedes modificar `limpiar-imagenes-huerfanas.js` para:
- Cambiar la carpeta de Cloudinary (línea con `prefix: 'coneri/'`)
- Agregar filtros adicionales
- Exportar reporte a CSV
- Enviar notificaciones por email

---

## 📊 Beneficios

Usar este script en lugar de Cloud Functions:

| Característica | Cloud Functions | Script Local |
|---------------|-----------------|--------------|
| **Costo** | Requiere plan Blaze | ✅ Gratis |
| **Control** | Automático | ✅ Manual (más control) |
| **Configuración** | Compleja | ✅ Simple |
| **Flexibilidad** | Limitada | ✅ Alta |
| **Ejecución** | En cada cambio | ✅ Cuando quieras |

---

## 📞 Soporte

- [Documentación completa](../README.md)
- [Documentación del script](../../scripts/README.md)
- [Cloudinary API Docs](https://cloudinary.com/documentation/admin_api)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

---

**Última actualización:** 2024-11-27
