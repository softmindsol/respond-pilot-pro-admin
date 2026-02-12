import React from "react";
import { useNavigate } from "react-router-dom";

const PageFallback = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    resetErrorBoundary();
    navigate("/");
  };

  return (
    <div className="bg-[#0f0d0d] min-h-screen flex flex-col justify-center items-center px-6 lg:px-8">
      <div className="max-w-md w-full bg-[#1a1818] border border-[#363A42] shadow-2xl rounded-xl p-8 text-center relative overflow-hidden">
        {/* Decorative gradient blur */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FEC36D] to-[#D78001]"></div>

        <h2 className="mt-4 text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          Something went wrong!
        </h2>
        <p className="mt-4 text-lg text-gray-400">
          We encountered an unexpected error while loading this page.
        </p>

        {process.env.NODE_ENV === "development" && error && (
          <div className="mt-6 p-4 bg-red-900/10 text-red-400 text-left text-sm rounded-md overflow-x-auto border border-red-900/20 font-mono">
            <code>{error.toString()}</code>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-[#FEC36D] to-[#D78001] hover:opacity-90 transition-opacity shadow-lg shadow-orange-900/20"
          >
            Reload
          </button>

          <button
            onClick={resetErrorBoundary}
            className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-[#363A42] text-base font-medium rounded-lg text-gray-300 bg-transparent hover:bg-[#2a2828] hover:text-white transition-all"
          >
            Try Again
          </button>

          <button
            onClick={handleGoHome}
            className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-[#363A42] text-base font-medium rounded-lg text-gray-300 bg-transparent hover:bg-[#2a2828] hover:text-white transition-all"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageFallback;
