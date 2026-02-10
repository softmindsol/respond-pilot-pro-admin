import React, { useState } from "react";

const ErrorTrigger = ({ label = "Trigger Test Error" }) => {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error(`Manually triggered error: ${label}`);
  }

  return (
    <button
      onClick={() => setShouldError(true)}
      className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg hover:opacity-90 transition-all font-medium text-xs shadow-md whitespace-nowrap"
    >
      {label}
    </button>
  );
};

export default ErrorTrigger;
