import { useState, useEffect } from 'react';
import { Dialog, styled, Typography, Box, InputBase, TextField, Button, CircularProgress } from '@mui/material'; 
import { Close, DeleteOutline} from '@mui/icons-material';
import axios from 'axios';
import { useLoginResult } from '../context/LoginResultContext'; // Import useLoginResult hook

const dialogStyle = {
    height: '90%',
    width: '80%',
    maxWidth: '100%',
    maxHeight: '100%',
    boxShadow: 'none',
    borderRadius: '10px 10px 0 0',
}

const Header = styled(Box)`
    display: flex;
    justify-content: space-between;
    align-items: center; /* Align items vertically */
    padding: 10px 15px;
    background: #f2f6fc;
    & > p {
        font-size: 14px;
        font-weight: 500;
    }
`;

const CloseButton = styled(Close)`
    font-size: 18px;
    cursor: pointer;
    transition: color 0.3s ease; /* Add transition effect on color change */
    &:hover {
        color: #ff0000; /* Change color on hover */
    }
`;

const RecipientWrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    padding: 0 15px;
    & > div {
        font-size: 14px;
        border-bottom: 1px solid #F5F5F5;
        margin-top: 10px;
    }
`;

const Footer = styled(Box)`
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
    align-items: center;
`;

const SendButton = styled(Button)`
    background: #0B57D0;
    color: #fff;
    font-weight: 500;
    text-transform: none;
    border-radius: 18px;
    width: 100px;
    &:hover {
        background: #0e69f0; /* Change background color on hover */
        color: #fff; /* Change text color on hover */
    }
`;
const PlaceholderBox = styled(Box)`
    height: 70px; /* Adjust height as needed */
`;

const ComposeMail = ({ open, setOpenDrawer, recipient, response, loading }) => {
    const { loginResult } = useLoginResult(); // Get loginResult from context

    const [data, setData] = useState({
        from: loginResult ? loginResult[0] : '', // Set from field to loginResult[0] if available
        to: recipient || '',
        subject: '',
        body: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (response) {
            setData({
                ...data,
                body: response || '',
            });
        }
    }, [response]);

    const onValueChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const sendEmail = async (e) => {
        e.preventDefault();
        console.log(loginResult);
        if (!data.to || !data.subject || !data.body) {
            setError('Recipients, Subject, or Email Body cannot be empty.');
            return;
        }
    
        setError('');
    
        // Format the email body as HTML with paragraph tags
        const bodyHTML = data.body.split('\n').map(line => `<p>${line}</p>`).join('');
    
        try {
            const response = await axios.post('http://localhost:5000/send', { ...data, body: bodyHTML });
            console.log('Response from Flask:', response.data);
    
            setOpenDrawer(false);
            setData({ // Only clear the fields that need to be cleared
                ...data,
                to: '',
                subject: '',
                body: '',
            });
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    const closeComposeMail = () => {
        setOpenDrawer(false);
    }

    return (
        <Dialog
            open={open}
            PaperProps={{ sx: dialogStyle }}
        >
            <Header>
                <Typography>New Message</Typography>
                <CloseButton fontSize="small" onClick={closeComposeMail} />
            </Header>
            <RecipientWrapper>
                <InputBase placeholder='Recipients' name="to" onChange={onValueChange} value={data.to} />
                <InputBase placeholder='Subject' name="subject" onChange={onValueChange} value={data.subject} />
            </RecipientWrapper>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TextField 
                    multiline
                    rows={18}
                    sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
                    name="body"
                    onChange={onValueChange}
                    value={data.body}
                />
            )}
            {error && (
                <Typography color="error" sx={{ paddingLeft: '15px', fontSize: '12px' }}>
                    {error}
                </Typography>
            )}
            {loading ? (
                <PlaceholderBox />
            ) : (
                <Footer>
                    <SendButton onClick={sendEmail}>Send</SendButton>
                    <DeleteOutline onClick={closeComposeMail} />
                </Footer>
            )}
        </Dialog>
    )
}

export default ComposeMail;
