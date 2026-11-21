import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: "primary" | "secondary" | "ghost" };
export default function Button({ children, variant = "primary", className = "", ...props }: Props) {
  return <button className={`ph-button ph-button-${variant} ${className}`.trim()} {...props}>{children}</button>;
}
