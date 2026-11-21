import type { ReactNode } from "react";
export default function Badge({ children, tone = "orange" }: { children: ReactNode; tone?: "orange" | "neutral" | "success" }) {
  return <span className={`ph-badge ph-badge-${tone}`}>{children}</span>;
}
