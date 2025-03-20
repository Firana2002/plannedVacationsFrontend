import React, { useState, useEffect } from 'react';
import './RequestsPage.css'; // Стили для страницы
import { useNavigate } from 'react-router-dom';
import { getPlannedVacations, updateVacationStatus } from '@/api/plannedVacations';

const RequestsPage = () => {
  
  const [vacations, setVacations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Состояния для фильтров и сортировки
  const [filter, setFilter] = useState('all'); // all, approved, rejected, my
  const [sortBy, setSortBy] = useState('date'); // alphabet, date, tag
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null); // Выбранная заявка для просмотра
  const [comment, setComment] = useState('');
  useEffect(() => {
      const fetchData = async () => {
          const vacationTypesData = await getPlannedVacations();
          console.log(vacationTypesData)
          setVacations(vacationTypesData);
      };
      fetchData();
      setLoading(false)
  }, []);

  const handleApproveApplication = async (id) => {
    try {
        await updateVacationStatus(id, 2, comment); // 1 - статус "принят"
        setVacations((prevVacations) =>
            prevVacations.map((vacation) =>
                vacation.plannedVacationId === id
                    ? { ...vacation, vacationStatus: { name: 'Принят' } }
                    : vacation
            )
        );
        setSelectedApplication(null); // Закрываем модальное окно
    } catch (error) {
        console.error('Ошибка при одобрении заявки:', error);
    }
};

const handleRejectApplication = async (id) => {
    try {
        await updateVacationStatus(id, 3, comment); // 2 - статус "отклонён"
        setVacations((prevVacations) =>
            prevVacations.map((vacation) =>
                vacation.plannedVacationId === id
                    ? { ...vacation, vacationStatus: { name: 'Отклонён' } }
                    : vacation
            )
        );
        setSelectedApplication(null); // Закрываем модальное окно
    } catch (error) {
        console.error('Ошибка при отклонении заявки:', error);
    }
};

  return (
    <div>
      <div className="main-content">
        <div className="dashboard">
          <h1>Просмотр заявок</h1>
          <div className="requests-section">
            <div className="requests-filter">
              <h2 className="wwww">Заявки</h2>
              <ul>
                <li>
                  <button onClick={() => setFilter('all')}>Все заявки</button>
                </li>
                <li>
                  <button onClick={() => setFilter('my')}>Мои заявки</button>
                </li>
              </ul>
              <ul>
                <li>
                  <button onClick={() => setFilter('all')}>Все заявления</button>
                </li>
                <li>
                  <button onClick={() => setFilter('approved')}>Одобренные</button>
                </li>
                <li>
                  <button onClick={() => setFilter('rejected')}>Отказанные</button>
                </li>
              </ul>
            </div>
            <div className="requests-search">
              <h2 className="wwww">Поиск</h2>
              <input
                type="text"
                placeholder="Поиск по ФИО, тегу или отделу"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="requests-sort">
              <h2 className="wwww">Сортировка</h2>
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
            <div className="requests-table">
              <table>
                <thead>
                  <tr>
                    <th>№</th>
                    <th>ФИО/тег</th>
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
                      <td>{app.employee.firstName}</td>
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
          </div>
        </div>
      </div>

      {/* Модальное окно для просмотра и обработки заявки */}
      {selectedApplication && (
        <div className="modal-overlay1">
          <div className="modal1">
            <h2>Заявка №{selectedApplication.plannedVacationId}</h2>
            <p><strong>ФИО:</strong> {selectedApplication.employee.lastName} {selectedApplication.employee.firstName} {selectedApplication.employee.middleName}</p>
            <p><strong>Начало:</strong> {selectedApplication.startDate}</p>
            <p><strong>Окончание:</strong> {selectedApplication.endDate}</p>
            <p><strong>Тип отпуска:</strong> {selectedApplication.vacationType.name}</p>
            <p><strong>Статус:</strong> {selectedApplication.vacationStatus.name}</p>
            <textarea
              placeholder="Комментарий руководителя"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="modal-actions1">
              <button onClick={() => handleApproveApplication(selectedApplication.plannedVacationId)}>
                Одобрить
              </button>
              <button onClick={() => handleRejectApplication(selectedApplication.plannedVacationId)}>
                Отклонить
              </button>
              <button onClick={() => setSelectedApplication(null)}>Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsPage;