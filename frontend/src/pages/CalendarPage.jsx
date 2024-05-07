import React from "react";
import NewCalendar from "../components/NewCalendar";
import { useEventContext } from "../context/EventsContext"; // Import the useEventContext hook

const CalendarPage = () => {
  const { state } = useEventContext(); // Get the events from the global state

  return (
    <div>
      <NewCalendar events={state.events} /> {/* Pass the events to the NewCalendar component */}
    </div>
  );
};

export default CalendarPage;
