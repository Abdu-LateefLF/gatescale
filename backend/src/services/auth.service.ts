import userRepository from "../repository/UserRepository";
import { BadRequestError } from "../utils/error";
import { hashPassword } from "../utils/auth";

class AuthService {
    async login(email: string, password: string) {
        // Implement login logic here
        return { message: "Login successful" };
    }

    async register(name: string, email: string, password: string): Promise<{ message: string }> {
        const userExists = await userRepository.findByEmail(email);
        if (userExists) {
            throw new BadRequestError("Email already in use");
        }

        const passwordHash = await hashPassword(password);
        await userRepository.insert(name, email, passwordHash);

        return { message: "Registration successful" };
    }
}

const authService = new AuthService();
export default authService;