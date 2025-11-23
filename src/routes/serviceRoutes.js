const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
import { validateServiceData } from "../validators/serviceValidator.js";

const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/services.controller");

// All routes here require authentication
router.get("/", auth, getAllServices);
router.get("/:id", auth, getServiceById);
router.post("/", auth, validateServiceData, createService);
router.put("/:id", auth, validateServiceData, updateService);
router.delete("/:id", auth, deleteService);

module.exports = router;