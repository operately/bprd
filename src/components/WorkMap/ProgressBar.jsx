import React from "react";

export function ProgressBar({ progress, status }) {
  // Convert progress from 0-100 to width percentage
  const progressWidth = `${progress}%`;

  // Determine color based on status
  let progressColor;
  switch (status) {
    case "on_track":
    case "completed":
      progressColor = "bg-green-500 dark:bg-green-400";
      break;
    case "paused":
    case "dropped":
      progressColor = "bg-gray-400 dark:bg-gray-500";
      break;
    case "caution":
      progressColor = "bg-amber-500 dark:bg-amber-400";
      break;
    case "issue":
    case "failed":
      progressColor = "bg-red-500 dark:bg-red-400";
      break;
    case "pending":
      progressColor = "bg-blue-500 dark:bg-blue-400";
      break;
    default:
      progressColor = "bg-gray-400 dark:bg-gray-500";
  }

  return (
    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${progressColor} relative overflow-hidden`}
        style={{ width: progressWidth }}
      >
        {/* Add subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-50 dark:via-white/30"></div>
      </div>
    </div>
  );
}
