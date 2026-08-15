const MONG_URI = process.env.MONG_URI;
const mongoose = require("mongoose");

const dbConnect = () => {
    console.log("Connecting to mongo DB...");

    mongoose
        .connect(MONG_URI)
        .then(() => {
            console.log("Mongo DB connected. ");
        })
        .catch((err: any) =>
            console.log("Connection to Mongo DB failed. " + err)
        );
};

export default dbConnect;
