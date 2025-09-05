import { conversations } from "@prisma/client";
import { prisma } from "../../config/prisma.config";
import { BadRequestError } from "../../utils/errors";
import { CreateConversationDto } from "./conversation.dto";
import { boolean } from "zod";

interface ConversationServiceInterface {
  createConversation(creatorId: string, conversationData: CreateConversationDto): Promise<conversations>;
  addMemberToConversation(conversationId: string, userId: string, isAdmin: boolean): Promise<void>;
  updateMemberRole(conversationId: string, userId: string, isAdmin: boolean): Promise<void>; 
  getConversationDetails(conversationId: string, reqUserId: string, skip:number, take: number): Promise<any>;
}
export class ConversationService implements ConversationServiceInterface {
  async createConversation(creatorId: string, conversationData: CreateConversationDto): Promise<conversations> {
    const { name, isGroup, groupMemberIds } = conversationData;
    const allMemberIds = [...new Set([creatorId, ...groupMemberIds])];

    const existingUsersCount = await prisma.users.count({
      where: {
        user_id: { in: allMemberIds },
      },
    });

    if (existingUsersCount !== allMemberIds.length) {
      throw new BadRequestError("One or more participant user IDs do not exist.");
    }

    const newConversationWithParticipants = await prisma.$transaction(async (tx) => {
      const conversation = await tx.conversations.create({
        data: {
          name: isGroup ? name : null,
          isGroup: isGroup,
          created_by_user_id: creatorId,
        },
      });

      const participantsData = allMemberIds.map((userId) => ({
        conversation_id: conversation.conversation_id,
        user_id: userId,
        // The creator is an admin in a group chat. In 1-on-1 chats, the concept of admin doesn't apply.
        is_admin: isGroup && userId === creatorId,
      }));

      await tx.conversation_participants.createMany({
        data: participantsData,
      });

      const fullConversation = await tx.conversations.findUniqueOrThrow({
        where: {
          conversation_id: conversation.conversation_id,
        },
        include: {
          conversation_participants: {
            include: {
              users: {
                select: {
                  user_id: true,
                  username: true,
                  profile_picture_url: true,
                  status: true,
                  last_seen_at: true,
                },
              },
            },
          },
        },
      });
      return fullConversation;
    });

    return newConversationWithParticipants;
  }

  async getConversationDetails(conversationId: string, reqUserId: string, skip: number, take: number): Promise<any> {
    const isPaticipant = await prisma.conversation_participants.count({
      where:{
        conversation_id: conversationId,
        user_id: reqUserId
      }
    }) 
    if ( !isPaticipant ) {
      throw new BadRequestError("User is not a participant of this conversation")
    }
    const conversation = await prisma.messages.findMany({
      where: {
        conversation_id: conversationId,
      },
      skip: skip,
      take: take,
      orderBy: {
        sent_at: "asc", // Get messages in ascending order (oldest first)
      },
      select: {
        message_id: true,
        content: true,
        sender_id: true,
        sent_at: true,
      },
    });
    return conversation;
  }
  async getConversationsByUserId(userId: string): Promise<any> {
    const conversations = await prisma.conversations.findMany({
      where: {
        conversation_participants: {
          some: {
            user_id: userId,
          },
        },
      },
      select: {
        name: true,
        isGroup: true,
        conversation_participants: {
          select: {
            is_admin: true,
            users: {
              select: {
                username: true,
                profile_picture_url: true,
              },
            },
          },
        },
      },
    });
    const formattedConversations = conversations.map((conversation) => {
      const { name, isGroup, conversation_participants } = conversation;

      const formattedParticipants = conversation_participants.map((participant) => {
        const { users, is_admin } = participant;
        return {
          name: users.username,
          avatar: users.profile_picture_url,
          isAdmin: is_admin,
        };
      });

      return {
        name,
        isGroup,
        members: formattedParticipants,
      };
    });

    return { data: formattedConversations };
  }
  async addMemberToConversation(conversationId: string, userId: string, isAdmin = false): Promise<void> {
    await prisma.conversation_participants.create({
      data: {
        user_id: userId,
        conversation_id: conversationId,
        is_admin: isAdmin,
      },
    });
  }
  async updateMemberRole(conversationId: string, userId: string, isAdmin: boolean): Promise<void> {
    await prisma.conversation_participants.update({
      where: {
        conversation_id_user_id: {
          conversation_id: conversationId,
          user_id: userId,
        },
      },
      data: {
        is_admin: isAdmin,
      },
    });
  }
}
