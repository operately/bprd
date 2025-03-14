import React from "react";
import { TableRow } from "./TableRow";

// Enhanced Table Row component that supports selection
export function SelectableTableRow({ item, level, isLast, filter, onSelectItem, selectedItemId }) {
  const isSelected = selectedItemId === item.id;
  
  // Handle click on the row to select it
  const handleRowClick = (e) => {
    // Prevent default to avoid navigating if this is a link
    e.preventDefault();
    // Don't trigger if clicking on a link or button inside the row
    if (e.target.tagName.toLowerCase() === 'a' || 
        e.target.tagName.toLowerCase() === 'button' ||
        e.target.closest('a') || 
        e.target.closest('button')) {
      return;
    }
    
    // Call the selection handler with the item data
    onSelectItem(item);
  };
  
  return (
    <div 
      className={`cursor-pointer transition-colors ${isSelected ? 'bg-surface-highlight dark:bg-surface-dimmed/30' : ''}`}
      onClick={handleRowClick}
    >
      <TableRow 
        item={item} 
        level={level} 
        isLast={isLast} 
        filter={filter}
      />
      
      {/* If the item has children, render them recursively */}
      {item.children && item.children.length > 0 && (
        <div>
          {item.children.map((child, index) => (
            <SelectableTableRow
              key={child.id}
              item={child}
              level={level + 1}
              isLast={index === item.children.length - 1}
              filter={filter}
              onSelectItem={onSelectItem}
              selectedItemId={selectedItemId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
