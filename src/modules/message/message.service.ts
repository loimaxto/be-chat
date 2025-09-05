import { conversations } from "@prisma/client";
import { prisma } from "../../config/prisma.config";

export class MessageService {
    async createMessage( useId:string, conversationId:string, content:any) {
        await prisma.messages.create({
            data: {
                conversation_id: conversationId,
                sender_id: useId,
                content: content,
                content_type: "text"
            }
        })
    }
}