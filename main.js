//Create a calendar interface for the current month. 
//Display the days of the month in a grid format
//Indicate days that have scheduled sports events. This can be as simple as a dot or marker on the day. 
// Sample Events to Include (you can leverage the json file shared to get events):
        //Sat., 18.07.2019, 18:30, Football, Salzburg vs. Sturm

//nav bar
function toggleMenu() {
  const navLinks = document.querySelector('.navLinks');
  navLinks.classList.toggle('active');
}

// Lists of events/ date and sport
let events = {
    "2024-11-06": ["Football Match"],
    "2024-11-23": ["Marathon"],
    "2024-11-08": ["Basketball"],
    "2024-11-30": ["Boxing"],
    "2024-11-21": ["MMA"],
  };
  
  // Generate the calendar
  function generateCalendar() {
    const calendarElement = document.getElementById("calendar");
    calendarElement.innerHTML = ""; // to empty the calendar
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
  
    // Calendar headers
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    daysOfWeek.forEach(day => {
      const header = document.createElement("div");
      header.className = "header";
      header.textContent = day;
      calendarElement.appendChild(header);
    });
  
    // First day and days in the month
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
  
    //loop to fill empty days
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
  
      // mark event days
      if (events[date]) {
        dayElement.className += " eventDay";
        dayElement.addEventListener("click", () => {
          showEventDetails(date);
        });
      }
  
      calendarElement.appendChild(dayElement);
    }
  }
  
  // Show event details
  function showEventDetails(date) {
    const eventDetailsElement = document.getElementById("eventDetails");
    eventDetailsElement.innerHTML = `<h3> Events on ${date}</h3>`;
    events[date].forEach(event => {
      const eventItem = document.createElement("p");
      eventItem.textContent = event;
      eventDetailsElement.appendChild(eventItem);
    });
  }
  
  // collecting event inputs and new event submission
  document.getElementById("eventForm").addEventListener("submit", (e) => {
    e.preventDefault();
  
    const date = document.getElementById("eventDate").value;
    const time = document.getElementById("eventTime").value;
    const sport = document.getElementById("sportName").value;
    const participants = document.getElementById("participants").value;
  
    if (date && time && sport && participants) {
      const eventDetails = `${sport} (${time}) - ${participants}`;
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
                        <h3 class="card-title text-primary">${homeTeam} vs ${awayTeam}</h3>
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
// Call the function to fetch and display matches
fetchAndDisplayMatches();