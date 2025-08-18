import { Request, Response, NextFunction } from 'express';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './conversation.dto';
import { NotFoundError } from '../../utils/errors';

export class ConversationController {
  private conversationService = new ConversationService();

  public createConversation = async (
    req: Request<{}, {}, CreateConversationDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const newConversation = await this.conversationService.createConversation(req.body);
      res.status(201).json(newConversation);
    } catch (error) {
      next(error);
    }
  };

  public getConversationById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const conversation = await this.conversationService.getConversationById(id);
      if (!conversation) {
        throw new NotFoundError('Conversation not found');
      }
      res.status(200).json(conversation);
    } catch (error) {
      next(error);
    }
  };

  public getUserConversations = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userId } = req.params;
      const conversations = await this.conversationService.getUserConversations(userId);
      res.status(200).json(conversations);
    } catch (error) {
      next(error);
    }
  };

  public addParticipantToConversation = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { conversationId, userId } = req.params;
      const updatedConversation = await this.conversationService.addParticipantToConversation(conversationId, userId);
      res.status(200).json(updatedConversation);
    } catch (error) {
      next(error);
    }
  };

  public removeParticipantFromConversation = async (
    req: Request,
    res