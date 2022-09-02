import mongoose from "mongoose";

let template = new mongoose.Schema({
  shop: {
    type: String,
    required: true,
  },
  merchant: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
});

const templates = mongoose.model("templates", template);

export default templates;
