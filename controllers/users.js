import fs from "fs/promises"; // For file system operations
import User from "../models/User.js";
import Post from "../models/Post.js";


/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const requestingUserId = req.user.id; // Accessing the ID of the requesting user from req.user
    const users = await User.find({ _id: { $ne: requestingUserId } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* DELETE */
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Ensure the authenticated user can only delete their own account
    if (req.user.id !== userId) {
      return res.status(403).json({ message: "You can only delete your own account" });
    }

    // Find and delete the user
     await User.findByIdAndDelete(userId);
     await Post.deleteMany({ userId });
     res.status(200).json({ message: "User deleted successfully" });


  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller function to update user profile

export const updateUserProfile = async (req, res) => {
  try {

    const { id } = req.params;
    const { firstName, lastName, location, occupation } = req.body;
    let picturePath = req.file?req.file.filename:undefined;

      // Check if id is defined
      if (!id) {
        return res.status(400).json({ message: "User ID is required" });
      }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, location, occupation, picturePath },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
       // Update user details in all associated posts
       await Post.updateMany(
        { userId: id }, // Find all posts where userId matches
        { $set: { 
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          location: updatedUser.location,
          userPicturePath: updatedUser.picturePath
        }}
      );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: error.message });
  }
};
