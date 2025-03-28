import React, { useState } from "react";
import { TableRow } from "./TableRow";
import { QuickAddRow } from "./QuickAddRow";
import { mockData } from "../../mockData";
import { IconChevronDown, IconChevronRight } from "./Icons";

// Import drag-and-drop styles
import "./workmap-drag-drop.css";

// Helper function to extract all projects from the data, including nested ones
const extractAllProjects = (data) => {
  let allProjects = [];

  const extractProjects = (items) => {
    items.forEach((item) => {
      // If this item is a project, add it to the list
      if (item.type === "project") {
        allProjects.push({ ...item, children: [] }); // Reset children to make it flat
      }

      // Recursively extract from children
      if (item.children && item.children.length > 0) {
        extractProjects(item.children);
      }
    });
  };

  extractProjects(data);
  return allProjects;
};

// Helper function to extract all completed, dropped, failed, achieved, partial, and missed items
const extractCompletedItems = (data) => {
  let completedItems = [];

  const extractItems = (items) => {
    items.forEach((item) => {
      // If this item is completed, dropped, failed, achieved, partial, or missed, add it to the list
      if (
        item.status === "completed" ||
        item.status === "dropped" ||
        item.status === "failed" ||
        item.status === "achieved" ||
        item.status === "partial" ||
        item.status === "missed"
      ) {
        // For completed page, use completedOn date if available, or create a mock one if not
        const enhancedItem = { ...item, children: [] }; // Reset children to make it flat

        // If completedOn is not present, add a mock date based on status
        if (!enhancedItem.completedOn) {
          if (
            enhancedItem.status === "completed" ||
            enhancedItem.status === "achieved"
          ) {
            enhancedItem.completedOn = { display: "Feb 28 2025" };
          } else if (enhancedItem.status === "dropped") {
            enhancedItem.completedOn = { display: "Jan 15 2025" };
          } else if (
            enhancedItem.status === "failed" ||
            enhancedItem.status === "missed"
          ) {
            enhancedItem.completedOn = { display: "Mar 5 2025" };
          } else if (enhancedItem.status === "partial") {
            enhancedItem.completedOn = { display: "Mar 10 2025" };
          }
        }

        completedItems.push(enhancedItem);
      }

      // Recursively extract from children
      if (item.children && item.children.length > 0) {
        extractItems(item.children);
      }
    });
  };

  extractItems(data);
  return completedItems;
};

// Helper function to filter children based on type and status criteria
const filterChildren = (item, filter) => {
  if (!item.children || item.children.length === 0)
    return { ...item, children: [] };

  const filteredChildren = item.children
    .filter((child) => {
      // Filter by type
      if (filter === "goals" && child.type !== "goal") return false;
      if (filter === "projects" && child.type !== "project") return false;

      // On goals page, exclude all completed goals (all closed statuses)
      if (
        filter === "goals" &&
        child.type === "goal" &&
        (child.status === "completed" ||
          child.status === "failed" ||
          child.status === "dropped" ||
          child.status === "achieved" ||
          child.status === "partial" ||
          child.status === "missed")
      )
        return false;

      return true;
    })
    .map((child) => filterChildren(child, filter));

  return { ...item, children: filteredChildren };
};

export default function WorkMapTable({ filter }) {
  // Determine if we're on the completed page
  const isCompletedPage = filter === "completed";
  // Add state for edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  // Create a state to store the modified data
  const [workMapData, setWorkMapData] = useState(mockData);
  // Add state to track currently dragged item
  const [draggedItemId, setDraggedItemId] = useState(null);
  const [draggedParentPath, setDraggedParentPath] = useState([]);
  
  // Mock function to check if user has permission to edit
  // This would be replaced with an actual authorization check
  const userCanEdit = () => {
    // In a real implementation, this would check against user roles
    // e.g., isCompanyAdmin || isSpaceAdmin
    return true;
  };
  
  // Function to handle drag-and-drop operation
  const handleDragAndDrop = (sourceId, targetId, insertBefore = false) => {
    // Create a deep copy of the data
    const newData = JSON.parse(JSON.stringify(workMapData));
    
    // Function to flatten the hierarchy for DnD operations while preserving parent info
    const flattenWithParentPath = (items, parentPath = []) => {
      let result = [];
      
      items.forEach(item => {
        const itemPath = [...parentPath, item.id];
        // Add the item with its path information
        result.push({
          id: item.id,
          item: item,
          parentPath: parentPath,
          depth: parentPath.length
        });
        
        // Process children
        if (item.children && item.children.length > 0) {
          result = [...result, ...flattenWithParentPath(item.children, itemPath)];
        }
      });
      
      return result;
    };
    
    // Flatten the hierarchy for easier manipulation
    const flatItems = flattenWithParentPath(newData);
    
    // Find the source and target items
    const sourceItem = flatItems.find(i => i.id === sourceId);
    const targetItem = flatItems.find(i => i.id === targetId);
    
    if (!sourceItem || !targetItem) return;
    
    // Check constraints:
    // 1. Can only reorder within the same parent
    // 2. Only goals can be reordered
    if (sourceItem.item.type !== 'goal' || 
        JSON.stringify(sourceItem.parentPath) !== JSON.stringify(targetItem.parentPath)) {
      return; // Can't reorder if constraints are violated
    }
    
    // Function to find and update items order in the hierarchy
    const updateItemsOrder = (items, parentPath) => {
      // If we're at the right level based on parentPath
      if (JSON.stringify(parentPath) === JSON.stringify(sourceItem.parentPath)) {
        // Find indices
        const sourceIndex = items.findIndex(item => item.id === sourceId);
        const targetIndex = items.findIndex(item => item.id === targetId);
        
        if (sourceIndex !== -1 && targetIndex !== -1) {
          // Remove source item
          const [movedItem] = items.splice(sourceIndex, 1);
          // Insert at target position (either before or after the target)
          if (insertBefore) {
            items.splice(targetIndex, 0, movedItem);
          } else {
            // If inserting after, we need to adjust the index
            items.splice(targetIndex + 1, 0, movedItem);
          }
          return true;
        }
      }
      
      // If we're not at the right level, process children
      for (let i = 0; i < items.length; i++) {
        if (items[i].children && items[i].children.length > 0) {
          if (updateItemsOrder(items[i].children, [...parentPath, items[i].id])) {
            return true;
          }
        }
      }
      
      return false;
    };
    
    // Update the order
    if (updateItemsOrder(newData, [])) {
      // If successful, update the data
      setWorkMapData(newData);
    }
  };

  // Function to handle legacy up/down reordering (fallback)
  const handleReorderGoal = (goalId, direction) => {
    // Create a deep copy of the data
    const newData = JSON.parse(JSON.stringify(workMapData));
    
    // Helper function to find a goal in the hierarchy and move it up or down
    const moveGoalInHierarchy = (items, parentPath = []) => {
      // Find the index of the goal at this level
      const goalIndex = items.findIndex(item => item.id === goalId && item.type === "goal");
      
      if (goalIndex !== -1) {
        // Found the goal at this level, now move it up or down
        if (direction === "up" && goalIndex > 0) {
          // Can move up (not already at the top)
          const temp = items[goalIndex];
          items[goalIndex] = items[goalIndex - 1];
          items[goalIndex - 1] = temp;
          return true;
        } else if (direction === "down" && goalIndex < items.length - 1) {
          // Can move down (not already at the bottom)
          const temp = items[goalIndex];
          items[goalIndex] = items[goalIndex + 1];
          items[goalIndex + 1] = temp;
          return true;
        }
        return false; // Can't move (already at top/bottom)
      }
      
      // Goal not found at this level, search in children
      for (let i = 0; i < items.length; i++) {
        if (items[i].children && items[i].children.length > 0) {
          // When searching children, pass the current parent path
          const childPath = [...parentPath, items[i].id];
          if (moveGoalInHierarchy(items[i].children, childPath)) {
            return true;
          }
        }
      }
      
      return false; // Goal not found in this branch
    };
    
    // Try to move the goal in the hierarchy
    if (moveGoalInHierarchy(newData)) {
      // If successful, update the data
      setWorkMapData(newData);
    }
  };

  // Get the column count based on filter
  const getColumnCount = () => {
    if (filter === "completed") return 5; // Name, Status, Completed On, Space, Champion
    return 7; // Name, Status, Progress, Deadline, Space, Champion, Next step
  };

  // Add listeners for add-item, delete-item, and reorder-goal events
  React.useEffect(() => {
    // Handle reordering goals
    const handleReorderGoal = (event) => {
      const { goalId, direction } = event.detail;
      
      // Create a deep copy of the data
      const newData = JSON.parse(JSON.stringify(workMapData));

      // Helper function to find a goal in the hierarchy and move it up or down
      const moveGoalInHierarchy = (items) => {
        // Find the index of the goal at the current level
        const goalIndex = items.findIndex(item => item.id === goalId && item.type === "goal");
        
        if (goalIndex !== -1) {
          // Found the goal at this level, now move it up or down
          if (direction === "up" && goalIndex > 0) {
            // Can move up (not already at the top)
            const temp = items[goalIndex];
            items[goalIndex] = items[goalIndex - 1];
            items[goalIndex - 1] = temp;
            return true;
          } else if (direction === "down" && goalIndex < items.length - 1) {
            // Can move down (not already at the bottom)
            const temp = items[goalIndex];
            items[goalIndex] = items[goalIndex + 1];
            items[goalIndex + 1] = temp;
            return true;
          }
          return false; // Can't move (already at top/bottom)
        }
        
        // Goal not found at this level, search in children
        for (let i = 0; i < items.length; i++) {
          if (items[i].children && items[i].children.length > 0) {
            if (moveGoalInHierarchy(items[i].children)) {
              return true;
            }
          }
        }
        
        return false; // Goal not found in this branch
      };
      
      // Try to move the goal in the hierarchy
      if (moveGoalInHierarchy(newData)) {
        // If successful, update the data
        setWorkMapData(newData);
      }
    };

    const handleAddItem = (event) => {
      const { parentItem, newItem } = event.detail;

      // Create a deep copy of the data
      const newData = JSON.parse(JSON.stringify(workMapData));

      // Helper function to add the item to the correct place in the hierarchy
      const addItemToHierarchy = (items, parentId) => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === parentId) {
            // Found the parent, add the new item to its children
            if (!items[i].children) {
              items[i].children = [];
            }
            items[i].children.push(newItem);
            return true;
          }

          // Check in children
          if (items[i].children && items[i].children.length > 0) {
            if (addItemToHierarchy(items[i].children, parentId)) {
              return true;
            }
          }
        }
        return false;
      };

      // If there's a parent item, add it to its children
      if (parentItem) {
        addItemToHierarchy(newData, parentItem.id);
      } else {
        // If no parent, add it to the root level
        newData.push(newItem);
      }

      // Update the data
      setWorkMapData(newData);
    };

    const handleDeleteItem = (event) => {
      const { itemId } = event.detail;

      // Create a deep copy of the data
      const newData = JSON.parse(JSON.stringify(workMapData));

      // Helper function to delete the item from the hierarchy
      const deleteItemFromHierarchy = (items) => {
        // Check if the item is at the root level
        const rootIndex = items.findIndex((item) => item.id === itemId);
        if (rootIndex !== -1) {
          // Found at root level, remove it
          items.splice(rootIndex, 1);
          return true;
        }

        // Check in children of each item
        for (let i = 0; i < items.length; i++) {
          if (items[i].children && items[i].children.length > 0) {
            // Check if item is in this item's children
            const childIndex = items[i].children.findIndex(
              (child) => child.id === itemId
            );
            if (childIndex !== -1) {
              // Found in children, remove it
              items[i].children.splice(childIndex, 1);
              return true;
            }

            // Check deeper in the hierarchy
            if (deleteItemFromHierarchy(items[i].children)) {
              return true;
            }
          }
        }
        return false;
      };

      // Delete the item from the hierarchy
      deleteItemFromHierarchy(newData);

      // Update the data
      setWorkMapData(newData);
    };

    // Add event listeners
    document.addEventListener("workmap:add-item", handleAddItem);
    document.addEventListener("workmap:delete-item", handleDeleteItem);
    document.addEventListener("workmap:reorder-goal", (event) => {
      const { goalId, direction } = event.detail;
      handleReorderGoal(goalId, direction);
    });
    document.addEventListener("workmap:drag-drop-goal", (event) => {
      const { sourceId, targetId, insertBefore } = event.detail;
      handleDragAndDrop(sourceId, targetId, insertBefore);
    });

    // Add a global dragend handler to clean up drop indicators
    const handleDragEnd = () => {
      // Remove any drop indicator element
      const indicator = document.getElementById('drop-indicator');
      if (indicator) indicator.remove();
      
      // Remove dragging state from tables
      document.querySelectorAll('tbody.dragging-in-progress').forEach(tbody => {
        tbody.classList.remove('dragging-in-progress');
      });
    };
    
    document.addEventListener("dragend", handleDragEnd);

    // Clean up on unmount
    return () => {
      document.removeEventListener("workmap:add-item", handleAddItem);
      document.removeEventListener("workmap:delete-item", handleDeleteItem);
      document.removeEventListener("workmap:reorder-goal", handleReorderGoal);
      document.removeEventListener("workmap:drag-drop-goal", handleDragAndDrop);
      document.removeEventListener("dragend", handleDragEnd);
    };
  }, [workMapData]);



  return (
    <div className="w-full overflow-x-auto">
      {/* Edit mode toggle button - only visible to authorized users and not on completed page */}
      {userCanEdit() && filter !== "completed" && (
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-md transition-colors ${isEditMode
              ? "bg-primary-600 text-white hover:bg-primary-700"
              : "bg-surface-dimmed hover:bg-surface-outline/50 text-content-base"
              }`}
          >
            {isEditMode ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Done
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Reorder Goals
              </>
            )}
          </button>
        </div>
      )}
      
      <table className={`w-full md:min-w-[1000px] table-auto ${isEditMode ? "border-2 border-primary-500 rounded" : ""}`}>
        <thead>
          <tr className="border-b-2 border-surface-outline dark:border-gray-600 bg-surface-dimmed dark:bg-gray-800/80 text-content-base dark:text-gray-200 text-sm sticky top-0">
            {/* Name column - more space on mobile for completed page */}
            <th
              className={`text-left py-2 md:py-3.5 px-2 md:px-4 font-semibold ${
                isCompletedPage ? "w-[60%] md:w-[50%]" : ""
              }`}
            >
              Name
            </th>
            {/* Status column */}
            <th
              className={`text-left py-2 md:py-3.5 px-2 md:px-4 font-semibold ${
                isCompletedPage
                  ? "w-[110px] md:w-[130px]"
                  : "w-[100px] md:w-[130px]"
              }`}
            >
              Status
            </th>
            {/* Progress column - not shown on completed page */}
            {filter !== "completed" && (
              <th className="text-left py-2 md:py-3.5 px-2 md:px-4 font-semibold w-[75px] md:w-[90px]">
                Progress
              </th>
            )}
            {/* Deadline/Completed On column */}
            <th
              className={`text-left py-2 md:py-3.5 px-2 md:px-4 font-semibold ${
                isCompletedPage
                  ? "w-[100px] md:w-[120px]"
                  : "hidden md:table-cell w-[120px]"
              }`}
            >
              {isCompletedPage ? "Completed On" : "Deadline"}
            </th>
            {/* Space column */}
            <th className="text-left py-2 md:py-3.5 px-2 md:px-4 font-semibold hidden lg:table-cell w-[100px]">
              Space
            </th>
            {/* Champion column */}
            <th className="text-left py-2 md:py-3.5 px-2 md:px-4 font-semibold hidden xl:table-cell w-[120px]">
              Champion
            </th>
            {/* Next step column - only shown on non-completed pages */}
            {filter !== "completed" && (
              <th className="text-left py-2 md:py-3.5 px-2 md:px-4 font-semibold xl:w-[200px] 2xl:w-[300px] hidden xl:table-cell">
                Next step
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {
            workMapData
              // Special case for projects and completed pages - show flat lists
              .flatMap((item) => {
              // For projects page, extract all projects from the hierarchy and make a flat list
              if (filter === "projects") {
                const allProjects = extractAllProjects([item]);
                // Exclude completed and dropped projects
                return allProjects.filter(
                  (project) =>
                    project.status !== "completed" &&
                    project.status !== "dropped"
                );
              }

              // For completed page, extract all completed/dropped/failed/achieved/partial/missed items in a flat list
              if (filter === "completed") {
                // Sort by completedOn date, most recent first
                const completedItems = extractCompletedItems([item]);

                // Parse dates in "Month DD YYYY" format
                const parseDate = (dateStr) => {
                  if (!dateStr) return new Date(0);

                  const months = {
                    Jan: 0,
                    Feb: 1,
                    Mar: 2,
                    Apr: 3,
                    May: 4,
                    Jun: 5,
                    Jul: 6,
                    Aug: 7,
                    Sep: 8,
                    Oct: 9,
                    Nov: 10,
                    Dec: 11,
                  };

                  // Extract components from format like "Mar 10 2025"
                  const parts = dateStr.split(" ");
                  if (parts.length === 3) {
                    const month = months[parts[0]];
                    const day = parseInt(parts[1], 10);
                    const year = parseInt(parts[2], 10);
                    return new Date(year, month, day);
                  }

                  return new Date(0); // Default to oldest date if parsing fails
                };

                return completedItems.sort((a, b) => {
                  const dateA = parseDate(a.completedOn?.display);
                  const dateB = parseDate(b.completedOn?.display);
                  return dateB - dateA; // Most recent first
                });
              }

              // For other views, use the normal filtering
              return [
                // First filter the top-level items
                ...(() => {
                  if (!filter) return [item];

                  if (filter === "goals") {
                    // For goals page, exclude all completed goals (all closed statuses)
                    return item.type === "goal" &&
                      item.status !== "completed" &&
                      item.status !== "failed" &&
                      item.status !== "dropped" &&
                      item.status !== "achieved" &&
                      item.status !== "partial" &&
                      item.status !== "missed"
                      ? [item]
                      : [];
                  }

                  return [item];
                })(),
              ];
            })
            // Then filter children appropriately (only for the goals view)
            .map((item) =>
              filter === "goals" ? filterChildren(item, filter) : item
            )
            .map((item, index, filteredItems) => {
              // Use the table row directly
              return (
                <TableRow
                  key={item.id}
                  item={item}
                  level={0}
                  isLast={index === filteredItems.length - 1}
                  filter={filter}
                  isSelected={false}
                  onRowClick={null}
                  selectedItemId={null}
                  isEditMode={isEditMode}
                />
              );
            })}

          {/* Permanent quick add row at the bottom of the table, not shown on completed page */}
          {filter !== "completed" && (
            <QuickAddRow columnCount={getColumnCount()} filter={filter} />
          )}
        </tbody>
      </table>
      
    </div>
  );
}
