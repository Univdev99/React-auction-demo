from channels import Group

from notification.constants import WS_CHANNEL_AUCTION


class AuctionChannel(object):
    @classmethod
    def send(text):
        Group(WS_CHANNEL_AUCTION).send({
            "text": text,
        })
