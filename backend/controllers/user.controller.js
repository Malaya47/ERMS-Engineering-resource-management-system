const User = require("../models/User");
const Assignment = require("../models/Assignment");

exports.getAllEngineers = async (req, res) => {
  const engineers = await User.find({ role: "engineer" }).select("-password");
  res.json(engineers);
};

exports.updateEngineer = async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

exports.getEngineerCapacity = async (req, res) => {
  const engineer = await User.findById(req.params.id);
  if (!engineer) return res.status(404).json({ message: "Engineer not found" });

  const assignments = await Assignment.find({
    engineerId: engineer._id,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() },
  });

  if (totalAllocated > engineer.maxCapacity) {
    totalAllocated = engineer.maxCapacity;
  }

  const available = Math.max(engineer.maxCapacity - totalAllocated, 0);

  res.json({ totalAllocated, available });
};
