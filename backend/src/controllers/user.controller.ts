import { Request, Response } from 'express';
import { AuthenticationError } from '../utils/error';
import userService from '../services/user.service';

class UserController {
    async getUserProfile(req: Request, res: Response) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new AuthenticationError('User not authenticated');
        }

        const user = await userService.getUserProfile(userId);
        res.json(user);
    }
}

const userController = new UserController();
export default userController;
