const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

export const createToken = (key: any) => {
    const token = jwt.sign(key, JWT_SECRET, {
        expiresIn: "1h"
    });
    return token;
};

export const decryptToken = (token: string) => {
    const decoded = jwt.verify(token, JWT_SECRET);
    const key = decoded;
    return key;
};
