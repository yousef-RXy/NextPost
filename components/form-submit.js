'use client';

import { useFormStatus } from 'react-dom';

function FormSubmit() {
  useFormStatus;
  const { pending, data, method, action } = useFormStatus();

  if (pending) {
    return <p>Creating post...</p>;
  }

  return (
    <>
      <button type="reset">Reset</button>
      <button>Create Post</button>
    </>
  );
}

export default FormSubmit;
