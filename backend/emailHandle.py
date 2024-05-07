def extract_sender_info(email_string):
    # Split the string by '<' and '>' to separate the sender name and email address
    parts = email_string.split('<')
    
    # If there is only one part, it means no '<' was found
    if len(parts) == 1:
        # In this case, consider the whole string as the sender name and set the email address to None
        sender = email_string.strip()  # Remove leading/trailing whitespace from sender name
        sender_email_address = None
    else:
        # Extract the sender name and email address
        sender = parts[0].strip()  # Remove leading/trailing whitespace from sender name
        # If there are multiple '>' symbols, consider only the first part before the first '>'
        sender_email_address = parts[1].split('>')[0].strip()  # Remove leading/trailing whitespace from email address
    
    # Remove quotation marks if present
    if sender and sender[0] in ['"', "'"] and sender[-1] in ['"', "'"]:
        sender = sender[1:-1]
    if sender_email_address and sender_email_address[0] in ['"', "'"] and sender_email_address[-1] in ['"', "'"]:
        sender_email_address = sender_email_address[1:-1]
    
    return sender, sender_email_address


email_string = 'Fiverr <no-reply@announce.fiverr.com>'
sender, sender_email_address = extract_sender_info(email_string)
print("Sender:", sender)  # Output: Fiverr
print("Sender Email Address:", sender_email_address)  # Output: no-reply@announce.fiverr.com

def create_message_json(message):
    sender, sender_email_address = extract_sender_info(message.sender)
    label_ids = [label.id for label in message.label_ids]  # Convert Label objects to their IDs
    attachments = [[attachment.id,attachment.filename, attachment.filetype] for attachment in message.attachments]
    message_json = {
        'to': message.recipient,
        'from': message.sender,
        'sender': sender,
        'senderEmailAddress': sender_email_address,
        'subject': message.subject,
        'body': message.plain,  # Assuming 'plain' attribute contains the plaintext contents of the message
        'date': message.date,
        'image': '',  # Placeholder for image URL (if available)
        'attachment': attachments,
        'name': message.subject,  # Use subject as name
        'starred': False,  # Placeholder for starred status
        'type': label_ids,  # Serialize label_ids
        'html': message.html,
        'plaintext': message.plain,
        'snippet': message.snippet
    }
    return message_json