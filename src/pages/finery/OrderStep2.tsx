import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Camera, MessageSquare } from "lucide-react";
import { FineryButton } from "@/components/finery/FineryButton";
import { FineryActionWidget } from "@/components/finery/FineryActionWidget";
import { ValetInstructionsSheet } from "@/components/finery/ValetInstructionsSheet";
import { AdditionalCommentsSheet } from "@/components/finery/AdditionalCommentsSheet";
import { CameraCaptureSheet } from "@/components/finery/CameraCaptureSheet";
import { PhotoNotesThumbnails } from "@/components/finery/PhotoNotesThumbnails";
import { DeleteItemDialog } from "@/components/finery/DeleteItemDialog";
import { useOrderChrome } from "@/components/primitives/OrderShell";
import { useOrderStore, type ValetPickupPreference, type ValetDeliveryPreference } from "@/stores/orderStore";
import { haptics } from "@/utils/haptics";

const PHOTOS_NOTES_SUBTITLE =
  "You can upload additional photos and leave notes for our experts. We will contact you after reviewing them";

const PICKUP_LABELS: Record<ValetPickupPreference, string> = {
  no_preference: "No specific instructions",
  ring_doorbell: "Ring the door",
  knock_door: "Knock on the door",
  do_not_disturb_bags_outside: "Do not disturb, bags outside",
  call_when_arrive: "Call me when you arrive",
};

const DELIVERY_LABELS: Record<ValetDeliveryPreference, string> = {
  no_preference: "No specific instructions",
  hang_door_handle: "Hang on door handle",
  at_concierge: "At concierge / reception",
  knock_door: "Knock the door",
  call_when_arrive: "Call when you arrive",
};

export default function OrderStep2() {
  const navigate = useNavigate();

  const valetPickup = useOrderStore((s) => s.valetPickupPreference);
  const valetDelivery = useOrderStore((s) => s.valetDeliveryPreference);
  const setValetPreferences = useOrderStore((s) => s.setValetPreferences);

  const additionalComments = useOrderStore((s) => s.additionalComments);
  const setAdditionalComments = useOrderStore((s) => s.setAdditionalComments);
  const photoNotesItems = useOrderStore((s) => s.photoNotesItems);
  const addPhotoNoteItem = useOrderStore((s) => s.addPhotoNoteItem);
  const deletePhotoNoteItem = useOrderStore((s) => s.deletePhotoNoteItem);

  const [valetSheetOpen, setValetSheetOpen] = useState(false);
  const [commentsSheetOpen, setCommentsSheetOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const valetPopulated =
    valetPickup !== "no_preference" || valetDelivery !== "no_preference";
  const photosPopulated = photoNotesItems.length > 0;
  const commentsPopulated = additionalComments.trim().length > 0;

  const anyPopulated = valetPopulated || photosPopulated || commentsPopulated;

  const onBack = () => {
    haptics.light();
    navigate("/");
  };

  const onCta = () => {
    haptics.medium();
    console.log("[OrderStep2] cta tap — navigating to /order/last-step");
    navigate("/order/last-step");
  };

  const onValetTap = () => {
    setValetSheetOpen(true);
  };

  const onValetApply = (pickup: ValetPickupPreference, delivery: ValetDeliveryPreference) => {
    haptics.medium();
    setValetPreferences(pickup, delivery);
  };

  const onPhotosTap = () => {
    setCameraOpen(true);
  };

  const onPhotoCaptured = (dataUrl: string) => {
    haptics.medium();
    setCameraOpen(false);
    const id = addPhotoNoteItem(dataUrl);
    navigate(`/order/instructions/photo?id=${id}`);
  };

  const onThumbTap = (id: string) => {
    navigate(`/order/instructions/photo?id=${id}`);
  };

  const onThumbDeleteTap = (id: string) => {
    setPendingDeleteId(id);
  };

  const onDeleteConfirm = () => {
    if (pendingDeleteId) {
      deletePhotoNoteItem(pendingDeleteId);
    }
    setPendingDeleteId(null);
  };

  const onCommentsTap = () => {
    setCommentsSheetOpen(true);
  };

  const onCommentsSave = (value: string) => {
    haptics.medium();
    setAdditionalComments(value);
  };

  const valetSubtitle = valetPopulated ? (
    <span className="flex flex-col">
      <span className="text-[12px] leading-[18px] tracking-[0.1px] text-finery-textSecondary">
        <span className="font-bold">Pick Up:</span>{" "}
        <span className="font-light">{PICKUP_LABELS[valetPickup]}</span>
      </span>
      <span className="text-[12px] leading-[18px] tracking-[0.1px] text-finery-textSecondary">
        <span className="font-bold">Drop Off:</span>{" "}
        <span className="font-light">{DELIVERY_LABELS[valetDelivery]}</span>
      </span>
    </span>
  ) : undefined;

  const commentsSubtitle = commentsPopulated ? (
    <span className="line-clamp-1">{additionalComments}</span>
  ) : undefined;

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
    ctaKey: `step2-${anyPopulated ? "continue" : "skip"}`,
    cta: (
      <FineryButton onClick={onCta} className="w-full">
        {anyPopulated ? "Continue to Order" : "Skip"}
      </FineryButton>
    ),
  });

  return (
    <>
    <div className="mt-[22px] flex flex-col gap-2">
      <FineryActionWidget
        icon={<Truck className="h-5 w-5" />}
        title="Valet Instructions"
        subtitle={valetSubtitle}
        action={valetPopulated ? "edit" : "plus"}
        onPress={onValetTap}
      />
      <FineryActionWidget
        icon={<Camera className="h-5 w-5" />}
        title="Photos & Notes"
        subtitle={PHOTOS_NOTES_SUBTITLE}
        action="plus"
        onPress={onPhotosTap}
      />
      <PhotoNotesThumbnails
        items={photoNotesItems}
        onTapItem={onThumbTap}
        onTapDelete={onThumbDeleteTap}
      />
      <FineryActionWidget
        icon={<MessageSquare className="h-5 w-5" />}
        title="Additional Comments"
        subtitle={commentsSubtitle}
        action={commentsPopulated ? "edit" : "plus"}
        onPress={onCommentsTap}
      />
    </div>

    <ValetInstructionsSheet
      open={valetSheetOpen}
      onOpenChange={setValetSheetOpen}
      initialPickup={valetPickup}
      initialDelivery={valetDelivery}
      onApply={onValetApply}
    />

    <AdditionalCommentsSheet
      open={commentsSheetOpen}
      onOpenChange={setCommentsSheetOpen}
      initialValue={additionalComments}
      onSave={onCommentsSave}
    />

    <CameraCaptureSheet
      open={cameraOpen}
      onClose={() => setCameraOpen(false)}
      onCapture={onPhotoCaptured}
    />

    <DeleteItemDialog
      open={pendingDeleteId !== null}
      onOpenChange={(open) => {
        if (!open) setPendingDeleteId(null);
      }}
      onConfirm={onDeleteConfirm}
    />
    </>
  );
}