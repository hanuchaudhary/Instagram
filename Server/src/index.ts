import http from 'http'
import express, { Request, Response } from 'express'
import { Server } from 'socket.io'
import cors from 'cors'
import { PrismaClient } from '../../Shared/node_modules/@prisma/client';
import cloudinary from './lib/uploadCloudinary';
import { config } from 'dotenv';
config();

const prisma = new PrismaClient()

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

app.use(cors({
  origin: "*",
  credentials: true
}))
app.use(express.json())

const onlineUsers = {} as { [key: string]: string };

const getRecieversSocketId = (userId: string) => {
  return onlineUsers[userId];
}

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId as string | undefined;
  onlineUsers[userId as string] = socket.id;
  io.emit("getOnlineUsers", Object.keys(onlineUsers));

  const recieversSocketId = getRecieversSocketId(userId as string);

  socket.on("disconnect", () => {
    delete onlineUsers[userId as string];
  });
});


app.post("/message/:userId/:toUserId", async (req: Request, res: Response): Promise<any> => {
  const { userId, toUserId } = req.params;
  const { message, image } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const otherUser = await prisma.user.findUnique({
      where: {
        id: toUserId
      }
    })

    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found"
      });
    }

    let response;
    if (image) {
      response = await cloudinary.uploader.upload(image, {
        resource_type: "image",
        folder: "instagram/messagesImages",
        quality: "auto:best",
      });

      console.log("Image uploaded to cloudinary: ", response.secure_url);
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId: userId,
        receiverId: toUserId,
        message,
        image: image ? response?.secure_url : null
      }
    })

    const recieversSocketId = getRecieversSocketId(toUserId);
    if (recieversSocketId) {
      io.to(recieversSocketId).emit("newMessage", newMessage);
      console.log("Message sent to user: ", toUserId);
    }

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      newMessage
    })
    return;

  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      success: false,
      message: "Error while sending message",
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    });
    return;
  }
});


server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})