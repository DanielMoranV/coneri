# ⚡ CONERI - Sistema Web de Energía Solar

Sistema web completo para la empresa CONERI, especializada en soluciones de energía solar en Perú. Incluye catálogo de productos, gestión de proyectos y panel de administración.

---

## 🌟 Características Principales

✅ **Catálogo de Productos Dinámico**
- Gestión completa de productos fotovoltaicos
- Sistema de filtros por categorías
- Carrito de cotización integrado
- Envío automático por WhatsApp

✅ **Portafolio de Proyectos**
- Galería dinámica de proyectos realizados
- Carga automática desde Firebase
- Imágenes optimizadas con Cloudinary

✅ **Panel de Administración**
- Autenticación segura con Firebase Auth
- CRUD completo de productos y proyectos
- Subida de imágenes con preview
- Gestión de categorías y especificaciones

✅ **Optimizado para Móviles**
- Diseño 100% responsive
- Interfaz adaptativa
- Experiencia de usuario optimizada

---

## 📚 Documentación

Toda la documentación del proyecto está organizada en la carpeta `docs/`:

### 📖 [Ver Documentación Completa](./docs/README.md)

**Accesos rápidos:**
- [🎯 Documentación Principal](./docs/DOCUMENTACION.md)
- [🔧 Guías de Configuración](./docs/configuracion/)
- [🚀 Instrucciones de Deploy](./docs/deployment/INSTRUCCIONES_DEPLOY.md)
- [💻 Guía de Desarrollo](./docs/desarrollo/GUIA_NUEVAS_FUNCIONALIDADES.md)
- [🔧 Solución de Problemas](./docs/solucion-problemas/)

---

## 🚀 Inicio Rápido

### **1. Clonar el Repositorio**
```bash
git clone [URL_DEL_REPOSITORIO]
cd coneri-1
```

### **2. Configurar Firebase**
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Iniciar sesión
firebase login

# Seleccionar proyecto
firebase use proyecto-coneri
```

### **3. Configurar Credenciales**
- Actualizar `js/firebase-config.js` con tus credenciales de Firebase
- (Opcional) Actualizar `js/cloudinary-config.js` si usas Cloudinary

### **4. Desplegar**
```bash
firebase deploy
```

📖 **Instrucciones detalladas:** [Ver Guía de Deploy](./docs/deployment/INSTRUCCIONES_DEPLOY.md)

---

## 🛠️ Tecnologías

| Categoría | Tecnologías |
|-----------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla) |
| **Backend** | Firebase (Firestore, Storage, Auth, Functions) |
| **CDN Imágenes** | Cloudinary |
| **Framework CSS** | Bootstrap 5 |
| **Animaciones** | WOW.js, Animate.css |
| **Iconos** | Font Awesome 6 |

---

## 📁 Estructura del Proyecto

```
coneri-1/
├── docs/                     # 📚 Documentación completa
├── js/                       # 📜 JavaScript
│   ├── firebase-config.js
│   ├── admin.js
│   ├── productos.js
│   ├── proyectos.js
│   ├── carrito.js
│   └── cloudinary-config.js
├── functions/                # ☁️ Cloud Functions
├── css/                      # 🎨 Estilos
├── img/                      # 🖼️ Imágenes
├── index.html               # 🏠 Página principal
├── admin.html               # 🔐 Panel admin
├── catalogo.html            # 🛒 Catálogo
├── project.html             # 📁 Proyectos
└── firebase.json            # ⚙️ Config Firebase
```

---

## 🌐 Páginas del Sitio

| Página | Descripción | Archivo |
|--------|-------------|---------|
| **Inicio** | Landing page con hero, servicios y contacto | `index.html` |
| **Nosotros** | Información de la empresa | `about.html` |
| **Servicios** | Servicios ofrecidos | `service.html` |
| **Proyectos** | Portafolio de proyectos realizados | `project.html` |
| **Catálogo** | Productos disponibles | `catalogo.html` |
| **Carrito** | Cotización de productos | `carrito.html` |
| **Contacto** | Formulario de contacto | `contact.html` |
| **Admin** | Panel de administración | `admin.html` |

---

## 🔐 Acceso al Panel de Administración

1. Ir a: `https://tu-sitio.web.app/admin.html`
2. Iniciar sesión con credenciales de Firebase Auth
3. Gestionar productos y proyectos

📖 **Más información:** [Documentación Principal](./docs/DOCUMENTACION.md)

---

## 📞 Contacto

**CONERI - Energía Solar en Perú**
- 📱 WhatsApp: +51 941 830 829
- 🌐 Web: [coneri.pe](https://coneri.pe)
- 📧 Email: contacto@coneri.pe
- 📍 Ubicación: Piura, Perú

---

## 🤝 Soporte

¿Problemas o preguntas?
1. Revisa la [Documentación](./docs/README.md)
2. Consulta [Solución de Problemas](./docs/solucion-problemas/)
3. Contacta al equipo de desarrollo

---

## 📝 Licencia

© 2024 CONERI. Todos los derechos reservados.

---

**Última actualización:** 2024-11-27
