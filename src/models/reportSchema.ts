import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        reportType: {
            type: String,
            required: true,
            ref: "reporttypes"
        },
        file: {
            type: String,
            required: true
        },
        json: {
            type: String,
            required: true
        },
        reportingDate: {
            type: Date,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        createdBy: {
            type: String,
            required: true,
            ref: "users"
        },
        approvedBy: {
            type: String,
            ref: "users"
        },
        status: {
            type: String,
            required: true,
            default: "Pending"
        },
        response: {
            type: Object
        }
    },
    { timestamps: true }
);

module.exports =
    mongoose?.models?.reports || mongoose.model("reports", reportSchema);
