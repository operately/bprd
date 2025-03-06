import React from "react";
import { TableRow } from "./TableRow";
import { mockData } from "./mockData";

export default function WorkMapTable() {
  return (
    <div className="w-full">
      <table className="w-full min-w-[1000px] table-auto">
        <thead>
          <tr className="border-b border-surface-outline text-content-dimmed text-sm">
            <th className="text-left py-3 px-4 font-medium">Name</th>
            <th className="text-left py-3 px-4 font-medium w-[130px]">
              Status
            </th>
            <th className="text-left py-3 px-4 font-medium w-[130px]">
              Progress
            </th>
            <th className="text-left py-3 px-4 font-medium w-[100px]">Space</th>
            <th className="text-left py-3 px-4 font-medium w-[120px]">Owner</th>
            <th className="text-left py-3 px-4 font-medium w-[100px]">
              Deadline
            </th>
            <th className="text-left py-3 px-4 font-medium w-[300px]">
              Next step
            </th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((item, index) => (
            <TableRow
              key={item.id}
              item={item}
              level={0}
              isLast={index === mockData.length - 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
