import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function BasicTabs() {
  const { userData, loading, error } = useSelector((state) => state.user); // Получаем данные о пользователе из Redux

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
    <div className="w-full">
      <div className="border-b border-gray-300">
        {userData.firstName}
      </div>
    </div>
  );
}
