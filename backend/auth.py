import os.path
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import json
from database import downloadFromDB, uploadToDB, create_json_file
from simplegmail import Gmail
# If modifying these scopes, delete the file token.json.
SCOPES = ["https://www.googleapis.com/auth/gmail.modify", "https://www.googleapis.com/auth/calendar"]


def Signup():
  """Shows basic usage of the Gmail API.
  Lists the user's Gmail labels.
  """
  creds = None
  # The file token.json stores the user's access and refresh tokens, and is
  # created automatically when the authorization flow completes for the first
  # time.

  if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
      creds.refresh(Request())
    else:
      flow = InstalledAppFlow.from_client_secrets_file(
          "credentials.json", SCOPES
      )
      creds = flow.run_local_server(port=0)

      with open("token.json", "w") as token:
        token.write(creds.to_json())
    # Save the credentials for the next run

      creds1 = creds.to_json()
    
      creds1=json.loads(creds1)
      accessToken=creds1['token']
      refreshToken=creds1['refresh_token']
      
      with open('gmail_token.json', 'r') as file:
        data = json.load(file)
      

      data['access_token']=accessToken
      data['refresh_token']=refreshToken

      with open('gmail_token.json', 'w') as file:
        json.dump(data, file)

  try:
    # Call the Gmail API
    service = build("gmail", "v1", credentials=creds)
    results = service.users().getProfile(userId ='me').execute()


    if not results:
      print("No emails found.")
      return
    # emailAddress=results.get('emailAddress')


  except HttpError as error:
    # TODO(developer) - Handle errors from gmail API.
    print(f"An error occurred: {error}")

  user_exists = create_json_file(results['emailAddress'], accessToken, refreshToken)

  gmail=Gmail()
  # msg=gmail.get_unread_inbox()
  # print("downloaded email")
  # print(msg[0].subject)

  return [results['emailAddress'], user_exists]

