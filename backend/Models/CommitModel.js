import {Schema,model} from "mongoose";

const commitSchema = new Schema({
  repository: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default model("Commit", commitSchema); 7