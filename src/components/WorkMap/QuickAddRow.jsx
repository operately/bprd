import React, { useState, useRef } from "react";
import { HoverQuickEntryWidget } from "./HoverQuickEntryWidget";

export function QuickAddRow({ columnCount }) {
  const [isAddingItem, setIsAddingItem] = useState(false);

  const handleAddClick = () => {
    setIsAddingItem(true);
  };

  const handleClose = () => {
    setIsAddingItem(false);
  };

  return (
    <tr className="border-t border-surface-outline relative">
      <td colSpan={columnCount} className="py-2 px-4">
        <button
          onClick={handleAddClick}
          className="flex items-center gap-1 text-sm text-content-dimmed hover:text-content-base transition-colors py-1.5 px-2 rounded-md hover:bg-surface-highlight"
          aria-label="Add new item"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14m-7-7h14" />
          </svg>
          <span>Add new item</span>
        </button>

        {/* Quick entry overlay */}
        {isAddingItem && (
          <div className="absolute z-10 left-0 mt-2 ml-4">
            <div className="bg-surface-base shadow-lg border border-surface-outline rounded-md p-2">
              <HoverQuickEntryWidget
                parentItem={null} // No parent item for root level
                onClose={handleClose}
              />
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}
