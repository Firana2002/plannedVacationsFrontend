import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './ProfilePage.css';
import { getMyProfile } from '@/api/employees';

import { getMyPlannedVacations } from '@/api/plannedVacations';



export default function BasicTabs() {
  const [userData, setUserData] = useState(null);
  const [vacations, setVacations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [user, plannedVacations] = await Promise.all([
          getMyProfile(),
          getMyPlannedVacations()
        ]);
        setUserData(user);
        setVacations(plannedVacations);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!userData) return <p>No user data available.</p>;

  return (
    <div className="vacation-requests-container">
      <div className="vacation-requests-section">
        <div className="personal-info">
          <div className="info-card">
            <p><strong>ФИО: &nbsp;&nbsp;</strong>{userData.lastName} {userData.firstName} {userData.middleName}</p>
            <p><strong>Адрес электронной почты: &nbsp;&nbsp;</strong>{userData.email}</p>
            <p><strong>Должность: &nbsp;&nbsp;</strong>{userData.position?.name || 'N/A'}</p>
            <p><strong>Отдел: &nbsp;&nbsp;</strong>{userData.department?.name || 'N/A'}</p>
            <p><strong>Дата трудоустройства: &nbsp;&nbsp;</strong>{userData.hireDate}</p>
            <p><strong>Накоплено дней отпуска: &nbsp;&nbsp;</strong>{userData.totalAccumulatedVacationDays}</p>
            <p><strong>Осталось из накопленных дней: &nbsp;&nbsp;</strong>{userData.accumulatedVacationDays}</p>
          </div>

          {/* Vacation Table */}
          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>Начало</th>
                <th>Окончание</th>
                <th>Тип отпуска</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {vacations.map((app, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{app.startDate}</td>
                  <td>{app.endDate}</td>
                  <td>{app.vacationType.name}</td>
                  <td>{app.vacationStatus.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}