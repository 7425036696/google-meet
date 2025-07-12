// lib/socket.js
import { io } from 'socket.io-client'

let socket

export const connectSocket = () => {
  if (!socket) {
    socket = io()
  }
  return socket
}
