import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.1/firebase-app.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.5.1/firebase-database.js"
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.5.1/firebase-auth.js";
    
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
    const signUpButton = document.querySelector('.signUpButton');
    signUpButton.addEventListener('click', async (e) => {
        e.preventDefault();

        var email = document.getElementById('emailID').value;
        var password = document.getElementById('passwordID').value;
        var confirmPassword = document.getElementById('confirmpasswordID').value;
        var username = document.getElementById('usernameID').value;

        if (password !== confirmPassword) {
            document.getElementById('passwordMatchError').textContent = 'Passwords do not match';
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('User created:', user);

            // Wait until the user is created before proceeding
            await sendEmailVerification(user);

            const userId = user.uid;
            const userRef = ref(database, 'users/' + userId);
            const dt = new Date();
            set(userRef, {
                username: username,
                email: email,
                last_login: dt,
                last_logout: dt
            }).then(() => {
                if(email=='campusclubhub@gmail.com'){
                    window.location = 'campusClubHub.html'
                }else{
                    window.location = 'index.html';
                }
            }).catch((error) => {
                console.log(error);
                document.getElementById('passwordMatchError').textContent = error.message;
            });
        } catch (error) {
            document.getElementById('passwordMatchError').textContent = error.message;
        }
    });
});