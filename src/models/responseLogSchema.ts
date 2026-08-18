import mongoose from "mongoose";

const responseLogSchema = new mongoose.Schema(
    {
        reportID: {
            type: String,
            required: true,
            ref: "reports"
        },
        json: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        response: {
            type: Object
        }
    },
    { timestamps: true }
);

module.exports =
    mongoose?.models?.responselog ||
    mongoose.model("responselog", responseLogSchema);
