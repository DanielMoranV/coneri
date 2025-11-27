// Sistema de Administración - CRUD con Cloudinary
// Este archivo reemplaza las funciones de subida de imágenes para usar Cloudinary

// ==================== CONFIGURACIÓN ====================

// ⚠️ IMPORTANTE: Reemplaza estos valores con los de tu cuenta Cloudinary
const CLOUDINARY_CLOUD_NAME = "duzzxgbxa"; // Ejemplo: 'coneri' o 'dxxxx'
const CLOUDINARY_UPLOAD_PRESET = "coneri_productos"; // El preset que creaste

// ==================== WIDGETS DE CLOUDINARY ====================

let widgetProyecto = null;
let widgetProducto = null;

/**
 * Inicializar widgets de Cloudinary
 */
function inicializarCloudinaryWidgets() {
  // Widget para proyectos
  widgetProyecto = cloudinary.createUploadWidget(
    {
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      sources: ["local", "url", "camera"],
      multiple: true,
      maxFiles: 10,
      maxFileSize: 5000000,
      clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
      folder: "coneri/proyectos",
      language: "es",
      text: {
        es: {
          local: {
            dd_title_multi: "Arrastra imágenes del proyecto aquí",
          },
        },
      },
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        imagenesTemporales.push(result.info.secure_url);
        mostrarPreviewImagenes(imagenesTemporales, "preview-imagenes-proyecto");
        mostrarNotificacion("Imagen subida correctamente", "success");
      }
      if (error) {
        console.error("Error Cloudinary:", error);
        mostrarNotificacion("Error al subir imagen", "danger");
      }
    }
  );

  // Widget para productos
  widgetProducto = cloudinary.createUploadWidget(
    {
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      sources: ["local", "url", "camera"],
      multiple: true,
      maxFiles: 10,
      maxFileSize: 5000000,
      clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
      folder: "coneri/productos",
      language: "es",
      text: {
        es: {
          local: {
            dd_title_multi: "Arrastra imágenes del producto aquí",
          },
        },
      },
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        imagenesTemporales.push(result.info.secure_url);
        mostrarPreviewImagenes(imagenesTemporales, "preview-imagenes-producto");
        mostrarNotificacion("Imagen subida correctamente", "success");
      }
      if (error) {
        console.error("Error Cloudinary:", error);
        mostrarNotificacion("Error al subir imagen", "danger");
      }
    }
  );
}

/**
 * Abrir widget de Cloudinary según el tipo
 */
function abrirCloudinaryWidget(tipo) {
  if (tipo === "proyecto") {
    if (!widgetProyecto) inicializarCloudinaryWidgets();
    widgetProyecto.open();
  } else if (tipo === "producto") {
    if (!widgetProducto) inicializarCloudinaryWidgets();
    widgetProducto.open();
  }
}

// ==================== ELIMINACIÓN DE IMÁGENES ====================

/**
 * Extraer public_id de una URL de Cloudinary
 * @param {string} url - URL completa de Cloudinary
 * @returns {string|null} - public_id o null si no es válida
 */
function extraerPublicIdDeUrl(url) {
  try {
    if (!url.includes("res.cloudinary.com")) {
      return null;
    }

    // Formato: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{format}
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;
    const match = url.match(regex);

    return match && match[1] ? match[1] : null;
  } catch (error) {
    console.error("Error al extraer public_id:", error);
    return null;
  }
}

/**
 * Eliminar una imagen de Cloudinary usando Firebase Cloud Function
 * @param {string} url - URL de la imagen a eliminar
 * @returns {Promise<boolean>} - true si se eliminó exitosamente
 */
async function eliminarImagenCloudinary(url) {
  try {
    if (!url || !url.includes("res.cloudinary.com")) {
      console.warn("URL no válida o no es de Cloudinary:", url);
      return false;
    }

    // Llamar a la Cloud Function
    const eliminarFuncion = firebase
      .functions()
      .httpsCallable("eliminarImagenCloudinary");

    const resultado = await eliminarFuncion({ url });

    if (resultado.data.success) {
      console.log("✅ Imagen eliminada de Cloudinary:", resultado.data.publicId);
      return true;
    } else {
      console.error("❌ Error al eliminar imagen:", resultado.data);
      return false;
    }
  } catch (error) {
    console.error("❌ Error al eliminar imagen de Cloudinary:", error);
    return false;
  }
}

/**
 * Eliminar múltiples imágenes de Cloudinary usando Firebase Cloud Function
 * @param {string[]} urls - Array de URLs de imágenes a eliminar
 * @returns {Promise<object>} - Resultado con estadísticas de eliminación
 */
async function eliminarImagenesCloudinary(urls) {
  try {
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      console.warn("No hay URLs para eliminar");
      return { success: false, exitosas: 0, fallidas: 0 };
    }

    // Filtrar solo URLs de Cloudinary
    const urlsCloudinary = urls.filter((url) =>
      url.includes("res.cloudinary.com")
    );

    if (urlsCloudinary.length === 0) {
      console.warn("No hay URLs de Cloudinary para eliminar");
      return { success: true, exitosas: 0, fallidas: 0 };
    }

    console.log(
      `🗑️ Eliminando ${urlsCloudinary.length} imágenes de Cloudinary...`
    );

    // Llamar a la Cloud Function
    const eliminarFuncion = firebase
      .functions()
      .httpsCallable("eliminarImagenesCloudinary");

    const resultado = await eliminarFuncion({ urls: urlsCloudinary });

    if (resultado.data.success) {
      console.log(
        `✅ Eliminación completada: ${resultado.data.exitosas} exitosas, ${resultado.data.fallidas} fallidas`
      );
      return resultado.data;
    } else {
      console.error("❌ Error al eliminar imágenes:", resultado.data);
      return { success: false, exitosas: 0, fallidas: urls.length };
    }
  } catch (error) {
    console.error("❌ Error al eliminar imágenes de Cloudinary:", error);
    return { success: false, exitosas: 0, fallidas: urls.length };
  }
}

// Inicializar widgets cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  // Inicializar widgets al cargar
  setTimeout(inicializarCloudinaryWidgets, 1000);
});
