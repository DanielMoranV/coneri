# Crear Índices Compuestos en Firebase Firestore

## ¿Por qué necesito esto?

Firebase Firestore requiere índices compuestos cuando haces consultas con:
- `.where()` en un campo + `.orderBy()` en otro campo diferente

## Opción 1: Usar el enlace automático (MÁS FÁCIL)

1. Copia el enlace que aparece en el error de la consola del navegador
2. Pégalo en tu navegador
3. Firebase te llevará directamente a crear el índice
4. Haz clic en **"Crear índice"**
5. Espera 1-2 minutos mientras se crea

## Opción 2: Crear manualmente en Firebase Console

### Para PROYECTOS:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **proyecto-coneri**
3. En el menú izquierdo, ve a **Firestore Database**
4. Haz clic en la pestaña **"Índices"**
5. Haz clic en **"Crear índice"**
6. Configura así:
   - **Colección**: `proyectos`
   - **Campos a indexar**:
     - Campo 1: `activo` - Orden: **Ascendente**
     - Campo 2: `fecha` - Orden: **Descendente**
   - **Estado de consulta**: Collection
7. Haz clic en **"Crear"**

### Para PRODUCTOS (Índice básico):

1. Repite los pasos 1-5
2. Configura así:
   - **Colección**: `productos`
   - **Campos a indexar**:
     - Campo 1: `activo` - Orden: **Ascendente**
     - Campo 2: `orden` - Orden: **Ascendente**
   - **Estado de consulta**: Collection
3. Haz clic en **"Crear"**

### Para PRODUCTOS con CATEGORÍA (Opcional - Mejor rendimiento):

1. Repite los pasos 1-5
2. Configura así:
   - **Colección**: `productos`
   - **Campos a indexar**:
     - Campo 1: `activo` - Orden: **Ascendente**
     - Campo 2: `categoria` - Orden: **Ascendente**
     - Campo 3: `orden` - Orden: **Ascendente**
   - **Estado de consulta**: Collection
3. Haz clic en **"Crear"**

> **Nota**: Este índice ya NO es necesario porque el código ahora ordena en el cliente, pero mejorará el rendimiento si tienes muchos productos.

## ⏱️ Tiempo de creación

Los índices pueden tardar **1-5 minutos** en crearse, especialmente si tienes muchos documentos.

## ✅ Verificar que funcionó

1. Espera a que el estado del índice cambie a **"Habilitado"** (verde)
2. Recarga tu página web
3. Los proyectos y productos deberían cargar correctamente

## 🔧 Alternativa temporal (sin índices)

Si necesitas probar rápidamente sin crear índices, puedo modificar el código para eliminar los `.orderBy()` temporalmente, pero los datos no estarán ordenados.
