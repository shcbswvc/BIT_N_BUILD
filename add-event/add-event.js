console.log("add-event.js");
import { db } from "../firebase/config.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.5.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.5.1/firebase-auth.js";

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(uid);
  } else {
    location.href = "../login.html";
  }
});

function closeAlert() {
  const alertElement = document.getElementById("alert");
  alertElement.style.display = "none";
}

function showAlert(message, isError = false) {
  const alertElement = document.getElementById("alert");
  const alertMessageElement = document.getElementById("alert-message");

  alertMessageElement.innerText = message;
  alertElement.classList.remove("error");
  if (isError) {
    alertElement.classList.add("error");
  }

  alertElement.style.display = "block";

  // Automatically hide the alert after 5 seconds (adjust as needed)
  setTimeout(() => {
    closeAlert();
  }, 5000);
}

function addEventToFirebase(event) {
  event.preventDefault();

  const formData = new FormData(event.target);

  const docData = {
    eventName: formData.get("event-name"),
    eventDate: formData.get("event-date"),
    eventTime: formData.get("event-time"),
    eventLocation: formData.get("event-location"),
    eventFee: formData.get("event-fee"),
    club: formData.get("club"),
    eventDescription: formData.get("event-description"),
  };

  const eventsCollectionRef = collection(db, "events");

  addDoc(eventsCollectionRef, docData)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      showAlert("Event added successfully!");
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
      showAlert("Error adding event. Please try again.", true);
    });
}

// Attach the form submission handler to the form
const form = document.querySelector(".form");
form.addEventListener("submit", addEventToFirebase);
