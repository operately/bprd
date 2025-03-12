import React from "react";
import { TableRow } from "./TableRow";
import { mockData } from "./mockData";

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
  
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full md:min-w-[1000px] table-auto">
        <thead>
          <tr className="border-b-2 border-surface-outline bg-surface-dimmed text-content-base text-sm sticky top-0">
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
          {mockData
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
            .map((item, index, filteredItems) => (
              <TableRow
                key={item.id}
                item={item}
                level={0}
                isLast={index === filteredItems.length - 1}
                filter={filter}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
}
