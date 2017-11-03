import logging

from channels import Group

from notification.constants import WS_CHANNEL_AUCTION


def ws_connect(message):
    message.reply_channel.send({"accept": True})
    Group(WS_CHANNEL_AUCTION).add(message.reply_channel)


def ws_disconnect(message):
    Group(WS_CHANNEL_AUCTION).discard(message.reply_channel)
