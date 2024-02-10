import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.5.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDlGGDbdAnntuJPu9znmx2HRxeoxvb_Bc4",
  authDomain: "campus-club-hub-a2f5b.firebaseapp.com",
  databaseURL: "https://campus-club-hub-a2f5b-default-rtdb.firebaseio.com",
  projectId: "campus-club-hub-a2f5b",
  storageBucket: "campus-club-hub-a2f5b.appspot.com",
  messagingSenderId: "131774428532",
  appId: "1:131774428532:web:3b9296146483cd6121a821",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
