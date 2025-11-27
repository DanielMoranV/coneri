# ☁️ Configurar Cloudinary (Alternativa GRATUITA a Firebase Storage)

## 🎯 ¿Por qué Cloudinary?

- ✅ **25 GB gratis** (5x más que Firebase)
- ✅ **NO requiere tarjeta de crédito**
- ✅ **NO requiere plan Blaze**
- ✅ **Optimización automática** de imágenes
- ✅ **CDN global** incluido
- ✅ **Widget fácil de usar**

---

## 🚀 CONFIGURACIÓN PASO A PASO (5 minutos)

### **Paso 1: Crear Cuenta en Cloudinary**

1. Ve a: https://cloudinary.com/users/register_free

2. Completa el formulario:
   - **First Name**: Tu nombre
   - **Last Name**: Tu apellido
   - **Email**: Tu correo
   - **Company/Organization**: CONERI
   - **Password**: Tu contraseña

3. En **"Cloud name"**, elige uno de estos:
   - `coneri` (si está disponible)
   - `coneri-peru`
   - `coneri-solar`
   - O el que prefieras (debe ser único)

4. **IMPORTANTE**: **Anota tu Cloud Name**, lo necesitarás después

5. Acepta términos y haz clic en **"Create Account"**

6. **Verifica tu email** (revisa tu bandeja de entrada)

---

### **Paso 2: Crear Upload Preset**

1. **Inicia sesión** en Cloudinary: https://console.cloudinary.com/

2. Ve a: **Settings** (⚙️ arriba a la derecha)

3. Pestaña: **Upload**

4. Scroll down hasta: **"Upload presets"**

5. Haz clic en: **"Add upload preset"** (o "Enable unsigned uploading")

6. Configura el preset:
   - **Upload preset name**: `coneri_productos`
   - **Signing Mode**: **Unsigned** ⚠️ IMPORTANTE
   - **Folder**: `coneri` (opcional)
   - **Unique filename**: **ON** (activado)
   - Deja todo lo demás por defecto

7. Haz clic en **"Save"**

8. **IMPORTANTE**: Anota el nombre del preset: `coneri_productos`

---

### **Paso 3: Configurar el Código**

1. **Abre el archivo**: `js/admin-cloudinary.js`

2. **Busca las líneas 6-7**:
   ```javascript
   const CLOUDINARY_CLOUD_NAME = 'TU_CLOUD_NAME';
   const CLOUDINARY_UPLOAD_PRESET = 'coneri_productos';
   ```

3. **Reemplaza `TU_CLOUD_NAME`** con el Cloud Name que elegiste en el Paso 1:
   ```javascript
   const CLOUDINARY_CLOUD_NAME = 'coneri';  // O el que elegiste
   const CLOUDINARY_UPLOAD_PRESET = 'coneri_productos';
   ```

4. **Guarda el archivo**

---

### **Paso 4: Probar**

1. **Abre**: `admin.html` en tu navegador

2. **Inicia sesión** con `admin@coneri.pe`

3. **Crea un nuevo producto** o proyecto

4. **Haz clic en**: "Subir Imágenes (Cloudinary)"

5. **Verás un widget** donde puedes:
   - Arrastrar imágenes
   - Seleccionar desde tu PC
   - Pegar URL de imagen
   - Tomar foto con cámara

6. **Selecciona imágenes** y súbelas

7. **¡Listo!** Las imágenes se subirán a Cloudinary

---

## 🎨 EJEMPLO VISUAL

**Antes (con Firebase Storage):**
```
[Input file] [Botón Browse]
```

**Ahora (con Cloudinary):**
```
[Botón: Subir Imágenes (Cloudinary)]
↓
[Widget modal con drag & drop]
```

---

## ✅ VERIFICAR QUE FUNCIONA

### **Test 1: Verificar Cloud Name**

En la consola del navegador (F12):
```javascript
console.log('Cloud Name:', CLOUDINARY_CLOUD_NAME);
// Debe mostrar tu cloud name, NO 'TU_CLOUD_NAME'
```

### **Test 2: Subir Imagen**

1. Clic en "Subir Imágenes (Cloudinary)"
2. ¿Se abre un widget modal? ✅
3. Arrastra una imagen
4. ¿Se sube correctamente? ✅
5. ¿Aparece el preview? ✅

### **Test 3: Guardar Producto/Proyecto**

1. Sube 2-3 imágenes
2. Completa el formulario
3. Guarda
4. Ve a Firestore y verifica que las URLs son de Cloudinary:
   ```
   https://res.cloudinary.com/tu-cloud-name/image/upload/...
   ```

---

## 🔍 SOLUCIÓN DE PROBLEMAS

### **Error: "Upload preset not found"**

**Solución:**
1. Ve a Cloudinary Settings → Upload
2. Verifica que el preset existe
3. Verifica que **Signing Mode** sea **"Unsigned"**
4. Copia exactamente el nombre del preset en `admin-cloudinary.js`

### **Error: "Widget no se abre"**

**Solución:**
1. Verifica que el script de Cloudinary esté cargado:
   ```javascript
   console.log(typeof cloudinary);  // Debe mostrar "object"
   ```
2. Si dice "undefined", verifica que `admin.html` tenga:
   ```html
   <script src="https://upload-widget.cloudinary.com/global/all.js"></script>
   ```

### **Error: "Invalid cloud name"**

**Solución:**
1. Ve a Cloudinary Dashboard
2. Arriba a la izquierda verás tu **Cloud Name**
3. Cópialo EXACTAMENTE en `admin-cloudinary.js`

### **Las imágenes no se ven en el sitio**

**Solución:**
1. Verifica que las URLs se guardaron en Firestore
2. Las URLs de Cloudinary son públicas por defecto
3. Formato: `https://res.cloudinary.com/[cloud-name]/image/upload/...`

---

## 💰 LÍMITES DEL PLAN GRATUITO

```
✅ Almacenamiento: 25 GB
✅ Transformaciones: 25 créditos/mes
✅ Ancho de banda: 25 GB/mes
✅ Imágenes: Ilimitadas
✅ CDN: Incluido
```

**Para CONERI:**
- 25 GB = ~25,000 imágenes de 1MB
- Más que suficiente para años de uso

---

## 🔄 MIGRAR IMÁGENES DE FIREBASE (Si ya tenías algunas)

Si ya habías subido imágenes a Firebase Storage antes:

1. Descárgalas manualmente
2. Súbelas a Cloudinary usando el widget
3. Actualiza las URLs en Firestore

O usa este script:
```javascript
// En la consola de admin.html
async function migrarImagenes() {
  const productos = await productosRef.get();

  productos.forEach(async (doc) => {
    const producto = doc.data();

    // Si tiene imágenes de Firebase, actualiza las URLs
    if (producto.imagenes && producto.imagenes[0].includes('firebasestorage')) {
      console.log('Producto con imágenes de Firebase:', producto.nombre);
      // Descarga y re-sube manualmente a Cloudinary
    }
  });
}
```

---

## 🎉 RESUMEN

**1. Crea cuenta en Cloudinary** (2 min)
   → https://cloudinary.com/users/register_free

**2. Crea upload preset** (1 min)
   → Settings → Upload → Add preset → Unsigned

**3. Configura el Cloud Name** (30 seg)
   → Edita `js/admin-cloudinary.js` línea 6

**4. Prueba** (1 min)
   → admin.html → Nuevo Producto → Subir Imágenes

**¡Listo! Sin pagar nada.** 🎉

---

## 📞 AYUDA

Si tienes problemas:
1. Verifica que el Cloud Name esté correcto
2. Verifica que el preset sea "Unsigned"
3. Abre la consola (F12) y busca errores
4. Revisa este documento paso a paso

**¡Cloudinary es más fácil que Firebase!** 🚀
