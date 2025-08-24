import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../../utils/errors";
import { CreateConversationDto } from "./conversation.dto";
import { ConversationService } from "./conversation.service";
import { conversations } from "@prisma/client";

export class ConversationController {
  private conversationService = new ConversationService();
  
  
  public createConversation = async (
    req: Request<{}, {}, CreateConversationDto>,
    res: Response<conversations>,
    next: NextFunction
  ) => {
    try {
      const creatorId = req.user?.sub;
      if (!creatorId) {
        return next(new UnauthorizedError("User not authenticated or user ID is missing."));
      }

      const newConversation = await this.conversationService.createConversation(creatorId, req.body);

      // Set the Location header to the URL of the newly created resource.
      // res.location(`/api/conversations/${newConversation.conversation_id}`);
      res.status(201).json(newConversation);
    } catch (error) {
      next(error);
    }
  };

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
