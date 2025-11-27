# 🔧 Solución al Error de CORS en Firebase Storage

## 🚨 El Error

```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/...' from origin 'http://127.0.0.1:5500'
has been blocked by CORS policy
```

Este error ocurre porque Firebase Storage por defecto no permite solicitudes desde localhost.

---

## ✅ SOLUCIÓN RÁPIDA (Recomendada)

### **Opción 1: Configurar CORS con Google Cloud SDK**

#### **Paso 1: Instalar Google Cloud SDK**

1. **Descarga el instalador**:
   - Windows: https://cloud.google.com/sdk/docs/install#windows
   - Ejecuta el instalador: `GoogleCloudSDKInstaller.exe`

2. **Instala con las opciones predeterminadas**

3. **Reinicia tu terminal/PowerShell**

#### **Paso 2: Autenticarte**

```bash
# Abre PowerShell como Administrador
gcloud auth login
```

Se abrirá tu navegador para autenticarte con tu cuenta de Google.

#### **Paso 3: Configurar el Proyecto**

```bash
# Configura tu proyecto de Firebase
gcloud config set project proyecto-coneri
```

#### **Paso 4: Aplicar Configuración CORS**

```bash
# Navega a tu carpeta del proyecto
cd C:\Users\Daniel\Desktop\DesarrolloWeb\coneri-1

# Aplica CORS
gsutil cors set cors.json gs://proyecto-coneri.appspot.com
```

#### **Paso 5: Verificar**

```bash
# Verifica que se aplicó correctamente
gsutil cors get gs://proyecto-coneri.appspot.com
```

Deberías ver algo como:
```json
[{"origin": ["*"], "method": ["GET", "POST", "PUT", "DELETE", "HEAD"], ...}]
```

#### **Paso 6: Prueba**

1. Refresca tu página de admin (`admin.html`)
2. Intenta subir una imagen
3. Debería funcionar sin errores de CORS

---

## ✅ SOLUCIÓN ALTERNATIVA (Sin instalar nada)

### **Opción 2: Usar Firebase Hosting (Producción)**

El error de CORS solo ocurre en **localhost**. Si despliegas tu sitio a Firebase Hosting, funcionará perfectamente.

#### **Desplegar a Firebase Hosting:**

1. **Instala Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Inicia sesión**:
   ```bash
   firebase login
   ```

3. **Inicializa tu proyecto**:
   ```bash
   cd C:\Users\Daniel\Desktop\DesarrolloWeb\coneri-1
   firebase init hosting
   ```
   - Selecciona: **proyecto-coneri**
   - Public directory: `.` (punto, la carpeta actual)
   - Configure as single-page app: **No**
   - Set up automatic builds: **No**

4. **Despliega**:
   ```bash
   firebase deploy --only hosting
   ```

5. **Accede a tu sitio**:
   ```
   https://proyecto-coneri.web.app
   ```

Ahora NO tendrás problemas de CORS porque el sitio está en el mismo dominio que Firebase.

---

## ✅ SOLUCIÓN TEMPORAL (Para desarrollo)

### **Opción 3: Usar una extensión de navegador**

**Solo para desarrollo, NO usar en producción:**

1. **Chrome**: Instala "CORS Unblock" o "Allow CORS"
   - https://chrome.google.com/webstore/search/cors

2. **Firefox**: Instala "CORS Everywhere"

3. **Activa la extensión** solo cuando estés desarrollando

4. **IMPORTANTE**: Desactívala cuando termines de desarrollar

---

## ✅ VERIFICAR REGLAS DE STORAGE

Asegúrate de que las reglas de Storage estén publicadas correctamente:

### **Paso 1: Ve a Firebase Console**

1. https://console.firebase.google.com/
2. Selecciona: **proyecto-coneri**
3. Ve a **Storage** → **Rules**

### **Paso 2: Verifica las Reglas**

Deberías tener algo como esto:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Reglas para imágenes de proyectos
    match /proyecto/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }

    // Reglas para imágenes de productos
    match /producto/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

### **Paso 3: Publicar Reglas**

Si las reglas no están publicadas:
1. Copia el contenido del archivo `storage.rules`
2. Pégalo en Firebase Console
3. Haz clic en **"Publish"**

---

## 🧪 PROBAR LA SOLUCIÓN

### **Test 1: Verificar Autenticación**

```javascript
// Abre la consola del navegador (F12) en admin.html
auth.onAuthStateChanged((user) => {
    console.log('Usuario:', user ? user.email : 'No autenticado');
});
```

Si muestra "No autenticado", primero inicia sesión.

### **Test 2: Intentar Subir Imagen**

1. Ve a `admin.html`
2. Inicia sesión
3. Crea un nuevo producto o proyecto
4. Intenta subir una imagen
5. Abre la consola (F12) y busca:
   - ✅ "Imagen subida: proyecto/..."
   - ❌ Errores de CORS

---

## 📊 COMPARACIÓN DE SOLUCIONES

| Solución | Dificultad | Tiempo | Permanente | Recomendada |
|----------|-----------|--------|------------|-------------|
| **Google Cloud SDK** | Media | 10 min | ✅ Sí | ⭐⭐⭐⭐⭐ |
| **Firebase Hosting** | Fácil | 5 min | ✅ Sí | ⭐⭐⭐⭐ |
| **Extensión Browser** | Muy Fácil | 1 min | ❌ No | ⭐⭐ (solo dev) |

---

## ❓ PREGUNTAS FRECUENTES

### **¿Por qué ocurre este error?**
Firebase Storage tiene políticas de seguridad que bloquean solicitudes desde orígenes no autorizados (como localhost).

### **¿Funcionará en producción?**
Sí, si usas Firebase Hosting o configuras CORS correctamente.

### **¿Es seguro permitir CORS desde cualquier origen (*)?**
- En **desarrollo**: Sí, está bien.
- En **producción**: Es mejor especificar solo tu dominio:
  ```json
  "origin": ["https://coneri.pe", "https://www.coneri.pe"]
  ```

### **¿Necesito hacer esto cada vez?**
No, solo una vez. La configuración CORS es permanente hasta que la cambies.

---

## 🆘 SI NADA FUNCIONA

### **Plan B: Verificar todo paso a paso**

1. **Verifica que estés autenticado**:
   ```javascript
   // En la consola de admin.html
   console.log('Auth:', firebase.auth().currentUser);
   ```

2. **Verifica las reglas de Storage**:
   - Firebase Console → Storage → Rules
   - Deben permitir `write: if request.auth != null`

3. **Verifica el bucket de Storage**:
   - Firebase Console → Storage
   - Debería ser: `proyecto-coneri.appspot.com`

4. **Limpia caché**:
   - Chrome: Ctrl + Shift + Delete → Borrar caché
   - Recarga la página: Ctrl + F5

5. **Prueba en modo incógnito**:
   - Abre admin.html en modo incógnito
   - Inicia sesión y prueba subir

---

## 📞 SOPORTE

Si después de probar todas las soluciones sigue sin funcionar:

1. **Verifica la consola** (F12) y copia todos los errores
2. **Verifica Firebase Console** → Storage → Files
3. **Verifica Firebase Console** → Storage → Rules

**Archivos importantes:**
- `cors.json` - Configuración CORS
- `storage.rules` - Reglas de seguridad
- `js/admin.js` - Código de subida (actualizado con mejor manejo de errores)

---

## ✅ RESUMEN

**La mejor solución es:**
1. Instalar Google Cloud SDK
2. Ejecutar `gsutil cors set cors.json gs://proyecto-coneri.appspot.com`
3. Recargar la página y probar

**O alternativamente:**
- Desplegar a Firebase Hosting y trabajar desde ahí

¡Buena suerte! 🚀
