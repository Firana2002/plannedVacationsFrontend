import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlannedVacations, updateVacationStatus } from '@/api/plannedVacations';
import './RequestsPage.css';

const RequestsPage = () => {
  const [vacations, setVacations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vacationTypesData = await getPlannedVacations();
        setVacations(vacationTypesData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApproveApplication = async (id) => {
    try {
      await updateVacationStatus(id, 2, comment);
      setVacations(prev => prev.map(v => 
        v.plannedVacationId === id ? { ...v, vacationStatus: { name: 'Принят' } } : v
      ));
      setSelectedApplication(null);
    } catch (error) {
      console.error('Ошибка при одобрении заявки:', error);
    }
  };

  const handleRejectApplication = async (id) => {
    try {
      await updateVacationStatus(id, 3, comment);
      setVacations(prev => prev.map(v => 
        v.plannedVacationId === id ? { ...v, vacationStatus: { name: 'Отклонён' } } : v
      ));
      setSelectedApplication(null);
    } catch (error) {
      console.error('Ошибка при отклонении заявки:', error);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="requests-container">
      <div className="requests-content">
    
        
        <div className="filters-section">
          <div className="filter-group">
            <h2>Заявки</h2>
            <div className="filter-buttons">
              <button onClick={() => setFilter('all')}>Все заявки</button>
              <button onClick={() => setFilter('my')}>Мои заявки</button>
            </div>
          </div>

          <div className="filter-group">
            <h2>Поиск</h2>
            <input
              type="text"
              placeholder="Поиск по ФИО, тегу или отделу"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <h2>Сортировка</h2>
            <div className="sort-controls">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date">По дате</option>
                <option value="alphabet">По ФИО</option>
                <option value="tag">По тегу</option>
              </select>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="desc">По убыванию</option>
                <option value="asc">По возрастанию</option>
              </select>
            </div>
          </div>
        </div>

        <div className="requests-table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>№</th>
                <th>ФИО</th>
                <th>Начало</th>
                <th>Окончание</th>
                <th>Тип отпуска</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {vacations.map((app, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{app.employee.firstName} {app.employee.lastName}</td>
                  <td>{app.startDate}</td>
                  <td>{app.endDate}</td>
                  <td>{app.vacationType.name}</td>
                  <td>{app.vacationStatus.name}</td>
                  <td>
                    <button onClick={() => setSelectedApplication(app)}>Просмотр</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedApplication && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Заявка №{selectedApplication.plannedVacationId}</h2>
              <div className="modal-content">
                <p><strong>ФИО:</strong> {selectedApplication.employee.lastName} {selectedApplication.employee.firstName}</p>
                <p><strong>Даты:</strong> {selectedApplication.startDate} - {selectedApplication.endDate}</p>
                <p><strong>Тип:</strong> {selectedApplication.vacationType.name}</p>
                <p><strong>Статус:</strong> {selectedApplication.vacationStatus.name}</p>
                <textarea
                  placeholder="Комментарий"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button className="approve-btn" onClick={() => handleApproveApplication(selectedApplication.plannedVacationId)}>
                  Одобрить
                </button>
                <button className="reject-btn" onClick={() => handleRejectApplication(selectedApplication.plannedVacationId)}>
                  Отклонить
                </button>
                <button className="close-btn" onClick={() => setSelectedApplication(null)}>
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsPage;