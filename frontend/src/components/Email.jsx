import { ListItem, Checkbox, Typography, Box, styled } from "@mui/material";
import { StarBorder, Star } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { routes } from "../routes/routes";
const Wrapper = styled(ListItem)`
    padding: 0 0 0 10px;
    background: #f2f6fc;
    cursor: pointer;
    transition: background-color 0.3s ease; /* Add transition effect */
    border-bottom: 1px solid #ccc; /* Add bottom border */
    &:hover {
        background-color: #e3e9f2; /* Change background color on hover */
    }
    & > div {
        display: flex;
        width: 100%;
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

    const isUnread = email.type && email.type.includes('UNREAD');
    const hasAttachment = email.attachment.length > 0;

    const handleEmailClick = async () => {
        navigate(routes.view.path, { state: { email: email }})
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
            <Box>
                <Typography style={{ width: 190, whiteSpace: 'nowrap', fontWeight: isUnread ? '600' : 'normal',
        overflow: 'hidden', 
        textOverflow: 'ellipsis'  }}>{ email.sender.split('@')[0]}</Typography>
                <Indicator>Mail{hasAttachment ? '/Att' : ''}</Indicator>
                <Typography 
    style={{ 
        width: 800, 
        whiteSpace: 'nowrap', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis' 
    }}
>
    <Typography style={{fontWeight: isUnread ? '600' : 'normal', fontSize: '14px', display: 'inline'}}>
        {email.subject}
    </Typography> 
    {email.snippet && ' -'} {email.snippet}
</Typography>
                <Date style={{fontWeight: isUnread ? '600' : 'normal', color: isUnread ? '#000' : '#5F6368'}}>
                    {(new window.Date(email.date)).getDate()}&nbsp;
                    {(new window.Date(email.date)).toLocaleString('default', { month: 'long' })}
                </Date>
            </Box>
        </Wrapper>
    )
}

export default Email;
