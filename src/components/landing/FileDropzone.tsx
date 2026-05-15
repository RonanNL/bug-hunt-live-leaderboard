import React, { useRef, useState } from "react";
import styles from "./FileDropzone.module.css";

type Props = {
  onFile: (file: File) => void;
};

export function FileDropzone({ onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFile(file);
      e.target.value = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <div
      className={`${styles.dropzone} ${isDragging ? styles.dragging : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Click or drag and drop a JSON file here"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleChange}
        className={styles.hiddenInput}
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Upload icon */}
      <svg
        className={styles.icon}
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <rect x="2" y="20" width="28" height="10" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 4v16M9 11l7-7 7 7" />
      </svg>

      <div className={styles.textGroup}>
        <p className={styles.primaryText}>
          {isDragging ? "Drop your JSON file here" : "Click to select JSON file"}
        </p>
        <p className={styles.secondaryText}>or drag and drop here</p>
      </div>
    </div>
  );
}
