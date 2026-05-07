import { cn } from "@/lib/utils";

interface RawSvgProps {
  /** Imported SVG markup string. Use `?raw` import suffix:
   *    import addUrl from "@/assets/icons/finery/add.svg?raw";
   */
  svg: string;
  /** Tailwind classes for sizing and any other styling. The SVG
   *  itself ships with hardcoded fills (#4B1574 purple, #C83C3E red),
   *  so text-color utilities won't change the icon color — the SVG
   *  defines its own color.
   */
  className?: string;
  /** Optional aria-label for accessibility. */
  ariaLabel?: string;
}

/**
 * RawSvg — inline an imported SVG string into the DOM via
 * dangerouslySetInnerHTML. Pattern matches Washmen's AppIcon helper.
 *
 * Usage:
 *   import addUrl from "@/assets/icons/finery/add.svg?raw";
 *   <RawSvg svg={addUrl} className="h-5 w-5" ariaLabel="Add" />
 *
 * The wrapping <span> is what Tailwind sizes; the inner <svg> is
 * forced to fill the wrapper (overrides the SVG's own width/height
 * attributes, which Figma exports always include).
 */
export function RawSvg({ svg, className, ariaLabel }: RawSvgProps) {
  return (
    <span
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={cn(
        "inline-flex shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}