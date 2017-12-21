from django.conf import settings
from django.core import mail


def send_email(title, content, to_addresses):
    with mail.get_connection() as connection:
        mail.EmailMessage(
            title,
            content,
            settings.NO_REPLY_EMAIL_ADDRESS,
            to_addresses,
            connection=connection,
        ).send()
