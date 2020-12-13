const mongoose = require("mongoose");
const { Schema } = mongoose;

const AuthorRequest = new Schema(
  {
    date: { type: Date, default: Date.now },
    email2: { type: String, required: true },
    professionalCard: { type: String, required: true },
    employmentHistory: { type: String, required: true },
    academicHistory: { type: String, required: true },
    userId: { type: Schema.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("AuthorRequest", AuthorRequest);
