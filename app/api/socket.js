// pages/api/socket.js
import { Server } from 'socket.io'
const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("socket server already running")
  }
  else {
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on("connection", (socket) => {
      console.log("server  is created")
    })
  }
res.send()
}
export default SocketHandler
