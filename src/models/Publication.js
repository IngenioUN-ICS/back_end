const mongoose = require("mongoose");
const { Schema } = mongoose;

const Publication = new Schema(
  {
    date: { type: Date, default: Date.now },
    title: { type: String, required: true },
    abstract: { type: String, required: true },
    keyWords: { type: [String], required: true },
    text: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User" },
    listCategories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Publication", Publication);
