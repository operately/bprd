import React, { useState, useRef, useEffect } from "react";

export function QuickEntryWidget({ onAddItem = () => {}, selectedItem = null, filter = "all" }) {
  // Initialize component state
  const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [itemType, setItemType] = useState("goal"); // Default to goal
  const [internalSelectedItem, setInternalSelectedItem] = useState(selectedItem);
  const inputRef = useRef(null);
  const widgetRef = useRef(null);
  
  // Initial setup only
  useEffect(() => {
    if (selectedItem) {
      setInternalSelectedItem(selectedItem);
    }
  }, []); // Only run on mount



  // Toggle the input field visibility
  const toggleInput = () => {

    setIsActive(!isActive);
    if (!isActive) {
      // Focus the input when it becomes visible
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
    }
  };

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
      
      // Call the callback if provided
      onAddItem(newItem);
      
      // Dispatch a custom event for the WorkMapTable to handle
      const event = new CustomEvent('workmap:add-item', { 
        detail: {
          parentItem: internalSelectedItem,  // The selected parent item (or null)
          newItem: newItem                   // The new item to add
        }
      });
      document.dispatchEvent(event);
      
      // Reset the input but keep the form open for more entries
      setInputValue("");
      // Focus back on the input for quick multiple entries
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
    }
  };

  // Handle clicks outside to close the input field
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Prevent the form from closing during selection
      // Check if the click was related to item selection
      const isSelectionRelatedClick = event.target.closest('[data-workmap-selectable]') !== null;
      
      if (widgetRef.current && !widgetRef.current.contains(event.target) && !isSelectionRelatedClick) {
        setIsActive(false);
      }
    };

    if (isActive) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActive]);

  // Handle escape key to cancel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isActive) {
        setIsActive(false);
        setInputValue("");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive]);
  
  // Listen for selection-related events
  useEffect(() => {
    const handleClearSelection = () => {

      setInternalSelectedItem(null);
      // Do not change isActive state here
    };
    
    const handleSelectItem = (event) => {

      setInternalSelectedItem(event.detail);
      
      // Don't automatically open the form when an item is selected
      // The selection will be stored and used when the user clicks 'Quick add'
      
      // Only focus if the form is already active
      if (isActive && inputRef.current) {
        setTimeout(() => {
          inputRef.current.focus();
        }, 50);
      }
    };
    

    document.addEventListener('workmap:clear-selection', handleClearSelection);
    document.addEventListener('workmap:select-item', handleSelectItem);
    
    return () => {

      document.removeEventListener('workmap:clear-selection', handleClearSelection);
      document.removeEventListener('workmap:select-item', handleSelectItem);
    };
  }, []);

  return (
    <div ref={widgetRef} className="relative flex items-center">
      {/* Quick entry button - Always visible */}
      <button
        onClick={toggleInput}
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
          <span>Quick add</span>
      </button>

      {/* Input field and type selection */}
      {isActive && (
        <div className="ml-2 inline-block">
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
                placeholder={internalSelectedItem ? `New ${itemType}...` : `New ${itemType} company-wide...`}
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
                onClick={() => {
                  setIsActive(false);
                  setInputValue("");
                }}
                className="h-9 px-3 text-sm border border-l-0 border-surface-outline text-content-base rounded-r-md hover:bg-surface-dimmed transition-colors"
              >
                Cancel
              </button>
            </div>
            
            {/* Instruction text below the input */}
            <div className="text-xs text-content-dimmed mt-1 context-label">
              {internalSelectedItem ? 
                <span>Creating in: {internalSelectedItem.name} <a href="#" 
                  className="text-link-base hover:text-link-hover ml-1 text-xs underline" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setInternalSelectedItem(null);
                    // Dispatch event to notify other components of the cleared selection
                    document.dispatchEvent(new CustomEvent("workmap:clear-selection"));
                  }}
                >(Clear)</a></span> : 
                "Select a goal to create a sub-item"}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
