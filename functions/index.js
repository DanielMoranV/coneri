/**
 * Firebase Cloud Functions para CONERI
 * Manejo de eliminación de imágenes en Cloudinary
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cloudinary = require('cloudinary').v2;

// Inicializar Firebase Admin
admin.initializeApp();

// Configurar Cloudinary con variables de entorno
cloudinary.config({
  cloud_name: functions.config().cloudinary.cloud_name,
  api_key: functions.config().cloudinary.api_key,
  api_secret: functions.config().cloudinary.api_secret
});

/**
 * Extraer public_id de una URL de Cloudinary
 * @param {string} url - URL completa de Cloudinary
 * @returns {string|null} - public_id o null si no es válida
 */
function extraerPublicId(url) {
  try {
    // Formato: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{format}
    // O: https://res.cloudinary.com/{cloud_name}/image/upload/{folder}/{public_id}.{format}

    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;
    const match = url.match(regex);

    if (match && match[1]) {
      return match[1];
    }

    return null;
  } catch (error) {
    console.error('Error al extraer public_id:', error);
    return null;
  }
}

/**
 * Función HTTP para eliminar una imagen de Cloudinary
 * @param {object} req - Request con { url: "https://..." } en el body
 * @param {object} res - Response
 */
exports.eliminarImagenCloudinary = functions.https.onCall(async (data, context) => {
  // Verificar autenticación
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Debes estar autenticado para eliminar imágenes'
    );
  }

  const { url } = data;

  if (!url) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Se requiere la URL de la imagen'
    );
  }

  try {
    // Verificar que sea una URL de Cloudinary
    if (!url.includes('res.cloudinary.com')) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'La URL no es de Cloudinary'
      );
    }

    // Extraer public_id
    const publicId = extraerPublicId(url);

    if (!publicId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'No se pudo extraer el public_id de la URL'
      );
    }

    console.log(`🗑️ Eliminando imagen de Cloudinary: ${publicId}`);

    // Eliminar de Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok' || result.result === 'not found') {
      console.log(`✅ Imagen eliminada exitosamente: ${publicId}`);
      return {
        success: true,
        message: 'Imagen eliminada exitosamente',
        publicId: publicId,
        result: result.result
      };
    } else {
      console.error(`❌ Error al eliminar imagen: ${result.result}`);
      throw new functions.https.HttpsError(
        'internal',
        `Error al eliminar imagen: ${result.result}`
      );
    }

  } catch (error) {
    console.error('Error en eliminarImagenCloudinary:', error);

    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError(
      'internal',
      `Error al eliminar la imagen: ${error.message}`
    );
  }
});

/**
 * Función HTTP para eliminar múltiples imágenes de Cloudinary
 * @param {object} req - Request con { urls: ["https://...", ...] } en el body
 * @param {object} res - Response
 */
exports.eliminarImagenesCloudinary = functions.https.onCall(async (data, context) => {
  // Verificar autenticación
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Debes estar autenticado para eliminar imágenes'
    );
  }

  const { urls } = data;

  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Se requiere un array de URLs'
    );
  }

  try {
    console.log(`🗑️ Eliminando ${urls.length} imágenes de Cloudinary`);

    const resultados = [];

    for (const url of urls) {
      try {
        // Verificar que sea una URL de Cloudinary
        if (!url.includes('res.cloudinary.com')) {
          resultados.push({
            url,
            success: false,
            error: 'No es una URL de Cloudinary'
          });
          continue;
        }

        // Extraer public_id
        const publicId = extraerPublicId(url);

        if (!publicId) {
          resultados.push({
            url,
            success: false,
            error: 'No se pudo extraer el public_id'
          });
          continue;
        }

        // Eliminar de Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);

        resultados.push({
          url,
          publicId,
          success: result.result === 'ok' || result.result === 'not found',
          result: result.result
        });

      } catch (error) {
        resultados.push({
          url,
          success: false,
          error: error.message
        });
      }
    }

    const exitosas = resultados.filter(r => r.success).length;
    const fallidas = resultados.filter(r => !r.success).length;

    console.log(`✅ Eliminación completada: ${exitosas} exitosas, ${fallidas} fallidas`);

    return {
      success: true,
      total: urls.length,
      exitosas,
      fallidas,
      resultados
    };

  } catch (error) {
    console.error('Error en eliminarImagenesCloudinary:', error);

    throw new functions.https.HttpsError(
      'internal',
      `Error al eliminar las imágenes: ${error.message}`
    );
  }
});

/**
 * Trigger automático: Eliminar imágenes cuando se elimina un proyecto
 */
exports.onEliminarProyecto = functions.firestore
  .document('proyectos/{proyectoId}')
  .onDelete(async (snap, context) => {
    const proyecto = snap.data();
    const imagenes = proyecto.imagenes || [];

    if (imagenes.length === 0) {
      console.log('No hay imágenes para eliminar');
      return null;
    }

    console.log(`🗑️ Eliminando ${imagenes.length} imágenes del proyecto eliminado`);

    for (const url of imagenes) {
      try {
        if (!url.includes('res.cloudinary.com')) continue;

        const publicId = extraerPublicId(url);
        if (!publicId) continue;

        const result = await cloudinary.uploader.destroy(publicId);
        console.log(`✅ Imagen eliminada: ${publicId} (${result.result})`);
      } catch (error) {
        console.error(`❌ Error al eliminar imagen ${url}:`, error);
      }
    }

    return null;
  });

/**
 * Trigger automático: Eliminar imágenes cuando se elimina un producto
 */
exports.onEliminarProducto = functions.firestore
  .document('productos/{productoId}')
  .onDelete(async (snap, context) => {
    const producto = snap.data();
    const imagenes = producto.imagenes || [];

    if (imagenes.length === 0) {
      console.log('No hay imágenes para eliminar');
      return null;
    }

    console.log(`🗑️ Eliminando ${imagenes.length} imágenes del producto eliminado`);

    for (const url of imagenes) {
      try {
        if (!url.includes('res.cloudinary.com')) continue;

        const publicId = extraerPublicId(url);
        if (!publicId) continue;

        const result = await cloudinary.uploader.destroy(publicId);
        console.log(`✅ Imagen eliminada: ${publicId} (${result.result})`);
      } catch (error) {
        console.error(`❌ Error al eliminar imagen ${url}:`, error);
      }
    }

    return null;
  });

/**
 * Trigger automático: Eliminar imágenes antiguas cuando se actualiza un proyecto
 */
exports.onActualizarProyecto = functions.firestore
  .document('proyectos/{proyectoId}')
  .onUpdate(async (change, context) => {
    const imagenesAntes = change.before.data().imagenes || [];
    const imagenesDespues = change.after.data().imagenes || [];

    // Encontrar imágenes que fueron removidas
    const imagenesEliminadas = imagenesAntes.filter(url => !imagenesDespues.includes(url));

    if (imagenesEliminadas.length === 0) {
      return null;
    }

    console.log(`🗑️ Eliminando ${imagenesEliminadas.length} imágenes removidas del proyecto`);

    for (const url of imagenesEliminadas) {
      try {
        if (!url.includes('res.cloudinary.com')) continue;

        const publicId = extraerPublicId(url);
        if (!publicId) continue;

        const result = await cloudinary.uploader.destroy(publicId);
        console.log(`✅ Imagen eliminada: ${publicId} (${result.result})`);
      } catch (error) {
        console.error(`❌ Error al eliminar imagen ${url}:`, error);
      }
    }

    return null;
  });

/**
 * Trigger automático: Eliminar imágenes antiguas cuando se actualiza un producto
 */
exports.onActualizarProducto = functions.firestore
  .document('productos/{productoId}')
  .onUpdate(async (change, context) => {
    const imagenesAntes = change.before.data().imagenes || [];
    const imagenesDespues = change.after.data().imagenes || [];

    // Encontrar imágenes que fueron removidas
    const imagenesEliminadas = imagenesAntes.filter(url => !imagenesDespues.includes(url));

    if (imagenesEliminadas.length === 0) {
      return null;
    }

    console.log(`🗑️ Eliminando ${imagenesEliminadas.length} imágenes removidas del producto`);

    for (const url of imagenesEliminadas) {
      try {
        if (!url.includes('res.cloudinary.com')) continue;

        const publicId = extraerPublicId(url);
        if (!publicId) continue;

        const result = await cloudinary.uploader.destroy(publicId);
        console.log(`✅ Imagen eliminada: ${publicId} (${result.result})`);
      } catch (error) {
        console.error(`❌ Error al eliminar imagen ${url}:`, error);
      }
    }

    return null;
  });
