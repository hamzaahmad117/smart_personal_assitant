from flask import Flask, request, jsonify
from simplegmail import Gmail
from auth import Signup
from flask_cors import CORS
from simplegmail.query import construct_query
from emailHandle import create_message_json
from gptApi import responseGeneration, extractEvent, create_calendar_entry


app = Flask(__name__)
# Dummy HTML content for testing
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

LoggedIn = False

"""

app route for signup functionality

"""


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        print("Signup route called")
        # Call the signup logic
        signup_result = Signup()
        # Return a response if needed
        LoggedIn = True
        
        return jsonify({'signup_result': signup_result})
    else:
        return jsonify({'message': 'Method not allowed'}), 405



@app.route('/send', methods = ['POST'])
def send_email():
    data = request.json
    print('Received data from React app:', data)
    

    # Perform any necessary operations with the received data
    gmail = Gmail()
    params = {
  "to": data['to'],
  "sender": data['from'],
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
    print(response)
    if response == None:
        print('response is none.')
        return 'None'
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

