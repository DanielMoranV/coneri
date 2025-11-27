# 🌐 Guía: Migrar Dominio Personalizado a proyecto-coneri

Guía paso a paso para migrar un dominio de Punto.pe desde coneri-web a proyecto-coneri.

---

## 🎯 Objetivo

Migrar el dominio personalizado (ej: `coneri.pe`) de tu cuenta personal (coneri-web) a la cuenta del cliente (proyecto-coneri).

---

## ⏱️ Tiempo Estimado

- **Configuración:** 15-30 minutos
- **Propagación DNS:** 5 minutos - 24 horas

---

## 📋 Checklist Pre-Migración

Antes de empezar, asegúrate de tener:

- [ ] Acceso al panel de Punto.pe
- [ ] Acceso a Firebase Console de coneri-web
- [ ] Acceso a Firebase Console de proyecto-coneri
- [ ] El dominio actual funcionando (para copiar la configuración)

---

## 🚀 Paso 1: Documentar Configuración Actual

### **1.1. Anotar los registros DNS actuales**

Antes de cambiar nada, anota la configuración actual:

1. Ve a Firebase Console de **coneri-web**:
   ```
   https://console.firebase.google.com/project/coneri-web/hosting
   ```

2. En la sección **"Dominios"**, busca tu dominio

3. Anota los registros DNS que están configurados:
   ```
   Dominio: coneri.pe

   Registros actuales:
   - Tipo A: 151.101.1.195, 151.101.65.195
   - Tipo TXT: [código-verificación]
   - CNAME www: coneri-web.web.app
   ```

---

## 🗑️ Paso 2: Eliminar Dominio de coneri-web

### **2.1. Desde Firebase Console**

1. Ve a: https://console.firebase.google.com/project/coneri-web/hosting

2. Encuentra tu dominio en la sección **"Dominios"**

3. Haz clic en **⋮** (tres puntos) → **"Eliminar dominio"**

4. Confirma la eliminación

⚠️ **ADVERTENCIA:**
- El sitio dejará de funcionar temporalmente en `coneri.pe`
- Solo estará disponible en `coneri-web.web.app` hasta que completes la migración
- Idealmente hazlo en horario de bajo tráfico

---

## ➕ Paso 3: Agregar Dominio a proyecto-coneri

### **3.1. Desde Firebase Console (Recomendado)**

1. **Ir a Firebase Console de proyecto-coneri:**
   ```
   https://console.firebase.google.com/project/proyecto-coneri/hosting
   ```

2. **Clic en "Agregar dominio personalizado"**

3. **Ingresar tu dominio:**
   ```
   coneri.pe
   ```

   - ✅ Marca la opción **"Configurar también el subdominio www"** (recomendado)

4. **Firebase mostrará los registros DNS necesarios:**

   **Para el dominio raíz (coneri.pe):**
   ```
   Tipo: A
   Nombre: @
   Valor: 151.101.1.195

   Tipo: A
   Nombre: @
   Valor: 151.101.65.195

   Tipo: TXT
   Nombre: @
   Valor: [código-de-verificación-único]
   ```

   **Para www (www.coneri.pe):**
   ```
   Tipo: CNAME
   Nombre: www
   Valor: proyecto-coneri.web.app
   ```

5. **Copia estos registros** (los necesitarás en el siguiente paso)

---

## 🔧 Paso 4: Actualizar DNS en Punto.pe

### **4.1. Acceder al Panel de Punto.pe**

1. Ve a: https://www.punto.pe/panel

2. Inicia sesión con las credenciales del cliente

3. Selecciona el dominio **coneri.pe**

### **4.2. Ir a Gestión de DNS**

1. Busca la sección **"DNS"** o **"Gestión de Zona DNS"**

2. Elimina todos los registros antiguos relacionados con Firebase/coneri-web

### **4.3. Agregar Nuevos Registros**

**Registros A (para el dominio raíz):**
```
Tipo    Nombre    Valor             TTL
────────────────────────────────────────────
A       @         151.101.1.195     3600
A       @         151.101.65.195    3600
```

**Registro TXT (para verificación):**
```
Tipo    Nombre    Valor                          TTL
────────────────────────────────────────────────────────
TXT     @         [código-de-firebase]           3600
```

**Registro CNAME (para www):**
```
Tipo    Nombre    Valor                      TTL
────────────────────────────────────────────────────
CNAME   www       proyecto-coneri.web.app    3600
```

### **4.4. Guardar Cambios**

- Haz clic en **"Guardar"** o **"Aplicar cambios"**
- Confirma los cambios

---

## ⏳ Paso 5: Esperar Propagación DNS

### **5.1. Tiempo de Espera**

- **Mínimo:** 5-10 minutos
- **Promedio:** 1-2 horas
- **Máximo:** 24 horas

### **5.2. Verificar Propagación**

**Opción A: Herramientas Online**

1. Ve a: https://dnschecker.org/
2. Ingresa: `coneri.pe`
3. Verifica que los registros A apunten a las IPs de Firebase

**Opción B: Desde Terminal**

```bash
# Windows (PowerShell)
nslookup coneri.pe

# Linux/Mac
dig coneri.pe
```

**Salida esperada:**
```
coneri.pe
Address: 151.101.1.195
Address: 151.101.65.195
```

---

## ✅ Paso 6: Verificación en Firebase

### **6.1. Estado del Dominio**

1. Ve a: https://console.firebase.google.com/project/proyecto-coneri/hosting

2. En la sección **"Dominios"** verás:

   **Estado en proceso:**
   ```
   coneri.pe
   ⏳ Pendiente verificación
   ```

   **Estado verificado:**
   ```
   coneri.pe
   ✅ Conectado
   🔒 SSL activo
   ```

### **6.2. Probar el Sitio**

Una vez que el estado sea **"Conectado"**:

```
https://coneri.pe           ← Debe cargar tu sitio
https://www.coneri.pe       ← Debe redirigir o cargar tu sitio
```

---

## 🔒 Paso 7: SSL/HTTPS (Automático)

Firebase emitirá automáticamente un certificado SSL gratuito:

- ⏱️ Puede tomar de 15 minutos a 24 horas
- 🔒 Se renovará automáticamente cada 90 días
- ✅ No requiere configuración adicional

**Verificar SSL:**
1. Ve a `https://coneri.pe`
2. Verifica el candado verde 🔒 en el navegador
3. Haz clic en el candado → **"El certificado es válido"**

---

## 📊 Resumen de URLs

### **Antes de la Migración:**
```
coneri-web (tu cuenta personal):
├─ https://coneri-web.web.app      ← Dominio por defecto
└─ https://coneri.pe                ← Dominio personalizado ❌

proyecto-coneri (cuenta cliente):
└─ https://proyecto-coneri.web.app ← Solo dominio por defecto
```

### **Después de la Migración:**
```
coneri-web (ya no se usa):
└─ https://coneri-web.web.app      ← Solo por defecto (sin dominio)

proyecto-coneri (cuenta cliente):
├─ https://proyecto-coneri.web.app ← Dominio por defecto
├─ https://coneri.pe                ← Dominio personalizado ✅
└─ https://www.coneri.pe            ← Redirección automática ✅
```

---

## 🐛 Solución de Problemas

### **Problema 1: "Dominio no verificado"**

**Causa:** Los registros DNS no están correctos o no se han propagado

**Solución:**
1. Verifica que los registros DNS en Punto.pe sean exactos
2. Espera más tiempo (hasta 24 horas)
3. Usa https://dnschecker.org/ para verificar propagación

---

### **Problema 2: "SSL no activo"**

**Causa:** Firebase aún está generando el certificado

**Solución:**
1. Espera hasta 24 horas
2. El certificado se genera automáticamente
3. No requiere acción

---

### **Problema 3: "www no funciona"**

**Causa:** Falta el registro CNAME para www

**Solución:**
1. Agrega en Punto.pe:
   ```
   Tipo: CNAME
   Nombre: www
   Valor: proyecto-coneri.web.app
   ```
2. Espera propagación DNS

---

### **Problema 4: "Sitio viejo todavía aparece"**

**Causa:** Caché del navegador

**Solución:**
1. Limpia caché del navegador (Ctrl + Shift + Delete)
2. Prueba en modo incógnito
3. Prueba desde otro dispositivo

---

## 📱 Verificación Completa

### **Checklist Final:**

- [ ] `https://coneri.pe` carga correctamente
- [ ] `https://www.coneri.pe` funciona
- [ ] Certificado SSL activo (candado verde)
- [ ] Panel de admin accesible: `https://coneri.pe/admin.html`
- [ ] Catálogo funciona: `https://coneri.pe/catalogo.html`
- [ ] Todas las imágenes cargan correctamente
- [ ] Firebase Console muestra dominio "Conectado"

---

## 💡 Consejos

### **Mejor Horario para Migrar:**
- 🌙 **Madrugada** (2-5 AM): Menos tráfico
- 📅 **Día de semana**: Evitar fines de semana

### **Comunicación:**
- Avisa al cliente del cambio
- Explica que puede haber 5-30 min de downtime
- Ten un plan de rollback (volver atrás)

### **Monitoreo:**
- Verifica el sitio cada hora el primer día
- Revisa Google Analytics para ver si hay caídas de tráfico
- Prueba desde diferentes dispositivos/ubicaciones

---

## 🔄 Plan de Rollback (Emergencia)

Si algo sale mal y necesitas volver atrás:

1. **Eliminar dominio de proyecto-coneri:**
   - Firebase Console → proyecto-coneri → Hosting → Eliminar dominio

2. **Re-agregar dominio a coneri-web:**
   - Firebase Console → coneri-web → Hosting → Agregar dominio

3. **Actualizar DNS en Punto.pe:**
   - Volver a los registros originales de coneri-web

⏱️ **Tiempo de recuperación:** 5-30 minutos

---

## 📞 Soporte

- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Punto.pe Soporte](https://www.punto.pe/soporte)
- [Verificador DNS](https://dnschecker.org/)

---

## ✅ Después de la Migración

Una vez completada exitosamente:

1. **Actualizar documentación del cliente** con las nuevas URLs
2. **Actualizar enlaces** en materiales de marketing
3. **Notificar a Google** del cambio de dominio (Google Search Console)
4. **Configurar redirecciones 301** si es necesario

---

**Última actualización:** 2024-11-27
