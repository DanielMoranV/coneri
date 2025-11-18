// Gestión dinámica de productos/catálogo desde Firestore

/**
 * Cargar y mostrar todos los productos
 */
async function cargarProductos(categoriaFiltro = null) {
    try {
        let query = productosRef.where('activo', '==', true);

        if (categoriaFiltro && categoriaFiltro !== '*') {
            query = query.where('categoria', '==', categoriaFiltro);
        }

        const snapshot = await query.orderBy('orden', 'asc').get();

        const contenedor = document.getElementById('productos-container');
        if (!contenedor) {
            console.error('Contenedor de productos no encontrado');
            return;
        }

        contenedor.innerHTML = '';

        if (snapshot.empty) {
            contenedor.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">No hay productos disponibles en este momento.</p>
                </div>
            `;
            return;
        }

        snapshot.forEach((doc) => {
            const producto = doc.data();
            const productoHTML = crearTarjetaProducto(doc.id, producto);
            contenedor.innerHTML += productoHTML;
        });

        // Reinicializar Isotope después de cargar productos
        if (typeof $.fn.isotope !== 'undefined') {
            setTimeout(() => {
                const $container = $('.productos-container');
                $container.isotope({
                    itemSelector: '.producto-item',
                    layoutMode: 'fitRows'
                });

                // Configurar filtros
                $('.catalogo-filters li').on('click', function () {
                    $('.catalogo-filters li').removeClass('filter-active');
                    $(this).addClass('filter-active');

                    const filterValue = $(this).attr('data-filter');
                    if (filterValue === '*') {
                        cargarProductos();
                    } else {
                        const categoria = filterValue.replace('.', '');
                        cargarProductos(categoria);
                    }
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
        console.error('Error al cargar productos:', error);
        mostrarErrorProductos('Error al cargar los productos. Por favor, intente más tarde.');
    }
}

/**
 * Crear HTML para una tarjeta de producto
 */
function crearTarjetaProducto(id, producto) {
    const categoria = producto.categoria || 'general';
    const imagen = producto.imagenes && producto.imagenes.length > 0
        ? producto.imagenes[0]
        : 'img/default-producto.jpg';

    const descripcionCorta = producto.descripcion
        ? (producto.descripcion.length > 120
            ? producto.descripcion.substring(0, 120) + '...'
            : producto.descripcion)
        : '';

    // Mostrar precio si está disponible
    const precioHTML = producto.precio
        ? `<div class="producto-precio mb-2">
               <span class="badge bg-primary fs-5">S/ ${producto.precio.toFixed(2)}</span>
           </div>`
        : '';

    // Mostrar especificaciones clave
    let especificacionesHTML = '';
    if (producto.especificaciones) {
        const specs = Object.entries(producto.especificaciones).slice(0, 3);
        especificacionesHTML = '<ul class="producto-specs list-unstyled mb-3">';
        specs.forEach(([key, value]) => {
            especificacionesHTML += `<li><small><i class="fa fa-check text-primary me-2"></i>${key}: ${value}</small></li>`;
        });
        especificacionesHTML += '</ul>';
    }

    return `
        <div class="col-lg-4 col-md-6 producto-item ${categoria} mb-4 wow fadeInUp" data-wow-delay="0.1s">
            <div class="card h-100 border-0 shadow-sm producto-card">
                <div class="producto-imagen position-relative">
                    <img class="card-img-top" src="${imagen}" alt="${producto.nombre || 'Producto'}">
                    ${producto.categoria ? `
                    <span class="badge bg-secondary position-absolute top-0 end-0 m-2">
                        ${formatearCategoria(producto.categoria)}
                    </span>
                    ` : ''}
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title text-primary mb-3">${producto.nombre || 'Sin nombre'}</h5>
                    ${precioHTML}
                    ${especificacionesHTML}
                    <p class="card-text text-muted flex-grow-1">${descripcionCorta}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <a href="#" class="btn btn-primary btn-sm" onclick="verDetalleProducto('${id}'); return false;">
                            <i class="fa fa-info-circle me-1"></i> Ver Detalles
                        </a>
                        <a href="${imagen}" class="btn btn-outline-primary btn-sm" data-lightbox="producto-${id}">
                            <i class="fa fa-search-plus"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Ver detalle de un producto en modal
 */
async function verDetalleProducto(productoId) {
    try {
        const doc = await productosRef.doc(productoId).get();

        if (!doc.exists) {
            alert('Producto no encontrado');
            return;
        }

        const producto = doc.data();
        mostrarModalProducto(productoId, producto);

    } catch (error) {
        console.error('Error al cargar detalle del producto:', error);
        alert('Error al cargar el producto. Por favor, intente más tarde.');
    }
}

/**
 * Mostrar modal con información detallada del producto
 */
function mostrarModalProducto(id, producto) {
    // Crear o actualizar modal
    let modal = document.getElementById('modalDetalleProducto');

    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalDetalleProducto';
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalTitulo"></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" id="modalContenido"></div>
                    <div class="modal-footer">
                        <a href="contact.html" class="btn btn-primary">
                            <i class="fa fa-envelope me-2"></i>Solicitar Cotización
                        </a>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Actualizar contenido
    document.getElementById('modalTitulo').textContent = producto.nombre || 'Producto';

    // Crear galería de imágenes
    let galeriaHTML = '';
    if (producto.imagenes && producto.imagenes.length > 0) {
        galeriaHTML = '<div class="producto-galeria mb-4"><div class="row g-2">';
        producto.imagenes.forEach((img, index) => {
            galeriaHTML += `
                <div class="col-${producto.imagenes.length === 1 ? '12' : '6'}">
                    <a href="${img}" data-lightbox="producto-detalle-${id}">
                        <img src="${img}" class="img-fluid rounded" alt="${producto.nombre}">
                    </a>
                </div>
            `;
        });
        galeriaHTML += '</div></div>';
    }

    // Precio
    const precioHTML = producto.precio
        ? `<div class="alert alert-primary d-inline-block mb-3">
               <h4 class="mb-0">Precio: S/ ${producto.precio.toFixed(2)}</h4>
           </div>`
        : '';

    // Especificaciones completas
    let especificacionesHTML = '';
    if (producto.especificaciones && Object.keys(producto.especificaciones).length > 0) {
        especificacionesHTML = '<h6 class="mb-3">Especificaciones Técnicas:</h6><table class="table table-bordered">';
        Object.entries(producto.especificaciones).forEach(([key, value]) => {
            especificacionesHTML += `
                <tr>
                    <td class="fw-bold" style="width: 40%;">${key}</td>
                    <td>${value}</td>
                </tr>
            `;
        });
        especificacionesHTML += '</table>';
    }

    const contenidoHTML = `
        ${galeriaHTML}
        ${precioHTML}
        <div class="mb-3">
            <h6>Descripción:</h6>
            <p>${producto.descripcion || 'Sin descripción disponible.'}</p>
        </div>
        ${especificacionesHTML}
        ${producto.categoria ? `
        <div class="mt-3">
            <span class="badge bg-secondary">${formatearCategoria(producto.categoria)}</span>
        </div>
        ` : ''}
    `;

    document.getElementById('modalContenido').innerHTML = contenidoHTML;

    // Mostrar modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

/**
 * Formatear nombre de categoría
 */
function formatearCategoria(categoria) {
    const categorias = {
        'paneles': 'Paneles Solares',
        'inversores': 'Inversores',
        'baterias': 'Baterías',
        'estructuras': 'Estructuras',
        'cables': 'Cables y Conectores',
        'bombas': 'Bombas Solares',
        'accesorios': 'Accesorios',
        'general': 'General'
    };
    return categorias[categoria] || categoria;
}

/**
 * Buscar productos
 */
async function buscarProductos(termino) {
    try {
        const snapshot = await productosRef
            .where('activo', '==', true)
            .get();

        const resultados = [];
        const terminoLower = termino.toLowerCase();

        snapshot.forEach((doc) => {
            const producto = doc.data();
            const nombre = (producto.nombre || '').toLowerCase();
            const descripcion = (producto.descripcion || '').toLowerCase();

            if (nombre.includes(terminoLower) || descripcion.includes(terminoLower)) {
                resultados.push({ id: doc.id, ...producto });
            }
        });

        return resultados;
    } catch (error) {
        console.error('Error al buscar productos:', error);
        return [];
    }
}

/**
 * Mostrar mensaje de error
 */
function mostrarErrorProductos(mensaje) {
    const contenedor = document.getElementById('productos-container');
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

// Cargar productos automáticamente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('productos-container')) {
        cargarProductos();
    }

    // Configurar búsqueda si existe el campo
    const campoBusqueda = document.getElementById('buscar-producto');
    if (campoBusqueda) {
        campoBusqueda.addEventListener('input', function(e) {
            const termino = e.target.value.trim();
            if (termino.length >= 3) {
                buscarProductos(termino).then(resultados => {
                    mostrarResultadosBusqueda(resultados);
                });
            } else if (termino.length === 0) {
                cargarProductos();
            }
        });
    }
});

/**
 * Mostrar resultados de búsqueda
 */
function mostrarResultadosBusqueda(resultados) {
    const contenedor = document.getElementById('productos-container');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    if (resultados.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">No se encontraron productos que coincidan con tu búsqueda.</p>
            </div>
        `;
        return;
    }

    resultados.forEach((producto) => {
        const productoHTML = crearTarjetaProducto(producto.id, producto);
        contenedor.innerHTML += productoHTML;
    });
}
