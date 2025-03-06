import React from "react";

export function StatusBadge({ status }) {
  let bgColor, textColor, dotColor, borderColor, label;
  
  switch (status) {
    case "on_track":
      bgColor = "bg-green-50";
      textColor = "text-green-700";
      dotColor = "bg-green-500";
      borderColor = "border-green-200"; 
      label = "On track";
      break;
    case "completed":
      bgColor = "bg-green-50";
      textColor = "text-green-700";
      dotColor = "bg-green-500";
      borderColor = "border-green-200";
      label = "Completed";
      break;
    case "paused":
      bgColor = "bg-gray-100";
      textColor = "text-gray-700";
      dotColor = "bg-gray-400";
      borderColor = "border-gray-200";
      label = "Paused";
      break;
    case "dropped":
      bgColor = "bg-gray-100";
      textColor = "text-gray-700";
      dotColor = "bg-gray-400";
      borderColor = "border-gray-200";
      label = "Dropped";
      break;
    case "caution":
      bgColor = "bg-amber-50";
      textColor = "text-amber-800";
      dotColor = "bg-amber-500";
      borderColor = "border-amber-200";
      label = "Caution";
      break;
    case "issue":
      bgColor = "bg-red-50";
      textColor = "text-red-700";
      dotColor = "bg-red-500";
      borderColor = "border-red-200";
      label = "Issue";
      break;
    case "failed":
      bgColor = "bg-red-50";
      textColor = "text-red-700";
      dotColor = "bg-red-500";
      borderColor = "border-red-200";
      label = "Failed";
      break;
    case "pending":
      bgColor = "bg-blue-50";
      textColor = "text-blue-700";
      dotColor = "bg-blue-500";
      borderColor = "border-blue-200";
      label = "Pending";
      break;
    default:
      bgColor = "bg-gray-50";
      textColor = "text-gray-700";
      dotColor = "bg-gray-400";
      borderColor = "border-gray-200";
      label = status;
  }
  
  // Determine which icon to show based on status
  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return (
          <svg className={`w-2.5 h-2.5 ${textColor} mr-1.5 flex-shrink-0`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case "failed":
      case "dropped":
        return (
          <svg className={`w-2.5 h-2.5 ${textColor} mr-1.5 flex-shrink-0`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      default:
        return <span className={`w-1.5 h-1.5 ${dotColor} rounded-full mr-1.5 flex-shrink-0`}></span>;
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${bgColor} ${textColor} border ${borderColor} shadow-sm backdrop-blur-[2px]`}>
      {getStatusIcon()}
      {label}
    </span>
  );
}
