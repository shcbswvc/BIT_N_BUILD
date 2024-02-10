import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.5.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.1/firebase-auth.js";

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

const dbRef = ref(database, 'Announcements');
let messages = [];

onValue(dbRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();

        const announcement = {
            text: childData.summary,
            date: childData.EventDate,
            author: childData.AnnouncementBy,
        };

        messages.push(announcement);
    });

    displayAnnouncementsOnCurrentPage();
});

function displayAnnouncementsOnCurrentPage() {
  const currentPageName = window.location.pathname.split('/').pop().split('.')[0];
  console.log('Current Page:', currentPageName);

  const filteredMessages = messages.filter(message => {
    console.log('Checking Message Author:', message.author.trim().toLowerCase());
    return message.author.trim().toLowerCase() === currentPageName;
  });

  console.log('Filtered Messages:', filteredMessages);

  const messageList = document.querySelector('.message_list');
  messageList.innerHTML = "";

  filteredMessages.forEach((message) => {
      const messageElement = createMessageElement(message);
      messageList.appendChild(messageElement);
  });
}

function createMessageElement(message) {
    const li = document.createElement('li');
    li.classList.add('message_content');

    const p = document.createElement('p');
    p.classList.add('message_full_text');
    p.textContent = message.text;

    const dateSpan = document.createElement('span');
    dateSpan.classList.add('message_date');
    dateSpan.textContent = 'Event date : ' + message.date;

    const authorSpan = document.createElement('span');
    authorSpan.classList.add('message_author');
    authorSpan.textContent = 'Announcement from ' + message.author;

    li.appendChild(p);
    li.appendChild(dateSpan);
    li.appendChild(authorSpan);

    return li;
}

const announcementsSwitch = document.querySelector('#announcements');
var x = false;

announcementsSwitch.addEventListener('click', function () {
    if (x == false) {
        openNav();
        x = true;
    } else {
        closeNav();
        x = false;
    }
});

function openNav() {
    document.getElementById("myNav").style.width = "100vw";
}

function closeNav() {
    document.getElementById("myNav").style.width = "0vw";
}
  