import React, { useState, useRef, useEffect } from "react";

export function HoverQuickEntryWidget({ parentItem, onClose = () => {} }) {
  const [inputValue, setInputValue] = useState("");
  const [itemType, setItemType] = useState("goal"); // Default to goal
  const inputRef = useRef(null);
  const widgetRef = useRef(null);
  
  // Focus the input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // Generate a unique ID for the new item
      const newItemId = Math.random().toString(36).substring(2, 9);
      
      // Create the new item object with all necessary fields for display
      const newItem = {
        id: newItemId,
        name: inputValue.trim(),
        type: itemType,
        status: "pending",
        progress: 0,
        children: [],
        deadline: { display: "" },  // Empty deadline
        space: "",                  // Empty space
        owner: {                    // Empty owner
          name: "",
          avatar: null,
          initials: ""
        },
        nextStep: ""                // Empty next step
      };
      
      // Dispatch a custom event for the WorkMapTable to handle
      const event = new CustomEvent('workmap:add-item', { 
        detail: {
          parentItem: parentItem,  // The parent item
          newItem: newItem         // The new item to add
        }
      });
      document.dispatchEvent(event);
      
      // Close the widget after submission
      onClose();
    }
  };

  // Handle clicks outside to close the input field
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Handle escape key to cancel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div ref={widgetRef} className="inline-block">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center">
          {/* Type selection dropdown */}
          <div className="relative border border-r-0 border-surface-outline rounded-l-md">
            <select
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              className="appearance-none h-9 bg-surface-base text-content-base pl-2 pr-7 py-1 focus:outline-none text-sm"
            >
              <option value="goal">Goal</option>
              <option value="project">Project</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-content-dimmed">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`New ${itemType} in ${parentItem ? parentItem.name : 'root'}...`}
            className="h-9 pl-2 pr-3 py-1 bg-surface-base text-content-base focus:outline-none min-w-[240px] text-sm border-y border-surface-outline"
          />
          
          {/* Add button */}
          <button
            type="submit"
            className="h-9 px-3 text-sm bg-accent-1 hover:bg-accent-1-light text-white-1 border-r border-white-1/20 transition-colors"
            disabled={!inputValue.trim()}
          >
            Add
          </button>

          {/* Cancel button */}
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-3 text-sm border border-l-0 border-surface-outline text-content-base rounded-r-md hover:bg-surface-dimmed transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
