import React from 'react';
import { Tabs, Tab } from '@mui/material';

const TabsComponent = ({ tabs, activeTab, onTabChange }) => {
    const handleChange = (event, newTab) => {
        onTabChange(newTab);
    };

    return (
        <Tabs
            value={activeTab}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            centered={true} // Set centered prop to true
        >
            {tabs.map(tab => (
                <Tab key={tab.type} label={tab.label} value={tab.type} />
            ))}
        </Tabs>
    );
};
export default TabsComponent;