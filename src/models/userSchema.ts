import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        role: {
            type: String,
            required: true
        },
        allowedReports: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "reporttypes"
            }
        ],
        lastLogin: {
            type: Date
        },
        createdBy: {
            type: String
        }
    },
    { timestamps: true }
);

module.exports = mongoose?.models?.users || mongoose.model("users", UserSchema);
