import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getMyNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  getUnreadNotificationsCount 
} from '../../api/notifications';
import './NotificationBell.css';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getMyNotifications();
                setNotifications(data);
                const count = await getUnreadNotificationsCount();
                setUnreadCount(count);
            } catch (error) {
                console.error('Ошибка загрузки уведомлений:', error);
            }
        };

        fetchNotifications();
    }, []);

    const handleNotificationsClick = () => {
        setShowNotifications(!showNotifications);
    };

    // Для компонента NotificationBell
const handleClearNotifications = async () => {
    try {
        await markAllNotificationsAsRead();
        setNotifications([]); // Полная очистка списка
        setUnreadCount(0);
    } catch (error) {
        console.error('Ошибка при очистке уведомлений:', error);
    }
};

const handleMarkAsRead = async (id) => {
    try {
        await markNotificationAsRead(id);
        setNotifications(prev => prev.filter(n => n.notificationId !== id)); // Удаление из списка
        setUnreadCount(prev => prev - 1);
    } catch (error) {
        console.error('Ошибка при отметке уведомления как прочитанного:', error);
    }
};

    const handleNotificationClick = () => {
        navigate('/all-vacations');
    };

    return (
        <div className="notification-bell">
            <button 
                className="action-btn notification-btn"
                onClick={handleNotificationsClick}
                aria-label="Уведомления"
            >
                <img src="/images/увед.svg" alt="Уведомления" />
                {unreadCount > 0 && (
                    <span className="badge">{unreadCount}</span>
                )}
            </button>

            {showNotifications && (
                <div className="modal-overlay" onClick={handleNotificationsClick}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">Уведомления</h3>
                        {notifications.length === 0 ? (
                            <p className="no-notifications">Новых уведомлений нет</p>
                        ) : (
                            <ul className="notifications-list">
                                {notifications.map((notification) => (
                                    <li 
                                        key={notification.notificationId} 
                                        className="notification-item"
                                    >
                                        <img 
                                            src="/images/увед.svg" 
                                            alt="Иконка уведомления" 
                                            className="notification-icon" 
                                        />
                                        <div 
                                            className="notification-content"
                                            onClick={handleNotificationClick}
                                        >
                                            <p className="notification-message">
                                                {notification.message}
                                            </p>
                                            <p className="notification-details">
                                                <span>
                                                    {new Date(notification.createdAt).toLocaleDateString('ru-RU')}
                                                </span>
                                            </p>
                                            {!notification.isRead && (
                                                <button
                                                    className="mark-read-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMarkAsRead(notification.notificationId);
                                                    }}
                                                >
                                                    Отметить как прочитанное
                                                </button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="modal-buttons">
                            <button 
                                className="modal-close-btn"
                                onClick={handleClearNotifications}
                            >
                                Прочитать все
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;