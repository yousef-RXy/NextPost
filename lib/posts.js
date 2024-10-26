import Post from '../models/Post';
import User from '../models/User';
import Like from '../models/Like';
import connectToDatabase from './mongoose';

export async function getPosts(maxNumber = 100) {
  await connectToDatabase();

  try {
    const posts = await Post.find()
      .populate('user_id', 'first_name last_name')
      .sort({ created_at: -1 })
      .limit(maxNumber);

    const formattedPosts = await Promise.all(
      posts.map(async post => {
        const likes = await Like.countDocuments({ post_id: post._id });
        return {
          id: post._id,
          title: post.title,
          content: post.content,
          createdAt: post.created_at,
          imagUrl: post.image_url,
          userFirstName: post.user_id.first_name,
          userLastName: post.user_id.last_name,
          likes,
        };
      })
    );

    return formattedPosts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function storePost(post) {
  await connectToDatabase();

  try {
    const newPost = await Post.create({
      image_url: post.imageUrl,
      title: post.title,
      content: post.content,
      user_id: post.userId,
    });

    return newPost;
  } catch (error) {
    console.error('Error storing post:', error);
    return null;
  }
}

export async function updatePostLikeStatus(postId, userId) {
  await connectToDatabase();

  try {
    const existingLike = await Like.findOne({
      post_id: postId,
      user_id: userId,
    });

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      return { success: true, liked: false };
    } else {
      await Like.create({ post_id: postId, user_id: userId });
      return { success: true, liked: true };
    }
  } catch (error) {
    console.error('Error updating like status:', error);
    return null;
  }
}
