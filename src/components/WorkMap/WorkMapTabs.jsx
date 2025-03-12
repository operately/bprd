import React from "react";

export function WorkMapTabs({ activeTab }) {
  return (
    <div className="border-b border-surface-outline">
      <div className="px-6">
        <nav className="flex space-x-8" aria-label="Work Map Tabs">
          <a
            href="/work-map"
            className={`
              border-b-2 
              ${
                activeTab === "all"
                  ? "border-blue-500 text-content-base"
                  : "border-transparent text-content-dimmed hover:text-content-base hover:border-surface-accent"
              } 
              px-1 py-2.5 text-base font-medium flex items-center gap-1.5
            `}
            aria-current={activeTab === "all" ? "page" : undefined}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            All work
          </a>
          <a
            href="/work-map-goals"
            className={`
              border-b-2 
              ${
                activeTab === "goals"
                  ? "border-blue-500 text-content-base"
                  : "border-transparent text-content-dimmed hover:text-content-base hover:border-surface-accent"
              } 
              px-1 py-2.5 text-base font-medium flex items-center gap-1.5
            `}
            aria-current={activeTab === "goals" ? "page" : undefined}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
              <path d="M12 7a5 5 0 1 0 5 5"></path>
              <path d="M13 3.055a9 9 0 1 0 7.941 7.945"></path>
              <path d="M15 6v3h3l3 -3h-3v-3z"></path>
              <path d="M15 9l-3 3"></path>
            </svg>
            Goals
          </a>
          <a
            href="/work-map-projects"
            className={`
              border-b-2 
              ${
                activeTab === "projects"
                  ? "border-blue-500 text-content-base"
                  : "border-transparent text-content-dimmed hover:text-content-base hover:border-surface-accent"
              } 
              px-1 py-2.5 text-base font-medium flex items-center gap-1.5
            `}
            aria-current={activeTab === "projects" ? "page" : undefined}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M9.615 20h-2.615a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8"></path>
              <path d="M14 19l2 2l4 -4"></path>
              <path d="M9 8h4"></path>
              <path d="M9 12h2"></path>
            </svg>
            Projects
          </a>
          <a
            href="/work-map-completed"
            className={`
              border-b-2 
              ${
                activeTab === "completed"
                  ? "border-blue-500 text-content-base"
                  : "border-transparent text-content-dimmed hover:text-content-base hover:border-surface-accent"
              } 
              px-1 py-2.5 text-base font-medium flex items-center gap-1.5
            `}
            aria-current={activeTab === "completed" ? "page" : undefined}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Completed
          </a>
        </nav>
      </div>
    </div>
  );
}
