import React from 'react';

const AttachmentList = ({ attachments }) => {
    const handleHover = (event) => {
        event.target.style.color = 'blue';
        event.target.style.textDecoration = 'underline';
    };

    const handleLeave = (event) => {
        event.target.style.color = 'inherit';
        event.target.style.textDecoration = 'none';
    };

    return (
        <div className="attachment-list">
            <h3 style={{ marginLeft: '50px' }}>Attachments:</h3>
            <ul>
                {attachments.map(attachment => (
                    <li
                        key={attachment.name}
                        onMouseEnter={handleHover}
                        onMouseLeave={handleLeave}
                        style={{ cursor: 'pointer' }}
                    >
                        {attachment.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AttachmentList;
