// Gestión dinámica de proyectos desde Firestore

/**
 * Cargar y mostrar todos los proyectos
 */
async function cargarProyectos() {
    try {
        const snapshot = await proyectosRef
            .where('activo', '==', true)
            .orderBy('fecha', 'desc')
            .get();

        const contenedor = document.getElementById('proyectos-container');
        if (!contenedor) {
            console.error('Contenedor de proyectos no encontrado');
            return;
        }

        contenedor.innerHTML = '';

        if (snapshot.empty) {
            contenedor.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">No hay proyectos disponibles en este momento.</p>
                </div>
            `;
            return;
        }

        snapshot.forEach((doc) => {
            const proyecto = doc.data();
            const proyectoHTML = crearTarjetaProyecto(doc.id, proyecto);
            contenedor.innerHTML += proyectoHTML;
        });

        // Reinicializar Isotope después de cargar proyectos
        if (typeof $.fn.isotope !== 'undefined') {
            setTimeout(() => {
                const $container = $('.portfolio-container');
                $container.isotope({
                    itemSelector: '.portfolio-item',
                    layoutMode: 'fitRows'
                });

                // Configurar filtros
                $('.portfolio-flters li').on('click', function () {
                    $('.portfolio-flters li').removeClass('filter-active');
                    $(this).addClass('filter-active');

                    const filterValue = $(this).attr('data-filter');
                    $container.isotope({ filter: filterValue });
                });
            }, 100);
        }

        // Reinicializar Lightbox
        if (typeof lightbox !== 'undefined') {
            lightbox.option({
                'resizeDuration': 200,
                'wrapAround': true
            });
        }

    } catch (error) {
        console.error('Error al cargar proyectos:', error);
        mostrarError('Error al cargar los proyectos. Por favor, intente más tarde.');
    }
}

/**
 * Crear HTML para una tarjeta de proyecto
 */
function crearTarjetaProyecto(id, proyecto) {
    const categoria = proyecto.categoria || 'first';
    const imagen = proyecto.imagenes && proyecto.imagenes.length > 0
        ? proyecto.imagenes[0]
        : 'img/portfolio-1.jpg';

    const descripcionCorta = proyecto.descripcion
        ? (proyecto.descripcion.length > 100
            ? proyecto.descripcion.substring(0, 100) + '...'
            : proyecto.descripcion)
        : '';

    return `
        <div class="col-lg-4 col-md-6 portfolio-item ${categoria} wow fadeInUp" data-wow-delay="0.1s">
            <div class="portfolio-inner rounded">
                <img class="img-fluid" src="${imagen}" alt="${proyecto.titulo || 'Proyecto'}">
                <div class="portfolio-text">
                    <h4 class="text-white mb-4">${proyecto.titulo || 'Sin título'}</h4>
                    <p class="text-white-50 mb-4">${descripcionCorta}</p>
                    <div class="d-flex">
                        <a class="btn btn-lg-square rounded-circle mx-2" href="${imagen}" data-lightbox="portfolio-${id}">
                            <i class="fa fa-eye"></i>
                        </a>
                        <a class="btn btn-lg-square rounded-circle mx-2" href="project-detail.html?id=${id}">
                            <i class="fa fa-link"></i>
                        </a>
                    </div>
                </div>
                ${proyecto.ubicacion ? `
                <div class="portfolio-badge">
                    <i class="fa fa-map-marker-alt me-2"></i>${proyecto.ubicacion}
                </div>
                ` : ''}
            </div>
        </div>
    `;
}

/**
 * Cargar un proyecto específico por ID
 */
async function cargarProyectoDetalle(proyectoId) {
    try {
        const doc = await proyectosRef.doc(proyectoId).get();

        if (!doc.exists) {
            console.error('Proyecto no encontrado');
            return null;
        }

        return { id: doc.id, ...doc.data() };
    } catch (error) {
        console.error('Error al cargar proyecto:', error);
        return null;
    }
}

/**
 * Filtrar proyectos por categoría
 */
async function filtrarProyectos(categoria) {
    try {
        let query = proyectosRef.where('activo', '==', true);

        if (categoria && categoria !== '*') {
            query = query.where('categoria', '==', categoria);
        }

        const snapshot = await query.orderBy('fecha', 'desc').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error al filtrar proyectos:', error);
        return [];
    }
}

/**
 * Mostrar mensaje de error
 */
function mostrarError(mensaje) {
    const contenedor = document.getElementById('proyectos-container');
    if (contenedor) {
        contenedor.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger" role="alert">
                    <i class="fa fa-exclamation-triangle me-2"></i>${mensaje}
                </div>
            </div>
        `;
    }
}

// Cargar proyectos automáticamente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('proyectos-container')) {
        cargarProyectos();
    }
});
