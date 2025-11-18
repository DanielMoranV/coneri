// Sistema de Administración - CRUD de Proyectos y Productos

// Estado global
let usuarioActual = null;
let modoEdicion = null; // 'proyecto' o 'producto'
let idEditando = null;
let imagenesTemporales = [];

/**
 * Verificar autenticación
 */
auth.onAuthStateChanged((usuario) => {
    if (usuario) {
        usuarioActual = usuario;
        mostrarPanelAdmin();
    } else {
        usuarioActual = null;
        mostrarPanelLogin();
    }
});

/**
 * Mostrar panel de login
 */
function mostrarPanelLogin() {
    document.getElementById('panel-login').style.display = 'block';
    document.getElementById('panel-admin').style.display = 'none';
}

/**
 * Mostrar panel de administración
 */
function mostrarPanelAdmin() {
    document.getElementById('panel-login').style.display = 'none';
    document.getElementById('panel-admin').style.display = 'block';
    document.getElementById('usuario-email').textContent = usuarioActual.email;

    // Cargar listas por defecto
    cargarListaProyectos();
    cargarListaProductos();
}

/**
 * Login
 */
async function iniciarSesion(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btnLogin = document.getElementById('btn-login');
    const errorDiv = document.getElementById('login-error');

    btnLogin.disabled = true;
    btnLogin.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Iniciando sesión...';
    errorDiv.style.display = 'none';

    try {
        await auth.signInWithEmailAndPassword(email, password);
        document.getElementById('form-login').reset();
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        errorDiv.textContent = obtenerMensajeError(error.code);
        errorDiv.style.display = 'block';
    } finally {
        btnLogin.disabled = false;
        btnLogin.textContent = 'Iniciar Sesión';
    }
}

/**
 * Logout
 */
function cerrarSesion() {
    auth.signOut();
}

/**
 * Obtener mensaje de error amigable
 */
function obtenerMensajeError(codigo) {
    const errores = {
        'auth/invalid-email': 'Correo electrónico inválido',
        'auth/user-disabled': 'Usuario deshabilitado',
        'auth/user-not-found': 'Usuario no encontrado',
        'auth/wrong-password': 'Contraseña incorrecta',
        'auth/email-already-in-use': 'El correo ya está en uso',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
        'auth/network-request-failed': 'Error de conexión. Verifica tu internet.'
    };
    return errores[codigo] || 'Error al procesar la solicitud';
}

// ==================== GESTIÓN DE PROYECTOS ====================

/**
 * Cargar lista de proyectos
 */
async function cargarListaProyectos() {
    try {
        const snapshot = await proyectosRef.orderBy('fecha', 'desc').get();
        const tbody = document.getElementById('lista-proyectos');
        tbody.innerHTML = '';

        if (snapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay proyectos registrados</td></tr>';
            return;
        }

        snapshot.forEach((doc) => {
            const proyecto = doc.data();
            const fecha = proyecto.fecha ? new Date(proyecto.fecha.toDate()).toLocaleDateString() : 'N/A';
            const estado = proyecto.activo ? '<span class="badge bg-success">Activo</span>' : '<span class="badge bg-secondary">Inactivo</span>';
            const categoria = proyecto.categoria === 'first' ? 'Culminados' : 'En marcha';

            const row = `
                <tr>
                    <td>${proyecto.titulo || 'Sin título'}</td>
                    <td>${categoria}</td>
                    <td>${proyecto.ubicacion || 'N/A'}</td>
                    <td>${fecha}</td>
                    <td>${estado}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editarProyecto('${doc.id}')">
                            <i class="fa fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarProyecto('${doc.id}')">
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error al cargar proyectos:', error);
        alert('Error al cargar los proyectos');
    }
}

/**
 * Mostrar formulario de nuevo proyecto
 */
function nuevoProyecto() {
    modoEdicion = 'proyecto';
    idEditando = null;
    imagenesTemporales = [];

    document.getElementById('form-proyecto').reset();
    document.getElementById('modal-proyecto-titulo').textContent = 'Nuevo Proyecto';
    document.getElementById('preview-imagenes-proyecto').innerHTML = '';

    const modal = new bootstrap.Modal(document.getElementById('modal-proyecto'));
    modal.show();
}

/**
 * Editar proyecto
 */
async function editarProyecto(id) {
    try {
        const doc = await proyectosRef.doc(id).get();
        if (!doc.exists) {
            alert('Proyecto no encontrado');
            return;
        }

        const proyecto = doc.data();
        modoEdicion = 'proyecto';
        idEditando = id;
        imagenesTemporales = proyecto.imagenes || [];

        document.getElementById('proyecto-titulo').value = proyecto.titulo || '';
        document.getElementById('proyecto-descripcion').value = proyecto.descripcion || '';
        document.getElementById('proyecto-categoria').value = proyecto.categoria || 'first';
        document.getElementById('proyecto-ubicacion').value = proyecto.ubicacion || '';
        document.getElementById('proyecto-cliente').value = proyecto.cliente || '';
        document.getElementById('proyecto-activo').checked = proyecto.activo !== false;

        mostrarPreviewImagenes(imagenesTemporales, 'preview-imagenes-proyecto');

        document.getElementById('modal-proyecto-titulo').textContent = 'Editar Proyecto';
        const modal = new bootstrap.Modal(document.getElementById('modal-proyecto'));
        modal.show();
    } catch (error) {
        console.error('Error al cargar proyecto:', error);
        alert('Error al cargar el proyecto');
    }
}

/**
 * Guardar proyecto
 */
async function guardarProyecto(e) {
    e.preventDefault();

    const btnGuardar = document.getElementById('btn-guardar-proyecto');
    btnGuardar.disabled = true;
    btnGuardar.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Guardando...';

    try {
        const datos = {
            titulo: document.getElementById('proyecto-titulo').value,
            descripcion: document.getElementById('proyecto-descripcion').value,
            categoria: document.getElementById('proyecto-categoria').value,
            ubicacion: document.getElementById('proyecto-ubicacion').value,
            cliente: document.getElementById('proyecto-cliente').value,
            activo: document.getElementById('proyecto-activo').checked,
            imagenes: imagenesTemporales,
            fecha: idEditando ? undefined : firebase.firestore.FieldValue.serverTimestamp()
        };

        // Eliminar campos undefined
        Object.keys(datos).forEach(key => datos[key] === undefined && delete datos[key]);

        if (idEditando) {
            await proyectosRef.doc(idEditando).update(datos);
        } else {
            await proyectosRef.add(datos);
        }

        bootstrap.Modal.getInstance(document.getElementById('modal-proyecto')).hide();
        cargarListaProyectos();
        mostrarNotificacion('Proyecto guardado exitosamente', 'success');

    } catch (error) {
        console.error('Error al guardar proyecto:', error);
        alert('Error al guardar el proyecto');
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = 'Guardar Proyecto';
    }
}

/**
 * Eliminar proyecto
 */
async function eliminarProyecto(id) {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;

    try {
        await proyectosRef.doc(id).delete();
        cargarListaProyectos();
        mostrarNotificacion('Proyecto eliminado exitosamente', 'success');
    } catch (error) {
        console.error('Error al eliminar proyecto:', error);
        alert('Error al eliminar el proyecto');
    }
}

// ==================== GESTIÓN DE PRODUCTOS ====================

/**
 * Cargar lista de productos
 */
async function cargarListaProductos() {
    try {
        const snapshot = await productosRef.orderBy('orden', 'asc').get();
        const tbody = document.getElementById('lista-productos');
        tbody.innerHTML = '';

        if (snapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay productos registrados</td></tr>';
            return;
        }

        snapshot.forEach((doc) => {
            const producto = doc.data();
            const estado = producto.activo ? '<span class="badge bg-success">Activo</span>' : '<span class="badge bg-secondary">Inactivo</span>';
            const precio = producto.precio ? `S/ ${producto.precio.toFixed(2)}` : 'No especificado';

            const row = `
                <tr>
                    <td>${producto.nombre || 'Sin nombre'}</td>
                    <td>${producto.categoria || 'N/A'}</td>
                    <td>${precio}</td>
                    <td>${producto.orden || 0}</td>
                    <td>${estado}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editarProducto('${doc.id}')">
                            <i class="fa fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarProducto('${doc.id}')">
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error al cargar productos:', error);
        alert('Error al cargar los productos');
    }
}

/**
 * Mostrar formulario de nuevo producto
 */
function nuevoProducto() {
    modoEdicion = 'producto';
    idEditando = null;
    imagenesTemporales = [];

    document.getElementById('form-producto').reset();
    document.getElementById('modal-producto-titulo').textContent = 'Nuevo Producto';
    document.getElementById('preview-imagenes-producto').innerHTML = '';
    document.getElementById('especificaciones-container').innerHTML = '';

    const modal = new bootstrap.Modal(document.getElementById('modal-producto'));
    modal.show();
}

/**
 * Editar producto
 */
async function editarProducto(id) {
    try {
        const doc = await productosRef.doc(id).get();
        if (!doc.exists) {
            alert('Producto no encontrado');
            return;
        }

        const producto = doc.data();
        modoEdicion = 'producto';
        idEditando = id;
        imagenesTemporales = producto.imagenes || [];

        document.getElementById('producto-nombre').value = producto.nombre || '';
        document.getElementById('producto-descripcion').value = producto.descripcion || '';
        document.getElementById('producto-categoria').value = producto.categoria || 'general';
        document.getElementById('producto-precio').value = producto.precio || '';
        document.getElementById('producto-orden').value = producto.orden || 0;
        document.getElementById('producto-activo').checked = producto.activo !== false;

        mostrarPreviewImagenes(imagenesTemporales, 'preview-imagenes-producto');

        // Cargar especificaciones
        const container = document.getElementById('especificaciones-container');
        container.innerHTML = '';
        if (producto.especificaciones) {
            Object.entries(producto.especificaciones).forEach(([key, value]) => {
                agregarEspecificacion(key, value);
            });
        }

        document.getElementById('modal-producto-titulo').textContent = 'Editar Producto';
        const modal = new bootstrap.Modal(document.getElementById('modal-producto'));
        modal.show();
    } catch (error) {
        console.error('Error al cargar producto:', error);
        alert('Error al cargar el producto');
    }
}

/**
 * Guardar producto
 */
async function guardarProducto(e) {
    e.preventDefault();

    const btnGuardar = document.getElementById('btn-guardar-producto');
    btnGuardar.disabled = true;
    btnGuardar.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Guardando...';

    try {
        // Obtener especificaciones
        const especificaciones = {};
        document.querySelectorAll('.especificacion-item').forEach(item => {
            const key = item.querySelector('.espec-key').value.trim();
            const value = item.querySelector('.espec-value').value.trim();
            if (key && value) {
                especificaciones[key] = value;
            }
        });

        const precio = document.getElementById('producto-precio').value;

        const datos = {
            nombre: document.getElementById('producto-nombre').value,
            descripcion: document.getElementById('producto-descripcion').value,
            categoria: document.getElementById('producto-categoria').value,
            precio: precio ? parseFloat(precio) : null,
            orden: parseInt(document.getElementById('producto-orden').value) || 0,
            activo: document.getElementById('producto-activo').checked,
            imagenes: imagenesTemporales,
            especificaciones: especificaciones
        };

        if (idEditando) {
            await productosRef.doc(idEditando).update(datos);
        } else {
            await productosRef.add(datos);
        }

        bootstrap.Modal.getInstance(document.getElementById('modal-producto')).hide();
        cargarListaProductos();
        mostrarNotificacion('Producto guardado exitosamente', 'success');

    } catch (error) {
        console.error('Error al guardar producto:', error);
        alert('Error al guardar el producto');
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = 'Guardar Producto';
    }
}

/**
 * Eliminar producto
 */
async function eliminarProducto(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
        await productosRef.doc(id).delete();
        cargarListaProductos();
        mostrarNotificacion('Producto eliminado exitosamente', 'success');
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar el producto');
    }
}

/**
 * Agregar campo de especificación
 */
function agregarEspecificacion(key = '', value = '') {
    const container = document.getElementById('especificaciones-container');
    const div = document.createElement('div');
    div.className = 'especificacion-item input-group mb-2';
    div.innerHTML = `
        <input type="text" class="form-control espec-key" placeholder="Ej: Potencia" value="${key}">
        <input type="text" class="form-control espec-value" placeholder="Ej: 450W" value="${value}">
        <button type="button" class="btn btn-danger" onclick="this.parentElement.remove()">
            <i class="fa fa-trash"></i>
        </button>
    `;
    container.appendChild(div);
}

// ==================== GESTIÓN DE IMÁGENES ====================

/**
 * Subir imágenes a Firebase Storage
 */
async function subirImagenes(e, tipo) {
    const archivos = e.target.files;
    if (!archivos.length) return;

    const previewId = tipo === 'proyecto' ? 'preview-imagenes-proyecto' : 'preview-imagenes-producto';
    const btnId = tipo === 'proyecto' ? 'btn-subir-img-proyecto' : 'btn-subir-img-producto';
    const btn = document.getElementById(btnId);

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Subiendo...';

    try {
        for (const archivo of archivos) {
            // Validar tipo de archivo
            if (!archivo.type.startsWith('image/')) {
                alert(`El archivo ${archivo.name} no es una imagen válida`);
                continue;
            }

            // Validar tamaño (máx 5MB)
            if (archivo.size > 5 * 1024 * 1024) {
                alert(`La imagen ${archivo.name} es muy grande. Máximo 5MB`);
                continue;
            }

            // Crear referencia única
            const extension = archivo.name.split('.').pop();
            const nombreUnico = `${tipo}/${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`;
            const storageRef = storage.ref(nombreUnico);

            // Subir archivo
            await storageRef.put(archivo);

            // Obtener URL
            const url = await storageRef.getDownloadURL();
            imagenesTemporales.push(url);
        }

        mostrarPreviewImagenes(imagenesTemporales, previewId);
        mostrarNotificacion('Imágenes subidas exitosamente', 'success');

    } catch (error) {
        console.error('Error al subir imágenes:', error);
        alert('Error al subir las imágenes');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa fa-upload"></i> Subir Imágenes';
        e.target.value = ''; // Resetear input
    }
}

/**
 * Mostrar preview de imágenes
 */
function mostrarPreviewImagenes(imagenes, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    imagenes.forEach((url, index) => {
        const div = document.createElement('div');
        div.className = 'preview-imagen';
        div.innerHTML = `
            <img src="${url}" alt="Imagen ${index + 1}">
            <button type="button" class="btn-eliminar-imagen" onclick="eliminarImagenTemporal(${index}, '${containerId}')">
                <i class="fa fa-times"></i>
            </button>
        `;
        container.appendChild(div);
    });
}

/**
 * Eliminar imagen temporal
 */
function eliminarImagenTemporal(index, containerId) {
    if (!confirm('¿Eliminar esta imagen?')) return;

    imagenesTemporales.splice(index, 1);
    mostrarPreviewImagenes(imagenesTemporales, containerId);
}

// ==================== UTILIDADES ====================

/**
 * Mostrar notificación
 */
function mostrarNotificacion(mensaje, tipo = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Form login
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', iniciarSesion);
    }

    // Form proyecto
    const formProyecto = document.getElementById('form-proyecto');
    if (formProyecto) {
        formProyecto.addEventListener('submit', guardarProyecto);
    }

    // Form producto
    const formProducto = document.getElementById('form-producto');
    if (formProducto) {
        formProducto.addEventListener('submit', guardarProducto);
    }
});
