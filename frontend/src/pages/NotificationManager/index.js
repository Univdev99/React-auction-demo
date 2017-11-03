import React, { Component } from 'react'

import { WS_BACKEND_URL } from 'config'


const AUTO_RECONNECT_INTERVAL = 10000

/*
 * Real-time notification handler map
 *
 * This is an array of handler configs in the form of
 *  { action: String, handler: Function }
 */
const notificationHandlerMap = []

export function registerNotificationHandler(action, handler) {
  if (handler.constructor !== Function) {
    return false
  }
  notificationHandlerMap.push({
    action,
    handler
  })
}

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
    let data = null
    try {
      data = JSON.parse(e.data)
    } catch(e) {
      console.error('Received invalid websocket message')
    }
    notificationHandlerMap.forEach(handlerConfig => {
      if (handlerConfig.action === data.action) {
        handlerConfig.handler(data)
      }
    })
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
