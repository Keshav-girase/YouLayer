// src/components/ToasterProvider.jsx
import { Toaster } from 'react-hot-toast';

const ToasterProvider = () => {
  return (
    <Toaster
      toastOptions={{
        style: {
          borderRadius: '30px',
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))',
          duration: 6000,
        },
        success: {
          style: {
            style: {
              borderRadius: '30px',
              background: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
            },
          },
        },
        error: {
          style: {
            backgroundColor: 'hsl(var(--destructive))',
            color: 'hsl(var(--destructive-foreground))',
            border: '1px solid hsl(var(--destructive))',
          },
        },
      }}
    />
  );
};

export default ToasterProvider;

import toast from 'react-hot-toast';

// toast.success("Uploaded successfully!");
// toast.error("Something went wrong");
// toast.promise(fetch("/api"), {
//   loading: "Loading...",
//   success: "Done!",
//   error: "Failed",
// });
