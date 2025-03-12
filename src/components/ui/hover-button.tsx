import React from 'react';
import { cn } from '@/lib/utils';

interface HoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const HoverButton = ({
  children,
  className,
  ...props
}: HoverButtonProps) => {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition-all duration-300 ease-out rounded-md group",
        "bg-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700",
        "before:absolute before:inset-0 before:w-full before:h-full before:bg-gradient-to-br before:from-blue-500 before:to-blue-700",
        "before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-500 before:ease-out",
        "hover:before:origin-bottom-left hover:before:scale-x-100",
        "after:absolute after:inset-0 after:z-10 after:w-full after:h-full after:bg-gradient-to-br after:from-blue-600 after:to-blue-800",
        "after:origin-top-right after:scale-x-0 after:transition-transform after:duration-500 after:ease-out",
        "hover:after:origin-top-right hover:after:scale-x-100",
        className
      )}
      {...props}
    >
      <span className="relative z-20">{children}</span>
    </button>
  );
};
