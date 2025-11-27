// Gestión dinámica de productos/catálogo desde Firestore

/**
 * Cargar y mostrar todos los productos
 */
async function cargarProductos(categoriaFiltro = null) {
    try {
        const contenedor = document.getElementById('productos-container');
        if (!contenedor) {
            console.error('Contenedor de productos no encontrado');
            return;
        }

        // Mostrar spinner de carga
        contenedor.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                    <span class="visually-hidden">Cargando productos...</span>
                </div>
                <p class="text-muted mt-3">Cargando productos...</p>
            </div>
        `;

        let snapshot;

        if (categoriaFiltro && categoriaFiltro !== '*') {
            // Consulta con filtro de categoría (sin orderBy para evitar necesidad de índice)
            const query = productosRef
                .where('activo', '==', true)
                .where('categoria', '==', categoriaFiltro);
            snapshot = await query.get();
        } else {
            // Consulta sin filtro, puede usar orderBy
            const query = productosRef
                .where('activo', '==', true)
                .orderBy('orden', 'asc');
            snapshot = await query.get();
        }

        contenedor.innerHTML = '';

        if (snapshot.empty) {
            contenedor.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fa fa-box-open fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No hay productos en esta categoría</h5>
                    <p class="text-muted">Intenta con otra categoría</p>
                </div>
            `;
            return;
        }

        // Convertir snapshot a array y ordenar en el cliente
        const productos = [];
        snapshot.forEach((doc) => {
            productos.push({ id: doc.id, ...doc.data() });
        });

        // Ordenar por campo 'orden' si existe, sino por nombre
        productos.sort((a, b) => {
            const ordenA = a.orden || 999;
            const ordenB = b.orden || 999;
            return ordenA - ordenB;
        });

        // Renderizar productos ordenados
        productos.forEach((producto) => {
            const productoHTML = crearTarjetaProducto(producto.id, producto);
            contenedor.innerHTML += productoHTML;
        });

        // Reinicializar Isotope después de cargar productos
        if (typeof $.fn.isotope !== 'undefined') {
            setTimeout(() => {
                const $container = $('.productos-container');

                // Destruir instancia anterior si existe
                try {
                    if ($container.data('isotope')) {
                        $container.isotope('destroy');
                    }
                } catch (e) {
                    // Isotope no estaba inicializado, continuar
                }

                // Inicializar Isotope
                $container.isotope({
                    itemSelector: '.producto-item',
                    layoutMode: 'fitRows',
                    transitionDuration: '0.6s'
                });
            }, 200);
        }

        // Reinicializar animaciones WOW
        if (typeof WOW !== 'undefined') {
            new WOW().init();
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
    const imagenes = producto.imagenes && producto.imagenes.length > 0
        ? producto.imagenes
        : ['https://via.placeholder.com/400x280/65B530/ffffff?text=Sin+Imagen'];

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

    // Crear carrusel de imágenes si hay múltiples imágenes
    let imagenesHTML = '';
    if (imagenes.length > 1) {
        imagenesHTML = `
            <div id="carousel-${id}" class="carousel slide producto-carousel" data-bs-ride="false">
                <div class="carousel-inner">
                    ${imagenes.map((img, index) => `
                        <div class="carousel-item ${index === 0 ? 'active' : ''}">
                            <img src="${img}" class="d-block w-100" alt="${producto.nombre || 'Producto'}"
                                 onerror="this.src='https://via.placeholder.com/400x280/65B530/ffffff?text=Sin+Imagen'">
                        </div>
                    `).join('')}
                </div>
                ${imagenes.length > 1 ? `
                    <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${id}" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Anterior</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carousel-${id}" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Siguiente</span>
                    </button>
                    <div class="carousel-indicators">
                        ${imagenes.map((_, index) => `
                            <button type="button" data-bs-target="#carousel-${id}" data-bs-slide-to="${index}"
                                    class="${index === 0 ? 'active' : ''}" aria-current="${index === 0 ? 'true' : 'false'}">
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    } else {
        imagenesHTML = `
            <img class="card-img-top" src="${imagenes[0]}" alt="${producto.nombre || 'Producto'}"
                 onerror="this.src='https://via.placeholder.com/400x280/65B530/ffffff?text=Sin+Imagen'">
        `;
    }

    return `
        <div class="col-lg-4 col-md-6 producto-item ${categoria} mb-4 wow fadeInUp" data-wow-delay="0.1s">
            <div class="card h-100 border-0 shadow-sm producto-card">
                <div class="producto-imagen position-relative">
                    ${imagenesHTML}
                    ${producto.categoria ? `
                    <span class="badge bg-secondary position-absolute top-0 end-0 m-2" style="z-index: 10;">
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
                        <button class="btn btn-success btn-sm" onclick="agregarAlCarrito('${id}')">
                            <i class="fa fa-cart-plus me-1"></i> Agregar
                        </button>
                        <a href="#" class="btn btn-primary btn-sm" onclick="verDetalleProducto('${id}'); return false;">
                            <i class="fa fa-info-circle me-1"></i> Detalles
                        </a>
                        ${imagenes.length > 0 ? `
                            <a href="${imagenes[0]}"
                               class="btn btn-outline-primary btn-sm"
                               data-lightbox="galeria-${id}"
                               data-title="${producto.nombre || 'Producto'} - Imagen 1 de ${imagenes.length}">
                                <i class="fa fa-search-plus"></i>
                            </a>
                            ${imagenes.slice(1).map((img, idx) => `
                                <a href="${img}"
                                   data-lightbox="galeria-${id}"
                                   data-title="${producto.nombre || 'Producto'} - Imagen ${idx + 2} de ${imagenes.length}"
                                   style="display:none;">
                                </a>
                            `).join('')}
                        ` : ''}
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
                        <button class="btn btn-success" onclick="agregarAlCarrito('${id}')">
                            <i class="fa fa-cart-plus me-2"></i>Agregar al Carrito
                        </button>
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

    // Configurar filtros - Solo registrar una vez
    const filtrosContainer = document.getElementById('catalogo-filters');
    if (filtrosContainer) {
        filtrosContainer.addEventListener('click', function(e) {
            // Verificar si el click fue en un botón o en su contenido (icono o texto)
            let filterBtn = null;
            if (e.target.classList.contains('filter-chip') || e.target.classList.contains('filter-btn')) {
                filterBtn = e.target;
            } else if (e.target.closest('.filter-chip') || e.target.closest('.filter-btn')) {
                filterBtn = e.target.closest('.filter-chip') || e.target.closest('.filter-btn');
            }

            if (!filterBtn) return;

            // Remover clases activas de todos los botones
            document.querySelectorAll('.filter-chip, .filter-btn').forEach(btn => {
                btn.classList.remove('active', 'filter-active');
            });

            // Agregar clase activa al botón clickeado
            filterBtn.classList.add('active', 'filter-active');

            // Obtener el filtro y cargar productos
            const filterValue = filterBtn.getAttribute('data-filter');

            if (filterValue === '*') {
                cargarProductos(null);
            } else {
                const categoria = filterValue.replace('.', '');
                cargarProductos(categoria);
            }
        });
    }

    // Configurar búsqueda si existe el campo
    const campoBusqueda = document.getElementById('buscar-producto');
    if (campoBusqueda) {
        let timeoutBusqueda;

        campoBusqueda.addEventListener('input', function(e) {
            const termino = e.target.value.trim();

            // Limpiar timeout anterior
            clearTimeout(timeoutBusqueda);

            // Agregar clase de búsqueda activa
            if (termino.length > 0) {
                campoBusqueda.classList.add('searching');
            } else {
                campoBusqueda.classList.remove('searching');
            }

            // Buscar con debounce
            timeoutBusqueda = setTimeout(() => {
                if (termino.length >= 2) {
                    buscarProductos(termino).then(resultados => {
                        mostrarResultadosBusqueda(resultados, termino);
                    });
                } else if (termino.length === 0) {
                    cargarProductos();
                }
            }, 300);
        });

        // Agregar placeholder dinámico
        const placeholders = [
            'Buscar paneles solares...',
            'Buscar inversores...',
            'Buscar baterías...',
            'Buscar por marca o modelo...'
        ];
        let placeholderIndex = 0;
        setInterval(() => {
            if (campoBusqueda === document.activeElement) return;
            placeholderIndex = (placeholderIndex + 1) % placeholders.length;
            campoBusqueda.placeholder = placeholders[placeholderIndex];
        }, 3000);
    }
});

/**
 * Mostrar resultados de búsqueda
 */
function mostrarResultadosBusqueda(resultados, termino = '') {
    const contenedor = document.getElementById('productos-container');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    // Mostrar banner de resultados
    if (termino) {
        const bannerResultados = document.createElement('div');
        bannerResultados.className = 'col-12 mb-3';
        bannerResultados.innerHTML = `
            <div class="alert alert-info d-flex justify-content-between align-items-center" role="alert">
                <div>
                    <i class="fa fa-search me-2"></i>
                    <strong>${resultados.length}</strong> producto${resultados.length !== 1 ? 's' : ''} encontrado${resultados.length !== 1 ? 's' : ''} para "<em>${termino}</em>"
                </div>
                <button class="btn btn-sm btn-outline-secondary" onclick="document.getElementById('buscar-producto').value = ''; cargarProductos();">
                    <i class="fa fa-times me-1"></i>Limpiar búsqueda
                </button>
            </div>
        `;
        contenedor.appendChild(bannerResultados);
    }

    if (resultados.length === 0) {
        const noResultados = document.createElement('div');
        noResultados.className = 'col-12 text-center py-5';
        noResultados.innerHTML = `
            <i class="fa fa-search fa-3x text-muted mb-3"></i>
            <h5 class="text-muted">No se encontraron productos</h5>
            <p class="text-muted">Intenta con otros términos de búsqueda o explora nuestras categorías</p>
            <button class="btn btn-primary mt-3" onclick="document.getElementById('buscar-producto').value = ''; cargarProductos();">
                <i class="fa fa-th me-2"></i>Ver todos los productos
            </button>
        `;
        contenedor.appendChild(noResultados);
        return;
    }

    resultados.forEach((producto) => {
        const productoHTML = crearTarjetaProducto(producto.id, producto);
        contenedor.innerHTML += productoHTML;
    });

    // Reinicializar animaciones
    if (typeof WOW !== 'undefined') {
        new WOW().init();
    }
}
