import mongoose from 'mongoose';

const LikeSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

LikeSchema.index({ user_id: 1, post_id: 1 }, { unique: true });

export default mongoose.models.Like || mongoose.model('Like', LikeSchema);
