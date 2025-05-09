import axios from './axiosConfig';

export interface Notification {
    notificationId: number;
    employeeId: number;
    message: string;
    isRead: boolean;
    createdAt: string;
    relatedVacationId?: number;
}

export const getMyNotifications = async (): Promise<Notification[]> => {
    const response = await axios.get('/notification/my');
    return response.data;
};

export const markNotificationAsRead = async (id: number): Promise<void> => {
    await axios.put(`/notification/${id}/read`);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
    await axios.put('/notification/read-all');
};

export const getUnreadNotificationsCount = async (): Promise<number> => {
    const response = await axios.get('/notification/unread-count');
    return response.data;
}; 