require('dotenv').config()
const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const prisma = require('./lib/prisma')

const app = express()
const server = http.createServer(app)

// ─── Socket.io Setup ─────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

const onlineUsers = new Map()

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id)

  socket.on('user:online', (userId) => {
    onlineUsers.set(userId, socket.id)
    io.emit('users:online', Array.from(onlineUsers.keys()))
  })

  socket.on('chat:join', ({ roomId }) => {
    socket.join(roomId)
  })

  socket.on('chat:message', async ({ roomId, senderId, receiverId, itemId, content }) => {
    try {
      const message = await prisma.message.create({
        data: {
          content,
          senderId: parseInt(senderId),
          receiverId: parseInt(receiverId),
          itemId: itemId ? parseInt(itemId) : null,
        },
        include: {
          sender: { select: { id: true, name: true, avatar: true } },
        },
      })
      io.to(roomId).emit('chat:message', message)
    } catch (err) {
      console.error('Message save error:', err)
      socket.emit('chat:error', { message: 'Failed to send message' })
    }
  })

  socket.on('chat:read', async ({ roomId, userId }) => {
    try {
      await prisma.message.updateMany({
        where: { receiverId: parseInt(userId), read: false },
        data: { read: true },
      })
      io.to(roomId).emit('chat:read', { userId })
    } catch (err) {
      console.error('Read receipt error:', err)
    }
  })

  socket.on('chat:typing', ({ roomId, userId, isTyping }) => {
    socket.to(roomId).emit('chat:typing', { userId, isTyping })
  })

  socket.on('disconnect', () => {
    onlineUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) onlineUsers.delete(userId)
    })
    io.emit('users:online', Array.from(onlineUsers.keys()))
  })
})

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }))
app.use(express.json())

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/items', require('./routes/itemRoutes'))
app.use('/api/messages', require('./routes/messageRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'CampusCart API running' })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT)
})

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  server.close()
})
