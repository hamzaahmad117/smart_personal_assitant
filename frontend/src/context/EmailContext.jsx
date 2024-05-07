// EmailContext.js
import React, { createContext, useReducer, useContext } from 'react';

const EmailContext = createContext();

export const EmailProvider = ({ children }) => {
  const [emailsReceived, setEmailsReceived] = useReducer((state, action) => {
    switch (action.type) {
      case 'SET_EMAILS_RECEIVED':
        return action.payload;
      default:
        return state;
    }
  }, []);

  return (
    <EmailContext.Provider value={{ emailsReceived, setEmailsReceived }}>
      {children}
    </EmailContext.Provider>
  );
};

export const useEmailContext = () => useContext(EmailContext);