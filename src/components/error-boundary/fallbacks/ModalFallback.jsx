import React from "react";

const ModalFallback = ({ error, resetErrorBoundary, onClose }) => {
  return (
    <div className="bg-[#1a1818] p-8 rounded-2xl border border-[#363A42] flex flex-col items-center justify-center text-center shadow-xl">
      <div className="w-16 h-16 bg-[#2a2828] rounded-full flex items-center justify-center mb-6 ring-1 ring-[#363A42]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-[#FEC36D]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
        Modal Error
      </h3>
      <p className="text-gray-400 mb-8 max-w-sm">
        {error?.message || "There was an error loading this modal content."}
      </p>
      <div className="flex gap-4 w-full">
        {onClose && (
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-[#363A42] bg-transparent text-gray-300 rounded-lg hover:bg-[#2a2828] hover:text-white transition-all font-medium"
          >
            Close
          </button>
        )}
        <button
          onClick={resetErrorBoundary}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-[#FEC36D] to-[#D78001] text-white rounded-lg hover:opacity-90 transition-opacity font-bold shadow-lg shadow-orange-900/20"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ModalFallback;
