import React, { createContext, useContext, useReducer } from "react";

// Define initial state
const initialState = {
  events: [], // Initially empty array
};

// Create context
const EventContext = createContext();

// Define reducer function
const eventReducer = (state, action) => {
  switch (action.type) {
    case "SET_EVENTS":
      return {
        ...state,
        events: action.payload, // Set events array to the payload
      };
    case "ADD_EVENT":
      return {
        ...state,
        events: [...state.events, action.payload], // Add new event to the events array
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
