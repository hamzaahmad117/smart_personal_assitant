import { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
// import useApi from '../hooks/useApi';
// import { API_URLS } from '../services/api.urls';
import { Box, List, Checkbox, CircularProgress } from '@mui/material';
import Email from './Email';
import { DeleteOutline } from '@mui/icons-material';
import NoMails from './common/NoMails';
import { EMPTY_TABS } from '../constants/constant';
import axios from 'axios';
import { useEmailContext } from '../context/EmailContext';

const Emails = () => {
    const { openDrawer } = useOutletContext();
    const { type } = useParams();
    const { emailsReceived, setEmailsReceived } = useEmailContext();
    const [loading, setLoading] = useState(true);

    

    const selectAllEmails = (e) => {
        // Your selectAllEmails logic
    }

    const deleteSelectedEmails = () => {
        // Your deleteSelectedEmails logic
    }

    useEffect(() => {
        const callEmailService = async () => {
            try {
                const response = await axios.get('http://localhost:5000/get-email-html');
                console.log(response.data);

                setEmailsReceived({ type: 'SET_EMAILS_RECEIVED', payload: response.data });
                setLoading(false); // Set loading to false when response is received
                // console.log(emailsReceived.attachments);
                
            } catch (error) {
                console.error('Error fetching email HTML:', error);
            }
        };

        // Check if emails have already been fetched
        if (emailsReceived.length === 0) {
            callEmailService();
        } else {
            setLoading(false); // Set loading to false if emails are already fetched
        }
    }, []);

    // Filter emails based on the URL path
    const filteredEmails = () => {
        switch (type) {
            case 'inbox':
                return emailsReceived.filter(email => email.type.includes('INBOX'));
            case 'sent':
                return emailsReceived.filter(email => email.type.includes('SENT'));
            case 'starred':
                return emailsReceived.filter(email => email.type.includes('STARRED'));
            case 'bin':
                return emailsReceived.filter(email => email.type.includes('TRASH'));
            case 'drafts':
                return emailsReceived.filter(email => email.type.includes('DRAFT'));
            case 'allmail':
                return emailsReceived;
            default:
                return [];
        }
    };

    return (
        <Box style={openDrawer ? { marginLeft: 250, width: '100%', marginTop: '64px' } : { width: '100%', marginTop: '64px' } }>
            <Box style={{ padding: '20px 10px 0 10px', display: 'flex', alignItems: 'center' }}>
                <Checkbox size="small" onChange={(e) => selectAllEmails(e)} />
                <DeleteOutline onClick={(e) => deleteSelectedEmails(e)} />
            </Box>
            {loading ? (
                <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <List>
                    {filteredEmails().map(email => (

                        <Email 
                            email={email} 
                            key={email.id}

                            
                            // Other props you pass to Email component
                        />
                    ))}
                </List> 
            )}
            {
                filteredEmails().length === 0 &&
                    <NoMails message={EMPTY_TABS[type]} />
            }
        </Box>
    )
}

export default Emails;
