require("@/models/userSchema");

import { UserDto } from "@/dto/user";

const mongoose = require("mongoose");
const userSchema = mongoose.model("users");

export const findUser = async (filter: UserDto) => {
    try {
        const user = await userSchema.findOne(filter);
        return user;
    } catch (e) {
        return null;
    }
};

export const findUsers = async (filter: UserDto) => {
    try {
        const user = await userSchema.find(filter).populate("allowedReports");
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

export const updateUser = async (id: string, update: UserDto) => {
    try {
        const userUp = await userSchema.updateOne(
            { _id: id },
            { $set: update }
        );
        return {
            found: userUp.matchedCount === 1,
            updated: userUp.matchedCount === 1
        };
    } catch (e) {
        return { found: false, updated: false };
    }
};
