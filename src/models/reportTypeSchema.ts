import mongoose from "mongoose";

const reportTypeSchema = new mongoose.Schema(
    {
        reportId: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        frequency: {
            type: String,
            required: true
        },
        service: {
            type: String,
            required: true
        },
        createdBy: {
            type: String,
            required: true,
            ref: "users"
        }
    },
    { timestamps: true }
);

module.exports =
    mongoose?.models?.reporttypes ||
    mongoose.model("reporttypes", reportTypeSchema);
