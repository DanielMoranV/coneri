// Your web app's Firebase configuration
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
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
coleccionVisitas = db.ref().child('visitas');

let nVisitas = document.querySelector('#nVisitas')

window.addEventListener('DOMContentLoaded', async (e) => {
  e.preventDefault()
  await coleccionVisitas.on('value', (visitas) => {
    visitas.forEach((visita) => {
      let visitaData = visita.val()
      nVisitas.innerHTML = visitaData.n_visitas
    })
  })
})

function updateVisita(){
  firebase
        .database()
        .ref('visitas/contador')
        .once('value')
        .then((visita)=> {
        const data = visita.val()
        let n_visitas = data.n_visitas
        let addVisita = parseInt(n_visitas + 1)
        const updateVisita = firebase.database().ref('visitas/contador')
        updateVisita.set({
          n_visitas : addVisita
        })
        })

}
updateVisita()