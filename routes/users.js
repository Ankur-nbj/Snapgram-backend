import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  deleteUser,
  updateUserProfile,
  getAllUsers,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();

// Setup multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* READ */
router.get("/", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
router.put("/:id", verifyToken, upload.single("picturePath"), updateUserProfile);

/* DELETE */
router.delete("/:id", verifyToken, deleteUser);

export default router;
