import { Router } from 'express';
import { ConversationController } from './conversation.controller';
import { validateZod } from '../../middlewares/zodValidation';
import { createConversationSchema } from './conversation.dto';
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = Router();
const conversationController = new ConversationController();

router.use(authenticateToken);

router.post('/', validateZod(createConversationSchema), conversationController.createConversation);
router.get('/self', conversationController.getUserConversations.bind(conversationController));
// router.get('/user/:userId', conversationController.getUserConversations);
// router.post(
//   '/:conversationId/participants/:userId',
//   conversationController.addParticipantToConversation,
// );
// router.delete(
//   '/:conversationId/participants/:userId',
//   conversationController.removeParticipantFromConversation,
// );

export default router;
