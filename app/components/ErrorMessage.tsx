import React from "react";
import { AlertCircle, X } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

export default function ErrorMessage({
  message,
  onDismiss,
}: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
      <div className="flex-1">
        <span className="text-red-800 text-[10px]">{message}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
