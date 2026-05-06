import { Schema, model } from "mongoose";

const commitSchema = new Schema(
  {
    repoId: {
      type: Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },

    message: {
      type: String,
      default: "initial commit",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    snapshot: [
      {
        filename: String,
        filePath: String,
      },
    ],
  },
  { timestamps: true }
);

export const CommitModel = model("Commit", commitSchema);