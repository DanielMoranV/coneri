# 📚 Documentación CONERI

Bienvenido a la documentación del sistema web de CONERI. Aquí encontrarás toda la información necesaria para configurar, desarrollar y desplegar el proyecto.

---

## 📖 Índice General

### 🎯 [Documentación Principal](./DOCUMENTACION.md)
Visión general del sistema, arquitectura y resumen de funcionalidades implementadas.

---

## 📂 Secciones de Documentación

### 🔧 Configuración
Guías paso a paso para configurar servicios externos y dependencias del proyecto.

- **[Alternativas de Storage](./configuracion/ALTERNATIVAS_STORAGE.md)**
  - Comparación de opciones para almacenamiento de archivos
  - Pros y contras de cada alternativa
  - Recomendaciones según caso de uso

- **[Configurar Cloudinary](./configuracion/CONFIGURAR_CLOUDINARY.md)**
  - Instalación y configuración inicial de Cloudinary
  - Integración con el panel de administración
  - Gestión de imágenes de productos y proyectos

- **[Configurar Eliminación en Cloudinary](./configuracion/CONFIGURAR_ELIMINACION_CLOUDINARY.md)**
  - Implementación de eliminación automática de imágenes
  - Sincronización con Firebase
  - Prevención de archivos huérfanos

- **[Crear Índices en Firebase](./configuracion/CREAR_INDICES_FIREBASE.md)**
  - Configuración de índices para Firestore
  - Optimización de consultas
  - Comandos necesarios

---

### 🚀 Deployment
Instrucciones para desplegar el proyecto en producción.

- **[Instrucciones de Deploy](./deployment/INSTRUCCIONES_DEPLOY.md)**
  - Despliegue a Firebase Hosting
  - Configuración de dominio personalizado
  - Actualización de archivos
  - Troubleshooting común

---

### 💻 Desarrollo
Guías para desarrolladores sobre las funcionalidades del sistema.

- **[Guía de Nuevas Funcionalidades](./desarrollo/GUIA_NUEVAS_FUNCIONALIDADES.md)**
  - Sistema de carrito de compras
  - Integración con WhatsApp
  - Gestión dinámica de contenido
  - Persistencia de datos
  - Cómo extender el sistema

---

### 🔧 Solución de Problemas
Problemas comunes y sus soluciones.

- **[Solución Error CORS](./solucion-problemas/SOLUCION_ERROR_CORS.md)**
  - Problemas de CORS en Firebase Storage
  - Configuración correcta de CORS
  - Comandos para aplicar configuración
  - Verificación de la solución

---

### 🧹 Mantenimiento
Scripts y guías para mantener el proyecto optimizado.

- **[Limpiar Imágenes Huérfanas](./mantenimiento/LIMPIAR_IMAGENES_HUERFANAS.md)**
  - Script local para limpiar imágenes no usadas en Cloudinary
  - Identificar imágenes huérfanas automáticamente
  - Liberar espacio y optimizar storage
  - Alternativa gratuita a Cloud Functions

---

## 🗂️ Estructura del Proyecto

```
coneri-1/
├── docs/                          # 📚 Documentación
│   ├── README.md                 # Este archivo
│   ├── DOCUMENTACION.md          # Documentación principal
│   ├── configuracion/            # Guías de configuración
│   ├── deployment/               # Instrucciones de despliegue
│   ├── desarrollo/               # Guías para desarrolladores
│   └── solucion-problemas/       # Troubleshooting
│
├── js/                           # 📜 JavaScript
│   ├── firebase-config.js        # Configuración de Firebase
│   ├── admin.js                  # Panel de administración
│   ├── productos.js              # Gestión de productos
│   ├── proyectos.js              # Gestión de proyectos
│   ├── carrito.js                # Sistema de carrito
│   └── cloudinary-config.js      # Configuración de Cloudinary
│
├── functions/                    # ☁️ Cloud Functions
│   └── index.js                  # Funciones serverless
│
├── *.html                        # 📄 Páginas HTML
├── css/                          # 🎨 Estilos
├── img/                          # 🖼️ Imágenes
└── firebase.json                 # ⚙️ Configuración de Firebase
```

---

## 🚀 Inicio Rápido

### 1. **Clonar y Configurar**
```bash
git clone [URL_DEL_REPOSITORIO]
cd coneri-1
```

### 2. **Configurar Firebase**
- Seguir [Crear Índices en Firebase](./configuracion/CREAR_INDICES_FIREBASE.md)
- Configurar credenciales en `js/firebase-config.js`

### 3. **Configurar Cloudinary** (Opcional)
- Seguir [Configurar Cloudinary](./configuracion/CONFIGURAR_CLOUDINARY.md)
- Actualizar credenciales en `js/cloudinary-config.js`

### 4. **Desplegar**
- Seguir [Instrucciones de Deploy](./deployment/INSTRUCCIONES_DEPLOY.md)

---

## 📌 Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Firebase (Firestore, Storage, Hosting, Functions)
- **CDN de Imágenes:** Cloudinary
- **Framework CSS:** Bootstrap 5
- **Animaciones:** WOW.js, Animate.css
- **Iconos:** Font Awesome 6

---

## 🤝 Soporte

Si encuentras algún problema o tienes preguntas:
1. Revisa la sección de [Solución de Problemas](./solucion-problemas/)
2. Consulta la [Documentación Principal](./DOCUMENTACION.md)
3. Contacta al equipo de desarrollo

---

## 📝 Notas

- Esta documentación está en constante actualización
- Todas las guías están probadas y validadas
- Se recomienda seguir las instrucciones en orden
- Revisa siempre la versión más reciente de los archivos de configuración

---

**Última actualización:** 2024-11-27
**Versión:** 2.0
