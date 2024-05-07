import { createContext, useContext, useState } from 'react';

// Create the context
const SignupContext = createContext();

// Create a context provider component
export const SignupProvider = ({ children }) => {
  const [signedUpUser, setSignedUpUser] = useState(null);

  return (
    <SignupContext.Provider value={{ signedUpUser, setSignedUpUser }}>
      {children}
    </SignupContext.Provider>
  );
};

// Custom hook to use the signup context
export const useSignup = () => useContext(SignupContext);
