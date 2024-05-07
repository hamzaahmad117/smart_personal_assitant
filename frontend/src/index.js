import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(document.getElementById('root'));
const dummyEvents = [
  {
    summary: "Team Building Workshop",
    location: "Conference Hall",
    description: "Workshop on team building activities",
    colorId: 5,
    start: {
      dateTime: "2024-05-20T14:00:00",
      timeZone: "Asia/Karachi"
    },
    end: {
      dateTime: "2024-05-20T16:00:00",
      timeZone: "Asia/Karachi"
    }
  },
  {
    summary: "Project Deadline",
    location: "Office",
    description: "Project submission deadline",
    colorId: 6,
    start: {
      dateTime: "2024-07-15T09:00:00",
      timeZone: "Asia/Karachi"
    },
    end: {
      dateTime: "2024-07-15T12:00:00",
      timeZone: "Asia/Karachi"
    }
  },
  {
    summary: "Client Meeting",
    location: "Client's Office",
    description: "Meeting with XYZ Corp",
    colorId: 7,
    start: {
      dateTime: "2024-07-15T09:00:00",
      timeZone: "Asia/Karachi"
    },
    end: {
      dateTime: "2024-07-15T12:00:00",
      timeZone: "Asia/Karachi"
    }
  }
  // Add more events as needed
];



root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
