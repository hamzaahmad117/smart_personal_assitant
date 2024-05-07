import os
import json
from google_auth_oauthlib.flow import Flow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from flask import Flask, request, redirect, session, url_for
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1" # to allow Http traffic for local dev

# If modifying these scopes, delete the file token.json.
SCOPES = [
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/calendar",
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
]

app = Flask(__name__)
app.secret_key = 'YOUR_SECRET_KEY_HERE'

def create_credentials():
    creds = None
    if 'credentials' in session:
        creds = Credentials.from_authorized_user_info(session['credentials'])
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            return None
    return creds

@app.route('/authorize')
def authorize():
    flow = Flow.from_client_secrets_file(
        'credentials.json',
        scopes=SCOPES,
        redirect_uri=url_for('oauth2callback', _external=True)
    )
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true'
    )
    session['state'] = state
    return redirect(authorization_url)

@app.route('/oauth2callback')
def oauth2callback():
    state = session['state']

    flow = Flow.from_client_secrets_file(
        'credentials.json',
        scopes=SCOPES,
        state=state,
        redirect_uri=url_for('oauth2callback', _external=True)
    )
    flow.fetch_token(authorization_response=request.url)

    # Extract tokens from the credential object
    access_token = flow.credentials.token
    refresh_token = flow.credentials.refresh_token

    # Store the credentials in the session for future API calls
    session['credentials'] = {
        'token': access_token,
        'refresh_token': refresh_token,
        'token_uri': flow.credentials.token_uri,
        'client_id': flow.credentials.client_id,
        'client_secret': flow.credentials.client_secret,
        'scopes': flow.credentials.scopes
    }

    # Save tokens to a file
    token_data = {}
    try:
        with open('gmail_token.json', 'r') as file:
            token_data = json.load(file)
    except FileNotFoundError:
        print("Token file not found, creating new one.")

    token_data['access_token'] = access_token
    token_data['refresh_token'] = refresh_token

    with open('gmail_token.json', 'w') as file:
        json.dump(token_data, file)

    return redirect(url_for('test_api_request'))


@app.route('/test_api_request')
def test_api_request():
    creds = create_credentials()
    if not creds:
        return redirect(url_for('authorize'))

    try:
        # Build the service for the OAuth2 API
        oauth2_service = build('oauth2', 'v2', credentials=creds)
        # Get user info
        user_info = oauth2_service.userinfo().get().execute()

        # Extract name and email
        name = user_info.get('name', 'No name found')
        email = user_info.get('email', 'No email found')

        session.clear()
        return f"Name: {name}, Email: {email}"

    except HttpError as error:
        return f"An error occurred: {error}"

if __name__ == '__main__':
    app.run( 'localhost', 5000, debug= True)
