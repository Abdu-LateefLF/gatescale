import { Request, Response } from 'express';
import { AuthenticationError } from '../utils/error';
import userService from '../services/user.service';

class UserController {
    getUserProfile(req: Request, res: Response) {
        const userId = req.user?.id;
        if (!userId) {
            throw new AuthenticationError('User not authenticated');
        }

        const user = userService.getUserProfile(userId);
        res.json(user);
    }
}

const userController = new UserController();
export default userController;
