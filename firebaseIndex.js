import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.1/firebase-app.js";
import { getDatabase, set, ref, update, get, onValue } from "https://www.gstatic.com/firebasejs/10.5.1/firebase-database.js"
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.5.1/firebase-auth.js";
      
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
    const trialElement = document.getElementById('trial');
    onAuthStateChanged(auth, (user) => {
    if (user) {
      const userId = user.uid;
      const userRef = ref(database, 'users/' + userId);
      const clubManagementRef = ref(database, 'Club Management/' + userId);
      Promise.all([get(userRef), get(clubManagementRef)])
          .then(([userData, clubManagementData]) => {
              if (clubManagementData.exists()) {
                  const username = clubManagementData.val().username;
                  trialElement.innerHTML = `<a href="./myProfile.html"><button id="back">Welcome, ${username}</button></a>`;
                  document.getElementById('loginlogin').style.display = 'none';
                  document.getElementById('loginlogin1').innerHTML = '<a href="./clubPageEdit.html"><li>Add Club Announcements</li></a>';
              } else if (userData.exists()) {
                  const username = userData.val().username;
                  const userEmail = userData.val().email;
                  trialElement.innerHTML = `<a href="./myProfile.html"><button id="back">Welcome, ${username}</button></a>`;
                  document.getElementById('loginlogin').style.display = 'none';
                  document.getElementById('signupsignup').style.display = 'none';
                  document.getElementById('clubloginclublogin').style.display = 'none';
                  if(userEmail=='campusclubhub@gmail.com'){
                    document.getElementById('loginlogin1').innerHTML = '<a href="./campusClubHub.html"><li>Create Club Account</li></a>';
                  }
              } else {
                  trialElement.innerHTML = '<a href="./login.html" id="trial"><button id="back">Log In</button></a>';
              }
          })
          .catch((error) => {
              console.error("Error checking user and club management data:", error);
              trialElement.innerHTML = '<a href="./login.html" id="trial"><button id="back">Log In</button></a>';
      });
    } else {
        trialElement.innerHTML = '<a href="./login.html" id="trial"><button id="back">Log In</button></a>';
    }
  });
});

const logOutButton = document.getElementById('logout');
logOutButton.addEventListener('click', (e) => {
    e.preventDefault();
    const dt = new Date();
    const user = auth.currentUser;

    if (user) {
        const userId = user.uid;
        const userRef = ref(database, 'users/' + userId);
        const clubManagementRef = ref(database, 'Club Management/' + userId);

        Promise.all([get(userRef), get(clubManagementRef)])
            .then(([userData, clubManagementData]) => {
                if (clubManagementData.exists()) {
                    // Update last logout in 'Club Management/' data
                    update(ref(database, 'Club Management/' + userId), {
                        last_logout: dt
                    }).then(() => {
                        // Perform the sign-out
                        signOut(auth).then(() => {
                            document.getElementById('trial').innerHTML = '<a href="./login.html"><button id="back">Log In</button></a>';
                            alert('User logged out.');
                        }).catch((error) => {
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            alert('Error!');
                        });
                    }).catch((error) => {
                        console.error("Error updating Club Management data:", error);
                    });
                } else {
                    // Update last logout in 'users/' data
                    update(ref(database, 'users/' + userId), {
                        last_logout: dt
                    }).then(() => {
                        // Perform the sign-out
                        signOut(auth).then(() => {
                            document.getElementById('trial').innerHTML = '<a href="./login.html"><button id="back">Log In</button></a>';
                            alert('User logged out.');
                        }).catch((error) => {
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            alert('Error!');
                        });
                    }).catch((error) => {
                        console.error("Error updating users data:", error);
                    });
                }
            })
            .catch((error) => {
                console.error("Error checking user and club management data:", error);
            });
    }
});

const dbRef = ref(database, 'Announcements');
let messages = [];

onValue(dbRef, (snapshot) => {
  snapshot.forEach((childSnapshot) => {
    const childKey = childSnapshot.key;
    const childData = childSnapshot.val();

    const announcement = {
      text: childData.summary,
      date: childData.EventDate,
      author: childData.AnnouncementBy,
    };

    messages.push(announcement);
  });
  messageList.innerHTML = "";
  messages.forEach((message) => {
    const messageElement = createMessageElement(message);
    messageList.appendChild(messageElement);
  });
}, {
  onlyOnce: true
});
function createMessageElement(message) {
  const li = document.createElement('li');
  li.classList.add('message_content');

  const p = document.createElement('p');
  p.classList.add('message_full_text');
  p.textContent = message.text;

  const dateSpan = document.createElement('span');
  dateSpan.classList.add('message_date');
  dateSpan.textContent = 'Event date : '+message.date;

  const authorSpan = document.createElement('span');
  authorSpan.classList.add('message_author');
  authorSpan.textContent = 'Announcement from '+message.author;

  li.appendChild(p);
  li.appendChild(dateSpan);
  li.appendChild(authorSpan);

  return li;
}
const messageList = document.querySelector('.message_list');

messageList.addEventListener('click', function (event) {
    const clickedElement = event.target.closest('.message_content');

    if (clickedElement) {
        const authorElement = clickedElement.querySelector('.message_author');
        const authorText = authorElement.textContent.trim();

        // Extract only the author's name
        const authorName = authorText.split(' ').slice(-1)[0].toLowerCase();
        const gotoLink = authorName + '.html';
        window.location = gotoLink;
    }
});



