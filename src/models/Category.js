const mongoose = require("mongoose");
const { Schema } = mongoose;

const Category = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    publications: { type: Number, default: 0, required: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Category", Category);
