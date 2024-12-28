import http from 'http'
import express from 'express'
import { Server } from 'socket.io'
import { PrismaClient } from '../../backend/node_modules/prisma/prisma-client'
import cors from 'cors'

const PORT = 8080
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
})

const prisma = new PrismaClient()
const onlineUsers = new Map()

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : "*",
  credentials: true
}))
app.use(express.json())

io.on('connection', (socket) => {
  socket.on("roomId", (roomId: string) => {
    // Leave previous rooms
    socket.rooms.forEach(room => {
      if (room !== socket.id) {
        socket.leave(room)
      }
    })
    // Join new room
    socket.join(roomId)
    console.log(`User ${socket.id} joined room: ${roomId}`)
  })

  socket.on("user online", (userId: string) => {
    onlineUsers.set(userId, socket.id)
    io.emit("user status", { userId, status: 'online' })
  })

  socket.on("send message", async (data: {
    message: string,
    senderId: string,
    receiverId: string,
    roomId: string
  }) => {
    try {
      const { message, senderId, receiverId, roomId } = data
      const result = await prisma.message.create({
        data: {
          message, receiverId, senderId
        }
      })

      io.to(roomId).emit("receive message", {
        id: result.id,
        message,
        senderId,
        receiverId,
        createdAt: result.createdAt
      })

    } catch (error) {
      console.error("Error saving message:", error)
      socket.emit("error", "Failed to send message")
    }
  })

  socket.on("typing", (data: { roomId: string, username: string }) => {
    socket.to(data.roomId).emit("typing", data.username)
  })

  socket.on("stopTyping", (roomId: string) => {
    socket.to(roomId).emit("stopTyping")
  })

  socket.on("online", (userId: string) => {
    socket.to(userId).emit("online")
  })

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId)
        io.emit("user status", { userId, status: 'offline' })
        break
      }
    }
    console.log("User disconnected:", socket.id)
  })
})

// API Route
app.get("/api/chat/:senderId/:receiverId", async (req, res) => {
  const { senderId, receiverId } = req.params

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      },
      orderBy: { createdAt: 'asc' },
      take: 50,
      select: {
        id: true,
        message: true,
        senderId: true,
        receiverId: true,
        createdAt: true
      }
    })
    res.status(200).json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    res.status(500).json({ error: "Failed to fetch messages" })
  }
})

// Get online status
app.get("/api/users/status/:userId", (req, res) => {
  const { userId } = req.params
  const isOnline = onlineUsers.has(userId)
  res.json({ online: isOnline })
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing HTTP server and Prisma Client...')
  await prisma.$disconnect()
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})