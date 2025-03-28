import React from "react";

const Button = ({ children, onClick, className, disabled }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
      }`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
