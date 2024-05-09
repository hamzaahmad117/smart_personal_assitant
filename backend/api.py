import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# If modifying these scopes, delete the file token.json.
SCOPES = ["https://www.googleapis.com/auth/gmail.modify"]


def main():
  """Shows basic usage of the Gmail API.
  Lists the user's Gmail labels.
  """
  creds = None
  # The file token.json stores the user's access and refresh tokens, and is
  # created automatically when the authorization flow completes for the first
  # time.
  if os.path.exists("token.json"):
    creds = Credentials.from_authorized_user_file("token.json", SCOPES)
  # If there are no (valid) credentials available, let the user log in.
  if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
      creds.refresh(Request())
    else:
      flow = InstalledAppFlow.from_client_secrets_file(
          "credentials.json", SCOPES
      )
      creds = flow.run_local_server(port=0)
    # Save the credentials for the next run
    with open("token.json", "w") as token:
      token.write(creds.to_json())

  try:
    # Call the Gmail API
    service = build("gmail", "v1", credentials=creds)
    results = service.users().messages().attachments().get(userId='me', messageId='18f3710c4b88d38e', id='ANGjdJ9RLdaMmAAfzZUOzvjlVS-7BvBoUAcOQa4s4bLB5Jm1yJcL-BWAsAE7QdLxRgP7Yobv8kydzQc3cJWj6GHhf73YU6-0iqgi9a3OyiUjcAH_Y1qGIHoaKiP_GS-g92xBqUqxmZXPFto3dL_arFcRlsNTbehPVYuxv_zJIb4Lx5bZ5JmlYvXq6Sbpel2PotpQ_fSVh8yU3C5ZGjvMADikdPoXmka8Kb0b-Ilp5jWjJdTeYdwbrsBYJogR5DfS6ooSxDl_Js3ecPs5a7DvgkiP55sqCihFVGh-G4BOZfU_bg3QxqNg4S1m1dvzjOl-vIhg5Kag2n9xOB7AxIxwK6se5v8FAjUICIKvO7x2XQOhVUBy72YIAXIcOJ5ymhnyFRXvnvww2IzUQwIJ2cw8' ).execute()
    print(results)

    # if not labels:
    #   print("No labels found.")
    #   return
    # print("Labels:")
    # for label in labels:
    #   print(label["name"])

  except HttpError as error:
    # TODO(developer) - Handle errors from gmail API.
    print(f"An error occurred: {error}")


if __name__ == "__main__":
  main()