# Django Email Application

This Django application allows users to manage emails, including composing, sending, receiving, and archiving emails between registered users.

## Features

- **Authentication:** Users can register, log in, and log out securely.
- **Email Management:** Users can compose new emails, view their inbox, send emails, and archive emails.
- **Email Actions:** Mark emails as read/unread, archive/unarchive, and view email details.

## Technologies Used

- Python 3.10.12
- Django
- Vanilla JavaScript
- Bootstrap 5

## Installation

1. Clone the repository
```bash
git clone git@github.com:leonti98/Mailbox.git
```
```bash
cd Mailbox
```
2. Install required packages
```bash
pip install -r requirements.txt
```

3. Create make migrations and migrate the database
```bash
python manage.py makemigrations mail
```
```bash
python manage.py migrate
```
4. Create a superuser
```bash
python manage.py createsuperuser
```

## Usage
Run the server
```bash
python manage.py runserver
```
### mail application usage
- Open the browser and navigate to `http://localhost:8000/`
- Register at least 2 new users. User should be "username@something.com"
- Compose, send, receive, and archive emails
- Log out and log in as another user to view the emails

### Admin panel
- Navigate to `http://localhost:8000/admin/`
- Log in with the superuser credentials
- View, add, edit, and delete users, emails, and email statuses
- 
