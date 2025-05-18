import React from "react";
import "./AlertBox.css";

export default function AlertBox({ message, type = "error", onClose }) {
  if (!message) return null;

  return (
    <div className={`alert-box ${type}`}>
      <span>{message}</span>
      <button onClick={onClose} className="close-btn">
        &times;
      </button>
    </div>
  );
}
