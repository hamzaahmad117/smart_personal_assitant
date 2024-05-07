import { AppBar, Toolbar, Box, InputBase, styled } from '@mui/material';
import { Menu as MenuIcon, Tune, HelpOutlineOutlined, SettingsOutlined, 
    AppsOutlined, AccountCircleOutlined, Search, CalendarMonth as CalendarMonthIcon, Attachment } from '@mui/icons-material'
import EmailIcon from '@mui/icons-material/Email';
import { useNavigate } from 'react-router-dom';
import { routes } from '../routes/routes';

const StyledEmailIcon= styled(EmailIcon)`
    margin-left: 100px; /* Adjust the padding as needed */
    font-size: 32px;
    
`;

const StyledAppBar = styled(AppBar)`
    background: #f5F5F5;
    box-shadow: none;
    position: fixed; /* Make the app bar fixed */
    top: 0; /* Position it at the top of the viewport */
    width: 100%; /* Occupy the full width */
    z-index: 1000; /* Ensure it's above other elements */
`;

const SearchWrapper = styled(Box)`
    background: #EAF1FB;
    margin-left: 80px;
    border-radius: 8px;
    min-width: 690px;
    max-width: 720px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    & > div {
        width: 100%
    }
`

const OptionsWrapper = styled(Box)`
    width: 100%;
    display: flex;
    justify-content: end;
    & > svg {
        margin-left: 20px;
    }

    /* Style CalendarMonthIcon on hover */
    & > svg:hover {
        color: #0B57D0; /* Change color on hover */
        cursor: pointer; /* Add pointer cursor on hover */
    }
`


const Header = ({ toggleDrawer }) => {

    const navigate = useNavigate();
    const handleCalendarClick = () => {
        navigate(routes.calendar.path)
    }
    const handleAttachClick = () => {
        navigate(routes.attachment.path)
    }
    return (
        <StyledAppBar position="static">
            <Toolbar>
                <MenuIcon color="action" onClick={toggleDrawer} />
                <StyledEmailIcon color='action'/>
                <SearchWrapper>
                    <Search color="action" />
                    <InputBase placeholder='Search Mail'/>
                    <Tune  color="action"/>
                </SearchWrapper>

                <OptionsWrapper>
                    <CalendarMonthIcon color="action" onClick={handleCalendarClick}/>
                    <Attachment color="action" onClick={handleAttachClick}/>
                    <SettingsOutlined color="action" />
                    <AppsOutlined color="action" />
                    <AccountCircleOutlined color="action" />
               </OptionsWrapper>
            </Toolbar>
        </StyledAppBar>
    )
}

export default Header;
