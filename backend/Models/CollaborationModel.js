import { Schema, model } from "mongoose";

const collaborationSchema = new Schema(
  {
    repoId: {
      type: Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "removed"],
      default: "pending",
    },
    role: {
      type: String,
      enum: ["collaborator", "viewer"],
      default: "collaborator",
    },
  },
  { timestamps: true }
);

export const CollaborationModel = model("Collaboration", collaborationSchema);
