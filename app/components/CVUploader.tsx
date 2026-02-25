"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

interface CVUploaderProps {
  onUploadComplete: (analysis: any) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export default function CVUploader({ onUploadComplete }: CVUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const uploadedFile = acceptedFiles[0];
      if (!uploadedFile) return;

      if (uploadedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }

      setFile(uploadedFile);
      setError(null);
      setUploading(true);
      setProgress(0);

      try {
        const formData = new FormData();
        formData.append("cv", uploadedFile);

        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90));
        }, 200);

        const response = await fetch("/api/analyze-cv", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);
        setProgress(100);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Upload failed");
        }

        setTimeout(() => {
          onUploadComplete(data.analysis);
        }, 500);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
        setFile(null);
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [onUploadComplete],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  const removeFile = () => {
    setFile(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          border-3 border-dotted border-purple-200 rounded-xl p-12 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragActive
              ? "border-purple-500 bg-blue-50 scale-105"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }
          ${uploading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div>
            <LoadingSpinner message="Analyzing your CV..." />
            <div className="mt-4 w-64 mx-auto bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{progress}%</p>
          </div>
        ) : file ? (
          <div className="flex items-center justify-center gap-3">
            {/* <CheckCircle className="w-6 h-6 text-green-500" /> */}
            <div className="text-left">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-500" />
                <span className="text-gray-700 font-medium">{file.name}</span>
              </div>
              <p className="text-xs text-gray-500">
                {formatFileSize(file.size)}
              </p>
            </div>
            {/* <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="ml-2 text-red-500 hover:text-red-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button> */}
          </div>
        ) : (
          <div>
            <img src="./images/upload.gif" className="w-20 mx-auto" alt="upload gif" />
            {/* <Upload className="w-16 h-16 mx-auto mb-4 text-gray-300" /> */}
            <p className="text-lg font-medium text-gray-600 mb-2">
              {isDragActive ? "Drop your CV here" : "Upload your CV"}
            </p>
            <p className="text-sm text-gray-400">
              Drag and drop or click to browse
            </p>
            {/* <p className="text-xs text-gray-400 mt-2">
              Supports PDF and TXT (Max 10MB)
            </p> */}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4">
          <ErrorMessage message={error} onDismiss={() => setError(null)} />
        </div>
      )}
    </div>
  );
}
