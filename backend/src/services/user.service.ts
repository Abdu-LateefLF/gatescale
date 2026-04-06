import userRepository from '../repository/UserRepository';
import { UserProfile } from '../schemas/user.schema';

class UserService {
    async getUserProfile(userId: string): Promise<UserProfile> {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const profile: UserProfile = {
            id: user.id || '',
            name: user.name,
            email: user.email,
            tier: user.tier,
            role: user.role,
            createdAt: user.createdAt || '',
        };

        return profile;
    }
}

const userService = new UserService();
export default userService;
