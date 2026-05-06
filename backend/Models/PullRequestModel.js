import { Schema, model } from "mongoose";

const pullRequestSchema = new Schema(
  {
    repoId: {
      type: Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: String,

    fromCommit: {
      type: Schema.Types.ObjectId,
      ref: "Commit",
      required: true,
    },

    toCommit: {
      type: Schema.Types.ObjectId,
      ref: "Commit",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    status: {
      type: String,
      enum: ["open", "merged", "rejected"],
      default: "open",
    },
  },
  { timestamps: true }
);

export const PullRequestModel = model("PullRequest", pullRequestSchema);