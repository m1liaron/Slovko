import { type User, type NewUser } from "./user.model";
import { encrypt } from "@/libs/modules/encrypt";
import { HttpError } from "@/libs/constants";
import { UserRepository } from "./user.repository";

const UserService = {
    toSafeUser(user: User): Omit<User, "password"> {
        const { password, ...safe } = user;
        return safe;
    },

    async createUser(input: NewUser): Promise<User> {
        if (!input.password) {
            throw HttpError.badRequest("Password is required");
        }

        const existing = await UserRepository.findByEmail(input.email);
        if (existing) {
            throw HttpError.badRequest("Email already in use");
        }

        const hashed = await encrypt.hash(input.password);

        return UserRepository.create({ ...input, password: hashed });
    },

    async findUserByEmail(email: string): Promise<User | undefined> {
        return UserRepository.findByEmail(email);
    },

    async findUserById(id: string): Promise<User | undefined> {
        return UserRepository.findById(id);
    },
}
export { UserService }