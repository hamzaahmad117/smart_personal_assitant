import os
import pathlib
from flask import Flask, session, redirect, request, make_response
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from pip._vendor import cachecontrol
import google.auth.transport.requests

app = Flask(__name__)
app.secret_key = "your-secret-key"

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

GOOGLE_CLIENT_ID = "your-google-client-id"
client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "credentials.json")
SCOPES = [
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/calendar",
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
]

flow = Flow.from_client_secrets_file(
    client_secrets_file=client_secrets_file,
    scopes=SCOPES,
    redirect_uri="http://localhost:5000/oauth2callback"
)

@app.route("/login", methods=['GET'])
def login():
    authorization_url, state = flow.authorization_url()
    session["state"] = state
    return redirect(authorization_url)

@app.route("/oauth2callback")
def callback():
    flow.fetch_token(authorization_response=request.url)
    if not session["state"] == request.args["state"]:
        return "State mismatch", 500
    credentials = flow.credentials
    session['credentials'] = credentials_to_dict(credentials)
    return redirect("/protected_area")

@app.route("/protected_area")
def protected_area():
    if "credentials" not in session:
        return redirect('/login')
    creds = session['credentials']
    return f"Hello {creds['email']}! <a href='/logout'><button>Logout</button></a>"

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

def credentials_to_dict(credentials):
    return {'token': credentials.token,
            'refresh_token': credentials.refresh_token,
            'token_uri': credentials.token_uri,
            'client_id': credentials.client_id,
            'client_secret': credentials.client_secret,
            'scopes': credentials.scopes}

if __name__ == "__main__":
    app.run('localhost', 5000, debug=True)
