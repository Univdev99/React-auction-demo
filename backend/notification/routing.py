from channels.routing import route

from notification.channels import ws_connect
from notification.channels import ws_disconnect


channel_routing = [
    route("websocket.connect", ws_connect),
    route("websocket.disconnect", ws_disconnect),
]
