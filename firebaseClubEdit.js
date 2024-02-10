import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.1/firebase-app.js";
import { getDatabase, set, ref, push, get } from "https://www.gstatic.com/firebasejs/10.5.1/firebase-database.js"
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
    const clubNameElement = document.getElementById('clubNameElement');
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userId = user.uid;
            const userRef = ref(database, 'Club Management/' + userId);
            get(userRef).then((snapshot) => {
                const userData = snapshot.val();
                clubNameElement.innerHTML = userData.username;
            });
        } else {
        }
    });
    const announcementSubmitButton = document.querySelector('#submitButton');
    announcementSubmitButton.addEventListener('click', async (e) => {
        e.preventDefault();

        const rawEventDate = document.getElementById('inputDate').value;
        const url = document.getElementById('url').value;
        const announcement = document.getElementById('inputtext').value;
        const summary = document.getElementById('summary').value;
        const announcementsRef = ref(database, 'Announcements');

        // Format the eventDate to DD/MM/YYYY
        const parts = rawEventDate.split('-');
        const formattedEventDate = `${parts[2]}/${parts[1]}/${parts[0]}`;

        const newAnnouncementRef = push(announcementsRef);
        const dt = new Date();

        set(newAnnouncementRef, {
            AnnouncementBy: clubNameElement.textContent,
            EventDate: formattedEventDate,
            url: url,
            announcement: announcement,
            summary : summary,
            timeAdded: dt.toISOString()
        }).then(() => {
            alert("Added to database");
        }).catch((error) => {
            console.log(error);
        });
    });
});


