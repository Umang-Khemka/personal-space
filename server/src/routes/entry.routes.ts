
import { Router } from "express";
import {
  createEntry,
  getEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
  getCalendarEntries,
  getMemories,
  getMoodStats
} from "../controllers/entry.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute);

router.post("/create", createEntry);
router.get("/all-entries", getEntries);
router.get("/create/:id", getEntryById);
router.patch("/update/:id", updateEntry);
router.delete("delete/:id", deleteEntry);


router.get("/calendar", getCalendarEntries);
router.get("/memories", getMemories);
router.get("/mood-stats", getMoodStats);

export default router;