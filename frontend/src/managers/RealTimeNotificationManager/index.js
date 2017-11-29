import React, { Component } from 'react'
import Immutable from 'immutable'

import { WS_BACKEND_URL } from 'config'


const AUTO_RECONNECT_INTERVAL = 10000

/*
 * Real-time notification handler map
 *
 * This is an array of handler configs in the form of
 *  { action: String, handler: Function }
 */
let notificationHandlerMap = Immutable.List()

export function registerRealTimeNotificationHandler(action, handler) {
  if (handler.constructor !== Function) {
    return false
  }
  notificationHandlerMap = notificationHandlerMap.push(Immutable.Map({
    action,
    handler
  }))
}

export function unregisterRealTimeNotificationHandler(action, handler = null) {
  notificationHandlerMap = notificationHandlerMap.filter(handlerConfig => (
    handlerConfig.get('action') !== action ||
    (handler && handlerConfig.get('handler') !== handler)
  ))
}

class RealTimeNotificationManager extends Component {

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
    notificationHandlerMap.map(handlerConfig => {
      if (!handlerConfig.get('action') || handlerConfig.get('action') === data.action) {
        handlerConfig.get('handler')(data)
      }
      return handlerConfig
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

export default RealTimeNotificationManager
