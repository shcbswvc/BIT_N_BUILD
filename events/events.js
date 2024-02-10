console.log("event.js");
import { db } from "../firebase/config.js";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.5.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.5.1/firebase-auth.js";

// Array to store all events
let allEvents = [];

async function getEventsFromFirestore() {
  const eventsContainer = document.getElementById("events-container");
  // Clear existing events before fetching and rendering new ones
  eventsContainer.innerHTML = "";

  const eventsCollectionRef = collection(db, "events");
  const snapshot = await getDocs(
    query(collection(db, "events"), orderBy("eventDate", "asc"))
  );
  // Clear existing events array before fetching and storing new ones
  allEvents = [];

  snapshot.forEach((doc) => {
    const eventData = doc.data();

    // Create event card elements
    const eventCard = document.createElement("div");
    eventCard.classList.add("event");

    const badge = document.createElement("div");
    badge.classList.add("badge");
    badge.innerHTML = `<p>${eventData.club} UVCE's Event</p>`;

    const eventName = document.createElement("h3");
    eventName.textContent = eventData.eventName;

    const eventDescription = document.createElement("p");
    eventDescription.classList.add("event__description");
    eventDescription.textContent = eventData.eventDescription;

    // Create parent container for footer elements
    const footerContainer = document.createElement("div");
    footerContainer.classList.add("card__footer", "card__footer-container");

    // Create and append footer section 1
    const footerSection1 = document.createElement("div");
    footerSection1.classList.add("card__footer__section");
    footerSection1.innerHTML = `<p>${eventData.eventDate}</p><p>${eventData.eventTime}</p>`;
    footerContainer.appendChild(footerSection1);

    // Create and append footer section 2
    const footerSection2 = document.createElement("div");
    footerSection2.classList.add("card__footer__section");
    footerSection2.innerHTML = `<p>${eventData.eventLocation}</p><p>Rs: ${eventData.eventFee}</p>`;
    footerContainer.appendChild(footerSection2);

    // Append footer container to the event card
    eventCard.appendChild(badge);
    eventCard.appendChild(eventName);
    eventCard.appendChild(eventDescription);
    eventCard.appendChild(footerContainer); // Append the entire footer container

    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("image__wrapper");

    const eventImage = document.createElement("img");
    eventImage.classList.add("event__img");
    eventImage.src = `https://source.unsplash.com/400x400/?${eventData.eventName}`;
    eventImage.alt = "image-for-event";

    const registerButton = document.createElement("button");
    registerButton.classList.add("register__btn");
    registerButton.innerHTML = `<a href="../register/register.html?id=${doc.id}">Register</a>`;

    // Append elements to event card
    imageWrapper.appendChild(eventImage);
    eventCard.appendChild(imageWrapper);
    eventCard.appendChild(registerButton);

    // Append event card to events container
    eventsContainer.appendChild(eventCard);

    // Store the event data in the array
    allEvents.push({
      id: doc.id,
      data: eventData,
    });
  });
}

// Add event listener to the club select element
const clubSelect = document.getElementById("club");
clubSelect.addEventListener("change", (event) => {
  const selectedClub = event.target.value;
  filterEventsByClub(selectedClub);
});

// Initial fetch without filtering
getEventsFromFirestore();

// Function to filter events by club
function filterEventsByClub(selectedClub) {
  const filteredEvents =
    selectedClub === "All"
      ? allEvents
      : allEvents.filter((event) => event.data.club === selectedClub);

  // Render the filtered events
  renderEvents(filteredEvents);
}

// Function to render events
function renderEvents(events) {
  const eventsContainer = document.getElementById("events-container");
  // Clear existing events before rendering new ones
  eventsContainer.innerHTML = "";

  events.forEach((event) => {
    // Create event card elements (similar to the previous code)
    const eventCard = document.createElement("div");
    eventCard.classList.add("event");

    const badge = document.createElement("div");
    badge.classList.add("badge");
    badge.innerHTML = `<p>${event.data.club} UVCE's Event</p>`;

    const eventName = document.createElement("h3");
    eventName.textContent = event.data.eventName;

    const eventDescription = document.createElement("p");
    eventDescription.classList.add("event__description");
    eventDescription.textContent = event.data.eventDescription;

    // Create parent container for footer elements
    const footerContainer = document.createElement("div");
    footerContainer.classList.add("card__footer", "card__footer-container");

    // Create and append footer section 1
    const footerSection1 = document.createElement("div");
    footerSection1.classList.add("card__footer__section");
    footerSection1.innerHTML = `<p>${event.data.eventDate}</p><p>${event.data.eventTime}</p>`;
    footerContainer.appendChild(footerSection1);

    // Create and append footer section 2
    const footerSection2 = document.createElement("div");
    footerSection2.classList.add("card__footer__section");
    footerSection2.innerHTML = `<p>${event.data.eventLocation}</p><p>Rs: ${event.data.eventFee}</p>`;
    footerContainer.appendChild(footerSection2);

    // Append footer container to the event card
    eventCard.appendChild(badge);
    eventCard.appendChild(eventName);
    eventCard.appendChild(eventDescription);
    eventCard.appendChild(footerContainer); // Append the entire footer container

    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("image__wrapper");

    const eventImage = document.createElement("img");
    eventImage.classList.add("event__img");
    eventImage.src = `https://source.unsplash.com/400x400/?${event.data.eventName}`;
    eventImage.alt = "image-for-event";

    const registerButton = document.createElement("button");
    registerButton.classList.add("register__btn");
    registerButton.innerHTML = `<a href="register/${event.id}">Register</a>`;

    // Append elements to event card
    imageWrapper.appendChild(eventImage);
    eventCard.appendChild(imageWrapper);
    eventCard.appendChild(registerButton);

    // Append event card to events container
    eventsContainer.appendChild(eventCard);
  });
}
