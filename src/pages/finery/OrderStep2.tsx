import { useNavigate } from "react-router-dom";
import { Truck, Camera, MessageSquare } from "lucide-react";
import { FineryButton } from "@/components/finery/FineryButton";
import { FineryActionWidget } from "@/components/finery/FineryActionWidget";
import { useOrderChrome } from "@/components/primitives/OrderShell";
import { haptics } from "@/utils/haptics";

const PHOTOS_NOTES_SUBTITLE =
  "You can leave photos and notes for our experts. We will review and call you to address all concerns";

export default function OrderStep2() {
  const navigate = useNavigate();

  const onBack = () => {
    haptics.light();
    navigate("/");
  };

  const onSkip = () => {
    haptics.medium();
    console.log("[OrderStep2] skip tap — would navigate to /order/last-step");
    navigate("/order/last-step");
  };

  const onValetTap = () => {
    console.log("[OrderStep2] valet tap — would open /order/instructions/valet");
  };

  const onPhotosTap = () => {
    console.log("[OrderStep2] photos tap — would open photo capture flow");
  };

  const onCommentsTap = () => {
    console.log("[OrderStep2] comments tap — would open Additional Comments sheet");
  };

  useOrderChrome({
    title: (
      <>
        Order Instructions{" "}
        <span className="font-normal text-[16px]">(optional)</span>
      </>
    ),
    step: 2,
    totalSteps: 3,
    onBack,
    cta: (
      <FineryButton onClick={onSkip} className="w-full">
        Skip
      </FineryButton>
    ),
  });

  return (
    <div className="mt-[22px] flex flex-col">
      <FineryActionWidget
        icon={<Truck className="h-5 w-5" />}
        title="Valet Instructions"
        action="plus"
        onPress={onValetTap}
      />
      <FineryActionWidget
        icon={<Camera className="h-5 w-5" />}
        title="Photos & Notes"
        subtitle={PHOTOS_NOTES_SUBTITLE}
        action="plus"
        onPress={onPhotosTap}
      />
      <FineryActionWidget
        icon={<MessageSquare className="h-5 w-5" />}
        title="Additional Comments"
        action="plus"
        onPress={onCommentsTap}
      />
    </div>
  );
}