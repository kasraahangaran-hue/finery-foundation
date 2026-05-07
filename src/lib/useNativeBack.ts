import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { nativeBridge } from "@/utils/nativeBridge";

/**
 * Global Android-hardware-back / iOS-swipe-back handler.
 *
 * Priority on back:
 *   1. If any open dialog / drawer / sheet exists, close it via Escape.
 *   2. Else, if there's web history to go back to, navigate(-1).
 *   3. Else, ask native to dismiss the WebView.
 */
export function useNativeBack() {
  const navigate = useNavigate();

  useEffect(() => {
    const handle = (): boolean => {
      const openOverlay = document.querySelector(
        '[data-state="open"][role="dialog"], [data-state="open"][role="alertdialog"], [vaul-drawer][data-state="open"]',
      );
      if (openOverlay) {
        document.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
        );
        return true;
      }

      if (window.history.length > 1) {
        navigate(-1);
        return true;
      }

      nativeBridge.dismiss();
      return false;
    };

    const unsubscribe = nativeBridge.onBack(handle);
    return () => {
      unsubscribe?.();
    };
  }, [navigate]);
}