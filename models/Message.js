import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: function() {
        return !this.imageUrl; // text is required if imageUrl is not provided
      }
    },
    imageUrl: {
      type: String,
      required: function() {
        return !this.text; // imageUrl is required if text is not provided
      }
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;
