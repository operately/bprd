import React from "react";

export function StatusBadge({ status }) {
  let bgColor, textColor, label;
  
  switch (status) {
    case "on_track":
      bgColor = "bg-green-100";
      textColor = "text-green-600";
      label = "On track";
      break;
    case "paused":
      bgColor = "bg-gray-200";
      textColor = "text-gray-600";
      label = "Paused";
      break;
    case "caution":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-700";
      label = "Caution";
      break;
    case "issue":
      bgColor = "bg-red-100";
      textColor = "text-red-600";
      label = "Issue";
      break;
    case "pending":
      bgColor = "bg-blue-100";
      textColor = "text-blue-600";
      label = "Pending";
      break;
    default:
      bgColor = "bg-gray-100";
      textColor = "text-gray-600";
      label = status;
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {label}
    </span>
  );
}
