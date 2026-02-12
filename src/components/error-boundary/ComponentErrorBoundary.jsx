import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import ComponentFallback from "./fallbacks/ComponentFallback";

const ComponentErrorBoundary = ({ children, onError }) => {
  return (
    <ErrorBoundary
      fallback={({ error, reset }) => (
        <ComponentFallback error={error} resetErrorBoundary={reset} />
      )}
      onError={onError}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ComponentErrorBoundary;
