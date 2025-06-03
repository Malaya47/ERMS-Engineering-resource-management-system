const Project = require("../models/Project");

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("managerId", "name email");
    res.status(200).json({
      message: "Projects fetched successfully",
      projects: projects,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching projects",
      error: error.message,
    });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "managerId",
      "name"
    );
    if (!project) return res.status(404).json({ message: "Not found" });
    res.status(200).json({
      message: "Project fetched successfully",
      project: project,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching project",
      error: error.message,
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      message: "Project updated successfully",
      updated: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating project",
      error: error.message,
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      requiredSkills,
      teamSize,
      status,
    } = req.body;
    const project = new Project({
      name,
      description,
      startDate,
      endDate,
      requiredSkills,
      teamSize,
      status,
      managerId: req.user.id,
    });
    await project.save();
    res.status(201).json({
      message: "Project created successfully",
      project: project,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating project",
      error: error.message,
    });
  }
};
