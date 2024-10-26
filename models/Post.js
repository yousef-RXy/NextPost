import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  image_url: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
