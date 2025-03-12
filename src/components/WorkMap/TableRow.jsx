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
  // Smaller indentation to save horizontal space
  const indentPadding = level * 20;
  const isGoal = item.type === "goal";
  const isProject = item.type === "project";

  // Determine if item should have strikethrough or other special styling
  const isCompleted = item.status === "completed";
  const isFailed = item.status === "failed";
  const isDropped = item.status === "dropped";
  const isPending = item.status === "pending";

  return (
    <>
      <tr className="group hover:bg-surface-highlight border-b border-surface-outline transition-all duration-150 ease-in-out">
        {/* Name */}
        <td className="py-2 px-2 md:px-4">
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
              className={`
                font-medium text-xs md:text-sm hover:underline transition-colors
                ${isCompleted || isFailed ? "line-through" : ""}
                ${isDropped ? "line-through opacity-70" : ""}
                ${isPending ? "text-content-dimmed" : ""}
                ${
                  isCompleted || isFailed || isDropped
                    ? "text-content-dimmed"
                    : "text-content-base hover:text-link-hover"
                }
              `}
            >
              {item.name}
            </a>
          </div>
        </td>

        {/* Status */}
        <td className="py-2 px-2 md:px-4">
          <div className="transform group-hover:scale-105 transition-transform duration-150">
            <StatusBadge status={item.status} />
          </div>
        </td>

        {/* Progress bar */}
        <td className="py-2  px-2 md:px-4">
          <div className="transform group-hover:scale-[1.02] transition-transform duration-150">
            <ProgressBar progress={item.progress} status={item.status} />
          </div>
        </td>

        {/* Deadline */}
        <td className="py-2  px-2 md:px-4 hidden md:table-cell">
          <span
            className={`
              text-sm whitespace-nowrap
              ${
                item.deadline.isPast &&
                !isCompleted &&
                !isFailed &&
                !isDropped &&
                !isPending
                  ? "text-red-600"
                  : "text-content-base"
              }
              ${
                isCompleted || isFailed
                  ? "line-through text-content-dimmed"
                  : ""
              }
              ${isDropped ? "line-through opacity-70 text-content-dimmed" : ""}
              ${isPending ? "text-content-dimmed" : ""}
            `}
          >
            {item.deadline.display}
          </span>
        </td>

        {/* Space */}
        <td className="py-2 px-2 md:px-4 hidden lg:table-cell">
          <div className="w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
            <a
              href="#"
              title={item.space}
              className={`
                text-sm hover:underline
                ${
                  isCompleted || isFailed
                    ? "text-content-dimmed"
                    : "text-content-base hover:text-link-hover"
                }
                ${isDropped ? "opacity-70 text-content-dimmed" : ""}
                ${isPending ? "text-content-dimmed" : ""}
              `}
            >
              {item.space}
            </a>
          </div>
        </td>

        {/* Champion */}
        <td className="py-2  px-2 md:px-4 hidden lg:table-cell">
          <div className="flex items-center max-w-[120px] overflow-hidden">
            {item.owner.avatar ? (
              <div className="w-5 h-5 rounded-full overflow-hidden border border-stroke-base mr-1.5 flex-shrink-0 transform group-hover:scale-110 transition-transform duration-150 shadow-sm">
                <img
                  src={item.owner.avatar}
                  alt={item.owner.name}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-1.5 text-xs flex-shrink-0 transform group-hover:scale-110 transition-transform duration-150 shadow-sm">
                {item.owner.initials}
              </div>
            )}
            <a
              href="#"
              title={item.owner.name}
              className={`
                text-sm truncate hover:underline transition-colors whitespace-nowrap overflow-hidden text-ellipsis inline-block
                ${
                  isCompleted || isFailed
                    ? "text-content-dimmed"
                    : "text-content-base hover:text-link-hover"
                }
                ${isDropped ? "opacity-70 text-content-dimmed" : ""}
                ${isPending ? "text-content-dimmed" : ""}
              `}
            >
              {item.owner.name}
            </a>
          </div>
        </td>

        {/* Next step */}
        <td className="py-2  px-2 md:px-4 hidden xl:table-cell">
          <div className="w-full xl:max-w-[200px] 2xl:max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">
            <span
              title={item.nextStep}
              className={`
                text-sm transition-colors duration-150
                ${
                  isCompleted || isFailed
                    ? "line-through text-content-dimmed"
                    : "text-content-base group-hover:text-content-intense"
                }
                ${
                  isDropped ? "line-through opacity-70 text-content-dimmed" : ""
                }
                ${isPending ? "text-content-dimmed" : ""}
              `}
            >
              {item.nextStep}
            </span>
          </div>
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
