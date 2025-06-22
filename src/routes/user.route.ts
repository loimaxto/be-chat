import {Router} from 'express'
import { createUser } from '../controllers/user.controllers';
import { validateZod } from '../middlewares/zodValidation';
import { createUserSchema } from '../dtos/user.dto';
const router = Router();

//user route
router.get('/', (req, res) => {
  res.json({ message: 'User route' });
});

//get friends of a user
router.get('/:userId/friends', (req, res) => {
  const userId = req.params.userId;
  res.json({ userId, friends: ['friend1', 'friend2'] });
});

router.post('/register', validateZod(createUserSchema), createUser);

export default router;