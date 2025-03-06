import React from "react";

export function StatusBadge({ status }) {
  let bgColor, textColor, label;
  
  switch (status) {
    case "on_track":
      bgColor = "bg-green-100";
      textColor = "text-green-700";
      label = "On track";
      break;
    case "completed":
      bgColor = "bg-green-100";
      textColor = "text-green-700";
      label = "Completed";
      break;
    case "paused":
      bgColor = "bg-gray-200";
      textColor = "text-gray-700";
      label = "Paused";
      break;
    case "dropped":
      bgColor = "bg-gray-200";
      textColor = "text-gray-700";
      label = "Dropped";
      break;
    case "caution":
      bgColor = "bg-amber-100";
      textColor = "text-amber-800";
      label = "Caution";
      break;
    case "issue":
      bgColor = "bg-red-100";
      textColor = "text-red-700";
      label = "Issue";
      break;
    case "failed":
      bgColor = "bg-red-100";
      textColor = "text-red-700";
      label = "Failed";
      break;
    case "pending":
      bgColor = "bg-blue-100";
      textColor = "text-blue-700";
      label = "Pending";
      break;
    default:
      bgColor = "bg-gray-100";
      textColor = "text-gray-700";
      label = status;
  }
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}>
      {label}
    </span>
  );
}
