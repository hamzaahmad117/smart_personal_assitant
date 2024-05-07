import os
import json
from simplegmail import Gmail
from flask_cors import CORS, cross_origin
from simplegmail.query import construct_query
from emailHandle import create_message_json
from gptApi import responseGeneration, extractEvent, create_calendar_entry
from google_auth_oauthlib.flow import Flow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from flask import Flask, request, redirect, session, url_for, jsonify, make_response



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
app.secret_key = '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'

CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})
LoggedIn = False

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

@app.route('/authorize', methods = ['GET'])
@cross_origin(supports_credentials=True, allow_headers=['Content-Type','Authorization'])
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
    print(authorization_url)
    session['state'] = state
    response = redirect(authorization_url)
    # # response = _corsify_actual_response(response)
    # response = jsonify({"url": authorization_url})
    return response

@app.route('/oauth2callback')
@cross_origin(supports_credentials=True, allow_headers=['Content-Type','Authorization'])
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

    return redirect(url_for('login'))


def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response

def _corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    print(response )
    print("header: ")
    print(response.headers)
    return response

@app.route('/login', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin(supports_credentials=True, allow_headers=['Content-Type','Authorization', 'Access-Control-Allow-Origin'])
def login():
    # if request.method == "OPTIONS":
    #     return _build_cors_preflight_response()

    creds = create_credentials()
    if not creds:
        return redirect(url_for('authorize'))

    try:
        oauth2_service = build('oauth2', 'v2', credentials=creds)
        user_info = oauth2_service.userinfo().get().execute()

        name = user_info.get('name', 'No name found')
        email = user_info.get('email', 'No email found')

        session.clear()  # Consider when and why you clear session
        response = jsonify({'name': name, 'email': email})
        response = _corsify_actual_response(response)
        return redirect(f"http://localhost:3000/login?response={response}")

    except HttpError as error:
        response = jsonify({'error': str(error)})
        response = _corsify_actual_response(response)
        return response, 500
    



@app.route('/send', methods = ['POST'])
def send_email():
    data = request.json
    print('Received data from React app:', data)
    

    # Perform any necessary operations with the received data
    gmail = Gmail()
    params = {
  "to": data['to'],
  "sender": "hamza.ahmad2601@gmail.com",
  "subject": data['subject'],
  "msg_html": "<p>"+data['body']+"</p>",
  "msg_plain": data['body'],
  "signature": True  # use my account signature
}
    gmail.send_message(**params)
    # Send a response back to the React app
    return jsonify({'message': 'Email received successfully'})


@app.route('/response', methods=['POST'])
def response():
    data = request.json
    if data is None:
        print('None')
    
    response= responseGeneration(data['body'])
    
    return response

@app.route('/calendar-entry',methods=["POST"])
def calendar_entry():
    email = request.json
    print(email)
    response = extractEvent(email['email'])
    return response

@app.route('/get-emails', methods=['GET'])
def get_emails():
    gmail = Gmail()
    attachment_name=''
    query_params = {
        "newer_than": (1, "month"),
        "exclude_labels": [['Promotions']]
    }
    # Get unread messages in your inbox
    # messages = gmail.get_messages(query=construct_query(query_params))
    messages = gmail.get_messages(query=construct_query(query_params))

    # Check if there are any unread messages
    if messages:
        messages_json = [create_message_json(message) for message in messages]
        return messages_json
    else:
        return {}



@app.route('/get-email-html', methods=['GET'])
def get_email_html():
    gmail = Gmail()
    attachment_name=''
    query_params = {
        "newer_than": (1, "year"),
        "exclude_labels": [['Promotions']]
    }
    # Get unread messages in your inbox
    # messages = gmail.get_messages(query=construct_query(query_params))
    messages = gmail.get_messages()

    # Check if there are any unread messages
    if messages:
        messages_json = [create_message_json(message) for message in messages]
        return messages_json
    else:
        return {}
    

  


if __name__ == '__main__':
    app.run(debug=True)







"""
logout functionality
"""
# # Check if gmail_token.json exists
# if os.path.exists("gmail_token.json"):
#     # If it exists, delete it
#     os.remove("gmail_token.json")
#     print("gmail_token.json deleted successfully.")
# else:
#     print("gmail_token.json does not exist.")

# Initialize Gmail object

