import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.1/firebase-app.js";
import { getDatabase, set, ref, update, get } from "https://www.gstatic.com/firebasejs/10.5.1/firebase-database.js"
import { getAuth, onAuthStateChanged, signOut, updatePassword } from "https://www.gstatic.com/firebasejs/10.5.1/firebase-auth.js";
      
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
    const email = document.getElementById('emailProfile');
    const userName = document.getElementById('userName');
    const userName1 = document.getElementById('userName1');
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userId = user.uid;
            const userRef = ref(database, 'users/' + userId);
            get(userRef).then((snapshot) => {
                const userData = snapshot.val();
                email.textContent = userData.email;
                userName.textContent = userData.username;
                userName1.textContent = userData.username;
            });
        } else {
        }
    });
});
const logOutButton = document.getElementById('logout');
logOutButton.addEventListener('click', (e) => {
    e.preventDefault();
    const dt = new Date();
    const user = auth.currentUser;
    if (user) {
        update(ref(database, 'users/' + user.uid), {
            last_logout: dt
        }).then(() => {
            signOut(auth).then(() => {
            alert('User logged out.');
            window.location.href = 'index.html';
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert('Error!');
            });
            
        }).catch((error) => {
            console.error(error);
        });
    }
});
const changePasswordButton = document.querySelector('.signUpButton');

changePasswordButton.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    const newPassword = document.getElementById('passwordID').value;
    const confirmPassword = document.getElementById('confirmpasswordID').value;

    if (newPassword !== confirmPassword) {
        document.getElementById('passwordMatchError').textContent = 'Passwords do not match';
        return;
    }

    try {
        await updatePassword(user, newPassword);
        document.getElementById('passwordChanged').textContent = 'Password changed!';
    } catch (error) {
        document.getElementById('passwordMatchError').textContent = error.message;
    }
});

   