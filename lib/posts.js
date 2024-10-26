import { supabase } from './supabaseClient';

export async function getPosts(maxNumber) {
  const { data: posts, error } = await supabase
    .from('posts')
    .select(
      `
      id, 
      image_url, 
      title, 
      content, 
      created_at, 
      user:user_id (first_name, last_name),
      likes:likes (post_id)
    `
    )
    .limit(maxNumber || 100)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  const formattedPosts = posts.map(post => ({
    ...post,
    userFirstName: post.user.first_name,
    userLastName: post.user.last_name,
    likes: post.likes ? post.likes.length : 0,
  }));

  return formattedPosts;
}

export async function storePost(post) {
  const { data, error } = await supabase.from('posts').insert({
    image_url: post.imageUrl,
    title: post.title,
    content: post.content,
    user_id: post.userId,
  });

  if (error) {
    console.error('Error storing post:', error);
    return null;
  }

  return data;
}

export async function updatePostLikeStatus(postId, userId) {
  const { data: existingLike, error } = await supabase
    .from('likes')
    .select('*')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking like status:', error);
    return null;
  }

  if (existingLike) {
    const { error: deleteError } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId);

    if (deleteError) {
      console.error('Error unliking post:', deleteError);
      return null;
    }

    return { success: true, liked: false };
  } else {
    const { data, error: insertError } = await supabase.from('likes').insert({
      user_id: userId,
      post_id: postId,
    });

    if (insertError) {
      console.error('Error liking post:', insertError);
      return null;
    }

    return { success: true, liked: true };
  }
}
