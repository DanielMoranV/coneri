# 🚀 Guía de Nuevas Funcionalidades - CONERI

## ✅ Funcionalidades Implementadas

### 1. 🛒 **Sistema de Carrito de Compras**

#### **Características:**
- Agregar productos al carrito desde el catálogo
- Ver productos en el carrito con imágenes y especificaciones
- Aumentar/disminuir cantidades
- Eliminar productos individuales
- Vaciar carrito completo
- Persistencia con LocalStorage (no se pierde al recargar)
- Contador de productos en la navegación

#### **Cómo usar:**
1. Ve a **Catálogo** (catalogo.html)
2. Haz clic en **"Agregar"** en cualquier producto
3. El contador del carrito se actualizará automáticamente
4. Haz clic en **"Carrito"** en la navegación para ver tus productos
5. Ajusta cantidades o elimina productos según necesites

#### **Archivos creados:**
- `js/carrito.js` - Lógica del carrito
- `carrito.html` - Página del carrito

---

### 2. 📱 **Integración con WhatsApp**

#### **Características:**
- Botón "Solicitar Cotización por WhatsApp" en el carrito
- Mensaje automático formateado con:
  - Lista de productos seleccionados
  - Cantidades de cada producto
  - Precios (si están disponibles)
  - Especificaciones técnicas clave
  - Total estimado
- Se abre WhatsApp Web o la app en móvil

#### **Cómo usar:**
1. Agrega productos al carrito
2. Ve a la página del **Carrito**
3. Revisa tu selección
4. Haz clic en **"Solicitar Cotización por WhatsApp"**
5. Se abrirá WhatsApp con el mensaje pre-formateado
6. Solo presiona "Enviar"

#### **Número de WhatsApp configurado:**
- +51 941830829

#### **Formato del mensaje:**
```
🛒 *Solicitud de Cotización - CONERI*

📋 *Productos seleccionados:*

1. *Panel Solar 450W*
   Cantidad: 2
   Precio unit.: S/ 450.00
   Potencia: 450W
   Tipo: Monocristalino

2. *Inversor Híbrido 5kW*
   Cantidad: 1
   Precio unit.: S/ 2,500.00
   Potencia: 5000W

💰 *Total estimado:* S/ 3,400.00

¿Podrían enviarme una cotización detallada?

¡Gracias!
```

---

### 3. 📄 **Página de Detalle de Proyectos**

#### **Características:**
- Vista completa de cada proyecto
- Galería de imágenes con thumbnails
- Información detallada:
  - Título y descripción completa
  - Estado (Culminado/En Marcha)
  - Ubicación
  - Cliente
  - Fecha de realización
- Integración con Lightbox para ver imágenes en grande
- Botones de acción (Solicitar Información, Ver Más Proyectos)

#### **Cómo acceder:**
1. Ve a **Proyectos** (project.html)
2. Haz clic en el icono de **enlace** en cualquier proyecto
3. Se abrirá la página de detalle del proyecto

#### **Archivos creados:**
- `project-detail.html` - Página de detalle

---

## 🔑 **Acceso al Panel de Administrador**

### **Paso 1: Crear Usuario en Firebase**

1. Ve a: https://console.firebase.google.com/
2. Inicia sesión con tu cuenta de Google
3. Selecciona el proyecto: **"proyecto-coneri"**
4. En el menú lateral → **Authentication**
5. Si no está activado, haz clic en **"Get Started"**
6. Pestaña **"Sign-in method"**:
   - Haz clic en **"Email/Password"**
   - Activa el toggle (debe quedar en azul)
   - Guarda los cambios
7. Pestaña **"Users"**:
   - Haz clic en **"Add User"**
   - Email: `admin@coneri.pe` (o el que prefieras)
   - Password: Elige una contraseña segura
   - Haz clic en **"Add User"**

### **Paso 2: Ingresar al Panel**

1. Ve a: https://coneri.pe/admin.html
2. Ingresa las credenciales que creaste:
   - Email: `admin@coneri.pe`
   - Password: (la que configuraste)
3. Haz clic en **"Iniciar Sesión"**

### **¿Olvidaste tu contraseña?**

Si necesitas resetear la contraseña:
1. Ve a Firebase Console → Authentication → Users
2. Encuentra tu usuario
3. Haz clic en los tres puntos → **"Reset password"**
4. Sigue las instrucciones

---

## 📱 **Flujo Completo del Usuario**

### **Para Clientes (Vista Pública):**

1. **Explorar Catálogo**:
   - Navegar por categorías
   - Buscar productos
   - Ver detalles y especificaciones

2. **Agregar al Carrito**:
   - Hacer clic en "Agregar"
   - Ver contador actualizado
   - Continuar comprando o ir al carrito

3. **Solicitar Cotización**:
   - Revisar productos en el carrito
   - Ajustar cantidades
   - Hacer clic en "Solicitar Cotización por WhatsApp"
   - Enviar mensaje a CONERI

4. **Ver Proyectos**:
   - Explorar proyectos realizados
   - Hacer clic para ver detalle completo
   - Ver galería de fotos
   - Solicitar información sobre proyectos similares

### **Para Administradores:**

1. **Gestionar Productos**:
   - Agregar nuevos productos con fotos
   - Editar precios y especificaciones
   - Activar/desactivar productos
   - Organizar por categorías

2. **Gestionar Proyectos**:
   - Publicar nuevos proyectos
   - Subir fotos del proceso
   - Actualizar información
   - Marcar como culminado o en marcha

---

## 🎨 **Personalizaciones Disponibles**

### **Cambiar Número de WhatsApp:**
Edita `js/carrito.js` línea 147:
```javascript
const telefono = '51941830829'; // Cambia este número
```

### **Cambiar Categorías de Productos:**
Edita `admin.html` líneas 380-389 y `catalogo.html` líneas 216-223

### **Cambiar Colores:**
Edita los archivos CSS o las secciones `<style>` en cada HTML

---

## 🐛 **Solución de Problemas**

### **El carrito no se muestra:**
- Verifica que `js/carrito.js` esté incluido en la página
- Abre la consola del navegador (F12) y busca errores
- Limpia el caché del navegador

### **WhatsApp no se abre:**
- Verifica el número de teléfono en `js/carrito.js`
- Asegúrate de tener WhatsApp instalado o usar WhatsApp Web

### **No puedo iniciar sesión en el admin:**
- Verifica que creaste el usuario en Firebase Authentication
- Verifica que Email/Password esté habilitado en Firebase
- Verifica tu conexión a internet

### **Los productos no se muestran:**
- Verifica que Firebase esté configurado correctamente
- Verifica que haya productos con `activo: true`
- Abre la consola y busca errores

---

## 📊 **Estadísticas y Monitoreo**

### **Ver uso del carrito:**
El carrito usa LocalStorage del navegador. Para ver datos guardados:
1. Abre Developer Tools (F12)
2. Pestaña "Application" o "Almacenamiento"
3. LocalStorage → Busca: `coneri_carrito`

### **Analíticas (Opcional):**
Si quieres rastrear conversiones de WhatsApp:
- Usa Google Analytics
- Configura eventos personalizados
- Rastrea clics en el botón de WhatsApp

---

## 🔄 **Próximas Mejoras Sugeridas**

1. **Sistema de Favoritos**: Guardar productos para revisar después
2. **Comparador de Productos**: Comparar especificaciones lado a lado
3. **Calculadora Solar**: Estimar necesidades energéticas
4. **Blog**: Artículos sobre energía solar
5. **Testimonio de Clientes**: Reviews y calificaciones
6. **Chat en Vivo**: Soporte en tiempo real
7. **PDF de Cotización**: Generar PDF descargable

---

## 📞 **Soporte Técnico**

**Desarrollado por:** Daniel Moran
- LinkedIn: https://www.linkedin.com/in/danielmoranv/
- Email: coneri.eirl@gmail.com

**Recursos:**
- Documentación Firebase: https://firebase.google.com/docs
- Bootstrap 5: https://getbootstrap.com/docs/5.0
- Font Awesome Icons: https://fontawesome.com/icons

---

## ✅ **Checklist de Implementación**

- [x] Sistema de carrito implementado
- [x] Integración con WhatsApp
- [x] Página de detalle de proyectos
- [x] Botón "Agregar al Carrito" en productos
- [x] Contador de carrito en navegación
- [x] LocalStorage para persistencia
- [x] Mensajes formateados para WhatsApp
- [x] Galería de imágenes en proyectos
- [ ] Crear usuario administrador en Firebase (¡Hazlo ahora!)
- [ ] Probar todas las funcionalidades
- [ ] Agregar productos de prueba
- [ ] Agregar proyectos de prueba

---

**¡Disfruta de tu nueva plataforma mejorada!** 🎉
