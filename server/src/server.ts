import express from 'express'
import http from 'http'
import socketIO from 'socket.io'

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

let players = []

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`)

  players.push(socket.id)

  if (players.length === 1) {
    io.emit('isPlayerA')
  }

  socket.on('dealCards', () => {
    io.emit('dealCards')
  })

  socket.on('cardPlayed', (gameObject, isPlayerA) => {
    io.emit('cardPlayed', gameObject, isPlayerA)
  })

  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`)
    players = players.filter((p) => p !== socket.id)
  })
})

server.listen(3000, () => {
  console.log('Server started!')
})
