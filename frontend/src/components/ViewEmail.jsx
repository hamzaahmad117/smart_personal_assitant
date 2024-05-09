import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { ArrowBack, Delete, Reply, Event } from '@mui/icons-material';
import ComposeMail from './ComposeMail';
import axios from 'axios';
import { emptyProfilePic } from '../constants/constant';
import { useEventContext } from '../context/EventsContext'; // Import the useEventsContext hook
import { useOutletContext } from "react-router-dom";

const IconWrapper = styled(Box)`
    padding: 15px;
    position: relative;
`;

const BackButton = styled(ArrowBack)`
    font-size: 20px;
    color: #333333;
    transition: color 0.3s ease;
    &:hover {
        color: #0B57D0;
        cursor: pointer; /* Add pointer cursor on hover */
    }
`;

const ReplyButton = styled(IconButton)`
    position: absolute;
    top: 60px;
    right: 100px;
    &:hover {
        color: #0B57D0;
    }
`;

const CalendarButton = styled(IconButton)`
    position: absolute;
    top: 60px;
    right: 60px;
    &:hover {
        color: #0B57D0;
    }
`;

const Subject = styled(Typography)`
    font-size: 22px;
    margin: 10px 0 20px 75px;
    display: flex
`;

const Indicator = styled(Box)`
    font-size: 12px !important;
    background: #ddd;
    color: #222;
    border-radius: 4px;
    margin-left: 6px;
    padding: 2px 4px;
    align-self: center;
`;

const Image = styled('img')`
    border-radius: 50%;
    width: 40px;
    height: 40px;
    margin: 5px 10px 0 10px;
    background-color: #cccccc;
`;

const Container = styled(Box)`
    margin-left: 15px;
    width: 100%;
    & > div {
        display: flex;
        & > p > span {
            font-size: 12px;
            color: #5E5E5E;
        }
    }
`;

const DateText = styled(Typography)`
    margin: 0 50px 0 auto;
    font-size: 12px;
    color: #5E5E5E;
`;

const ViewEmail = () => {
    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);
    const { openDrawer } = useOutletContext();

    const { state } = useLocation();
    const { email } = state;
    const { dispatch } = useEventContext(); // Get dispatch function from the events context
    const [openComposeMail, setOpenComposeMail] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reply, setReply] = useState('');

    const handleReply = async (email) => {
        setLoading(true);
        setOpenComposeMail(true);

        try {
            const response = await axios.post('http://localhost:5000/response', {
                body: email.body
            });
            if (response.data.response === 'None') {
                setReply('[No Automated Reply Suggested]')
            }
            else {
            setReply("[This is an Automated Reply]\n\n" + response.data.response);}
        } catch (error) {
            console.error('Error posting response:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleCalendar = async (email) => {
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/calendar-entry', {
                email: email.body
            });
            // Update the event state by dispatching an action
            console.log(response.data);
            if (response.data !== 'None') {
                dispatch({ type: 'ADD_EVENT', payload: response.data });
                alert('A new Calendar Entry was Created.')
            } else {
                alert('NO Calendar Event was detected.')

            }
            
        } catch (error) {
            console.error('Error creating calendar entry:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box style={openDrawer ? { marginLeft: 250, width: '100%', paddingTop: 64 } : { width: '100%', paddingTop: 64 }}>
            <IconWrapper>
                <BackButton onClick={() => window.history.back() } />
                <Delete fontSize='small' color="action" style={{ marginLeft: 40 }} />
                <Tooltip title="Generate automated reply">
                    <ReplyButton onClick={() => handleReply(email)}>
                        <Reply fontSize='small' color="action" />
                    </ReplyButton>
                </Tooltip>
                <Tooltip title="Create automated entry">
                    <CalendarButton onClick={() => handleCalendar(email)}>
                        <Event fontSize='small' color="action" />
                    </CalendarButton>
                </Tooltip>
            </IconWrapper>
            <Subject style={{ 
                width: 1000, 
                whiteSpace: 'wrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis' 
            }}>
                {email.subject} <Indicator component="span">Mail</Indicator>
            </Subject>
            <Box style={{ display: 'flex' }}>
                <Image src={emptyProfilePic} alt="profile" />
                <Container>
                    <Box>
                        <Typography>
                            {email.sender}
                            <Box component="span">&nbsp;&#60;{email.senderEmailAddress}&#62;</Box>
                        </Typography>
                        <DateText>
                            {(new Date(email.date)).toLocaleDateString()} 
                        </DateText>
                    </Box>
                    <Typography style={{ marginTop: 20 }} >
                        <div dangerouslySetInnerHTML={{ __html: email.html }}></div>
                        {/* Display attachments if available */}
                        {email.attachment && email.attachment.length > 0 && (
                            <Box style={{ border: '1px solid #ccc', padding: '10px', marginTop: '20px', marginRight: '60px' }}>
                                <Typography variant="subtitle1">Attachments:</Typography>
                                <ul>
                                    {email.attachment.map((attachment, index) => (
                                        <li key={index}>{attachment[2]}</li>
                                    ))}
                                </ul>
                            </Box>
                        )}
                    </Typography>
                </Container>
            </Box>
            <ComposeMail open={openComposeMail} setOpenDrawer={setOpenComposeMail} recipient={email.senderEmailAddress} response={reply} loading={loading} />
        </Box>
    )
}

export default ViewEmail;
