const express = require("express");
const {
  getAllEngineers,
  getEngineerCapacity,
  updateEngineer,
} = require("../controllers/user.controller");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", authMiddleware, getAllEngineers);
router.get("/:id/capacity", authMiddleware, getEngineerCapacity);
router.put("/:id", authMiddleware, updateEngineer);

module.exports = router;
