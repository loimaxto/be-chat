import { messages } from "@prisma/client";
import { prisma } from "../../config/prisma.config";

export class MessageService {
  async createMessage(userId: string, conversationId: string, content: any): Promise<messages> {
    const message = await prisma.messages.create({
      data: {
        conversation_id: conversationId,
        sender_id: userId,
        content: content,
        content_type: "text",
      },
    });
    return message;
  }

  async getMessages(conversationId: string): Promise<any> {
    const messages = await prisma.messages.findMany({
      where: {
        conversation_id: conversationId, 
      },
      relationLoadStrategy: "join",
      select: {
        message_id: true,
        content: true,
        sent_at: true,
        content_type: true,
        users: {
          select: {
            user_id: true,
            username: true,
            profile_picture_url: true,
          },
        },
      },
    });

    const formattedMessages = messages.map((message) => {
      const { users: sender, ...rest } = message;
      return {
        id: message.message_id,
        content: message.content,
        type: message.content_type,
        sentAt: message.sent_at,
        sender: {
          id: sender.user_id,
          name: sender.username,
          avatar: sender.profile_picture_url,
        },
      };
    });
    return { data: formattedMessages };
  }

  async deleteMessage(messageId: string) {
    await prisma.messages.delete({
      where: {
        message_id: messageId,
      },
    });
  }
}
