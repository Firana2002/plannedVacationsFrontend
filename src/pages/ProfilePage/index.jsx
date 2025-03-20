import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './ProfilePage.css';

import { getMyPlannedVacations } from '@/api/plannedVacations';

export default function BasicTabs() {
  const { userData, loading, error } = useSelector((state) => state.user);
  const [vacations, setVacations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        const vacationTypesData = await getMyPlannedVacations();
        console.log(vacationTypesData)
        setVacations(vacationTypesData.$values);
    };
    fetchData();
}, []);

    if (loading) {
        return <p>Loading...</p>; // Показываем индикатор загрузки
    }

    if (error) {
        return <p>Error: {error}</p>; // Показываем ошибку
    }

    if (!userData) {
        return <p>No user data available.</p>; // Если данных о пользователе нет
    }
    

  return (
      <div className="personal-info">
        <h2>Личная информация</h2>
        <div className="info-card">
          <p><strong>Имя:</strong>{userData.lastName} {userData.firstName} {userData.middleName}</p>
          <p><strong>Почта:</strong> {userData.email}</p>
          <p><strong>Должность:</strong> {userData.position.name}</p>
          <p><strong>Отдел:</strong> {userData.department.name}</p>
        </div>
      </div>
  );
}
