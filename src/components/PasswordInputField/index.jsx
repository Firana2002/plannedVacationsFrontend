import React, { useState } from 'react';
import './style.css';

function PasswordInputField({ placeholder, value, onChange }) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => !value && setIsFocused(false);
  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  return (
    <div className={`input-field-container ${isFocused ? 'focused' : ''}`}>
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="input-field"
        placeholder={placeholder}
      />
      <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
        {showPassword ? '👁️' : '🙈'}
      </button>
    </div>
  );
}

export default PasswordInputField;
