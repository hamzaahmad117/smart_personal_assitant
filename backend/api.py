from flask import Flask, request, jsonify
from simplegmail import Gmail

app = Flask(__name__)
# Dummy HTML content for testing


@app.route('/get-email-html', methods=['GET'])
def get_email_html():
    # Initialize Gmail object
    gmail = Gmail()

    # Get unread messages in your inbox
    messages = gmail.get_unread_inbox()

    # Check if there are any unread messages
    if messages:
        # Get the HTML content of the first message
        email_html = messages[2].html
        print(messages[0].plain)
    # return jsonify({'html': email_html})

get_email_html()
# if __name__ == '__main__':
    # app.run(debug=True)

