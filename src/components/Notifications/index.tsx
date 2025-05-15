import React, { useEffect, useState } from 'react';
import { getMyNotifications, markNotificationAsRead, markAllNotificationsAsRead, Notification } from '../../api/notifications';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import './styles.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await getMyNotifications();
            setNotifications(data);
            setError(null);
        } catch (err) {
            setError('Не удалось загрузить уведомления');
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAllAsRead = async () => {
    try {
        await markAllNotificationsAsRead();
        setNotifications([]); // Полная очистка списка
    } catch (err) {
        console.error('Error marking all notifications as read:', err);
    }
};

const handleMarkAsRead = async (id) => {
    try {
        await markNotificationAsRead(id);
        setNotifications(prev => prev.filter(n => n.notificationId !== id)); // Удаление из списка
    } catch (err) {
        console.error('Error marking notification as read:', err);
    }
};

    if (loading) {
        return <div className="notifications-loading">Загрузка уведомлений...</div>;
    }

    if (error) {
        return <div className="notifications-error">{error}</div>;
    }

    return (
        <div className="notifications-container">
            <div className="notifications-header">
                <h2>Уведомления</h2>
                {notifications.length > 0 && (
                    <button
                        className="mark-all-read-button"
                        onClick={handleMarkAllAsRead}
                    >
                        Отметить все как прочитанные
                    </button>
                )}
            </div>
            {notifications.length === 0 ? (
                <div className="no-notifications">Нет новых уведомлений</div>
            ) : (
                <div className="notifications-list">
                    {notifications.map(notification => (
                        <div
                            key={notification.notificationId}
                            className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                        >
                            <div className="notification-content">
                                <p className="notification-message">{notification.message}</p>
                                <span className="notification-date">
                                    {format(new Date(notification.createdAt), 'dd MMMM yyyy, HH:mm', { locale: ru })}
                                </span>
                            </div>
                            {!notification.isRead && (
                                <button
                                    className="mark-read-button"
                                    onClick={() => handleMarkAsRead(notification.notificationId)}
                                >
                                    Отметить как прочитанное
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications; 