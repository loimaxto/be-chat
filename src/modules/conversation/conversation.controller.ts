import { conversations } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../../utils/errors";
import { CreateConversationDto } from "./conversation.dto";
import { ConversationService } from "./conversation.service";

export class ConversationController {
  private conversationService = new ConversationService();

  public async createConversation(
    req: Request<{}, {}, CreateConversationDto>,
    res: Response<conversations>,
    next: NextFunction
  ) {
    try {
      const creatorId = req.user?.sub;
      if (!creatorId) {
        return next(new UnauthorizedError("User not authenticated or user ID is missing."));
      }
      const newConversation = await this.conversationService.createConversation(creatorId, req.body);

      res.status(201).json(newConversation);
    } catch (error) {
      next(error);
    }
  }

  public async getUserConversations(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        return next(new UnauthorizedError("User not authenticated or user ID is missing."));
      }
      const conversations = await this.conversationService.getConversationsByUserId(userId)
      return res.status(201).json(conversations)
    } catch (e) {
      next(e)
    }
  }
  // public getConversationById = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const { id } = req.params;
  //     const conversation =
  //       // await this.conversationService.getConversationById(id);
  //     if (!conversation) {
  //       throw new NotFoundError("Conversation not found");
  //     }
  //     res.status(200).json(conversation);
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}
