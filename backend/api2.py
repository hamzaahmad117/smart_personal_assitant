from flask import Flask, request, jsonify, redirect, url_for, session
from simplegmail import Gmail
import json

app = Flask(__name__)
app.secret_key = 'your_secret_key'

# Initialize Gmail object
gmail = Gmail()

# Dummy HTML content for testing
dummy_html = "<html><body><h1>Hello, World!</h1></body></html>"

# File to store user information
USER_INFO_FILE = 'user_info.json'


def load_user_info():
    try:
        with open(USER_INFO_FILE, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return {}


def save_user_info(user_info):
    with open(USER_INFO_FILE, 'w') as file:
        json.dump(user_info, file)


@app.route('/login')
def login():
    # Redirect user to Google login page for authentication
    auth_url = gmail.authorization_url()
    return redirect(auth_url)


@app.route('/login/callback')
def login_callback():
    # Callback URL after successful authentication
    auth_code = request.args.get('code')

    # Exchange auth code for access token
    gmail.authenticate(auth_code)

    # Get user's email
    user_email = gmail.get_profile().email

    # Store user email in session
    session['user_email'] = user_email

    # Load user information
    user_info = load_user_info()

    # Check if user exists in user_info, if not, add them
    if user_email not in user_info:
        user_info[user_email] = {}

    # Save user info to file
    save_user_info(user_info)

    return redirect(url_for('get_email_html'))


@app.route('/get-email-html', methods=['GET'])
def get_email_html():
    # Check if user is logged in
    if 'user_email' not in session:
        return redirect(url_for('login'))

    # Load user information
    user_info = load_user_info()

    # Get unread messages in user's inbox
    messages = gmail.get_unread_inbox()

    # Check if there are any unread messages
    if messages:
        # Get the HTML content of the first message
        email_html = messages[0].html
    else:
        email_html = dummy_html

    return jsonify({'html': email_html})


if __name__ == '__main__':
    app.run(debug=True)
