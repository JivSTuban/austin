import { toast as sonnerToast, type ToastT } from "sonner";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  [key: string]: unknown;
}

export function useToast() {
  const toast = (props: ToastProps) => {
    const { title, description, variant, ...rest } = props;
    
    if (variant === "destructive") {
      return sonnerToast.error(title, {
        description,
        ...rest
      });
    }
    
    return sonnerToast(title, {
      description,
      ...rest
    });
  };

  return {
    toast,
  };
}
