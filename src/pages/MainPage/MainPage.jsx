import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css'; // Стили для страницы

const MainPage = () => {
  const navigate = useNavigate();

  // Обработчик для перехода на страницу с календарем отпусков
  const handleYearClick = (year) => {
    navigate(`/vacation-days?year=${year}`);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <div className="dashboard">
   
          <div className="year-cards">
            <div className="year-card" onClick={() => handleYearClick(2024)}>
              <h2>2024</h2>
              <p>Отпуска на 2024 год</p>
            </div>
            <div className="year-card" onClick={() => handleYearClick(2025)}>
              <h2>2025</h2>
              <p>Отпуска на 2025 год</p>
            </div>
            <div className="year-card" onClick={() => handleYearClick(2026)}>
              <h2>2026</h2>
              <p>Отпуска на 2026 год</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;