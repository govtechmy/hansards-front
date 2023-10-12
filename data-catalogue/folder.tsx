import { BookmarkIcon } from "@heroicons/react/24/solid";
import { ClosedFolderIcon, OpenFolderIcon } from "@icons/index";
import { cn } from "@lib/helpers";
import { Sitting } from "@lib/types";
import { FunctionComponent, useState } from "react";

/**
 * Catalogue Folder
 * @overview Status: In-development
 */

interface CatalogueFolderProps {
  sitting_list: Sitting[];
}

export default function CatalogueFolder({
  sitting_list,
}: CatalogueFolderProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <div className="relative">
        <div
          className={cn(
            open &&
              "absolute -top-2 -left-2 border rounded-md -z-10 w-[100px] h-20"
          )}
        ></div>
        {open ? (
          <OpenFolderIcon onClick={() => setOpen(false)} />
        ) : (
          <ClosedFolderIcon onClick={() => setOpen(true)} />
        )}
        <div
          className={cn(
            open ? "right-3" : "right-1",
            "absolute bottom-1 bg-slate-400 rounded-md flex gap-0.5 items-center py-0.5 px-1.5"
          )}
        >
          <BookmarkIcon className="text-white h-3.5 w-3.5" />
          <p className="text-white font-medium">{sitting_list.length}</p>
        </div>
      </div>
    </>
  );
}
