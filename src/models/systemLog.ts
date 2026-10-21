import mongoose from "mongoose";

const systemLogSchema = new mongoose.Schema(
    {
        reportID: {
            type: String,
            ref: "reporttypes"
        },
        startedAt: {
            type: Date,
            required: true
        },
        finishedAt: {
            type: Date
        },
        status: {
            type: String
        },
        description: {
            type: Object
        }
    },
    { timestamps: true }
);

module.exports =
    mongoose?.models?.systemlog || mongoose.model("systemlog", systemLogSchema);
