import React, { useState } from "react";
import { StatusBadge } from "./StatusBadge";
import { ProgressBar } from "./ProgressBar";
import {
  IconTargetArrow,
  IconChecklist,
  IconChevronDown,
  IconChevronRight,
} from "./Icons";
import { HoverQuickEntryWidget } from "./HoverQuickEntryWidget";

export const TableRow = React.forwardRef(({
  item,
  level,
  isLast,
  filter,
  isSelected = false,
  onRowClick,
  selectedItemId,
  isEditMode = false,
  dragHandleProps = null,
  isDragging = false,
}, ref) => {
  // Determine if we're on the completed page for compact styling
  const isCompletedPage = filter === "completed";
  const [expanded, setExpanded] = useState(true);
  const [showAddButton, setShowAddButton] = useState(false);
  const [showQuickEntryWidget, setShowQuickEntryWidget] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  // Decide whether to show indentation and controls
  // Only apply indentation on hierarchical pages (all work, goals)
  const showIndentation = !filter || filter === "goals" || filter === "all";
  const indentPadding = showIndentation ? level * 20 : 0;
  const isGoal = item.type === "goal";
  const isProject = item.type === "project";

  // Determine if item should have strikethrough or other special styling
  const isCompleted =
    item.status === "completed" ||
    item.status === "achieved" ||
    item.status === "partial" ||
    item.status === "missed";
  const isFailed = item.status === "missed";
  const isDropped = item.status === "dropped";
  const isPending = item.status === "pending";

  // Handle click on the row to trigger selection
  const handleRowClick = (e) => {
    // Prevent click from bubbling when clicking links or buttons
    if (
      e.target.tagName.toLowerCase() === "a" ||
      e.target.tagName.toLowerCase() === "button" ||
      e.target.closest("a") ||
      e.target.closest("button")
    ) {
      return;
    }

    // Call the selection handler
    if (onRowClick) {
      onRowClick(item);
    }
  };

  // Determine if this item is selected
  const isThisItemSelected =
    isSelected || (selectedItemId && selectedItemId === item.id);

  // Create a combined ref if one is provided
  const rowRef = React.useRef(null);
  
  // Handle ref forwarding
  React.useEffect(() => {
    if (ref && rowRef.current) {
      if (typeof ref === 'function') {
        ref(rowRef.current);
      } else {
        ref.current = rowRef.current;
      }
    }
  }, [ref]);
  
  return (
    <>
      <tr
        ref={rowRef}
        data-workmap-selectable="true"
        data-id={item.id}
        data-type={item.type}
        className={`group border-b border-stroke-base transition-all duration-150 ease-in-out cursor-pointer relative
          ${
            isThisItemSelected
              ? "bg-surface-highlight dark:bg-surface-dimmed/30"
              : "hover:bg-surface-highlight dark:hover:bg-surface-dimmed/20"
          }
          ${isDragging ? "opacity-50" : ""}
        `}
        onClick={handleRowClick}
        onMouseEnter={() => !isEditMode && setShowAddButton(true)}
        onMouseLeave={() => setShowAddButton(false)}
        onDragOver={(e) => {
          // Only allow drop if in edit mode and this is a goal
          if (isEditMode && isGoal) {
            e.preventDefault();
            e.stopPropagation();
            
            // Get mouse position relative to the row
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseY = e.clientY - rect.top;
            const rowHeight = rect.height;
            
            // Mark the table as in dragging state
            const tbody = e.currentTarget.closest('tbody');
            if (tbody) tbody.classList.add('dragging-in-progress');
            
            // Get or create the drop indicator
            let indicator = document.getElementById('drop-indicator');
            if (!indicator) {
              indicator = document.createElement('div');
              indicator.id = 'drop-indicator';
              document.body.appendChild(indicator);
            }
            
            // Position the indicator at the top or bottom of the row
            if (mouseY < rowHeight / 2) {
              // Position at top of row
              indicator.style.top = `${rect.top}px`;
            } else {
              // Position at bottom of row
              indicator.style.top = `${rect.bottom - 3}px`;
            }
            
            // Store position information for the drop
            e.currentTarget.dataset.dropPosition = mouseY < rowHeight / 2 ? 'top' : 'bottom';
          }
        }}
        onDragLeave={(e) => {
          // Check if we're still within the table
          const relatedTarget = e.relatedTarget;
          if (relatedTarget && (relatedTarget === e.currentTarget || e.currentTarget.contains(relatedTarget) || relatedTarget.closest('table') === e.currentTarget.closest('table'))) {
            return; // Still within the table, don't remove indicators yet
          }
          
          // Remove the drop indicator
          const indicator = document.getElementById('drop-indicator');
          if (indicator) indicator.remove();
          
          // Remove dragging state from table
          const tbody = e.currentTarget.closest('tbody');
          if (tbody) tbody.classList.remove('dragging-in-progress');
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // Remove the drop indicator
          const indicator = document.getElementById('drop-indicator');
          if (indicator) indicator.remove();
          
          // Remove dragging state from table
          const tbody = e.currentTarget.closest('tbody');
          if (tbody) tbody.classList.remove('dragging-in-progress');
          
          // Get the dragged item ID
          const sourceId = e.dataTransfer.getData('text/plain');
          const targetId = item.id;
          
          if (sourceId && targetId && sourceId !== targetId) {
            // Get position based on stored data attribute
            const insertBefore = e.currentTarget.dataset.dropPosition === 'top';
            
            // Dispatch event to handle the drop
            document.dispatchEvent(
              new CustomEvent("workmap:drag-drop-goal", {
                detail: { sourceId, targetId, insertBefore }
              })
            );
          }
        }}
      >
        {/* Name */}
        <td className="py-2 px-2 md:px-4 relative">
          {/* Drag handle - only visible in edit mode for goals that aren't completed */}
          {isEditMode && isGoal && !isCompleted && (
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 pl-1 z-10 touch-none"
              draggable="true"
              onDragStart={(e) => {
                e.stopPropagation();
                // Set data transfer with the item ID
                e.dataTransfer.setData('text/plain', item.id);
                e.dataTransfer.effectAllowed = 'move';
                // Add a class to indicate drag
                e.currentTarget.closest('tr').classList.add('opacity-50');
              }}
              onDragEnd={(e) => {
                e.stopPropagation();
                // Remove the drag class
                e.currentTarget.closest('tr').classList.remove('opacity-50');
              }}
            >
              <div 
                className="w-6 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing text-content-dimmed hover:text-content-base"
                title="Drag to reorder"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="5" r="1"/>
                  <circle cx="9" cy="12" r="1"/>
                  <circle cx="9" cy="19" r="1"/>
                  <circle cx="15" cy="5" r="1"/>
                  <circle cx="15" cy="12" r="1"/>
                  <circle cx="15" cy="19" r="1"/>
                </svg>
              </div>
            </div>
          )}

          <div className={`flex items-center ${isEditMode && isGoal && !isCompleted ? "pl-8" : ""}`}>
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
                isGoal
                  ? "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30"
                  : "text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
              }`}
            >
              {isGoal && <IconTargetArrow size={12} />}
              {isProject && <IconChecklist size={12} />}
            </div>

            <div className="flex items-center">
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

              {/* Quick add button on hover */}
              {isGoal &&
                showAddButton &&
                !showQuickEntryWidget &&
                !isCompletedPage && (
                  <button
                    className="ml-2 relative flex items-center gap-1 text-xs font-semibold border border-surface-outline bg-surface-base text-content-dimmed hover:text-content-base hover:bg-surface-accent rounded-2xl pl-2 pr-3 py-[1px] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowQuickEntryWidget(true);
                    }}
                    title="Add sub-item"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14m-7-7h14" />
                    </svg>
                    <span>Add</span>
                  </button>
                )}

              {/* Delete button for pending items */}
              {isPending && showAddButton && (
                <button
                  className="ml-2 p-1 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Dispatch a custom event to delete this item
                    const event = new CustomEvent("workmap:delete-item", {
                      detail: { itemId: item.id },
                    });
                    document.dispatchEvent(event);
                  }}
                  title="Delete pending item"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </td>

        {/* Status - empty when in edit mode */}
        <td className="py-2 px-2 md:px-4">
          {!isEditMode && (
            <div className="transform group-hover:scale-105 transition-transform duration-150">
              <StatusBadge status={item.status} />
            </div>
          )}
        </td>

        {/* Progress bar - empty when in edit mode */}
        {filter !== "completed" && (
          <td className="py-2 px-2 md:px-4">
            {!isEditMode && !isCompleted && (
              <div className="transform group-hover:scale-[1.02] transition-transform duration-150">
                <ProgressBar progress={item.progress} status={item.status} />
              </div>
            )}
          </td>
        )}

        {/* Deadline or Completed On - empty when in edit mode */}
        <td
          className={`py-2 px-2 md:px-4 ${
            filter === "completed" ? "" : "hidden md:table-cell"
          }`}
        >
          {!isEditMode && (filter === "completed" && item.completedOn ? (
            <span className="text-xs sm:text-sm whitespace-nowrap text-content-base">
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
          ))}
        </td>

        {/* Space - empty when in edit mode */}
        <td className="py-2 px-2 md:px-4 hidden lg:table-cell">
          {!isEditMode && (
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
          )}
        </td>

        {/* Champion - empty when in edit mode */}
        <td className="py-2 px-2 md:px-4 hidden xl:table-cell">
          {!isEditMode && (
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
          )}
        </td>

        {/* Next step - empty when in edit mode */}
        {filter !== "completed" && (
          <td className="py-2 px-2 md:px-4 hidden xl:table-cell">
            {!isEditMode && (
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
            )}
          </td>
        )}
      </tr>

      {/* Quick entry widget shown when add button is clicked as an overlay */}
      {showQuickEntryWidget && (
        <tr className="bg-transparent">
          <td colSpan="7" className="p-0">
            <div className="relative">
              <div
                className="absolute z-10 mt-1"
                style={{ marginLeft: `${indentPadding + 40}px` }}
              >
                <div className="bg-surface-base dark:bg-surface-dimmed shadow-lg border border-surface-outline rounded-md p-2 inline-block">
                  <HoverQuickEntryWidget
                    parentItem={item}
                    onClose={() => setShowQuickEntryWidget(false)}
                  />
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}

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
            isEditMode={isEditMode}
          />
        ))}
    </>
  );
});
