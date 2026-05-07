import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "@/stores/orderStore";
import { FineryButton } from "@/components/finery/FineryButton";
import { haptics } from "@/utils/haptics";

export default function OrderConfirmationScreen() {
  const navigate = useNavigate();
  const reset = useOrderStore((s) => s.reset);

  useEffect(() => {
    haptics.success();
  }, []);

  const onBack = () => {
    haptics.light();
    reset();
    navigate("/");
  };

  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center bg-finery-beige-200 px-6">
      <h1 className="font-display text-[24px] font-bold text-finery-purple-400">
        Order placed!
      </h1>
      <p className="mt-3 text-center text-[14px] leading-[20px] text-finery-purple-400/70">
        Your order has been received. We'll be in touch shortly.
      </p>
      <FineryButton onClick={onBack} className="mt-8 w-full">
        Back to Home
      </FineryButton>
    </div>
  );
}