import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import PageFallback from "./fallbacks/PageFallback";

const PageErrorBoundary = ({ children, onError }) => {
  return (
    <ErrorBoundary
      fallback={({ error, reset }) => (
        <PageFallback error={error} resetErrorBoundary={reset} />
      )}
      onError={onError}
    >
      {children}
    </ErrorBoundary>
  );
};

export default PageErrorBoundary;
