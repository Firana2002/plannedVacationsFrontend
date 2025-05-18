import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import localforage from 'localforage';
import axios from 'axios';
import './style.css';
import { getEmployee } from '@/api/employees';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import NotificationBell from '../NotificationBell';

const Header = () => {
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Маппинг путей к названиям страниц
  const pageTitles = {
    '/main-page': 'Архив',
    '/create-vacation': 'Создать отпуск',
    '/planned-vacation': 'Запланированные отпуска',
    '/profile': 'Профиль',
    '/employees': 'Сотрудники',
    '/requests': 'Заявки',
    '/vacation-days': 'Дни отпуска',
    '/all-vacations': 'Заявки на отпуск',
    '/settings': 'Настройки'
  };

  // Получаем заголовок текущей страницы
  const getCurrentPageTitle = () => {
    return pageTitles[location.pathname] || '';
  };

  // Загрузка данных пользователя
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем ID пользователя из токена
        const token = Cookies.get('token');
        if (!token) {
          console.error('Токен не найден');
          return;
        }
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.EmployeeId;

        // Загрузка данных пользователя
        const userResponse = await getEmployee(userId);
        setUserInfo(userResponse.data);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    fetchData();
  }, []);

  const handleSettingsClick = () => {
    navigate('/settings');
    setShowNotifications(false);
    setShowUserInfo(false);
  };

  const handleUserInfoClick = () => {
    setShowUserInfo(!showUserInfo);
  };

  const handleHomeClick = () => {
    navigate('/main-page');
    setShowUserInfo(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* Логотип и название приложения */}
      <div className="navbar-brand" onClick={handleHomeClick}>
        <img 
          src="/images/amage1.png" 
          alt="Логотип V.PLANNER" 
          className="navbar-logo" 
        />
        <span className="app-name">V.PLANNER</span>
      </div>

      {/* Динамический заголовок страницы */}
      <h1 className="page-title">{getCurrentPageTitle()}</h1>

      {/* Панель иконок */}
      <div className="navbar-actions">
        {/* Компонент уведомлений */}
        <NotificationBell />

        {/* Иконка настроек */}
        <button 
          className="action-btn settings-btn"
          onClick={handleSettingsClick}
          aria-label="Настройки"
        >
          <img src="/images/настр.png" alt="" />
        </button>


        {/* Иконка профиля */}
        <button 
          className="action-btn profile-btn"
          onClick={handleUserInfoClick}
          aria-label="Профиль"
        >
          <img src="/images/полф.png" alt="" />
        </button>
      </div>

      {/* Модальное окно профиля */}
      {showUserInfo && (
        <div className="modal-backdrop" onClick={handleUserInfoClick}>
          <div className="modal-content profile-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Профиль пользователя</h3>
            </div>

            <div className="modal-body">
              {userInfo ? (
                <div className="user-profile">
                  <div className="user-info">
                    <div className="info-row">
                      <span className="label">Имя:</span>
                      <span className="value">{userInfo.firstName} {userInfo.lastName}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Должность:</span>
                      <span className="value">{userInfo.position?.name || '-'}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Отдел:</span>
                      <span className="value">{userInfo.department?.name || '-'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p>Загрузка данных...</p>
              )}
            </div>

            <div className="modal-footer">
              <button 
                className="btn danger"
                onClick={handleLogout}
              >
                Выйти из системы
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
