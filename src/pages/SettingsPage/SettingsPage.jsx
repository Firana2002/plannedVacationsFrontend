import React, { useState, useEffect } from 'react';
import './SettingsPage.css';

const SettingsPage = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Загружаем тему из localStorage при монтировании компонента
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkTheme(savedTheme === 'dark');
      document.body.classList.toggle('dark-theme', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkTheme ? 'dark' : 'light';
    setIsDarkTheme(!isDarkTheme);
    document.body.classList.toggle('dark-theme', !isDarkTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="vacation-requests-container">
      <div className="vacation-requests-section">
        <div className={`settings-page ${isDarkTheme ? 'dark-theme' : ''}`}>
          <span className="theme-label">Сменить тему (светлая/темная)</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isDarkTheme}
              onChange={toggleTheme}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
