import express from "express";
import { getMessages, sendMessage } from "../controllers/message.js";

import {verifyToken} from "../middleware/auth.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/:id", verifyToken, getMessages);
router.post("/send/:id", verifyToken, sendMessage);

export default router;
