import React from 'react';
import { Tabs, Tab, styled } from '@mui/material';

const StyledTabsContainer = styled('div')({
  paddingTop: '20px', // Add padding at the top
  display: 'flex',
  justifyContent: 'center', // Center the tabs horizontally
});

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: 'transparent', // Hide the indicator
  },
  '& .MuiTab-root': {
    borderRadius: '10px', // Adjust the border radius as needed
    border: '1px solid #ccc', // Add border
    minWidth: 'auto', // Remove minimum width
    marginRight: theme.spacing(1), // Add some space between tabs
    '&.Mui-selected': {
      backgroundColor: '#EAF0FF', // Light blue background when selected
    },
    '&:hover': {
      backgroundColor: '#f5f5f5', // Light gray background on hover
    },
  },
}));

const TabsComponent = ({ tabs, activeTab, onTabChange }) => {
  const handleChange = (event, newTab) => {
    onTabChange(newTab);
  };

  return (
    <StyledTabsContainer>
      <StyledTabs
        value={activeTab}
        onChange={handleChange}
        scrollButtons="auto"
        centered={true} // Set centered prop to true
      >
        {tabs.map(tab => (
          <Tab key={tab.type} label={tab.label} value={tab.type} />
        ))}
      </StyledTabs>
    </StyledTabsContainer>
  );
};

export default TabsComponent;
