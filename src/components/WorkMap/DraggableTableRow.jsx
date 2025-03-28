import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { TableRow } from "./TableRow";

export function DraggableTableRow(props) {
  const { 
    id, 
    isSortable = false,
    ...rest 
  } = props;
  
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
    disabled: !isSortable
  });

  return (
    <TableRow
      {...rest}
      dragHandleProps={isSortable ? { ...listeners, ...attributes } : null}
      isDragging={isDragging}
      ref={setNodeRef}
    />
  );
}
