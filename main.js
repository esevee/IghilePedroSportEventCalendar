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
  