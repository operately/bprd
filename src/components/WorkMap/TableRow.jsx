import React from "react";
import { StatusBadge } from "./StatusBadge";
import { ProgressBar } from "./ProgressBar";
import {
  IconTargetArrow,
  IconChecklist,
  IconChevronDown,
  IconChevronRight,
} from "./Icons";

export function TableRow({ item, level, isLast }) {
  const [expanded, setExpanded] = React.useState(true);
  const hasChildren = item.children && item.children.length > 0;
  const indentPadding = level * 24;
  const isGoal = item.type === "goal";
  const isProject = item.type === "project";

  return (
    <>
      <tr
        className={`hover:bg-surface-highlight ${
          !isLast ? "border-b border-surface-outline" : ""
        }`}
      >
        <td className="py-3 px-4">
          <div className="flex items-center">
            <div
              style={{ width: `${indentPadding}px` }}
              className="flex-shrink-0"
            ></div>

            {hasChildren && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mr-2 text-content-dimmed hover:text-content-base"
              >
                {expanded ? (
                  <IconChevronDown size={16} />
                ) : (
                  <IconChevronRight size={16} />
                )}
              </button>
            )}

            {!hasChildren && <div className="w-[24px]"></div>}

            <div
              className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                isGoal ? "text-red-500 bg-red-50" : "text-blue-500 bg-blue-50"
              }`}
            >
              {isGoal && <IconTargetArrow size={12} />}
              {isProject && <IconChecklist size={12} />}
            </div>

            <a
              href="#"
              className="text-content-base hover:underline hover:text-link-hover transition-colors"
            >
              {item.name}
            </a>
          </div>
        </td>
        <td className="py-3 px-4">
          <StatusBadge status={item.status} />
        </td>
        <td className="py-3 px-4">
          <ProgressBar progress={item.progress} status={item.status} />
        </td>
        <td className="py-3 px-4">
          <a
            href="#"
            className="text-content-base text-sm hover:underline hover:text-link-hover transition-colors"
          >
            {item.space}
          </a>
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center">
            {item.owner.avatar ? (
              <div className="w-5 h-5 rounded-full overflow-hidden border border-stroke-base mr-1.5">
                <img
                  src={item.owner.avatar}
                  alt={item.owner.name}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-1.5 text-xs">
                {item.owner.initials}
              </div>
            )}
            <a
              href="#"
              className="text-content-base text-sm truncate hover:underline hover:text-link-hover transition-colors"
            >
              {item.owner.name}
            </a>
          </div>
        </td>
        <td className="py-3 px-4">
          <span
            className={`${
              item.deadline.isPast ? "text-red-600" : "text-content-base"
            } text-sm whitespace-nowrap`}
          >
            {item.deadline.display}
          </span>
        </td>
        <td className="py-3 px-4">
          <span className="text-content-base text-sm">{item.nextStep}</span>
        </td>
      </tr>

      {expanded &&
        hasChildren &&
        item.children.map((child, index) => (
          <TableRow
            key={child.id}
            item={child}
            level={level + 1}
            isLast={index === item.children.length - 1 && isLast}
          />
        ))}
    </>
  );
}
