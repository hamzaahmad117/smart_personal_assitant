import React from "react";
import styled from "styled-components";
import { Calendar, Whisper, Popover, Badge } from "rsuite";

// Importing CSS files
import "../styles/styles.css";
import "../styles/calendar.css";

const StyledContainer = styled.div`
  padding: 10px;
`;

const StyledCalendar = styled(Calendar)`
  .calendar-todo-list {
    text-align: left;
    padding: 0;
    list-style: none;
  }

  .calendar-todo-list li {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .calendar-todo-item-badge {
    vertical-align: top;
    margin-top: 8px;
    width: 6px;
    height: 6px;
  }
`;

const NewCalendar = ({ events }) => {
  function getTodoList(date) {
    // Convert both the calendar date and event dates to midnight on the same day
    const calendarDate = new Date(date);
    calendarDate.setHours(0, 0, 0, 0);

    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.start.dateTime);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === calendarDate.getTime();
    });

    if (filteredEvents.length) {
      const moreItem = (
        <li>
          <Whisper
            placement="top"
            trigger="click"
            speaker={
              <Popover>
                {filteredEvents.map((item, index) => (
                  <p key={index}>
                    <b>{item.start.dateTime.slice(11, 16)} - {item.end.dateTime.slice(11, 16)}</b><br />
                    <span><strong>Summary:</strong> {item.summary}</span><br />
                    <span><strong>Location:</strong> {item.location}</span><br />
                    <span><strong>Description:</strong> {item.description}</span>
                  </p>
                ))}
              </Popover>
            }
          >
            <a>View</a>
          </Whisper>
        </li>
      );

      return (
        <ul className="calendar-todo-list">
          {filteredEvents.slice(0, 2).map((item, index) => (
            <li key={index}>
              <Badge /> <b>{item.start.dateTime.slice(11, 16)} - {item.end.dateTime.slice(11, 16)}</b> - {item.summary}
            </li>
          ))}
          {moreItem}
        </ul>
      );
    }

    return null;
  }

  return (
    <StyledContainer>
      <StyledCalendar bordered renderCell={getTodoList} />
    </StyledContainer>
  );
};

export default NewCalendar;
