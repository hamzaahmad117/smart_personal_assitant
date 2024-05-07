import os.path
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from flask import Flask, redirect, request, session
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = 'your_secret_key'
CORS(app, resources={r"/signup": {"origins": "http://localhost:3000"}})

# Define the OAuth 2.0 scopes
SCOPES = ["https://www.googleapis.com/auth/gmail.modify"]

def authenticate_with_google():
    # Initialize the Flow object with client secrets and scopes
    flow = Flow.from_client_secrets_file(
        "credentials.json", scopes=SCOPES,
        redirect_uri='http://localhost:5000/callback'
    )

    # Start the OAuth 2.0 web server flow
    auth_url, state = flow.authorization_url(prompt='consent')

    # Store the state in the session for later verification
    session['oauth_state'] = state

    # Redirect the user to the authorization URL
    return redirect(auth_url)

@app.route('/signup', methods= ['POST'])
def signup():
    return authenticate_with_google()

@app.route('/callback')
def callback():
    # Verify the state to prevent CSRF attacks
    if request.args.get('state', '') != session.pop('oauth_state', ''):
        return 'Invalid state parameter', 400

    # Process the authorization response to complete the flow
    flow = Flow.from_client_secrets_file(
        "credentials.json", scopes=SCOPES,
        redirect_uri='http://localhost:5000/callback'
    )
    flow.fetch_token(authorization_response=request.url)

    # Use the credentials to access the Gmail API
    credentials = flow.credentials
    service = build('gmail', 'v1', credentials=credentials)

    # Now you can use the 'service' object to make requests to the Gmail API or other Google APIs
    # For example, you can list the labels in the user's Gmail account
    labels = service.users().labels().list(userId='me').execute()
    print('Labels:')
    for label in labels['labels']:
        print(label['name'])

    return 'Authentication successful'

if __name__ == "__main__":
    app.run(debug=True)
