import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import ModalFallback from "./fallbacks/ModalFallback";

const ModalErrorBoundary = ({ children, onError, onClose }) => {
  return (
    <ErrorBoundary
      fallback={({ error, reset }) => (
        <ModalFallback
          error={error}
          resetErrorBoundary={reset}
          onClose={onClose}
        />
      )}
      onError={onError}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ModalErrorBoundary;
