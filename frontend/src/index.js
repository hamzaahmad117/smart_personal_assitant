// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Import createTheme and ThemeProvider

// Define a theme with Poppins as the default font-family
const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  
    
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  
);

reportWebVitals();
