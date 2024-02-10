import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.1/firebase-app.js";
import { 
    getDatabase, 
    ref, 
    update,
    get 
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
                const userId = user.uid;

                // Check if the user's data is in the "Club Management" folder
                // Replace 'club-management' with the actual key in your database
                const clubManagementRef = ref(database, 'Club Management/' + userId);

                get(clubManagementRef)
                    .then((clubManagementData) => {
                        // Check if club management data exists
                        if (clubManagementData.exists()) {
                            const dt = new Date();
                            update(ref(database, 'Club Management/' + userId), {
                                last_login: dt,
                            }).then(() => {
                                window.location = 'clubPageEdit.html';
                            });
                        } else {
                            document.getElementById('error').textContent = "User not authorized.";
                        }
                    })
                    .catch((error) => {
                        console.error("Error checking club management data:", error);
                        document.getElementById('error').textContent = "Error checking user data.";
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
});
