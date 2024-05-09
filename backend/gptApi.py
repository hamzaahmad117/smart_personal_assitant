import openai
import json
import datetime
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.discovery import build
from datetime import datetime, timedelta
from google.oauth2.credentials import Credentials
import os

def responseGeneration(body):
    API_KEY= open("API_KEY","r").read()
    openai.api_key=API_KEY
    response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an AI-powered assistant designed to generate concise and intelligent responses for emails in the inbox, similar to a smart email assistant. Your responses should be helpful, relevant, and considerate. The goal is to assist the user in efficiently handling their emails with clarity and professionalism. Please provide responses that align with the tone and context of the given email content, ensuring they are suitable for a professional communication setting. note that if the body is empty or is promotional or social then never respond to it. in above cases, just return 'None'."},
                {"role": "user", "content": body},
            ]
        )
    assistant_reply = response.choices[0].message.content

    # Create a JSON object
    json_response = {"response": assistant_reply}

    return json.dumps(json_response)



def extractEvent(email_body):
    API_KEY= open("API_KEY","r").read()
    openai.api_key=API_KEY
    instruct="You are an AI assistant trained to extract event details from emails. If the email discusses event information such as the event name, date, and venue, please provide the extracted details. If it's a promotional or non-event email, indicate 'None.' Just extract the event name, date, and venue. Remember to check if the extracted information is related to an event. If the email does not contain details about an event, respond with 'None. NOTE: the event can be any deadline, any upcoming show, any invitation, any deadline of work or an upcoming or a thing to remember. we have to extract all details. Return the output as {\"eventName\": 'name', \"eventDate\": 'date', \"eventTime\":'time', \"eventVenue\": 'venue'} if eventTime is not present, set it to 12:00 PM. You should return the month name in just three letters : march should be Mar. if no year is present, add 2024. date format should be like 7 Mar 2024 12:40 PM. If date is not mentioned, then use the today's date.'"
    response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": instruct},
                {"role": "user", "content": email_body},
            ]
        )

    assistantReply = response.choices[0].message.content

    
    if assistantReply != 'None.':
        assistantReply = json.loads(assistantReply)
        print(f"Email Body: {email_body}")
        print(f"Assistant Reply: {assistantReply}")
        print("=" * 50)
    else:
        print("This is a non-event email")
    
    event=create_calendar_entry(assistantReply)
    return event
        
    
def create_calendar_entry(assistantReply):
    # Open the file in read mode
    if os.path.exists("token.json"):
        creds=Credentials.from_authorized_user_file("token.json")
             
    try:
        print("reply from assistant: ")
        print(assistantReply)

        if assistantReply == 'None.':
            return None
        service=build("calendar","v3", credentials=creds)
        
        event_name = assistantReply["eventName"]
        event_date = assistantReply["eventDate"].strip()
        event_time = assistantReply.get("eventTime", "12:00 PM")
        event_venue = assistantReply.get("eventVenue", "in office")

        # Formatting start and end dateTime
        start_datetime = datetime.strptime(f"{event_date} {event_time}", "%d %b %Y %I:%M %p")
        end_datetime = start_datetime + timedelta(hours=1)  # Assuming events are 1 hour long

        # Creating the event dictionary
        event1 = {
            "summary": f"{event_name}",
            "location": event_venue,
            "description": "details",
            "colorId": 5,  # Corrected the key from colorid to colorId
            "start": {
                "dateTime": start_datetime.strftime("%Y-%m-%dT%H:%M:%S"),
                "timeZone": "Asia/Karachi"
            },
            "end": {
                "dateTime": end_datetime.strftime("%Y-%m-%dT%H:%M:%S"),
                "timeZone": "Asia/Karachi"
            },
            # "recurrence": ["RRULE:FREQ=DAILY;COUNT=3"],
            # "attendees": [
            #     {"email": "social@neuralnine.com"},
            #     {"email": "social2@neuralnine.com"}
            # ]
        }

        # Inserting the event into the calendar
        event = service.events().insert(calendarId="primary", body=event1).execute()
        print(f"Event created {event.get('htmlLink')}")

    except HttpError as error:
        print("An error occured: ",error)
    return event1

# Open the file in read mode
# with open('./text.txt', 'r') as file:
#     # Read the content of the file
#     text = file.read()
# extractEvent(text)

# @app.route('/calendar-entry',methods=["POST"])
# def calendar_entry():
#     extractEvent(email_body)