import React, { Component } from 'react'

import { WS_BACKEND_URL } from 'config'


const AUTO_RECONNECT_INTERVAL = 10000

class NotificationManager extends Component {

  socket = null
  reconnectTimerID = 0

  createSocket = () => {
    const socket = new WebSocket(WS_BACKEND_URL)
    socket.onopen = this.handleOpen
    socket.onmessage = this.handleMessageReceived
    socket.onclose = this.handleClose

    this.socket = socket
    return socket
  }

  reconnectSocket = () => {
    console.warn('Websocket: reconnecting...')
    this.createSocket()
  }

  setReconnectTimer = () => {
    this.reconnectTimerID = setInterval(this.reconnectSocket, AUTO_RECONNECT_INTERVAL)
  }

  unsetReconnectTimer = () => {
    if (this.reconnectTimerID) {
      clearInterval(this.reconnectTimerID)
      this.reconnectTimerID = 0
    }
  }

  handleOpen = () => {
    console.log('Websocket: connected')
    this.unsetReconnectTimer()
  }

  handleMessageReceived = (e) => {
    console.log('message arrived', e.data)
  }

  handleClose = () => {
    if (!this.reconnectTimerID) {
      console.warn('Websocket: disconnected')
      this.setReconnectTimer()
    }
  }

  componentDidMount() {
    console.log('Websocket: connecting...')
    this.createSocket()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false
  }

  render() {
    return <div />
  }
}

export default NotificationManager
