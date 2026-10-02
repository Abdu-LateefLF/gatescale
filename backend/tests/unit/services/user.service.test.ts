import { jest, test, expect, beforeEach } from "@jest/globals";
import userService from "../../../src/services/user.service";
import userRepository from "../../../src/repository/UserRepository";

jest.mock("../../../src/repository/UserRepository", () => ({
    findById: jest.fn()
}));

const mockUserRepository = jest.mocked(userRepository);

beforeEach(() => {
    jest.resetAllMocks();
});

test('get user profile returns the public fields without the password hash', async () => {
    const fakeUser = {
        id: '123',
        name: 'John Doe',
        email: 'jdoe@gmail.com',
        passwordHash: 'hashed-password',
        createdAt: new Date('2026-01-01T00:00:00Z'),
        role: 'user',
        tier: 'free'
    } as const;
    const { passwordHash, ...expectedUser } = fakeUser;
    mockUserRepository.findById.mockResolvedValueOnce(fakeUser);

    const profile = await userService.getUserProfile(fakeUser.id);

    expect(profile).toEqual(expectedUser);
    expect(profile).not.toHaveProperty('passwordHash');
    expect(mockUserRepository.findById).toHaveBeenCalledWith(fakeUser.id);
});

test('rejects non-existent user profile id', async () => {
    mockUserRepository.findById.mockResolvedValueOnce(null);

    await expect(userService.getUserProfile('123')).rejects.toThrow(/not found/);
});
