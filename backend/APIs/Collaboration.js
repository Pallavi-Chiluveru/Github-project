import { Schema, model, Types } from "mongoose";

const CollaborationSchema = new Schema({
  repository: {
    type: Types.ObjectId,
    ref: "repo",
    required: true
  },

  user: {
    type: Types.ObjectId,
    ref: "user",
    required: true
  },

  role: {
    type: String,
    enum: ["owner", "collaborator", "viewer"],
    default: "collaborator"
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  },

  invitedBy: {
    type: Types.ObjectId,
    ref: "user"
  }

}, { timestamps: true });

export const CollaborationModel = model("Collaboration", CollaborationSchema);