from channels import Group

from notification.constants import WS_CHANNEL_AUCTION


class AuctionChannel(object):
    @classmethod
    def send(cls, text):
        Group(WS_CHANNEL_AUCTION).send({
            "text": text,
        })
