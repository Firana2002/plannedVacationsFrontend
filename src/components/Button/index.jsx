import React from 'react';
import './style.css';

function Button({ text, onClick }) {
  return (
    <button className="login-button" onClick={onClick}>
      <span className="login-button-text-style">{text}</span>
    </button>
  );
}

export default Button;
