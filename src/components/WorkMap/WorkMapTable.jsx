import React from "react";
import { TableRow } from "./TableRow";
import { mockData } from "./mockData";

export default function WorkMapTable() {
  return (
    <div className="w-full">
      <table className="w-full min-w-[1000px] table-auto">
        <thead>
          <tr className="border-b-2 border-surface-outline bg-surface-dimmed text-content-base text-sm sticky top-0">
            <th className="text-left py-3.5 px-4 font-semibold">Name</th>
            <th className="text-left py-3.5 px-4 font-semibold w-[130px]">
              Status
            </th>
            <th className="text-left py-3.5 px-4 font-semibold w-[130px]">
              Progress
            </th>
            <th className="text-left py-3.5 px-4 font-semibold w-[100px]">Space</th>
            <th className="text-left py-3.5 px-4 font-semibold w-[120px]">Owner</th>
            <th className="text-left py-3.5 px-4 font-semibold w-[100px]">
              Deadline
            </th>
            <th className="text-left py-3.5 px-4 font-semibold w-[300px]">
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
