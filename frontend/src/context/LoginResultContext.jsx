import React, { createContext, useContext, useState } from 'react';

const LoginResultContext = createContext();

export const useLoginResult = () => useContext(LoginResultContext);

export const LoginResultProvider = ({ children }) => {
    const [loginResult, setLoginResult] = useState(null);

    const setLoginResultGlobal = (result) => {
        setLoginResult(result);
    };

    return (
        <LoginResultContext.Provider value={{ loginResult, setLoginResult: setLoginResultGlobal }}>
            {children}
        </LoginResultContext.Provider>
    );
};
