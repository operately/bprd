import React from "react";
import { StatusBadge } from "./StatusBadge";
import { ProgressBar } from "./ProgressBar";
import {
  IconTargetArrow,
  IconChecklist,
  IconChevronDown,
  IconChevronRight,
} from "./Icons";

export function TableRow({ item, level, isLast, filter, isSelected = false, onRowClick, selectedItemId }) {
  // Determine if we're on the completed page for compact styling
  const isCompletedPage = filter === "completed";
  const [expanded, setExpanded] = React.useState(true);
  const hasChildren = item.children && item.children.length > 0;
  // Decide whether to show indentation and controls
  // Only apply indentation on hierarchical pages (all work, goals)
  const showIndentation = !filter || filter === "goals" || filter === "all";
  const indentPadding = showIndentation ? level * 20 : 0;
  const isGoal = item.type === "goal";
  const isProject = item.type === "project";

  // Determine if item should have strikethrough or other special styling
  const isCompleted = item.status === "completed";
  const isFailed = item.status === "failed";
  const isDropped = item.status === "dropped";
  const isPending = item.status === "pending";

  // Handle click on the row to trigger selection
  const handleRowClick = (e) => {
    // Prevent click from bubbling when clicking links or buttons
    if (e.target.tagName.toLowerCase() === 'a' || 
        e.target.tagName.toLowerCase() === 'button' ||
        e.target.closest('a') || 
        e.target.closest('button')) {
      return;
    }
    
    // Call the selection handler
    if (onRowClick) {
      onRowClick(item);
    }
  };
  
  // Determine if this item is selected
  const isThisItemSelected = isSelected || (selectedItemId && selectedItemId === item.id);
  
  return (
    <>
      <tr 
        data-workmap-selectable="true"
        className={`group border-b border-surface-outline dark:border-gray-700 transition-all duration-150 ease-in-out cursor-pointer
          ${isThisItemSelected ? 'bg-surface-highlight dark:bg-surface-dimmed/30' : 'hover:bg-surface-highlight dark:hover:bg-surface-dimmed/20'}`}
        onClick={handleRowClick}
      >
        {/* Name */}
        <td className="py-2 px-2 md:px-4">
          <div className="flex items-center">
            {/* Only show indentation and controls on hierarchical pages */}
            {showIndentation && (
              <>
                <div
                  style={{ width: `${indentPadding}px` }}
                  className="flex-shrink-0"
                ></div>

                {hasChildren && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="mr-2 text-content-dimmed hover:text-content-base dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    {expanded ? (
                      <IconChevronDown size={16} />
                    ) : (
                      <IconChevronRight size={16} />
                    )}
                  </button>
                )}

                {!hasChildren && <div className="w-[24px]"></div>}
              </>
            )}

            <div
              className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                isGoal ? "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30" : "text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
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
                ${isPending ? "text-content-dimmed dark:text-gray-400" : ""}
                ${
                  filter === "completed" &&
                  (isCompleted || isFailed || isDropped)
                    ? "text-content-dimmed dark:text-gray-400"
                    : isCompleted || isFailed || isDropped
                    ? "text-content-dimmed dark:text-gray-400"
                    : "text-content-base dark:text-gray-200 hover:text-link-hover dark:hover:text-white"
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

        {/* Deadline or Completed On */}
        <td className="py-2 px-2 md:px-4 hidden md:table-cell">
          {filter === "completed" && item.completedOn ? (
            <span className="text-sm whitespace-nowrap text-content-base">
              {item.completedOn.display}
            </span>
          ) : (
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
                ${
                  isDropped ? "line-through opacity-70 text-content-dimmed" : ""
                }
                ${isPending ? "text-content-dimmed" : ""}
              `}
            >
              {item.deadline.display}
            </span>
          )}
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
        <td className="py-2  px-2 md:px-4 hidden xl:table-cell">
          <div className="flex items-center max-w-[120px] overflow-hidden">
            {/* Only show avatar/initials if there's an owner name */}
            {item.owner && item.owner.name && (
              <>
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
                  item.owner.initials && (
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-1.5 text-xs flex-shrink-0 transform group-hover:scale-110 transition-transform duration-150 shadow-sm">
                      {item.owner.initials}
                    </div>
                  )
                )}
              </>
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

        {/* Next step - don't show on completed page */}
        {filter !== "completed" && (
          <td className="py-2 px-2 md:px-4 hidden xl:table-cell">
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
                    isDropped
                      ? "line-through opacity-70 text-content-dimmed"
                      : ""
                  }
                  ${isPending ? "text-content-dimmed" : ""}
                `}
              >
                {item.nextStep}
              </span>
            </div>
          </td>
        )}
      </tr>

      {expanded &&
        hasChildren &&
        item.children.map((child, index) => (
          <TableRow
            key={child.id}
            item={child}
            level={level + 1}
            isLast={index === item.children.length - 1 && isLast}
            filter={filter}
            selectedItemId={selectedItemId}
            onRowClick={onRowClick}
          />
        ))}
    </>
  );
}
