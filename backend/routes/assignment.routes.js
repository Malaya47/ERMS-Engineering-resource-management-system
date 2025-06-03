const express = require("express");
const {
  getAllAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} = require("../controllers/assignment.controller");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", authMiddleware, getAllAssignments);
router.post("/", authMiddleware, createAssignment);
router.put("/:id", authMiddleware, updateAssignment);
router.delete("/:id", authMiddleware, deleteAssignment);

module.exports = router;
