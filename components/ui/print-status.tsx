"use client";

interface PrintStatusProps {
  isPrinting: boolean;
  progress: string;
  error: string | null;
  onClearError: () => void;
}

export default function PrintStatus({
  isPrinting,
  progress,
  error,
  onClearError,
}: PrintStatusProps) {
  if (!isPrinting && !error && !progress) {
    return null;
  }

  return (
    <div className="print-status">
      {isPrinting && (
        <div className="status-message printing">
          <span className="status-icon">⏳</span>
          <span>{progress || "Printing..."}</span>
        </div>
      )}

      {error && (
        <div className="status-message error">
          <span className="status-icon">❌</span>
          <span>{error}</span>
          <button onClick={onClearError} className="clear-btn">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
