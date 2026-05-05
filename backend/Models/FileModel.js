import {Schema,model} from "mongoose";
const fileSchema = new Schema({
  repository: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ""
  },
  path: {
    type: String,
    default: "/" 
  }
}, { timestamps: true });

export const fileModel= model("file", fileSchema);