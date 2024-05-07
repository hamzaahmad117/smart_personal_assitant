import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { routes } from '../routes/routes';

export default function LoginPage() {
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const navigate = useNavigate();

    const buttonStyle = {
        color: 'white',
        backgroundColor: '#1976D2',
        borderRadius: '20px', // Adjust the border radius as needed
        textTransform: 'none',
        '&:hover': {
            backgroundColor: '#0D47A1', // Darker shade on hover
        },
    };


    

    const handleLoginClick = () => {
        setLoading(true);
        axios.post('/signup')
            .then(response => {
                console.log("Login successful");
                const login_result = response.data.login_result;
                console.log(login_result);
                setLoggedIn(true);
                setMessage('Your account with email address ' + login_result[0] + ' has logged in.');
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDashboardClick = () => {
        navigate(routes.emails.path);
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
        >
            <h1 style={{ marginBottom: '20px' }}>Smart Personal Assistant</h1>
            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    {!loggedIn ? (
                        <Button variant="contained" onClick={handleLoginClick} sx={{ mb: 2 }} style={buttonStyle}>
                            Login with Google
                        </Button>
                    ) : (
                        <Button variant="contained" onClick={handleDashboardClick} sx={{ mb: 2 }} style={buttonStyle}>
                            Go to Dashboard
                        </Button>
                    )}
                    <p>{message}</p>
                </>
            )}
        </Box>
    );
}
