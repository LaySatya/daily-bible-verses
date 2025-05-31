import React from "react";

export default function Alert({ type = "info", message, onClose }) {
  const color = {
    info: "alert-info",
    success: "alert-success",
    error: "alert-error",
    warning: "alert-warning",
  }[type] || "alert-info";

  return (
    <div className={`alert ${color} shadow-lg flex items-center justify-between`}>
      <span>{message}</span>
      {onClose && (
        <button className="btn btn-sm btn-ghost" onClick={onClose}>
          ✕
        </button>
      )}
    </div>
  );
}