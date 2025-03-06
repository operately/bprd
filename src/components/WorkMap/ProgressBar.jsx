import React from "react";

export function ProgressBar({ progress, status }) {
  // Convert progress from 0-100 to width percentage
  const progressWidth = `${progress}%`;
  
  // Determine color based on status
  let progressColor;
  switch (status) {
    case "on_track":
    case "completed":
      progressColor = "bg-green-500";
      break;
    case "paused":
    case "dropped":
      progressColor = "bg-gray-400";
      break;
    case "caution":
      progressColor = "bg-amber-500";
      break;
    case "issue":
    case "failed":
      progressColor = "bg-red-500";
      break;
    case "pending":
      progressColor = "bg-blue-500";
      break;
    default:
      progressColor = "bg-gray-400";
  }
  
  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full ${progressColor}`}
        style={{ width: progressWidth }}
      />
    </div>
  );
}
