import { prisma } from '../../config/prisma.config';
import { CreateConversationDto } from './conversation.dto';
import { NotFoundError } from '../../utils/errors';

export class ConversationService {
  public async createConversation(data: CreateConversationDto) {
    const { name, isGroup, participants } = data;

    // Ensure all participants exist
    const existingUsers = await prisma.users.findMany({
      where: {
        user_id: {
          in: participants,
        },
      },
      select: {
        user_id: true,
      },
    });

    if (existingUsers.length !== participants.length) {
      const foundUserIds = new Set(existingUsers.map((u) => u.user_id));
      const missingParticipants = participants.filter(
        (id) => !foundUserIds.has(id),
      );
      throw new NotFoundError(
        `Participants not found: ${missingParticipants.join(', ')}`,
      );
    }

    const newConversation = await prisma.conversations.create({
      data: {
        name,
        is_group: isGroup,
        participants: {
          create: participants.map((userId) => ({
            user_id: userId,
          })),
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                user_id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });
    return newConversation;
  }

  public async getConversationById(conversationId: string) {
    const conversation = await prisma.conversations.findUnique({
      where: { conversation_id: conversationId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                user_id: true,
                username: true,
                email: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            sent_at: 'asc',
          },
          include: {
            sender: {
              select: {
                user_id: