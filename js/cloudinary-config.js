// Configuración de Cloudinary para subida de imágenes
// REEMPLAZA 'TU_CLOUD_NAME' con el Cloud Name de tu cuenta Cloudinary

const CLOUDINARY_CONFIG = {
    cloudName: 'TU_CLOUD_NAME',  // ⚠️ CAMBIA ESTO por tu Cloud Name
    uploadPreset: 'coneri_productos'  // El preset que creaste
};

/**
 * Crear widget de Cloudinary
 */
function crearCloudinaryWidget(callback) {
    return cloudinary.createUploadWidget({
        cloudName: CLOUDINARY_CONFIG.cloudName,
        uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
        sources: ['local', 'url', 'camera'],
        multiple: true,
        maxFiles: 10,
        maxFileSize: 5000000, // 5MB
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        folder: 'coneri',
        resourceType: 'image',
        cropping: false,
        showSkipCropButton: true,
        styles: {
            palette: {
                window: "#FFFFFF",
                windowBorder: "#00B98D",
                tabIcon: "#00B98D",
                menuIcons: "#5A616A",
                textDark: "#000000",
                textLight: "#FFFFFF",
                link: "#00B98D",
                action: "#00B98D",
                inactiveTabIcon: "#0E2F5A",
                error: "#F44235",
                inProgress: "#00B98D",
                complete: "#20B832",
                sourceBg: "#E4EBF1"
            },
            fonts: {
                default: null,
                "'Roboto', sans-serif": {
                    url: "https://fonts.googleapis.com/css?family=Roboto",
                    active: true
                }
            }
        },
        language: 'es',
        text: {
            es: {
                or: 'O',
                back: 'Atrás',
                advanced: 'Avanzado',
                close: 'Cerrar',
                no_results: 'Sin resultados',
                search_placeholder: 'Buscar archivos',
                about_uw: 'Acerca del widget',
                menu: {
                    files: 'Mis archivos',
                    web: 'URL',
                    camera: 'Cámara'
                },
                local: {
                    browse: 'Examinar',
                    dd_title_single: 'Arrastra una imagen aquí',
                    dd_title_multi: 'Arrastra imágenes aquí',
                    drop_title_single: 'Suelta para subir',
                    drop_title_multiple: 'Suelta para subir'
                },
                camera: {
                    capture: 'Capturar',
                    cancel: 'Cancelar',
                    take_pic: 'Toma una foto y súbela',
                    explanation: 'Asegúrate de que tu cámara esté conectada',
                    camera_error: 'Error al acceder a la cámara',
                    retry: 'Reintentar'
                },
                url: {
                    inner_title: 'URL pública de imagen:',
                    input_placeholder: 'https://ejemplo.com/imagen.jpg'
                },
                queue: {
                    title: 'Cola de subida',
                    title_uploading_with_counter: 'Subiendo {{num}} archivos',
                    title_uploading: 'Subiendo archivos',
                    mini_title: 'Subido',
                    mini_title_uploading: 'Subiendo',
                    show_completed: 'Mostrar completados',
                    retry_failed: 'Reintentar fallidos',
                    abort_all: 'Cancelar todo',
                    upload_more: 'Subir más',
                    done: 'Listo',
                    mini_upload_count: '{{num}} subidos',
                    mini_failed: '{{num}} fallidos',
                    statuses: {
                        uploading: 'Subiendo...',
                        error: 'Error',
                        uploaded: 'Listo',
                        aborted: 'Cancelado'
                    }
                }
            }
        }
    }, callback);
}
