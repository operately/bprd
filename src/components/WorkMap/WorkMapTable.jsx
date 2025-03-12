import React from "react";
import { TableRow } from "./TableRow";
import { mockData } from "./mockData";

export default function WorkMapTable() {
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
            <th className="text-left py-2 md:py-3.5 px-2 md:px-4 font-semibold w-[80px] md:w-[130px]">
              Progress
            </th>
            <th className="text-left py-2 md:py-3.5 px-2 md:px-4 font-semibold w-[100px] hidden md:table-cell">
              Deadline
            </th>
            <th className="text-left py-2 md:py-3.5 px-2 md:px-4 font-semibold w-[100px] hidden lg:table-cell">
              Space
            </th>
            <th className="text-left py-2 md:py-3.5 px-2 md:px-4 font-semibold w-[120px] hidden lg:table-cell">
              Owner
            </th>
            <th className="text-left py-2 md:py-3.5 px-2 md:px-4 font-semibold xl:w-[200px] 2xl:w-[300px] hidden xl:table-cell">
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
