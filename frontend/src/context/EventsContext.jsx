import React, { createContext, useContext, useReducer } from "react";

// Define initial state
const initialState = {
  events: [], // Initially empty array
};

// Create context
const EventContext = createContext();

// Define action types
const SET_EVENTS = "SET_EVENTS";
const ADD_EVENT = "ADD_EVENT";
const ADD_EVENTS = "ADD_EVENTS";

// Define action creators
const setEvents = (events) => ({
  type: SET_EVENTS,
  payload: events,
});

const addEvent = (event) => ({
  type: ADD_EVENT,
  payload: event,
});

const addEvents = (events) => ({
  type: ADD_EVENTS,
  payload: events,
});

// Define reducer function
const eventReducer = (state, action) => {
  switch (action.type) {
    case SET_EVENTS:
      return {
        ...state,
        events: action.payload,
      };
    case ADD_EVENT:
      return {
        ...state,
        events: [...state.events, action.payload],
      };
    case ADD_EVENTS:
      return {
        ...state,
        events: [...state.events, ...action.payload],
      };
    default:
      return state;
  }
};

// Create provider component
export const EventProvider = ({ children }) => {
  const [state, dispatch] = useReducer(eventReducer, initialState);

  return (
    <EventContext.Provider value={{ state, dispatch }}>
      {children}
    </EventContext.Provider>
  );
};

// Custom hook to use event context
export const useEventContext = () => useContext(EventContext);

export { setEvents, addEvent, addEvents };
