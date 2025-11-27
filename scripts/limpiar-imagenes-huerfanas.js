#!/usr/bin/env node

/**
 * Script para limpiar imágenes huérfanas de Cloudinary
 *
 * Este script:
 * 1. Obtiene todas las URLs de imágenes en Firestore (productos y proyectos)
 * 2. Obtiene todas las imágenes en Cloudinary
 * 3. Identifica las imágenes huérfanas (en Cloudinary pero no en Firestore)
 * 4. Opcionalmente las elimina
 *
 * Uso:
 *   node scripts/limpiar-imagenes-huerfanas.js          # Solo listar huérfanas
 *   node scripts/limpiar-imagenes-huerfanas.js --delete # Eliminar huérfanas
 */

require('dotenv').config({ path: './scripts/.env' });
const admin = require('firebase-admin');
const cloudinary = require('cloudinary').v2;
const readline = require('readline');

// Configurar Firebase Admin
const serviceAccount = require('./service-account-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

/**
 * Extraer public_id de una URL de Cloudinary
 */
function extraerPublicId(url) {
  try {
    // Formato: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{format}
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.error(`${colors.red}Error al extraer public_id de ${url}:${colors.reset}`, error.message);
    return null;
  }
}

/**
 * Obtener todas las URLs de imágenes en Firestore
 */
async function obtenerImagenesFirestore() {
  console.log(`\n${colors.cyan}📦 Obteniendo imágenes de Firestore...${colors.reset}`);
  const urls = new Set();

  try {
    // Obtener imágenes de productos
    const productosSnapshot = await db.collection('productos').get();
    console.log(`   ${colors.blue}Productos encontrados: ${productosSnapshot.size}${colors.reset}`);

    productosSnapshot.forEach(doc => {
      const producto = doc.data();
      if (producto.imagen) urls.add(producto.imagen);
      if (producto.imagenes && Array.isArray(producto.imagenes)) {
        producto.imagenes.forEach(img => urls.add(img));
      }
    });

    // Obtener imágenes de proyectos
    const proyectosSnapshot = await db.collection('proyectos').get();
    console.log(`   ${colors.blue}Proyectos encontrados: ${proyectosSnapshot.size}${colors.reset}`);

    proyectosSnapshot.forEach(doc => {
      const proyecto = doc.data();
      if (proyecto.imagen) urls.add(proyecto.imagen);
      if (proyecto.imagenes && Array.isArray(proyecto.imagenes)) {
        proyecto.imagenes.forEach(img => urls.add(img));
      }
    });

    console.log(`   ${colors.green}✓ Total de URLs en Firestore: ${urls.size}${colors.reset}`);
    return urls;
  } catch (error) {
    console.error(`${colors.red}✗ Error al obtener imágenes de Firestore:${colors.reset}`, error);
    throw error;
  }
}

/**
 * Obtener todas las imágenes de Cloudinary en la carpeta 'coneri'
 */
async function obtenerImagenesCloudinary() {
  console.log(`\n${colors.cyan}☁️  Obteniendo imágenes de Cloudinary...${colors.reset}`);
  const publicIds = [];

  try {
    let hasMore = true;
    let nextCursor = null;

    while (hasMore) {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'coneri/', // Solo imágenes en la carpeta 'coneri'
        max_results: 500,
        next_cursor: nextCursor
      });

      result.resources.forEach(resource => {
        publicIds.push(resource.public_id);
      });

      nextCursor = result.next_cursor;
      hasMore = !!nextCursor;

      if (hasMore) {
        console.log(`   ${colors.yellow}Cargando más imágenes...${colors.reset}`);
      }
    }

    console.log(`   ${colors.green}✓ Total de imágenes en Cloudinary: ${publicIds.length}${colors.reset}`);
    return publicIds;
  } catch (error) {
    console.error(`${colors.red}✗ Error al obtener imágenes de Cloudinary:${colors.reset}`, error);
    throw error;
  }
}

/**
 * Identificar imágenes huérfanas
 */
function identificarHuerfanas(urlsFirestore, publicIdsCloudinary) {
  console.log(`\n${colors.cyan}🔍 Identificando imágenes huérfanas...${colors.reset}`);

  // Convertir URLs de Firestore a public_ids
  const publicIdsFirestore = new Set();
  urlsFirestore.forEach(url => {
    const publicId = extraerPublicId(url);
    if (publicId) {
      publicIdsFirestore.add(publicId);
    }
  });

  console.log(`   ${colors.blue}Public IDs en uso (Firestore): ${publicIdsFirestore.size}${colors.reset}`);

  // Identificar huérfanas (en Cloudinary pero no en Firestore)
  const huerfanas = publicIdsCloudinary.filter(id => !publicIdsFirestore.has(id));

  return huerfanas;
}

/**
 * Preguntar confirmación al usuario
 */
function preguntarConfirmacion(mensaje) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(`${mensaje} (s/n): `, (respuesta) => {
      rl.close();
      resolve(respuesta.toLowerCase() === 's' || respuesta.toLowerCase() === 'y');
    });
  });
}

/**
 * Eliminar imágenes huérfanas de Cloudinary
 */
async function eliminarHuerfanas(huerfanas) {
  console.log(`\n${colors.yellow}🗑️  Eliminando imágenes huérfanas...${colors.reset}`);

  let eliminadas = 0;
  let errores = 0;

  for (const publicId of huerfanas) {
    try {
      await cloudinary.uploader.destroy(publicId);
      eliminadas++;
      console.log(`   ${colors.green}✓ Eliminada: ${publicId}${colors.reset}`);
    } catch (error) {
      errores++;
      console.error(`   ${colors.red}✗ Error al eliminar ${publicId}:${colors.reset}`, error.message);
    }
  }

  return { eliminadas, errores };
}

/**
 * Función principal
 */
async function main() {
  const modoEliminar = process.argv.includes('--delete') || process.argv.includes('-d');

  console.log(`${colors.bright}${colors.cyan}`);
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║     🧹 Limpieza de Imágenes Huérfanas - CONERI        ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  try {
    // 1. Obtener imágenes de Firestore
    const urlsFirestore = await obtenerImagenesFirestore();

    // 2. Obtener imágenes de Cloudinary
    const publicIdsCloudinary = await obtenerImagenesCloudinary();

    // 3. Identificar huérfanas
    const huerfanas = identificarHuerfanas(urlsFirestore, publicIdsCloudinary);

    // 4. Mostrar resultados
    console.log(`\n${colors.bright}═══════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.yellow}📊 RESUMEN:${colors.reset}`);
    console.log(`   Imágenes en uso (Firestore): ${colors.green}${urlsFirestore.size}${colors.reset}`);
    console.log(`   Imágenes en Cloudinary: ${colors.blue}${publicIdsCloudinary.length}${colors.reset}`);
    console.log(`   Imágenes huérfanas: ${colors.red}${huerfanas.length}${colors.reset}`);
    console.log(`${colors.bright}═══════════════════════════════════════════════════════${colors.reset}\n`);

    if (huerfanas.length === 0) {
      console.log(`${colors.green}✓ ¡No hay imágenes huérfanas! Tu almacenamiento está limpio.${colors.reset}\n`);
      return;
    }

    // 5. Mostrar lista de huérfanas
    console.log(`${colors.yellow}Imágenes huérfanas encontradas:${colors.reset}`);
    huerfanas.forEach((id, index) => {
      console.log(`   ${index + 1}. ${id}`);
    });

    // 6. Eliminar si se especificó --delete
    if (modoEliminar) {
      console.log(`\n${colors.red}⚠️  ADVERTENCIA: Estás a punto de eliminar ${huerfanas.length} imágenes de Cloudinary.${colors.reset}`);
      const confirmar = await preguntarConfirmacion(`${colors.yellow}¿Deseas continuar?${colors.reset}`);

      if (confirmar) {
        const resultado = await eliminarHuerfanas(huerfanas);

        console.log(`\n${colors.bright}═══════════════════════════════════════════════════════${colors.reset}`);
        console.log(`${colors.green}✓ COMPLETADO${colors.reset}`);
        console.log(`   Eliminadas: ${colors.green}${resultado.eliminadas}${colors.reset}`);
        console.log(`   Errores: ${colors.red}${resultado.errores}${colors.reset}`);
        console.log(`${colors.bright}═══════════════════════════════════════════════════════${colors.reset}\n`);
      } else {
        console.log(`\n${colors.yellow}Operación cancelada.${colors.reset}\n`);
      }
    } else {
      console.log(`\n${colors.cyan}💡 Para eliminar estas imágenes, ejecuta:${colors.reset}`);
      console.log(`   ${colors.bright}node scripts/limpiar-imagenes-huerfanas.js --delete${colors.reset}\n`);
    }

  } catch (error) {
    console.error(`\n${colors.red}✗ Error fatal:${colors.reset}`, error);
    process.exit(1);
  } finally {
    // Cerrar conexión a Firebase
    await admin.app().delete();
  }
}

// Ejecutar script
main().catch(console.error);
