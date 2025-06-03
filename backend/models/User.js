const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["manager", "engineer"], default: "engineer" },
  skills: [String],
  seniority: { type: String, enum: ["junior", "mid", "senior"] },
  maxCapacity: Number,
  department: String,
});

module.exports = mongoose.model("User", userSchema);
