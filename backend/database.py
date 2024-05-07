import firebase_admin
from firebase_admin import credentials, db
import json
import re

# Initialize Firebase
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {"databaseURL": "https://smart-personal-assistant-7b435-default-rtdb.firebaseio.com/"})

def uploadToDB(filename):
    # Read the contents of the JSON file
    with open(filename, 'r') as file:
        data = file.read()

    # Convert the JSON string to a Python dictionary
    json_data = json.loads(data)

    # Push the data to Firebase Realtime Database
    db.reference('users').set(json_data)

# returns 0 if user exists, 1 if doesn't
def create_json_file(email, access_token, refresh_token):
    data= downloadFromDB('users')
    if data != None:
        with open('users.json', 'r') as json_file:
            existing_data = json.load(json_file)
    else:
        # If users.json doesn't exist, start with an empty dictionary
        existing_data = {}

    # Sanitize keys in new user data
    newemail = sanitize_email(email)
    if newemail in existing_data:
        print("Account Already Exists.")
        return 0
    else:
        data = {newemail: {"access_token": access_token, "refresh_token": refresh_token}}

        # Append sanitized new user data to the existing JSON data
        updated_data = append_to_json(existing_data, data)

        # Save the updated JSON data back to users.json
        with open('users.json', 'w') as json_file:
            json.dump(updated_data, json_file, indent=4)

        # Call uploadToFirebase function with the updated JSON data
        uploadToDB('users.json')
        return 1
    

def downloadFromDB(filename):
    # Get a reference to the database
    ref = db.reference(filename)

    # Retrieve the data from Firebase Realtime Database
    data = ref.get()

    return data

def sanitize_email(email):
    # Remove periods (".") from email address
    return re.sub(r'\.', '_', email)


def append_to_json(existing_data, new_data):
    # Merge the existing JSON data with the new data
    existing_data.update(new_data)
    return existing_data



# def sanitize_keys(data):
#     # Sanitize keys in data dictionary
#     sanitized_data = {}
#     for key, value in data.items():
#         sanitized_key = sanitize_email(key)
#         sanitized_data[sanitized_key] = value
#     return sanitized_data

# uploadToDB('users.json')