import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface RawSvgProps {
  svg: string;
  className?: string;
  style?: CSSProperties;
  preserveAspect?: boolean;
}

export function RawSvg({ svg, className, style, preserveAspect = false }: RawSvgProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        preserveAspect
          ? "[&>svg]:h-full [&>svg]:w-auto"
          : "[&>svg]:h-full [&>svg]:w-full",
        className,
      )}
      style={style}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}