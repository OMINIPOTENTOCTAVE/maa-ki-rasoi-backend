// src/components/ui/sonner.jsx
// Simplified version — no next-themes dependency required
import { Toaster as Sonner, toast } from "sonner";

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-[#2D2418] group-[.toaster]:border-[#E5E0D8] group-[.toaster]:shadow-card rounded-2xl",
          description: "group-[.toast]:text-[#6B5E52]",
          actionButton:
            "group-[.toast]:bg-[#C8550A] group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-[#F4E4BC] group-[.toast]:text-[#2D2418]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
