'use server';

import { uploadImage } from '@/lib/cloudinary';
import { storePost, updatePostLikeStatus } from '@/lib/posts';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(prevState, formData) {
  const title = formData.get('title');
  const content = formData.get('content');
  const image = formData.get('image');

  let errors = [];
  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  }
  if (!content || content.trim().length === 0) {
    errors.push('Content is required');
  }
  if (!image || image.size === 0) {
    errors.push('image is required');
  }

  if (errors.length > 0) {
    return { errors };
  }

  let imageUrl;
  try {
    imageUrl = await uploadImage(image);
  } catch (err) {
    throw new Error(
      'image Upload failed, post was not created. please try again later.'
    );
  }

  await storePost({
    imageUrl,
    title,
    content,
    userId: '671d262ad6217e1f117e1809',
  });
  revalidatePath('/feed');
  redirect('/feed');
}

export async function togglePostLike(postId) {
  await updatePostLikeStatus(postId, '671d262ad6217e1f117e1809');
  revalidatePath('/feed');
}
