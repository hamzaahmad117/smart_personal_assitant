import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import CircularProgress from '@mui/material/CircularProgress';
import { Attachment } from '@mui/icons-material'; // Import attachment icon from Material-UI
import Tooltip from '@mui/material/Tooltip'; // Import Tooltip from Material-UI

const AttachmentList = ({ attachments }) => {
    const [downloading, setDownloading] = useState(false); // State to track downloading status

    const handleHover = (event) => {
        event.target.style.color = 'blue';
        event.target.style.textDecoration = 'underline';
    };

    const handleLeave = (event) => {
        event.target.style.color = 'inherit';
        event.target.style.textDecoration = 'none';
    };

    const handleClick = async (messageId, id, name) => {
        setDownloading(true); // Set downloading state to true when download starts
        try {
            const response = await axios.post('/download_attachment', { att_name: name, msg_id: messageId, att_id: id }, { responseType: 'blob' });
            
            // Create a URL for the blob response
            const url = window.URL.createObjectURL(new Blob([response.data]));
            
            // Create a hidden anchor element
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name); // Set the download attribute to specify the filename
            document.body.appendChild(link);
            
            // Programmatically click the anchor element to initiate the download
            link.click();
            
            // Cleanup
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading attachment:', error);
        } finally {
            setDownloading(false); // Set downloading state to false when download completes or encounters an error
        }
    };

    return (
        <div className="attachment-list">
            <h3 style={{ marginLeft: '50px' }}>Attachments:</h3>
            <ul style={{ listStyleType: 'none', paddingLeft: '10px' }}> {/* Remove left margin */}
                {attachments.map(attachment => (
                    <Tooltip title={'Download "' + attachment.name + '"'} key={attachment.id} arrow arrowOffset={5}>
                        <li
                            onMouseEnter={handleHover}
                            onMouseLeave={handleLeave}
                            // Pass messageId and id to handleClick function
                            onClick={() => handleClick(attachment.message_id, attachment.id, attachment.name)}
                            style={{
                                cursor: 'pointer',
                                backgroundColor: '#EAF0FF', // Light blue background color
                                borderBottom: '1px solid #ccc', // Border
                                width: '98%', // Full width
                                padding: '10px', // Padding
                                // marginBottom: '5px', // Margin bottom
                                display: 'flex', // Add display flex to align icon and text horizontally
                                alignItems: 'center', // Center items vertically
                            }}
                        >
                            <Attachment color='action' style={{ marginRight: '10px' }} /> {/* Attachment icon */}
                            {attachment.name}
                        </li>
                    </Tooltip>
                ))}
            </ul>
            {downloading && ( // Display circular progress and text if downloading is in progress
                <div style={{ textAlign: 'center' }}>
                    <CircularProgress />
                    <p>Please wait for download...</p>
                </div>
            )}
        </div>
    );
};

export default AttachmentList;
