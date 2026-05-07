import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Camera } from "lucide-react";
import { FineryButton } from "@/components/finery/FineryButton";
import { CameraCaptureSheet } from "@/components/finery/CameraCaptureSheet";
import { useOrderStore } from "@/stores/orderStore";
import { haptics } from "@/utils/haptics";

/**
 * PhotoMetadataScreen — full-page editor for a single photo+notes item.
 *
 * URL: /order/instructions/photo?id=<itemId>
 *
 * Save enabled only when BOTH brand and notes have content.
 *
 * Back behavior:
 *   - Edit mode (item had brand/notes already): revert local state, navigate back
 *   - Create mode (item has empty brand AND empty notes): delete item, navigate back
 */
export default function PhotoMetadataScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const photoNotesItems = useOrderStore((s) => s.photoNotesItems);
  const updatePhotoNoteItem = useOrderStore((s) => s.updatePhotoNoteItem);
  const deletePhotoNoteItem = useOrderStore((s) => s.deletePhotoNoteItem);

  const item = useMemo(
    () => photoNotesItems.find((p) => p.id === id) ?? null,
    [photoNotesItems, id],
  );

  const [photo, setPhoto] = useState(item?.photo ?? "");
  const [brand, setBrand] = useState(item?.brand ?? "");
  const [notes, setNotes] = useState(item?.notes ?? "");
  const [retakeCameraOpen, setRetakeCameraOpen] = useState(false);

  // Snapshot the saved state at mount; used to determine create-vs-edit on back
  const [createMode] = useState(
    () => (item?.brand ?? "").length === 0 && (item?.notes ?? "").length === 0,
  );

  useEffect(() => {
    if (!id || !item) {
      navigate("/order/instructions", { replace: true });
    }
  }, [id, item, navigate]);

  // Sync local photo if item.photo changes (e.g. retake)
  useEffect(() => {
    if (item) setPhoto(item.photo);
  }, [item]);

  if (!item) return null;

  const saveEnabled = brand.trim().length > 0 && notes.trim().length > 0;

  const onSave = () => {
    if (!saveEnabled) return;
    haptics.medium();
    updatePhotoNoteItem(item.id, {
      brand: brand.trim(),
      notes: notes.trim(),
      photo,
    });
    navigate("/order/instructions");
  };

  const onBack = () => {
    haptics.light();
    if (createMode) {
      deletePhotoNoteItem(item.id);
    }
    navigate("/order/instructions");
  };

  const onRetakeCaptured = (dataUrl: string) => {
    setPhoto(dataUrl);
    updatePhotoNoteItem(item.id, { photo: dataUrl });
    setRetakeCameraOpen(false);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-finery-beige-200">
      <div className="flex-1 overflow-y-auto">
        {/* Photo header */}
        <div className="relative h-[220px] w-full bg-finery-purple-400/10">
          {photo ? (
            <img src={photo} alt="Captured item" className="h-full w-full object-cover" />
          ) : null}
          <button
            type="button"
            onClick={() => {
              haptics.light();
              setRetakeCameraOpen(true);
            }}
            aria-label="Retake photo"
            className="press-effect absolute right-[24px] top-[174px] flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(17,17,53,0.62)] text-white"
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>

        {/* Brand */}
        <div className="px-6 pt-6">
          <p className="font-display text-[16px] font-bold leading-[17px] tracking-[0.4px] text-finery-purple-400">
            What brand is the item?
          </p>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value.slice(0, 15))}
            maxLength={15}
            placeholder="Enter brand name"
            className="mt-4 w-full border-b border-finery-disabledBg bg-transparent pb-2 text-[13px] font-light leading-[18px] tracking-[0.2px] text-finery-purple-400 placeholder:text-finery-disabledBg focus:border-finery-purple-400 focus:outline-none"
          />
        </div>

        {/* Notes */}
        <div className="px-6 pt-6">
          <p className="font-display text-[16px] font-bold leading-[17px] tracking-[0.4px] text-finery-purple-400">
            Leave notes for our experts
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes"
            className="mt-4 h-[166px] w-full resize-none border border-finery-disabledBg bg-transparent px-3 py-2.5 text-[13px] font-light leading-[18px] tracking-[0.2px] text-finery-purple-400 placeholder:text-finery-disabledText focus:border-finery-purple-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-finery-beige-300 px-6 pb-[max(env(safe-area-inset-bottom),1rem)] pt-3">
        <div className="flex gap-2">
          <FineryButton variant="tiny" onClick={onBack} aria-label="Back" />
          <FineryButton onClick={onSave} disabled={!saveEnabled} className="flex-1">
            Save
          </FineryButton>
        </div>
      </div>

      <CameraCaptureSheet
        open={retakeCameraOpen}
        onClose={() => setRetakeCameraOpen(false)}
        onCapture={onRetakeCaptured}
      />
    </div>
  );
}