import React from "react";
import { TableRow } from "./TableRow";
import { mockData } from "./mockData";

// Helper function to filter children based on type criteria
const filterChildrenByType = (item, filter) => {
  if (!item.children || item.children.length === 0) return { ...item, children: [] };

  const filteredChildren = item.children
    .filter(child => {
      if (filter === "goals" && child.type !== "goal") return false;
      if (filter === "projects" && child.type !== "project") return false;
      return true;
    })
    .map(child => filterChildrenByType(child, filter));

  return { ...item, children: filteredChildren };
};

export default function WorkMapTable({ filter }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full md:min-w-[1000px] table-auto">
        <thead>
          <tr className="border-b-2 border-surface-outline bg-surface-dimmed text-content-base text-sm sticky top-0">
            <th className="text-left py-2 md:py-3.5 px-2 md:px-4 font-semibold">
              Name
            </th>
            <th className="text-left py-2 md:py-3.5 px-2 md:px-4 font-semibold w-[100px] md:w-[130px]">
              Status
            </th>
            <th className="text-left py-2 md:py-3.5 px-2 md:px-4 font-semibold w-[75px] md:w-[90px]">
              Progress
            </th>
            <th className="text-left py-2 md:py-3.5 px-2 md:px-4 font-semibold w-[100px] hidden md:table-cell">
              Deadline
            </th>
            <th className="text-left py-2 md:py-3.5 px-2 md:px-4 font-semibold w-[100px] hidden lg:table-cell">
              Space
            </th>
            <th className="text-left py-2 md:py-3.5 px-2 md:px-4 font-semibold w-[120px] hidden xl:table-cell">
              Champion
            </th>
            <th className="text-left py-2 md:py-3.5 px-2 md:px-4 font-semibold xl:w-[200px] 2xl:w-[300px] hidden xl:table-cell">
              Next step
            </th>
          </tr>
        </thead>
        <tbody>
          {mockData
            // First filter the top-level items
            .filter(item => {
              if (!filter) return true;
              if (filter === "goals") return item.type === "goal";
              if (filter === "projects") return item.type === "project";
              if (filter === "completed") return item.status === "completed";
              return true;
            })
            // Then filter their children appropriately
            .map(item => filter === "goals" || filter === "projects" ? 
              filterChildrenByType(item, filter) : item)
            .map((item, index, filteredItems) => (
              <TableRow
                key={item.id}
                item={item}
                level={0}
                isLast={index === filteredItems.length - 1}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
}
