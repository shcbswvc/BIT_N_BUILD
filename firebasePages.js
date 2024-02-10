import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.1/firebase-app.js";
import { getDatabase, get, ref } from "https://www.gstatic.com/firebasejs/10.5.1/firebase-database.js"
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.1/firebase-auth.js";
  
const firebaseConfig = {
    apiKey: "AIzaSyDlGGDbdAnntuJPu9znmx2HRxeoxvb_Bc4",
    authDomain: "campus-club-hub-a2f5b.firebaseapp.com",
    databaseURL: "https://campus-club-hub-a2f5b-default-rtdb.firebaseio.com",
    projectId: "campus-club-hub-a2f5b",
    storageBucket: "campus-club-hub-a2f5b.appspot.com",
    messagingSenderId: "131774428532",
    appId: "1:131774428532:web:3b9296146483cd6121a821"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

document.addEventListener('DOMContentLoaded', function () {
    console.log('Document loaded');
    const auth = getAuth();
    const database = getDatabase(app);
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userId = user.uid;
            const userRef = ref(database, 'users/' + userId);
            get(userRef).then((snapshot) => {
                const userData = snapshot.val();
                document.getElementById('trial').innerHTML = `<a href="#popup1"><button id="back">Apply</button></a>`; 

            });
        } else {
        }
    });
});
