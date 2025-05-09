import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { getEmployeeVacationDays } from '@/api/EmployeeVacationDays';
import "./EmployeeVacationDaysPage.css"

const EmployeeVacationDaysPage = () => {
  const [vacationDays, setVacationDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get('year');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching all vacations');
        const data = await getEmployeeVacationDays();
        console.log('Received vacations:', data);
        
        // Если указан год, фильтруем отпуска
        if (selectedYear) {
          const filteredData = data.filter(vacation => {
            const startDate = new Date(vacation.startDate);
            const endDate = new Date(vacation.endDate);
            return startDate.getFullYear() === parseInt(selectedYear) || 
                   endDate.getFullYear() === parseInt(selectedYear);
          });
          setVacationDays(filteredData);
        } else {
          setVacationDays(data);
        }
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
        setError(error.message || "Произошла ошибка при загрузке отпусков");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedYear]);

  const calculateDaysCount = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleAddVacationDaysClick = () => {
    navigate('/create-vacation');
  };

  const filteredVacationDays = vacationDays.filter(day => {
    const searchLower = searchTerm.toLowerCase();
    return (
      day.employee?.firstName?.toLowerCase().includes(searchLower) ||
      (day.employee?.lastName && day.employee.lastName.toLowerCase().includes(searchLower)) ||
      day.vacationType?.name?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="main-content">
        <div className="dashboard">
          <div className="content-area">
            <div className="loading">Загрузка...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="dashboard">
          <div className="content-area">
            <div className="error-message">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vacation-requests-container">
      <div className="vacation-requests-section">
            <div className="employees-page">
          <h2>{selectedYear ? `Отпуска за ${selectedYear} год` : 'Все отпуска'}</h2>
          <div className="header-controls">
            <div className="employees-page__controls">
              <input
                type="text"
                placeholder="Поиск по имени, фамилии или типу отпуска..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button 
              className="add-vacation-btn"
              onClick={handleAddVacationDaysClick}
            >
              Добавить отпуск
            </button>
          </div>
          
          {filteredVacationDays.length === 0 ? (
            <div className="no-vacations">Нет отпусков</div>
          ) : (
            <table className="employees-table">
              <thead>
                <tr>
                  <th>ID записи</th>
                  <th>Сотрудник</th>
                  <th>Тип отпуска</th>
                  <th>Дата начала</th>
                  <th>Дата окончания</th>
                  <th>Дней</th>
                </tr>
              </thead>
              <tbody>
                {filteredVacationDays.map((day) => (
                  <tr key={day.employeeVacationDaysId}>
                    <td>{day.employeeVacationDaysId}</td>
                    <td>{day.employee?.firstName} {day.employee?.lastName || ''}</td>
                    <td>{day.vacationType?.name}</td>
                    <td>
                      {format(new Date(day.startDate), 'dd.MM.yyyy', { locale: ru })}
                    </td>
                    <td>
                      {format(new Date(day.endDate), 'dd.MM.yyyy', { locale: ru })}
                    </td>
                    <td>
                      {calculateDaysCount(day.startDate, day.endDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeVacationDaysPage;