import { ListItem, Checkbox, Typography, Box, styled } from "@mui/material";
import { StarBorder, Star } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { routes } from "../routes/routes";
import axios from "axios";

const Wrapper = styled(ListItem)`
    padding: 0 0 0 10px;
    background: #f2f6fc;
    cursor: pointer;
    & > div {
        display: flex;
        width: 100%
    }
    & > div > p {
        font-size: 14px;
    }
`;

const Indicator = styled(Typography)`
    font-size: 12px !important;
    background: #ddd;
    color: #222;
    border-radius: 4px;
    margin-right: 6px;
    padding: 0 4px;
`;

const Date = styled(Typography)({
    marginLeft: 'auto',
    marginRight: 20,
    fontSize: 12,
    color: '#5F6368'
})

const Email = ({ email /*, setStarredEmail, selectedEmails, setSelectedEmails */}) => {
    const navigate = useNavigate();
    
    const handleEmailClick = async () => {
        console.log(email.body)
        // try {
        //     const response = await axios.post('http://localhost:5000/response', {
        //         body: email.body
        //     });
        //     console.log(response.data);
        //     // Handle response here
        // } catch (error) {
        //     console.error('Error posting response:', error);
        // }
    }

    return (
        <Wrapper onClick={handleEmailClick}>
            <Checkbox size="small" />
            { 
                email.starred ? 
                    <Star fontSize="small" style={{ marginRight: 10 }} />
                : 
                    <StarBorder fontSize="small" style={{ marginRight: 10 }} /> 
            }
            <Box onClick={() => navigate(routes.view.path, { state: { email: email }})}>
                <Typography style={{ width: 200, whiteSpace: 'nowrap', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis'  }}>{email.sender.split('@')[0]}</Typography>
                <Indicator>Mail</Indicator>
                <Typography 
    style={{ 
        width: 800, 
        whiteSpace: 'nowrap', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis' 
    }}
>
    {email.subject} {email.body && '-'} {email.snippet}
</Typography>
                <Date>
                    {(new window.Date(email.date)).getDate()}&nbsp;
                    {(new window.Date(email.date)).toLocaleString('default', { month: 'long' })}
                </Date>
            </Box>
        </Wrapper>
    )
}

export default Email;
