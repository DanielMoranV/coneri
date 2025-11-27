# 🚀 Instrucciones para Desplegar a Firebase Hosting

## ✅ DESPLIEGUE RÁPIDO (Ya tienes todo listo)

### **Paso 1: Autentícate con Firebase**

```bash
# Abre PowerShell o CMD en la carpeta del proyecto
cd C:\Users\Daniel\Desktop\DesarrolloWeb\coneri-1

# Inicia sesión con TU cuenta personal de Google
firebase login
```

**IMPORTANTE:**
- Usa TU cuenta personal de Google (no necesitas la del cliente)
- Se abrirá tu navegador para autenticarte
- Acepta los permisos

### **Paso 2: Verifica el Proyecto**

```bash
# Verifica que estés usando el proyecto correcto
firebase use proyecto-coneri

# Si te dice que no existe, lista los proyectos disponibles:
firebase projects:list
```

**¿No ves el proyecto?**
- Pídele al cliente que te agregue como colaborador en Firebase Console
- O usa `firebase use --add` para vincularlo manualmente

### **Paso 3: Despliega**

```bash
# Despliega todo
firebase deploy --only hosting
```

Esperarás unos 30-60 segundos y verás algo como:

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/proyecto-coneri/overview
Hosting URL: https://proyecto-coneri.web.app
```

### **Paso 4: Accede a tu Panel**

Ahora accede a:
```
https://proyecto-coneri.web.app/admin.html
```

**¡Sin errores de CORS!** 🎉

---

## 🔐 CREAR USUARIO ADMINISTRADOR

Una vez desplegado, crea tu usuario:

1. Ve a: https://console.firebase.google.com/project/proyecto-coneri
2. Authentication → Users → Add User
3. Email: `admin@coneri.pe`
4. Password: (tu contraseña segura)

Luego inicia sesión en: `https://proyecto-coneri.web.app/admin.html`

---

## 🔄 FLUJO DE TRABAJO RECOMENDADO

### **Para desarrollo:**
1. Edita archivos localmente
2. Prueba visualmente en `http://127.0.0.1:5500`
3. Cuando todo esté bien, despliega: `firebase deploy`

### **Para probar funcionalidades de Firebase:**
- **NO uses localhost** (hay errores de CORS)
- **USA el sitio desplegado**: `proyecto-coneri.web.app`
- Cada cambio requiere re-desplegar

### **Comandos útiles:**

```bash
# Desplegar rápido
firebase deploy --only hosting

# Ver logs
firebase hosting:logs

# Abrir sitio en el navegador
firebase open hosting:site

# Ver qué proyecto estás usando
firebase use
```

---

## 🆘 SI NO TIENES PERMISOS EN EL PROYECTO

Si al ejecutar `firebase use proyecto-coneri` te dice que no tienes acceso:

### **Opción A: Pedir permisos al cliente**

Dile al cliente que:
1. Vaya a: https://console.firebase.google.com/project/proyecto-coneri
2. ⚙️ Project Settings → Users and permissions
3. Add member → **TU EMAIL PERSONAL**
4. Rol: **Editor** o **Owner**

### **Opción B: El cliente te comparte las credenciales**

Si el cliente prefiere darte acceso temporal:
- Que te dé usuario/contraseña de su Google Account
- Creas un nuevo perfil de Chrome para esa cuenta
- Trabajas desde ahí

---

## ✅ RESUMEN

**Lo más fácil:**
1. `firebase login` (con TU cuenta)
2. `firebase use proyecto-coneri`
3. `firebase deploy --only hosting`
4. Trabajar desde: `https://proyecto-coneri.web.app`

**¡Sin CORS, sin problemas!** 🎉
