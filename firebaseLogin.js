import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.1/firebase-app.js";
import { 
    getDatabase, 
    ref, 
    update 
} from "https://www.gstatic.com/firebasejs/10.5.1/firebase-database.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail, 
    GoogleAuthProvider,
    signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.5.1/firebase-auth.js";
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
const provider = new GoogleAuthProvider();
document.addEventListener('DOMContentLoaded', function () {
    const signInButton = document.querySelector('.signInButton');
    const resetButton = document.querySelector('.reset');
    signInButton.addEventListener('click', (e) => {
    e.preventDefault();
    var email = document.getElementById('emailID').value;
    var password = document.getElementById('passwordID').value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        const user = userCredential.user;
        const dt = new Date();
        update(ref(database, 'users/' + user.uid), {
            last_login: dt,
        }).then(() => {
            window.location = 'index.html';
        });
        })
        .catch((error) => {
        const errorMessage = error.message;
        document.getElementById('error').textContent = errorMessage;
        });
    });
    resetButton.addEventListener('click', (e) => {
        e.preventDefault();
        var email = document.getElementById('emailID').value;
        sendPasswordResetEmail(auth, email)
        .then(() => {
            document.getElementById('error').textContent = "Password reset Email sent!";
            document.getElementById('error').style.color = "green";
        })
        .catch((error) => {
            const errorMessage = error.message;
            document.getElementById('error').textContent = errorMessage;
        });
    });
    const signInWithGoogleButton = document.querySelector('.signInButton.signInWithGoogleButton');
    signInWithGoogleButton.addEventListener('click', (e) => {
        e.preventDefault();
        signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const info = result.user;
            var email = info.email;
            var username = info.displayName;
            const userId = result.user.uid;
            const userRef = ref(database, 'users/' + userId);
            const dt = new Date();
            update(userRef, {
                username: username,
                email: email,
                last_login: dt,
            })
            .then(() => {
                window.location.href = 'index.html';
            })
            .catch((error) => {
                console.error('Error during sign-in:', error.code, error.message);
            });
        })
        .catch((error) => {
            console.error('Error during sign-in:', error.code, error.message);
        });
    });
});