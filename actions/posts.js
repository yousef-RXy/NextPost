'use server';

import { storePost } from '@/lib/posts';
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

  if (errors.length > 0) {
    return { errors };
  }

  storePost({
    imageUrl: './',
    title,
    content,
    userId: '671d262ad6217e1f117e1809',
  });
  redirect('/feed');
}
