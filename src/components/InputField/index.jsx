import React, { useState } from 'react';
import './style.css';

function InputField({ placeholder, type, value, onChange }) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (!value) {
      setIsFocused(false);
    }
  };

  return (
    <div className={`input-field-container ${isFocused ? 'focused' : ''}`}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="input-field"
        placeholder={placeholder} // Используем placeholder
      />
    </div>
  );
}

export default InputField;
