import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface RawSvgProps {
  svg: string;
  className?: string;
  style?: CSSProperties;
}

export function RawSvg({ svg, className, style }: RawSvgProps) {
  return (
    <span
      className={cn("inline-block", className)}
      style={style}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}