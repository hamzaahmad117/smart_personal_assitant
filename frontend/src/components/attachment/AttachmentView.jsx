import React, { useState } from 'react';
import TabsComponent from './Tabs';
import AttachmentList from './AttachmentList';

const attachmentTypes = [
    { type: 'pdf', label: 'PDF' },
    { type: 'xlsx', label: 'Excel' },
    { type: 'jpg', label: 'Image' },
    { type: 'docx', label: 'Word Document' },
    { type: 'exe', label: 'Executable' }
];

const attachmentsByType = {
    pdf: [{ name: 'AnnualReport2023.pdf' }, { name: 'FinancialStatement.pdf' }],
    xlsx: [{ name: 'SalesData2023.xlsx' }, { name: 'ExpenseReport.xlsx' }, { name: 'sheet.xlsx' }, { name: 'files.xlsx' }],
    jpg: [{ name: 'VacationPhoto1.jpg' }, { name: 'Logo.jpg' }, { name: 'shape.jpg' }],
    docx: [{ name: 'ProjectProposal.docx' }, { name: 'MeetingMinutes.docx' }],
    exe: [{ name: 'Installer2.exe' }, { name: 'Application.exe' }]
};

const AttachmentView = () => {
    const [activeTab, setActiveTab] = useState(attachmentTypes[0].type);

    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
    };

    return (
        <div className="attachment-view">
            <TabsComponent tabs={attachmentTypes} activeTab={activeTab} onTabChange={handleTabChange} />
            <AttachmentList attachments={attachmentsByType[activeTab]} />
        </div>
    );
};

export default AttachmentView;
