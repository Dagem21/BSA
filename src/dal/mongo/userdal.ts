import { UserDto } from "@/dto/user";

require("@/models/userSchema");
const mongoose = require("mongoose");
const userSchema = mongoose.model("users");

export const findUser = async (email: string) => {
    try {
        const user = await userSchema.findOne({ email });
        return user;
    } catch (e) {
        return null;
    }
};

export const findUsers = async (filter: UserDto) => {
    try {
        const user = await userSchema.find(filter);
        return user;
    } catch (e) {
        return null;
    }
};

export const createUser = async (user: UserDto) => {
    try {
        const userCr = await userSchema.create(user);
        return { created: userCr };
    } catch (e) {
        return { created: false };
    }
};

export const updateUser = async (email: string, update: UserDto) => {
    try {
        const userUp = await userSchema.updateOne({ email }, { $set: update });
        return {
            found: userUp.matchedCount === 1,
            updated: userUp.matchedCount === 1
        };
    } catch (e) {
        return { found: false, updated: false };
    }
};
