const mongoose = require("mongoose");
const { Schema } = mongoose;

const Notification = new Schema(
  {
    authorId: { type: Schema.Types.ObjectId, ref: "User" },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    listPublications: [{ type: Schema.Types.ObjectId, ref: "Publication" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Notification", Notification);
