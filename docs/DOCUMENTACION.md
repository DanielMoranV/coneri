# 📚 Documentación del Sistema de Gestión Dinámica - CONERI

## 🎯 Resumen del Sistema

Se ha implementado un sistema completo de gestión dinámica para el sitio web de CONERI que permite:

- ✅ **Agregar proyectos dinámicamente** con imágenes y descripción
- ✅ **Gestionar catálogo de productos** con especificaciones técnicas y precios
- ✅ **Panel de administración** protegido con autenticación
- ✅ **Subida de imágenes** a Firebase Storage
- ✅ **Carga automática** de contenido desde Firestore

---

## 📁 Estructura de Archivos Creados/Modificados

### Nuevos Archivos JavaScript
```
js/
├── firebase-config.js      # Configuración centralizada de Firebase
├── proyectos.js            # Gestión dinámica de proyectos
├── productos.js            # Gestión dinámica de productos
└── admin.js                # Lógica del panel de administración
```

### Nuevas Páginas HTML
```
admin.html              # Panel de administración
catalogo.html          # Catálogo de productos
migration-data.html    # Herramienta de migración de datos
```

### Archivos de Configuración
```
firestore.rules        # Reglas de seguridad de Firestore
storage.rules          # Reglas de seguridad de Storage
```

### Páginas Modificadas
```
index.html             # Navegación actualizada
about.html             # Navegación actualizada
service.html           # Navegación actualizada
project.html           # Carga dinámica de proyectos
contact.html           # Navegación actualizada
```

---

## 🚀 Configuración Inicial

### Paso 1: Configurar Firebase Authentication

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **proyecto-coneri**
3. En el menú lateral, ve a **Authentication**
4. Haz clic en **Get Started** (si no está activado)
5. En la pestaña **Sign-in method**, habilita **Email/Password**
6. En la pestaña **Users**, haz clic en **Add User**
7. Crea tu usuario administrador:
   - Email: `tu-email@ejemplo.com`
   - Contraseña: `tu-contraseña-segura`

### Paso 2: Configurar Reglas de Seguridad

#### Firestore Rules:
1. Ve a **Firestore Database** > **Rules**
2. Copia el contenido de `firestore.rules`
3. Haz clic en **Publish**

#### Storage Rules:
1. Ve a **Storage** > **Rules**
2. Copia el contenido de `storage.rules`
3. Haz clic en **Publish**

### Paso 3: Migrar Datos Existentes

1. Abre en tu navegador: `https://coneri.pe/migration-data.html`
2. Haz clic en **"Migrar Proyectos"** para migrar los 3 proyectos existentes
3. Haz clic en **"Agregar Productos de Ejemplo"** para agregar productos de prueba

---

## 🎨 Uso del Panel de Administración

### Acceso al Panel
1. Ve a: `https://coneri.pe/admin.html`
2. Inicia sesión con el usuario creado en Firebase Authentication

### Gestión de Proyectos

#### Agregar Nuevo Proyecto
1. En el panel de admin, ve a la pestaña **Proyectos**
2. Haz clic en **"Nuevo Proyecto"**
3. Completa el formulario:
   - **Título**: Nombre del proyecto
   - **Descripción**: Descripción detallada
   - **Categoría**:
     - "Proyectos Culminados" (aparecerá en filtro)
     - "Proyectos en Marcha" (aparecerá en filtro)
   - **Ubicación**: Ciudad/Zona del proyecto
   - **Cliente**: Nombre del cliente (opcional)
   - **Imágenes**: Haz clic en "Subir Imágenes" (múltiples permitidas)
   - **Activo**: Marca para mostrar en el sitio web
4. Haz clic en **"Guardar Proyecto"**

#### Editar Proyecto
1. En la lista de proyectos, haz clic en el botón **✏️ Editar**
2. Modifica los campos necesarios
3. Puedes agregar/eliminar imágenes
4. Haz clic en **"Guardar Proyecto"**

#### Eliminar Proyecto
1. En la lista de proyectos, haz clic en el botón **🗑️ Eliminar**
2. Confirma la eliminación

### Gestión de Productos

#### Agregar Nuevo Producto
1. En el panel de admin, ve a la pestaña **Productos**
2. Haz clic en **"Nuevo Producto"**
3. Completa el formulario:
   - **Nombre**: Nombre del producto
   - **Descripción**: Descripción detallada
   - **Categoría**:
     - Paneles Solares
     - Inversores
     - Baterías
     - Estructuras
     - Cables y Conectores
     - Bombas Solares
     - Accesorios
     - General
   - **Precio**: Precio en soles (opcional)
   - **Orden**: Número para ordenar productos (menor = aparece primero)
   - **Especificaciones Técnicas**:
     - Haz clic en "Agregar Especificación"
     - Ejemplo: Potencia = 450W
   - **Imágenes**: Subir una o más imágenes
   - **Activo**: Marca para mostrar en el catálogo
4. Haz clic en **"Guardar Producto"**

#### Editar Producto
1. En la lista de productos, haz clic en el botón **✏️ Editar**
2. Modifica los campos necesarios
3. Haz clic en **"Guardar Producto"**

#### Eliminar Producto
1. En la lista de productos, haz clic en el botón **🗑️ Eliminar**
2. Confirma la eliminación

---

## 📂 Estructura de Datos en Firestore

### Colección: `proyectos`
```javascript
{
  titulo: String,              // "Sistema Solar Palo Blanco"
  descripcion: String,         // Descripción detallada
  categoria: String,           // "first" | "second"
  ubicacion: String,           // "Palo Blanco, Chulucanas"
  cliente: String,             // "Cliente ABC" (opcional)
  activo: Boolean,             // true | false
  fecha: Timestamp,            // Fecha de creación
  imagenes: Array<String>      // URLs de imágenes en Storage
}
```

### Colección: `productos`
```javascript
{
  nombre: String,              // "Panel Solar 450W"
  descripcion: String,         // Descripción detallada
  categoria: String,           // "paneles" | "inversores" | etc.
  precio: Number,              // 450.00 (opcional)
  orden: Number,               // 1, 2, 3... (para ordenar)
  activo: Boolean,             // true | false
  imagenes: Array<String>,     // URLs de imágenes
  especificaciones: Object     // { "Potencia": "450W", ... }
}
```

---

## 🖼️ Gestión de Imágenes

### Formatos Aceptados
- JPG, JPEG
- PNG
- WEBP

### Tamaño Máximo
- 5 MB por imagen

### Ubicación en Storage
```
proyecto/
├── [timestamp]_[random].jpg
└── [timestamp]_[random].webp

producto/
├── [timestamp]_[random].jpg
└── [timestamp]_[random].png
```

### Mejores Prácticas
1. **Optimiza las imágenes** antes de subirlas (usa TinyPNG, Squoosh, etc.)
2. **Dimensiones recomendadas**:
   - Proyectos: 1200x800 px
   - Productos: 800x600 px
3. **Formato recomendado**: WEBP (menor peso, buena calidad)
4. **Nombres descriptivos**: Ayudan a identificar las imágenes

---

## 🔒 Seguridad

### Acceso al Panel de Administración
- Solo usuarios autenticados en Firebase pueden acceder
- No hay registro público, los usuarios deben ser creados desde Firebase Console

### Lectura Pública
- Los visitantes pueden ver proyectos y productos marcados como "activos"
- Los items inactivos NO son visibles públicamente

### Escritura Protegida
- Solo usuarios autenticados pueden crear, editar y eliminar
- Las reglas de Firestore y Storage protegen los datos

---

## 🎨 Personalización

### Cambiar Colores del Panel de Admin
En `admin.html`, modifica los estilos CSS:
```css
.admin-header {
    background: linear-gradient(to right, #TU_COLOR_1, #TU_COLOR_2);
}
```

### Agregar Nuevas Categorías de Productos
1. Edita `admin.html` línea 455:
```html
<option value="tu-categoria">Tu Categoría</option>
```

2. Edita `catalogo.html` línea 220:
```html
<li class="mx-2" data-filter=".tu-categoria">Tu Categoría</li>
```

3. Edita `js/productos.js` función `formatearCategoria()`:
```javascript
'tu-categoria': 'Tu Categoría'
```

---

## 🐛 Solución de Problemas

### Los proyectos no se muestran en project.html

**Posibles causas:**
1. Firestore no está habilitado en Firebase
2. Las reglas de seguridad están mal configuradas
3. No hay proyectos con `activo: true`

**Solución:**
- Verifica la consola del navegador (F12)
- Asegúrate de que Firestore esté habilitado
- Verifica que existan proyectos activos

### No puedo iniciar sesión en el panel de admin

**Posibles causas:**
1. Firebase Authentication no está habilitado
2. Usuario no existe en Firebase
3. Contraseña incorrecta

**Solución:**
- Ve a Firebase Console > Authentication
- Verifica que Email/Password esté habilitado
- Verifica que el usuario exista

### Las imágenes no se suben

**Posibles causas:**
1. Firebase Storage no está habilitado
2. Las reglas de Storage están mal configuradas
3. Imagen muy grande (>5MB)
4. Formato no soportado

**Solución:**
- Verifica Firebase Console > Storage
- Revisa las reglas de Storage
- Reduce el tamaño de la imagen
- Usa formatos JPG, PNG o WEBP

### Error: "Permission denied"

**Causa:** Las reglas de seguridad están bloqueando la operación

**Solución:**
- Verifica que las reglas de `firestore.rules` y `storage.rules` estén publicadas
- Asegúrate de estar autenticado para operaciones de escritura

---

## 📊 Monitoreo y Analytics

### Ver Estadísticas de Uso
1. Ve a Firebase Console
2. **Firestore Database** > **Usage**: Ver lecturas/escrituras
3. **Storage** > **Usage**: Ver almacenamiento utilizado
4. **Authentication** > **Users**: Ver usuarios registrados

### Límites del Plan Gratuito (Spark)
- **Firestore**: 50,000 lecturas/día, 20,000 escrituras/día
- **Storage**: 5GB almacenamiento, 1GB descarga/día
- **Authentication**: Ilimitado

---

## 🔄 Mantenimiento

### Backup de Datos
Firebase hace backups automáticos, pero puedes exportar manualmente:
1. Ve a Firestore Database
2. Haz clic en los tres puntos (...) al lado de cada colección
3. Selecciona "Export collection"

### Actualizar Firebase SDK
Si quieres actualizar a una versión más reciente de Firebase:
1. Cambia la versión en los scripts de `admin.html`, `project.html`, `catalogo.html`
2. Ejemplo: De `8.10.1` a `9.x.x`
3. **Nota**: Firebase v9 tiene sintaxis diferente (modular)

---

## 📞 Soporte

### Recursos Útiles
- [Documentación Firebase](https://firebase.google.com/docs)
- [Firestore Guías](https://firebase.google.com/docs/firestore)
- [Storage Guías](https://firebase.google.com/docs/storage)

### Contacto
Para soporte técnico del sitio CONERI:
- Email: coneri.eirl@gmail.com
- WhatsApp: +51 941830829

---

## ✅ Checklist de Implementación

- [x] Configuración de Firebase (Firestore, Storage, Authentication)
- [x] Creación de scripts JavaScript
- [x] Panel de administración
- [x] Página de catálogo
- [x] Actualización de navegación
- [x] Reglas de seguridad
- [ ] Crear usuario administrador en Firebase
- [ ] Publicar reglas de seguridad
- [ ] Migrar datos existentes
- [ ] Probar funcionalidades
- [ ] Optimizar imágenes
- [ ] Deploy a producción

---

## 🎉 ¡Listo!

Tu sitio web CONERI ahora tiene un sistema completo de gestión dinámica. Puedes agregar, editar y eliminar proyectos y productos desde el panel de administración sin necesidad de tocar el código HTML.

**¡Disfruta de tu nuevo sistema!** 🚀
