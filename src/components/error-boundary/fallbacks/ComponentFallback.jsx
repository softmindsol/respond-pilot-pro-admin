import React from "react";

const ComponentFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="p-4 border border-[#363A42] rounded-lg bg-[#1a1818] flex flex-col items-start gap-3 shadow-sm max-w-sm">
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-base font-semibold text-white">
          Something went wrong
        </h3>
      </div>
      <p className="text-sm text-gray-400">
        {error?.message || "An unexpected error occurred in this component."}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-3 py-1.5 bg-[#2a2828] text-gray-300 border border-[#363A42] hover:bg-[#363A42] hover:text-white rounded text-sm transition-colors font-medium"
      >
        Try again
      </button>
    </div>
  );
};

export default ComponentFallback;
