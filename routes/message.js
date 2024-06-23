import express from "express";
import multer from "multer";
import { getMessages, sendMessage } from "../controllers/message.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

router.get("/:id", verifyToken, getMessages);
router.post("/send/:id", verifyToken, upload.single("image"), sendMessage);

export default router;
