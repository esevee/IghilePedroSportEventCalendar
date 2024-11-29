// obtaining event data from URL parameters
const params = new URLSearchParams(window.location.search);
const date = params.get("date");
const events = [];

for (const key of params.keys()) {
  if (key.startsWith("event")) {
    events.push(params.get(key));
  }
}

// increase event details dynamically
const eventDetailsContainer = document.querySelector(".eventDetailsContainer");
eventDetailsContainer.innerHTML = `<h1>Events on ${date}</h1>`;

events.forEach((event, index) => {
  //event details are in the format: "Sport (time) - Participants/Teams"
  const [sportAndTime, participants] = event.split(" - ");
  const [sport, time] = sportAndTime.split(" (");
  const formattedTime = time.replace(")", "");

  const eventElement = document.createElement("div");
  eventElement.className = "eventItem";
  eventElement.innerHTML = `
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Sport:</strong> ${sport}</p>
    <p><strong>Time:</strong> ${formattedTime}</p>
    <p><strong>Participants/Teams:</strong> ${participants}</p>
    <p><strong><a href="index.html">Back to Calendar</a></strong></p>
  `;
  eventDetailsContainer.appendChild(eventElement);
});
