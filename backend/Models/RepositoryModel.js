import {Schema,model} from "mongoose";
import "../models/UserModel.js";
const repositorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    isPrivate: {
      type: Boolean,
      default: false,
    },

    collaborators: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    viewers: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    defaultBranch: {
      type: String,
      default: "main",
    },

    gitRemoteUrl: {
      type: String,
      default: "",
    },

    gitProvider: {
      type: String,
      enum: ["none", "github"],
      default: "none",
    },

    // optional but useful later
    tags: [
      {
        type: String,
      },
    ],
    gitignore: {
      type: String,
      default: "None"
    },
    license: {
      type: String,
      default: "None"
    }
  },
  { timestamps: true }
);

export const RepositoryModel = model("Repository", repositorySchema);
