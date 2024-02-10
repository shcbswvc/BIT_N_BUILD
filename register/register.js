console.log("register.js");
import { db } from "../firebase/config.js";
import {
  doc,
  addDoc,
  getDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/10.5.1/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.5.1/firebase-auth.js";

const auth = getAuth();
let userDetails;
let username;
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(uid);
    username = user.displayName;
    userDetails = user;
  } else {
    location.href = "../../login.html";
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

  setTimeout(() => {
    closeAlert();
  }, 5000);
}

// Function to extract the id parameter from the URL
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Get the id from the URL
const eventId = getParameterByName("id");
const formName = document.getElementById("person-name");
formName.value = username ? username : "";

// Function to handle form submission
function submitRegistration(event) {
  event.preventDefault();
  const submitButton = event.target.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  const formData = new FormData(event.target);

  const registrationData = {
    personName: formData.get("person-name") || "N/A",
    registrationId: formData.get("person-uucms-id") || "N/A",
    academicYear: formData.get("person-year") || "N/A",
    branch: formData.get("branch") || "N/A",
    eventFeedback: formData.get("event-feedback") || "N/A",
    email: userDetails.email,
    eventId: eventId,
  };

  // Assuming you have access to the Firestore db object
  const registrationsCollectionRef = collection(db, "registrations");

  // Use addDoc to add the registration data to Firestore
  addDoc(registrationsCollectionRef, registrationData)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      showAlert("Registration submitted successfully! 🎉");
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
      showAlert("Error submitting registration. Please try again.", true);
    })
    .finally(() => {
      submitButton.disabled = false;
    });

  // Reset the form
  event.target.reset();
}

// Attach the form submission handler to the form
const registrationForm = document.querySelector("form");
if (registrationForm) {
  registrationForm.addEventListener("submit", submitRegistration);
} else {
  console.error("Registration form not found!");
}

// Make a GET call to Firestore events collection with the eventId
if (eventId) {
  // Assuming you have access to the Firestore db object
  const eventDocRef = doc(db, "events", eventId);

  // Use getDoc to retrieve the document
  getDoc(eventDocRef)
    .then((doc) => {
      if (doc.exists()) {
        const eventData = doc.data();

        // Create elements to render event information
        const eventInfoContainer = document.getElementById(
          "event-info-container"
        );

        const eventName = document.createElement("h2");
        eventName.textContent = eventData.eventName || "Event Name N/A";

        const eventDescription = document.createElement("p");
        eventDescription.textContent =
          eventData.eventDescription || "Event Description N/A";

        const eventDateTimeLocation = document.createElement("p");
        eventDateTimeLocation.textContent = `Date & Time: ${
          eventData.eventDate || "N/A"
        } ${eventData.eventTime || "N/A"} | Location: ${
          eventData.eventLocation || "N/A"
        } & Entry Fee: ${eventData.eventFee || "N/A"}`;

        // Append elements to the container
        eventInfoContainer.appendChild(eventName);
        eventInfoContainer.appendChild(eventDescription);
        eventInfoContainer.appendChild(eventDateTimeLocation);
      } else {
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.error("Error getting document:", error);
    });
} else {
  console.error("No eventId found in the URL!");
}
