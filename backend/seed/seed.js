const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/User");
const Project = require("../models/Project");
const Assignment = require("../models/Assignment");

const connectDB = require("../config/db");
connectDB();

const seed = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await Assignment.deleteMany();

    // Password hashing
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create Users
    const engineers = await User.insertMany([
      {
        name: "Alice Engineer",
        email: "alice@example.com",
        password: hashedPassword,
        role: "engineer",
        skills: ["React", "Node.js"],
        seniority: "mid",
        maxCapacity: 100,
        department: "Frontend",
      },
      {
        name: "Bob Dev",
        email: "bob@example.com",
        password: hashedPassword,
        role: "engineer",
        skills: ["Python", "Django"],
        seniority: "senior",
        maxCapacity: 100,
        department: "Backend",
      },
      {
        name: "Charlie Coder",
        email: "charlie@example.com",
        password: hashedPassword,
        role: "engineer",
        skills: ["Node.js", "MongoDB"],
        seniority: "junior",
        maxCapacity: 50,
        department: "Fullstack",
      },
    ]);

    const manager = await User.create({
      name: "Mandy Manager",
      email: "manager@example.com",
      password: hashedPassword,
      role: "manager",
      department: "Management",
    });

    // Create Projects
    const projects = await Project.insertMany([
      {
        name: "Project Atlas",
        description: "AI analytics dashboard",
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        requiredSkills: ["React", "Node.js"],
        teamSize: 3,
        status: "active",
        managerId: manager._id,
      },
      {
        name: "Project Nova",
        description: "Backend service revamp",
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
        requiredSkills: ["Python", "Django"],
        teamSize: 2,
        status: "planning",
        managerId: manager._id,
      },
      {
        name: "Project Zenith",
        description: "Internal tooling",
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
        requiredSkills: ["MongoDB", "Node.js"],
        teamSize: 2,
        status: "planning",
        managerId: manager._id,
      },
    ]);

    // Create Assignments
    await Assignment.insertMany([
      {
        engineerId: engineers[0]._id,
        projectId: projects[0]._id,
        allocationPercentage: 50,
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
        role: "Frontend Developer",
      },
      {
        engineerId: engineers[1]._id,
        projectId: projects[1]._id,
        allocationPercentage: 80,
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        role: "Backend Lead",
      },
      {
        engineerId: engineers[2]._id,
        projectId: projects[2]._id,
        allocationPercentage: 50,
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        role: "Support Engineer",
      },
    ]);

    console.log("🌱 Seed data inserted!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
