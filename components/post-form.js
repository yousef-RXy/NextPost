'use client';

import { createPost } from '@/actions/posts';
import { useActionState } from 'react';
import { toast, Toaster } from 'sonner';

function PostForm({ action, children }) {
  const [state, formAction] = useActionState(createPost, {});

  state.errors &&
    state.errors.map(error => {
      console.log(state.errors);
      console.log(error);
      toast.error(error);
    });

  return (
    <>
      <Toaster richColors closeButton />
      <form action={formAction}>{children}</form>
    </>
  );
}

export default PostForm;
