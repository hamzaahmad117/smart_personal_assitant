import React, { useState, useEffect } from 'react';
import TabsComponent from './Tabs';
import AttachmentList from './AttachmentList';
import { useEmailContext } from '../../context/EmailContext';
import Button from '@mui/material/Button';

const attachmentTypes = [
    { type: 'pdf', label: 'PDF' },
    { type: 'xlsx', label: 'Excel' },
    { type: 'jpg', label: 'Image' },
    { type: 'docx', label: 'Text Document' },
    { type: 'pptx', label: 'PowerPoint' },
    { type: 'exe', label: 'Application' }
];

const AttachmentView = () => {
    const [activeTab, setActiveTab] = useState(attachmentTypes[0].type);
    const { emailsReceived } = useEmailContext();
    const [attachmentsByType, setAttachmentsByType] = useState({});

    useEffect(() => {
        // Create attachmentsByType when the component mounts
        const initialAttachmentsByType = {};

        attachmentTypes.forEach(attachmentType => {
            initialAttachmentsByType[attachmentType.type] = [];
        });

        emailsReceived.forEach(email => {
            email.attachment.forEach(attachment => {
                const attachment_id = attachment[1];
                const fileName = attachment[2];
                
                let fileType = attachment[3];
                const msg_id = attachment[5];
                const extension = fileName.split('.').pop();

                if (['jpg', 'jpeg', 'png'].includes(extension)) {
                    fileType = 'jpg';
                } else if (['docx', 'txt'].includes(extension)) {
                    fileType = 'docx';
                } else if (extension === 'pdf') {
                    fileType = 'pdf';
                } else if (extension === 'xlsx' || extension === 'xls') {
                    fileType = 'xlsx';
                } else if (extension === 'pptx' || extension === 'ppt') {
                    fileType = 'pptx';
                }else {
                    fileType = 'exe';
                }

                if (!initialAttachmentsByType[fileType]) {
                    initialAttachmentsByType[fileType] = [];
                }

                initialAttachmentsByType[fileType].push({ name: fileName, id: attachment_id, message_id: msg_id });
            });
        });

        setAttachmentsByType(initialAttachmentsByType);
    }, [emailsReceived]);

    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
    };

    // Click handler for the back button
    const handleBackButtonClick = () => {
        // Implement your logic to navigate back to the previous window
        // For example, you can use window.history.back() to navigate back
        window.history.back();
    };

    return (
        <div className="attachment-view">
            {/* Back button */}
            <Button variant="outlined" onClick={handleBackButtonClick} style={{marginLeft: '10px', marginTop: '10px'}}>Back</Button>
            {/* TabsComponent */}
            <TabsComponent tabs={attachmentTypes} activeTab={activeTab} onTabChange={handleTabChange} />
            {/* AttachmentList */}
            {attachmentsByType[activeTab] && <AttachmentList attachments={attachmentsByType[activeTab]} />}
        </div>
    );
};

export default AttachmentView;
