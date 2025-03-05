import React from "react";

export function ProgressBar({ progress, status }) {
  // Convert progress from 0-100 to width percentage
  const progressWidth = `${progress}%`;
  
  // Determine color based on status
  let progressColor;
  switch (status) {
    case "on_track":
      progressColor = "bg-green-400";
      break;
    case "paused":
      progressColor = "bg-gray-400";
      break;
    case "caution":
      progressColor = "bg-yellow-400";
      break;
    case "issue":
      progressColor = "bg-red-400";
      break;
    case "pending":
      progressColor = "bg-blue-400";
      break;
    default:
      progressColor = "bg-gray-400";
  }
  
  return (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full ${progressColor}`}
        style={{ width: progressWidth }}
      />
    </div>
  );
}
