// Sistema de Carrito de Compras con LocalStorage

/**
 * Clase para gestionar el carrito de compras
 */
class Carrito {
    constructor() {
        this.items = this.cargarCarrito();
        this.inicializar();
    }

    /**
     * Inicializar eventos y UI
     */
    inicializar() {
        this.actualizarContador();
        this.renderizarIconoCarrito();
    }

    /**
     * Cargar carrito desde LocalStorage
     */
    cargarCarrito() {
        const carritoGuardado = localStorage.getItem('coneri_carrito');
        return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    }

    /**
     * Guardar carrito en LocalStorage
     */
    guardarCarrito() {
        localStorage.setItem('coneri_carrito', JSON.stringify(this.items));
        this.actualizarContador();
    }

    /**
     * Agregar producto al carrito
     */
    agregarProducto(producto) {
        const itemExistente = this.items.find(item => item.id === producto.id);

        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            this.items.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio || 0,
                imagen: producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes[0] : '',
                cantidad: 1,
                especificaciones: producto.especificaciones || {}
            });
        }

        this.guardarCarrito();
        this.mostrarNotificacion(`${producto.nombre} agregado al carrito`, 'success');
    }

    /**
     * Eliminar producto del carrito
     */
    eliminarProducto(productoId) {
        this.items = this.items.filter(item => item.id !== productoId);
        this.guardarCarrito();
        this.mostrarNotificacion('Producto eliminado del carrito', 'info');
    }

    /**
     * Actualizar cantidad de un producto
     */
    actualizarCantidad(productoId, cantidad) {
        const item = this.items.find(item => item.id === productoId);
        if (item) {
            item.cantidad = Math.max(1, cantidad);
            this.guardarCarrito();
        }
    }

    /**
     * Obtener total del carrito
     */
    obtenerTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.precio * item.cantidad);
        }, 0);
    }

    /**
     * Obtener cantidad total de items
     */
    obtenerCantidadTotal() {
        return this.items.reduce((total, item) => total + item.cantidad, 0);
    }

    /**
     * Limpiar carrito
     */
    limpiarCarrito() {
        this.items = [];
        this.guardarCarrito();
        this.mostrarNotificacion('Carrito vacío', 'info');
    }

    /**
     * Actualizar contador del carrito en la UI
     */
    actualizarContador() {
        const contador = document.getElementById('carrito-contador');
        if (contador) {
            const cantidad = this.obtenerCantidadTotal();
            contador.textContent = cantidad;
            contador.style.display = cantidad > 0 ? 'inline-block' : 'none';
        }
    }

    /**
     * Renderizar icono del carrito en el navbar
     */
    renderizarIconoCarrito() {
        const navbar = document.querySelector('.navbar-nav');
        if (!navbar || document.getElementById('carrito-link')) return;

        const carritoHTML = `
            <a href="carrito.html" class="nav-item nav-link position-relative" id="carrito-link">
                <i class="fa fa-shopping-cart"></i> Carrito
                <span class="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill"
                      id="carrito-contador" style="display: none; font-size: 0.7rem;">0</span>
            </a>
        `;
        navbar.insertAdjacentHTML('beforeend', carritoHTML);
        this.actualizarContador();
    }

    /**
     * Generar mensaje para WhatsApp
     */
    generarMensajeWhatsApp() {
        if (this.items.length === 0) {
            return '';
        }

        let mensaje = '🛒 *Solicitud de Cotización - CONERI*\n\n';
        mensaje += '📋 *Productos seleccionados:*\n\n';

        this.items.forEach((item, index) => {
            mensaje += `${index + 1}. *${item.nombre}*\n`;
            mensaje += `   Cantidad: ${item.cantidad}\n`;

            if (item.precio > 0) {
                mensaje += `   Precio unit.: S/ ${item.precio.toFixed(2)}\n`;
            }

            // Agregar especificaciones clave
            if (item.especificaciones && Object.keys(item.especificaciones).length > 0) {
                const specsArray = Object.entries(item.especificaciones).slice(0, 2);
                specsArray.forEach(([key, value]) => {
                    mensaje += `   ${key}: ${value}\n`;
                });
            }
            mensaje += '\n';
        });

        const total = this.obtenerTotal();
        if (total > 0) {
            mensaje += `💰 *Total estimado:* S/ ${total.toFixed(2)}\n\n`;
        }

        mensaje += '¿Podrían enviarme una cotización detallada?\n\n';
        mensaje += '¡Gracias!';

        return encodeURIComponent(mensaje);
    }

    /**
     * Enviar cotización por WhatsApp
     */
    enviarWhatsApp() {
        if (this.items.length === 0) {
            this.mostrarNotificacion('El carrito está vacío', 'warning');
            return;
        }

        const mensaje = this.generarMensajeWhatsApp();
        const telefono = '51941830829';
        const url = `https://api.whatsapp.com/send?phone=${telefono}&text=${mensaje}`;

        window.open(url, '_blank');
    }

    /**
     * Mostrar notificación
     */
    mostrarNotificacion(mensaje, tipo = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';

        const iconos = {
            success: 'fa-check-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle',
            danger: 'fa-times-circle'
        };

        alertDiv.innerHTML = `
            <i class="fa ${iconos[tipo]} me-2"></i>${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alertDiv);

        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }
}

// Instancia global del carrito
const carritoCompras = new Carrito();

/**
 * Función global para agregar al carrito desde cualquier página
 */
window.agregarAlCarrito = async function(productoId) {
    try {
        const doc = await productosRef.doc(productoId).get();

        if (!doc.exists) {
            carritoCompras.mostrarNotificacion('Producto no encontrado', 'danger');
            return;
        }

        const producto = { id: doc.id, ...doc.data() };
        carritoCompras.agregarProducto(producto);

    } catch (error) {
        console.error('Error al agregar producto:', error);
        carritoCompras.mostrarNotificacion('Error al agregar el producto', 'danger');
    }
};
