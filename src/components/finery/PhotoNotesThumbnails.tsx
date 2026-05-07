import { X } from "lucide-react";
import { haptics } from "@/utils/haptics";
import type { PhotoNoteItem } from "@/stores/orderStore";

interface PhotoNotesThumbnailsProps {
  items: PhotoNoteItem[];
  onTapItem: (id: string) => void;
  onTapDelete: (id: string) => void;
}

export function PhotoNotesThumbnails({ items, onTapItem, onTapDelete }: PhotoNotesThumbnailsProps) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-row flex-wrap gap-3 px-1 pt-1">
      {items.map((item) => (
        <div key={item.id} className="relative">
          <button
            type="button"
            onClick={() => {
              haptics.light();
              onTapItem(item.id);
            }}
            aria-label={`Edit ${item.brand || "photo"}`}
            className="press-effect block h-[52px] w-[52px] overflow-hidden bg-finery-beige-300"
          >
            <img src={item.photo} alt="" className="h-full w-full object-cover" />
          </button>
          <button
            type="button"
            onClick={() => {
              haptics.light();
              onTapDelete(item.id);
            }}
            aria-label={`Delete ${item.brand || "photo"}`}
            className="press-effect absolute -right-[6px] -top-[6px] flex h-[16px] w-[16px] items-center justify-center rounded-full bg-[#C83C3E] text-white"
          >
            <X className="h-[10px] w-[10px]" />
          </button>
        </div>
      ))}
    </div>
  );
}