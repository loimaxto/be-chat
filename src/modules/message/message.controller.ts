import { Request, Response, NextFunction } from 'express';
import { MessageService } from './message.service';


export class MessageController {
    private messageService = new MessageService();

    async getMessages(req: Request, res: Response, next: NextFunction):Promise<any> {
        try {
            const { conversationId } = req.params;
            if (!conversationId) {
                return res.status(400).json({ message: 'Conversation ID is required' });
            }
            const messages = await this.messageService.getMessages(conversationId);
            res.status(200).json(messages);
        } catch (error) {
            next(error);
        }
    }
}