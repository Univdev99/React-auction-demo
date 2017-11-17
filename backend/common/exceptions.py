from rest_framework.exceptions import APIException


class PaymentRequired(APIException):
    status_code = 402
    default_detail = 'Payment transaction failed.'
    default_code = 'payment_required'
