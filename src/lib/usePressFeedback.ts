import { useEffect } from "react";

/**
 * Global press-feedback hook. Pointer-events-only — handles every
 * `press-effect` element across the app on a single document-level
 * listener set.
 *
 * Behavior on press-effect elements:
 * - On pointerdown, applies data-pressed="true" after a short arm delay.
 *   CSS scales the element over 80ms (snappy press-down).
 * - On pointermove with movement >8px, treats as scroll: snaps the
 *   element back to scale 1.0 INSTANTLY via data-canceled.
 * - On pointerup with no movement, holds data-pressed for 80ms so the
 *   press-down arc completes, then removes the attribute.
 *
 * Call this ONCE at the app root.
 */
export function useGlobalPressFeedback() {
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let pressedTarget: HTMLElement | null = null;
    let releaseTimer: ReturnType<typeof setTimeout> | null = null;
    let armTimer: ReturnType<typeof setTimeout> | null = null;
    let pendingTarget: HTMLElement | null = null;
    const MOVE_THRESHOLD = 8;
    const RELEASE_HOLD = 80;
    const ARM_DELAY = 90;

    const findPressTarget = (el: Element | null): HTMLElement | null => {
      let cur = el as HTMLElement | null;
      while (cur && cur !== document.documentElement) {
        if (cur.classList?.contains("press-effect")) return cur;
        cur = cur.parentElement;
      }
      return null;
    };

    const cancelPressImmediate = () => {
      if (armTimer) {
        clearTimeout(armTimer);
        armTimer = null;
      }
      pendingTarget = null;
      if (releaseTimer) {
        clearTimeout(releaseTimer);
        releaseTimer = null;
      }
      if (pressedTarget) {
        const t = pressedTarget;
        pressedTarget = null;
        t.setAttribute("data-canceled", "true");
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        t.offsetHeight;
        t.removeAttribute("data-pressed");
        requestAnimationFrame(() => {
          t.removeAttribute("data-canceled");
        });
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      cancelPressImmediate();
      const target = findPressTarget(e.target as Element);
      if (!target) return;
      startX = e.clientX;
      startY = e.clientY;
      pendingTarget = target;
      armTimer = setTimeout(() => {
        armTimer = null;
        if (!pendingTarget) return;
        pressedTarget = pendingTarget;
        pendingTarget = null;
        pressedTarget.setAttribute("data-pressed", "true");
      }, ARM_DELAY);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pressedTarget && !pendingTarget) return;
      const dx = Math.abs(e.clientX - startX);
      const dy = Math.abs(e.clientY - startY);
      if (dx > MOVE_THRESHOLD || dy > MOVE_THRESHOLD) {
        cancelPressImmediate();
      }
    };

    const onPointerEnd = () => {
      if (pendingTarget && !pressedTarget) {
        if (armTimer) {
          clearTimeout(armTimer);
          armTimer = null;
        }
        const t = pendingTarget;
        pendingTarget = null;
        pressedTarget = t;
        t.setAttribute("data-pressed", "true");
      }
      if (!pressedTarget) return;
      const t = pressedTarget;
      pressedTarget = null;
      releaseTimer = setTimeout(() => {
        t.removeAttribute("data-pressed");
        releaseTimer = null;
      }, RELEASE_HOLD);
    };

    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerup", onPointerEnd, { passive: true });
    document.addEventListener("pointercancel", onPointerEnd, { passive: true });

    return () => {
      cancelPressImmediate();
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerEnd);
      document.removeEventListener("pointercancel", onPointerEnd);
    };
  }, []);
}