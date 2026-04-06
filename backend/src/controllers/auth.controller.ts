import { Request, Response } from 'express';
import { RegisterInput } from '../schemas/auth.schema';
import authService from '../services/auth.service';

class AuthController {
    async login(req: Request, res: Response) {
        res.send("Login route");
    }

    async register(req: Request, res: Response) {
        const { name, email, password } = req.body as RegisterInput;
        
        const result = await authService.register(name, email, password);
        res.json(result);
    }
}

const authController = new AuthController();
export default authController;