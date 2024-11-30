//Create a calendar interface for the current month. 
//Display the days of the month in a grid format
//Indicate days that have scheduled sports events. This can be as simple as a dot or marker on the day. 
// Sample Events to Include (you can leverage the json file shared to get events):
        //Sat., 18.07.2019, 18:30, Football, Salzburg vs. Sturm

//nav bar
function toggleMenu() {
  const navLinks = document.querySelector('.navLinks');
  navLinks.classList.toggle('active');
}//nav bar ends

// Lists of events/ date and sport/input format
let events = {
    "2024-11-06": ["Football (12:12 pm) - 22"],
    "2024-11-23": ["Marathon (11:12 pm) - 15"],
    "2024-11-08": ["Basketball (3:00 pm) - Team A vs Team B"],
    "2024-11-30": ["Boxing (12:12 pm) - 2"],
    "2024-11-21": ["MMA (05:30 pm) - 2"],
  };
  
  // Generate the calendar/generateCalendar generates a calendar for the current month and displays it in an HTML element
  function generateCalendar() {
    const calendarElement = document.getElementById("calendar");
    calendarElement.innerHTML = ""; // to empty the calendar
    const today = new Date(); // obtaining current date
    const year = today.getFullYear();//current date and extracts the year and month values to generate the calendar for the current month
    const month = today.getMonth();
  
    // Add calendar headers
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    daysOfWeek.forEach(day => {
      const header = document.createElement("div");
      header.className = "header";
      header.textContent = day;
      calendarElement.appendChild(header);//each day is added as a <div> with a class of header
    });
  
    // Calculate first day and number of days in the month// calculating first day and days in the month
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
  
    // //loop to fill empty days before the first day
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      const blankDay = document.createElement("div");
      blankDay.className = "day";
      calendarElement.appendChild(blankDay);
    }
  
    // loop to add days to the calendar
    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement("div");
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  
      dayElement.className = "day";
      dayElement.textContent = day;
  
      // checking if there are events on this date
      if (events[date]) {
        dayElement.className += " eventDay";
        dayElement.title = events[date].join("\n"); // add event details as tooltip
  
        dayElement.addEventListener("click", () => {
          showEventDetails(date);
        });
      }
  
      calendarElement.appendChild(dayElement);
    }
  }
  
  
  // Show event details
  function showEventDetails(date) {
    const eventsOnDate = events[date];
    if (!eventsOnDate) return;
  
    // Format the event details to pass to the event details page
    const eventDetailsUrl = `eventDetails.html?date=${encodeURIComponent(date)}`;
    const eventDetailsParams = eventsOnDate
      .map((event, index) => `event${index}=${encodeURIComponent(event)}`)
      .join("&");
  
    window.location.href = `${eventDetailsUrl}&${eventDetailsParams}`;
  }
  
  // collecting event inputs and new event submission
  document.getElementById("eventForm").addEventListener("submit", (e) => {
    e.preventDefault();
  
    const date = document.getElementById("eventDate").value; //retrieves form inputs
    const time = document.getElementById("eventTime").value;
    const sport = document.getElementById("sportName").value;
    const participants = document.getElementById("participants").value;
  
    if (date && time && sport && participants) { //form inputs authentication and validation, check if any field is empty
      const eventDetails = `${sport} (${time}) - ${participants}`; // adding event to event object, after formating
      if (events[date]) {
        events[date].push(eventDetails);
      } else {
        events[date] = [eventDetails];
      }
  
      alert("Event added successfully!");//alerting user of added event
      generateCalendar(); // generate fuction to update the calendar
    }
  });
  
  // Initialize calendar
  generateCalendar();
  
  //fetching matches
  async function fetchAndDisplayMatches() {
    try {
        // fetch the json data
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        
        // getting the data from json
        const matches = jsonData.data;

        // arrays of days of the week
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        // Get the container element
        const matchesContainer = document.getElementById('matches');

        // remove previous matches
        matchesContainer.innerHTML = '';

        // Loop through the matches and display each one
        matches.forEach(match => {
            const matchDiv = document.createElement('div');
            matchDiv.classList.add('match');

            const homeTeam = match.homeTeam ? match.homeTeam.name : 'TBD';
            const awayTeam = match.awayTeam ? match.awayTeam.name : 'TBD';
            const dateVenue = match.dateVenue;

            let dayName = 'Invalid Date';
            if (dateVenue) {
                const date = new Date(dateVenue);
                dayName = daysOfWeek[date.getDay()];
            }

            const result = match.result && match.result.homeGoals !== null
                ? `${match.result.homeGoals} - ${match.result.awayGoals}`
                : 'Match not played yet';

               matchDiv.innerHTML = `
                <div class="card shadow mb-4">
                    <div class="card-body">
                        <h3 class="card-title" id="cardTitle">${homeTeam} vs ${awayTeam}</h3>
                        <p class="card-text"><strong>Date:</strong> ${dayName}. ${dateVenue}</p>
                        <p class="card-text"><strong>Time:</strong> ${match.timeVenueUTC}</p>
                        <p class="card-text"><strong>Sport:</strong> ${match.sport}</p>
                        <p class="card-text"><strong>Result:</strong> ${result}</p>
                    </div>
                </div>
            `;

            matchesContainer.appendChild(matchDiv);
        });
    } catch (error) {
        console.error('Error fetching or displaying matches:', error);
    }
}

// Countdown Timer 
function updateCountdowns() {
  const today = new Date();
  const countdownContainer = document.getElementById("countdownContainer");
  countdownContainer.innerHTML = ""; // Clear existing countdowns

  Object.keys(events).forEach((date) => {
    const eventDate = new Date(date);
    if (eventDate >= today) {
      const diff = eventDate - today;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const countdownText = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      // Create an element for the countdown
      const countdownElement = document.createElement("div");
      countdownElement.className = "countdown";
      countdownElement.textContent = `Countdown to the ${events[date][0]} match: ${countdownText}`;

      countdownContainer.appendChild(countdownElement);// append the countdown element to countdownContainer
    }
  });
}

// show event details to include countdown
function showEventDetails(date) {
  const event = events[date][0]; // assuming a single event per day for simplicity
  const eventDetailsUrl = `eventDetails.html?date=${encodeURIComponent(date)}&event=${encodeURIComponent(event)}`; //eventDetailsPageParams
  window.location.href = eventDetailsUrl;
  const eventDetailsElement = document.getElementById("eventDetails");
  eventDetailsElement.innerHTML = `<h3>Events on ${date}</h3>`;
  events[date].forEach((event) => {
    const eventItem = document.createElement("p");
    eventItem.textContent = event;
    eventDetailsElement.appendChild(eventItem);
  });

  const today = new Date();
  const eventDate = new Date(date);

  if (eventDate >= today) { //to capture future date
    const diff = eventDate - today;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const countdownText = `Countdown: ${days}d ${hours}h ${minutes}m ${seconds}s`;
    const countdownElement = document.createElement("p");
    countdownElement.className = "eventCountdown";
    countdownElement.textContent = countdownText;

    eventDetailsElement.appendChild(countdownElement);
  }
}

//nav bars
document.addEventListener("DOMContentLoaded", function() {
  // get elements for calendar and add event pages
  const calendarPage = document.getElementById('calendarPage');
  const addEventPage = document.getElementById('addEventPage');
  
  // getting nav links
  const calendarNav = document.getElementById('calendarNav');
  const addEventNav = document.getElementById('addEventNav');
  
  // shows calendar page by default
  calendarPage.style.display = "block";
  addEventPage.style.display = "none";

  // adding event listener to the calendar link
  calendarNav.addEventListener('click', function(e) {
    e.preventDefault();
    calendarPage.style.display = "block";
    addEventPage.style.display = "none";
  });
  
  // adding event listener to the add event link
  addEventNav.addEventListener('click', function(e) {
    e.preventDefault();
    calendarPage.style.display = "none";
    addEventPage.style.display = "block";
  });
});
//end of nav bars

// calendar and timers
generateCalendar();

updateCountdowns();

// updating countdown timers every second
setInterval(updateCountdowns, 1000);

// Call the function to fetch and display matches
fetchAndDisplayMatches();