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

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Seed engineers
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
        maxCapacity: 60, // Part-time
        department: "Backend",
      },
      {
        name: "Charlie Coder",
        email: "charlie@example.com",
        password: hashedPassword,
        role: "engineer",
        skills: ["Node.js", "MongoDB"],
        seniority: "junior",
        maxCapacity: 80,
        department: "Fullstack",
      },
      {
        name: "Daisy DevOps",
        email: "daisy@example.com",
        password: hashedPassword,
        role: "engineer",
        skills: ["AWS", "Terraform", "Docker"],
        seniority: "senior",
        maxCapacity: 100,
        department: "DevOps",
      },
    ]);

    // Seed manager
    const manager = await User.create({
      name: "Mandy Manager",
      email: "manager@example.com",
      password: hashedPassword,
      role: "manager",
      department: "Management",
    });

    // Seed projects
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
      {
        name: "Project Orbit",
        description: "Infrastructure automation for CI/CD",
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 50),
        requiredSkills: ["Docker", "Terraform", "AWS"],
        teamSize: 2,
        status: "active",
        managerId: manager._id,
      },
    ]);

    // Seed assignments
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
        allocationPercentage: 60,
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        role: "Backend Engineer",
      },
      {
        engineerId: engineers[2]._id,
        projectId: projects[2]._id,
        allocationPercentage: 40,
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25),
        role: "Support Engineer",
      },
      {
        engineerId: engineers[3]._id,
        projectId: projects[3]._id,
        allocationPercentage: 100,
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 50),
        role: "DevOps Engineer",
      },
      {
        engineerId: engineers[0]._id,
        projectId: projects[1]._id,
        allocationPercentage: 30,
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
        role: "Frontend Consultant",
      },
      {
        engineerId: engineers[2]._id,
        projectId: projects[0]._id,
        allocationPercentage: 30,
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
        role: "Junior Developer",
      },
      {
        engineerId: engineers[1]._id,
        projectId: projects[3]._id,
        allocationPercentage: 40,
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        role: "Backend Support",
      },
      {
        engineerId: engineers[3]._id,
        projectId: projects[2]._id,
        allocationPercentage: 50,
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        role: "Infra Advisor",
      },
    ]);

    console.log("🌱 Seed data inserted successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seed();
