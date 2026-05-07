import { X } from "lucide-react";
import { RawSvg } from "@/components/finery/RawSvg";
import photosNotesUrl from "@/assets/icons/finery/photos-notes.svg?raw";
import { haptics } from "@/utils/haptics";
import type { PhotoNoteItem } from "@/stores/orderStore";

interface PhotoNotesThumbnailsProps {
  items: PhotoNoteItem[];
  onTapAdd: () => void;
  onTapItem: (id: string) => void;
  onTapDelete: (id: string) => void;
}

export function PhotoNotesThumbnails({ items, onTapAdd, onTapItem, onTapDelete }: PhotoNotesThumbnailsProps) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-4 gap-2 px-6 pt-1">
      <button
        type="button"
        onClick={() => {
          haptics.light();
          onTapAdd();
        }}
        aria-label="Add another photo"
        className="press-effect flex aspect-square items-center justify-center rounded-md border-2 border-dashed border-finery-purple-300"
      >
        <RawSvg svg={photosNotesUrl} className="h-6 w-6" />
      </button>
      {items.map((item) => (
        <div key={item.id} className="relative aspect-square overflow-hidden rounded-md">
          <button
            type="button"
            onClick={() => {
              haptics.light();
              onTapItem(item.id);
            }}
            aria-label={`Edit ${item.brand || "photo"}`}
            className="press-effect h-full w-full"
          >
            <img src={item.photo} alt="" className="h-full w-full object-cover" />
          </button>
          <button
            type="button"
            onClick={() => {
              haptics.warning();
              onTapDelete(item.id);
            }}
            aria-label={`Delete ${item.brand || "photo"}`}
            className="press-effect absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}