import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  children: ReactNode;
  type?: "button" | "submit" | "reset";
}

export function LoadingButton({
  children,
  isLoading,
  className,
  disabled,
  type = "button",
  ...props
}: LoadingButtonProps) {
  return (
    <Button type={type} disabled={disabled || isLoading} className={cn("relative", className)} {...props}>
      {isLoading && (
        <Loader2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />
      )}
      <span className={cn(isLoading && "opacity-0")}>{children}</span>
    </Button>
  );
}
