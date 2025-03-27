import React, { useState, useRef } from "react";
import { HoverQuickEntryWidget } from "./HoverQuickEntryWidget";

export function QuickAddRow({ columnCount, filter }) {
  const [isAddingItem, setIsAddingItem] = useState(false);

  const handleAddClick = () => {
    setIsAddingItem(true);
  };

  const handleClose = () => {
    setIsAddingItem(false);
  };

  // Determine button text based on filter
  let buttonText = "Add new item";
  if (filter === "projects") {
    buttonText = "Add new project";
  } else if (filter === "goals") {
    buttonText = "Add new goal";
  }

  return (
    <tr className="border-t border-surface-outline">
      <td colSpan={columnCount} className="py-2 px-4">
        {!isAddingItem ? (
          <button
            onClick={handleAddClick}
            className="flex items-center gap-1 text-sm text-content-dimmed hover:text-content-base transition-colors py-1.5 px-2 rounded-md hover:bg-surface-highlight"
            aria-label={buttonText}
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
            <span>{buttonText}</span>
          </button>
        ) : (
          <div className="inline-block bg-surface-base dark:bg-surface-dimmed border border-surface-outline rounded-md p-2">
            <HoverQuickEntryWidget
              parentItem={null} // No parent item for root level
              onClose={handleClose}
              filter={filter}
            />
          </div>
        )}
      </td>
    </tr>
  );
}
