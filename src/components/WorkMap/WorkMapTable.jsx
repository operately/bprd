import React, { useState } from "react";
import { TableRow } from "./TableRow";
import { QuickAddRow } from "./QuickAddRow";
import { mockData } from "../../mockData";

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

// Helper function to extract all completed, dropped, and failed items
const extractCompletedItems = (data) => {
  let completedItems = [];

  const extractItems = (items) => {
    items.forEach((item) => {
      // If this item is completed, dropped, or failed, add it to the list
      if (
        item.status === "completed" ||
        item.status === "dropped" ||
        item.status === "failed"
      ) {
        // For completed page, use completedOn date if available, or create a mock one if not
        const enhancedItem = { ...item, children: [] }; // Reset children to make it flat

        // If completedOn is not present, add a mock date based on status
        if (!enhancedItem.completedOn) {
          if (enhancedItem.status === "completed") {
            enhancedItem.completedOn = { display: "Feb 28 2025" };
          } else if (enhancedItem.status === "dropped") {
            enhancedItem.completedOn = { display: "Jan 15 2025" };
          } else if (enhancedItem.status === "failed") {
            enhancedItem.completedOn = { display: "Mar 5 2025" };
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

      // On goals page, exclude completed, failed, or dropped goals
      if (
        filter === "goals" &&
        child.type === "goal" &&
        (child.status === "completed" ||
          child.status === "failed" ||
          child.status === "dropped")
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
  // Create a state to store the modified data
  const [workMapData, setWorkMapData] = useState(mockData);
  
  // Get the column count based on filter
  const getColumnCount = () => {
    if (filter === "completed") return 6; // Name, Status, Progress, Completed On, Space, Champion
    return 7; // Name, Status, Progress, Deadline, Space, Champion, Next step
  };
  
  // Add listeners for add-item and delete-item events
  React.useEffect(() => {
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
        const rootIndex = items.findIndex(item => item.id === itemId);
        if (rootIndex !== -1) {
          // Found at root level, remove it
          items.splice(rootIndex, 1);
          return true;
        }
        
        // Check in children of each item
        for (let i = 0; i < items.length; i++) {
          if (items[i].children && items[i].children.length > 0) {
            // Check if item is in this item's children
            const childIndex = items[i].children.findIndex(child => child.id === itemId);
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
    document.addEventListener('workmap:add-item', handleAddItem);
    document.addEventListener('workmap:delete-item', handleDeleteItem);
    
    // Clean up on unmount
    return () => {
      document.removeEventListener('workmap:add-item', handleAddItem);
      document.removeEventListener('workmap:delete-item', handleDeleteItem);
    };
  }, [workMapData]);
  
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full md:min-w-[1000px] table-auto">
        <thead>
          <tr className="border-b-2 border-surface-outline dark:border-gray-600 bg-surface-dimmed dark:bg-gray-800/80 text-content-base dark:text-gray-200 text-sm sticky top-0">
            {/* Name column - max width to prevent excessive spacing */}
            <th className={`text-left py-2 md:py-3.5 px-2 md:px-4 font-semibold ${isCompletedPage ? "max-w-[35%] w-[35%]" : ""}`}>
              Name
            </th>
            {/* Status column */}
            <th className="text-left py-2 md:py-3.5 px-2 md:px-4 font-semibold w-[100px] md:w-[130px]">
              Status
            </th>
            {/* Progress column */}
            <th className="text-left py-2 md:py-3.5 px-2 md:px-4 font-semibold w-[75px] md:w-[90px]">
              Progress
            </th>
            {/* Deadline/Completed On column */}
            <th
              className="text-left py-2 md:py-3.5 px-2 md:px-4 font-semibold hidden md:table-cell w-[120px]"
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
          {workMapData
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

              // For completed page, extract all completed/dropped/failed items in a flat list
              if (filter === "completed") {
                return extractCompletedItems([item]);
              }

              // For other views, use the normal filtering
              return [
                // First filter the top-level items
                ...(() => {
                  if (!filter) return [item];

                  if (filter === "goals") {
                    // For goals page, exclude completed, failed or dropped goals
                    return item.type === "goal" &&
                      item.status !== "completed" &&
                      item.status !== "failed" &&
                      item.status !== "dropped"
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
                />
              );
            })}
            
            {/* Permanent quick add row at the bottom of the table, not shown on completed page */}
            {filter !== "completed" && (
              <QuickAddRow columnCount={getColumnCount()} />
            )}
        </tbody>
      </table>
    </div>
  );
}
