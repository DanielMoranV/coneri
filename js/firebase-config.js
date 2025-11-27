// Configuración centralizada de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAl7ituXOM3hg2oYRX57IAGrU-cOu2q3Qk",
    authDomain: "proyecto-coneri.firebaseapp.com",
    databaseURL: "https://proyecto-coneri-default-rtdb.firebaseio.com",
    projectId: "proyecto-coneri",
    storageBucket: "proyecto-coneri.appspot.com",
    messagingSenderId: "551182184129",
    appId: "1:551182184129:web:9bb0245e70fdf0357dae40",
    measurementId: "G-1ZNH83SVLG"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar servicios
const db = firebase.firestore();
// const storage = firebase.storage(); // Ya no usamos Firebase Storage, ahora usamos Cloudinary
const auth = firebase.auth();
const realtimeDb = firebase.database();

// Configurar idioma de autenticación
auth.languageCode = 'es';

// Referencias a colecciones
const proyectosRef = db.collection('proyectos');
const productosRef = db.collection('productos');

// Mantener compatibilidad con el contador de visitas
const coleccionVisitas = realtimeDb.ref().child('visitas');
