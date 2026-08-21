"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-gray-200 group-[.toaster]:border-card-border group-[.toaster]:shadow-xl group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-gray-400",
          actionButton:
            "group-[.toast]:bg-cyan-500 group-[.toast]:text-black",
          cancelButton:
            "group-[.toast]:bg-card group-[.toast]:text-gray-400",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
