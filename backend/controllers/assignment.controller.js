const Assignment = require("../models/Assignment");

exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("engineerId", "name email")
      .populate("projectId", "name");
    res.status(200).json({
      message: "Assignments fetched successfully",
      assignments: assignments,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching assignments", error: error.message });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    const {
      engineerId,
      projectId,
      allocationPercentage,
      startDate,
      endDate,
      role,
    } = req.body;
    const assignment = new Assignment({
      engineerId,
      projectId,
      allocationPercentage,
      startDate,
      endDate,
      role,
    });
    await assignment.save();

    res.status(201).json({
      message: "Assignment created successfully",
      assignment: assignment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating assignment", error: error.message });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const updated = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res
      .status(200)
      .json({ message: "Assignment updated successfully", updated: updated });
    res.json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating assignment", error: error.message });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: "Assignment removed" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting assignment", error: error.message });
  }
};
