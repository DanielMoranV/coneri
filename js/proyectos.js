// ============================================
// CASOS DE ÉXITO - JAVASCRIPT SIMPLE
// ============================================

/**
 * Cargar y mostrar todos los proyectos
 */
async function cargarCasosExito() {
    try {
        const snapshot = await proyectosRef
            .where('activo', '==', true)
            .orderBy('fecha', 'desc')
            .get();

        const contenedor = document.getElementById('casos-container');
        if (!contenedor) {
            console.error('Contenedor no encontrado');
            return;
        }

        contenedor.innerHTML = '';

        if (snapshot.empty) {
            contenedor.innerHTML = `
                <div class="casos-vacio">
                    <i class="fas fa-folder-open"></i>
                    <h3>No hay proyectos disponibles</h3>
                    <p>Pronto agregaremos nuevos casos de éxito.</p>
                </div>
            `;
            return;
        }

        snapshot.forEach((doc) => {
            const proyecto = doc.data();
            const casoHTML = crearTarjetaCaso(doc.id, proyecto);
            contenedor.innerHTML += casoHTML;
        });

        // Configurar filtros
        configurarFiltros();

        // Inicializar galerías
        inicializarGalerias();

    } catch (error) {
        console.error('Error al cargar casos:', error);
        mostrarError();
    }
}

/**
 * Crear HTML para una tarjeta de caso de éxito
 */
function crearTarjetaCaso(id, proyecto) {
    const imagenes = proyecto.imagenes && proyecto.imagenes.length > 0
        ? proyecto.imagenes
        : ['img/portfolio-1.jpg'];

    const descripcionCorta = proyecto.descripcion
        ? (proyecto.descripcion.length > 120
            ? proyecto.descripcion.substring(0, 120) + '...'
            : proyecto.descripcion)
        : '';

    // Determinar categoría y badge
    const categoria = proyecto.categoria || 'first';
    let badgeClass = '';
    let badgeText = '';

    if (categoria === 'first') {
        badgeClass = 'culminado';
        badgeText = 'Culminado';
    } else if (categoria === 'second') {
        badgeClass = 'en-marcha';
        badgeText = 'En Marcha';
    }

    return `
        <div class="caso-exito-card visible" data-categoria="${badgeClass}">
            <!-- Galería de Imágenes -->
            <div class="caso-galeria" data-galeria="${id}">
                <img src="${imagenes[0]}" alt="${proyecto.titulo || 'Proyecto'}" class="caso-imagen-principal">

                ${badgeText ? `<div class="caso-badge ${badgeClass}">${badgeText}</div>` : ''}

                ${imagenes.length > 1 ? `
                <div class="caso-contador">
                    <i class="fa fa-images"></i> ${imagenes.length}
                </div>
                <button class="galeria-prev" onclick="cambiarImagen('${id}', -1)">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="galeria-next" onclick="cambiarImagen('${id}', 1)">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <div class="galeria-nav">
                    ${imagenes.map((_, index) => `
                        <span class="galeria-dot ${index === 0 ? 'active' : ''}"
                              onclick="irAImagen('${id}', ${index})"></span>
                    `).join('')}
                </div>
                ` : ''}

                <!-- Datos de galería ocultos -->
                <div style="display:none;" data-imagenes='${JSON.stringify(imagenes)}'></div>
            </div>

            <!-- Contenido -->
            <div class="caso-contenido">
                <h3 class="caso-titulo">${proyecto.titulo || 'Sin título'}</h3>

                ${proyecto.ubicacion || proyecto.capacidad ? `
                <div class="caso-detalles">
                    ${proyecto.ubicacion ? `
                    <div class="caso-detalle">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${proyecto.ubicacion}</span>
                    </div>
                    ` : ''}
                    ${proyecto.capacidad ? `
                    <div class="caso-detalle">
                        <i class="fas fa-solar-panel"></i>
                        <span>${proyecto.capacidad}</span>
                    </div>
                    ` : ''}
                </div>
                ` : ''}

                ${descripcionCorta ? `<p class="caso-descripcion">${descripcionCorta}</p>` : ''}

                <!-- Botones -->
                <div class="caso-acciones">
                    <a href="project-detail.html?id=${id}" class="caso-btn caso-btn-primary">
                        <i class="fas fa-info-circle"></i> Ver Detalles
                    </a>
                    <a href="${imagenes[0]}" data-lightbox="proyecto-${id}" class="caso-btn caso-btn-outline">
                        <i class="fas fa-images"></i> Galería
                    </a>
                    ${imagenes.slice(1).map(img => `
                        <a href="${img}" data-lightbox="proyecto-${id}" style="display:none;"></a>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

/**
 * Inicializar galerías de imágenes
 */
function inicializarGalerias() {
    // Guardar índice actual de cada galería
    window.galeriaIndices = {};

    document.querySelectorAll('[data-galeria]').forEach(galeria => {
        const id = galeria.getAttribute('data-galeria');
        window.galeriaIndices[id] = 0;
    });
}

/**
 * Cambiar imagen en la galería
 */
function cambiarImagen(id, direccion) {
    const galeria = document.querySelector(`[data-galeria="${id}"]`);
    if (!galeria) return;

    const imagenesData = galeria.querySelector('[data-imagenes]');
    if (!imagenesData) return;

    const imagenes = JSON.parse(imagenesData.getAttribute('data-imagenes'));
    if (imagenes.length <= 1) return;

    // Actualizar índice
    let indiceActual = window.galeriaIndices[id] || 0;
    indiceActual += direccion;

    // Circular
    if (indiceActual < 0) indiceActual = imagenes.length - 1;
    if (indiceActual >= imagenes.length) indiceActual = 0;

    window.galeriaIndices[id] = indiceActual;

    // Actualizar imagen
    const imagen = galeria.querySelector('.caso-imagen-principal');
    imagen.src = imagenes[indiceActual];

    // Actualizar dots
    const dots = galeria.querySelectorAll('.galeria-dot');
    dots.forEach((dot, index) => {
        if (index === indiceActual) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

/**
 * Ir a una imagen específica
 */
function irAImagen(id, indice) {
    const galeria = document.querySelector(`[data-galeria="${id}"]`);
    if (!galeria) return;

    const imagenesData = galeria.querySelector('[data-imagenes]');
    if (!imagenesData) return;

    const imagenes = JSON.parse(imagenesData.getAttribute('data-imagenes'));

    window.galeriaIndices[id] = indice;

    // Actualizar imagen
    const imagen = galeria.querySelector('.caso-imagen-principal');
    imagen.src = imagenes[indice];

    // Actualizar dots
    const dots = galeria.querySelectorAll('.galeria-dot');
    dots.forEach((dot, idx) => {
        if (idx === indice) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

/**
 * Configurar filtros
 */
function configurarFiltros() {
    const botones = document.querySelectorAll('.filtro-btn');

    botones.forEach(boton => {
        boton.addEventListener('click', function() {
            // Actualizar botón activo
            botones.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Obtener filtro
            const filtro = this.getAttribute('data-filtro');

            // Filtrar tarjetas
            const tarjetas = document.querySelectorAll('.caso-exito-card');

            tarjetas.forEach(tarjeta => {
                const categoria = tarjeta.getAttribute('data-categoria');

                if (filtro === 'todos') {
                    tarjeta.classList.remove('oculto');
                    tarjeta.classList.add('visible');
                } else if (categoria === filtro) {
                    tarjeta.classList.remove('oculto');
                    tarjeta.classList.add('visible');
                } else {
                    tarjeta.classList.remove('visible');
                    tarjeta.classList.add('oculto');
                }
            });
        });
    });
}

/**
 * Mostrar mensaje de error
 */
function mostrarError() {
    const contenedor = document.getElementById('casos-container');
    if (contenedor) {
        contenedor.innerHTML = `
            <div class="casos-vacio">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error al cargar proyectos</h3>
                <p>Por favor, intenta recargar la página.</p>
            </div>
        `;
    }
}

// Cargar proyectos automáticamente
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('casos-container')) {
        cargarCasosExito();
    }
});
