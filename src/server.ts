import app from './app';
import config from './config/config';
import http from 'http';
import { Server } from 'socket.io';
import { MessageService } from './modules/message/message.service';

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Adjust for your frontend URL in production
    }
});

const messageService = new MessageService();

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('join_conversation', (conversationId: string) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined conversation ${conversationId}`);
  });

  socket.on('send_message', async (data: { conversationId: string; senderId: string; content: string }) => {
    try {
      // In a real app, you'd get senderId from an authenticated session/token
      const message = await messageService.createMessage(data.senderId, data.conversationId, data.content);
      io.to(data.conversationId).emit('receive_message', message);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message_error', { error: 'Could not send message' });
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});