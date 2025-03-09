import React from 'react';
import { useLocation } from 'react-router-dom';
import './style.css';

const Header = () => {
    const location = useLocation();

    // Функция для определения заголовка в зависимости от текущего пути
    const getPageTitle = () => {
        switch (location.pathname) {
            case '/':
                return 'Главная';
            case '/employees':
                return 'Сотрудники';
            case '/schedule':
                return 'График отпусков';
            default:
                return '';
        }
    };

    return (
        <div className='header'>
            <h1 className="page-title">{getPageTitle()}</h1>
            <div className="header-icons">
                <img src="/assets/settings.svg" alt="Настройки" className="image-container2" />
                <img src="/assets/my-profile.svg" alt="Мой профиль" className="image-container2" />
            </div>
        </div>
    );
};

export default Header;
