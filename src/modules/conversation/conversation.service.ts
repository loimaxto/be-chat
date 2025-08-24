import { prisma } from "../../config/prisma.config";
import { conversations } from "@prisma/client";
import { BadRequestError } from "../../utils/errors";
import { UserService } from "../user/user.service";
import { CreateConversationDto } from "./conversation.dto";

interface ConversationServiceInterface {
  createConversation(creatorId: string, conversationData: CreateConversationDto): Promise<conversations>;
  addMemberToConversation(conversationId: string, userId: string, isAdmin: boolean): Promise<void>;
  updateMemberRole(conversationId: string, userId: string, isAdmin: boolean): Promise<void>;
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

    // Use a transaction to ensure creating the conversation and adding participants is an atomic operation.
    const newConversationWithParticipants = await prisma.$transaction(async (tx) => {
      const conversation = await tx.conversations.create({
        data: {
          // The database constraint violation indicates an empty name is not allowed for non-group chats.
          // We'll use the provided name for group chats, and null for 1-on-1 chats.
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

      // Fetch the newly created conversation with its participants and their user details.
      // This is more efficient than a separate query after the transaction.
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
