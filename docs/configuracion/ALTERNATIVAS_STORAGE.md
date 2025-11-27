# 🆓 Alternativas Gratuitas a Firebase Storage

## 📊 Comparación de Servicios Gratuitos

| Servicio | Almacenamiento | Descarga/mes | Límite | Recomendación |
|----------|---------------|--------------|--------|---------------|
| **Firebase Storage** | 5 GB | 30 GB | 50k ops/día | ⭐⭐⭐⭐⭐ Mejor integración |
| **Cloudinary** | 25 GB | 25 GB | - | ⭐⭐⭐⭐⭐ Más espacio |
| **ImgBB** | Ilimitado | Ilimitado | API limitada | ⭐⭐⭐ Buena opción |
| **Imgur** | Ilimitado | Ilimitado | API limitada | ⭐⭐⭐ Buena opción |
| **Supabase Storage** | 1 GB | 2 GB | - | ⭐⭐⭐⭐ Open source |

---

## ✅ OPCIÓN 1: Firebase Storage (RECOMENDADA)

**Habilitar (es GRATIS):**
1. https://console.firebase.google.com/project/proyecto-coneri/storage
2. "Get Started" → Modo Producción → Ubicación: us-central1
3. Done

**Límites gratuitos:**
- 5 GB almacenamiento
- 1 GB/día descarga
- **MÁS QUE SUFICIENTE** para CONERI

---

## 🌥️ OPCIÓN 2: Cloudinary (Más espacio gratis)

### **Ventajas:**
- ✅ 25 GB gratis (5x más que Firebase)
- ✅ Redimensionamiento automático
- ✅ Optimización de imágenes
- ✅ CDN rápido
- ✅ Transformaciones en URL

### **Configuración:**

**1. Crear cuenta:**
- https://cloudinary.com/users/register/free
- Registro con email

**2. Obtener credenciales:**
- Dashboard → Cloud Name, API Key, API Secret

**3. Instalar SDK:**
```bash
npm install cloudinary
```

**4. Configurar en tu proyecto:**
```javascript
// js/cloudinary-config.js
const cloudinary = window.cloudinary;

cloudinary.config({
  cloud_name: 'TU_CLOUD_NAME',
  api_key: 'TU_API_KEY',
  secure: true
});

// Widget de subida
const uploadWidget = cloudinary.createUploadWidget({
  cloudName: 'TU_CLOUD_NAME',
  uploadPreset: 'coneri_preset'
}, (error, result) => {
  if (!error && result && result.event === "success") {
    console.log('URL de imagen:', result.info.secure_url);
    imagenesTemporales.push(result.info.secure_url);
  }
});
```

**5. Modificar admin.js:**
```javascript
// Reemplazar función subirImagenes con:
function abrirCloudinaryWidget() {
  uploadWidget.open();
}
```

---

## 📸 OPCIÓN 3: ImgBB (Ilimitado)

### **Ventajas:**
- ✅ Almacenamiento ilimitado
- ✅ Sin límite de descarga
- ✅ API gratuita
- ✅ Muy simple

### **Configuración:**

**1. Obtener API Key:**
- https://api.imgbb.com/
- Crear cuenta y copiar API Key

**2. Crear función de subida:**
```javascript
// js/imgbb-upload.js
async function subirAImgBB(archivo) {
  const apiKey = 'TU_API_KEY_AQUI';
  const formData = new FormData();
  formData.append('image', archivo);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  return data.data.url; // URL de la imagen
}

// Usar en admin.js:
async function subirImagenes(e, tipo) {
  const archivos = e.target.files;

  for (const archivo of archivos) {
    const url = await subirAImgBB(archivo);
    imagenesTemporales.push(url);
  }
}
```

---

## 🖼️ OPCIÓN 4: Imgur

Similar a ImgBB pero con más restricciones en API.

**API Key:**
- https://api.imgur.com/oauth2/addclient
- Registrar app y obtener Client ID

**Código similar a ImgBB.**

---

## 🗄️ OPCIÓN 5: Supabase Storage

### **Ventajas:**
- ✅ Open source
- ✅ 1 GB gratis
- ✅ Alternativa completa a Firebase
- ✅ Incluye Database, Auth, Storage

### **Configuración:**

**1. Crear proyecto:**
- https://supabase.com
- Crear cuenta y proyecto

**2. Instalar SDK:**
```bash
npm install @supabase/supabase-js
```

**3. Configurar:**
```javascript
// js/supabase-config.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xxx.supabase.co'
const supabaseKey = 'TU_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)

// Subir archivo
async function subirImagen(file) {
  const { data, error } = await supabase.storage
    .from('productos')
    .upload(`public/${Date.now()}_${file.name}`, file)

  if (error) throw error

  // Obtener URL pública
  const { data: urlData } = supabase.storage
    .from('productos')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}
```

---

## 🎯 RECOMENDACIÓN FINAL

### **Para CONERI, usa Firebase Storage:**

**¿Por qué?**
1. ✅ Ya tienes Firebase configurado
2. ✅ 5GB es suficiente para cientos de productos
3. ✅ Integración perfecta con tu código actual
4. ✅ Es GRATIS (plan Spark)
5. ✅ No necesitas código extra

**¿Cuándo usar alternativas?**
- Si necesitas más de 5GB → **Cloudinary** (25GB gratis)
- Si quieres almacenamiento ilimitado → **ImgBB**
- Si quieres migrar de Firebase → **Supabase**

---

## 💡 SOLUCIÓN HÍBRIDA (Mejor de dos mundos)

Usa Firebase para la app + Cloudinary para imágenes grandes:

```javascript
// Para imágenes pequeñas (< 500KB)
if (archivo.size < 500000) {
  await subirAFirebase(archivo);
} else {
  // Para imágenes grandes
  await subirACloudinary(archivo);
}
```

---

## 📞 ¿Cuál elegir?

**Mi recomendación:**
1. **Primero**: Habilita Firebase Storage (es gratis)
2. **Si necesitas más espacio**: Cloudinary
3. **Si quieres independencia**: Supabase

**Para CONERI:** Firebase Storage es perfecto. 5GB = ~5,000 fotos de productos.
