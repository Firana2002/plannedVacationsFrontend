import React, { useEffect, useState } from 'react';
import Header from '../Header/Header'; // Импортируем шапку
import Sidebar from '../Sidebar/Sidebar'; // Импортируем новый компонент Sidebar
import { fetchApplications, createApplication, updateApplication, deleteApplication } from '../../api'; // Импортируем API
import './RequestsPage.css'; // Стили для страницы

const RequestsPage = () => {
  const [applications, setApplications] = useState([]); // Состояние для хранения заявок
  const [loading, setLoading] = useState(true); // Состояние для отображения загрузки
  const [error, setError] = useState(null); // Состояние для отображения ошибок

  const [newApplication, setNewApplication] = useState({
    employeeName: '',
    applicationNumber: '',
    registrationDate: '',
    department: '',
    leaveType: '',
    status: 'На рассмотрении',
  });

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await fetchApplications();
        setApplications(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  // Обработчик для создания новой заявки
  const handleCreateApplication = async (application) => {
    try {
      const createdApplication = await createApplication(application);
      setApplications([...applications, createdApplication]);
    } catch (err) {
      setError(err.message);
    }
  };

  // Обработчик для обновления заявки
  const handleUpdateApplication = async (id, updatedApplication) => {
    try {
      const updated = await updateApplication(id, updatedApplication);
      setApplications(applications.map(app => (app.id === id ? updated : app)));
    } catch (err) {
      setError(err.message);
    }
  };

  // Обработчик для удаления заявки
  const handleDeleteApplication = async (id) => {
    try {
      await deleteApplication(id);
      setApplications(applications.filter(app => app.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Обработчик изменения значений в форме
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewApplication({ ...newApplication, [name]: value });
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleCreateApplication(newApplication);
    setNewApplication({
      employeeName: '',
      applicationNumber: '',
      registrationDate: '',
      department: '',
      leaveType: '',
      status: 'На рассмотрении',
    });
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div className="app-container">
      <Header title="Просмотр заявок" /> {/* Шапка профиля */}
      <div className="main-content">
        <Sidebar /> {/* Используем новый компонент Sidebar */}
        <div className="dashboard">
          <h1>Просмотр заявок</h1>
          {/* Форма для создания новой заявки */}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="employeeName"
              value={newApplication.employeeName}
              onChange={handleInputChange}
              placeholder="ФИО/тег"
            />
            <input
              type="text"
              name="applicationNumber"
              value={newApplication.applicationNumber}
              onChange={handleInputChange}
              placeholder="Номер заявления"
            />
            <input
              type="date"
              name="registrationDate"
              value={newApplication.registrationDate}
              onChange={handleInputChange}
              placeholder="Дата регистрации"
            />
            <input
              type="text"
              name="department"
              value={newApplication.department}
              onChange={handleInputChange}
              placeholder="Отдел"
            />
            <input
              type="text"
              name="leaveType"
              value={newApplication.leaveType}
              onChange={handleInputChange}
              placeholder="Тип отпуска"
            />
            <button type="submit">Создать заявку</button>
          </form>
          <div className="requests-section">
            <div className="requests-filter">
              <h2>Заявки</h2>
              <ul>
                <li>Мои заявки</li>
                <li>Отказанные заявления</li>
              </ul>
            </div>
            <div className="requests-sort">
              <h2>Все заявления</h2>
              <p>Сортировка по:</p>
              <ul>
                <li>по алфавиту</li>
                <li>Похваты</li>
              </ul>
            </div>
            <div className="requests-table">
              <h2>Требуем отпусков</h2>
              <table>
                <thead>
                  <tr>
                    <th>№</th>
                    <th>ФИО/тег</th>
                    <th>Номер заявления</th>
                    <th>Дата регистрации</th>
                    <th>Отдел</th>
                    <th>Тип отпуска</th>
                    <th>Статус</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, index) => (
                    <tr key={app.id}>
                      <td>{index + 1}</td>
                      <td>{app.employeeName}</td>
                      <td>{app.applicationNumber}</td>
                      <td>{app.registrationDate}</td>
                      <td>{app.department}</td>
                      <td>{app.leaveType}</td>
                      <td>{app.status}</td>
                      <td>
                        <button onClick={() => handleUpdateApplication(app.id, { ...app, status: 'Одобрено' })}>
                          Одобрить
                        </button>
                        <button onClick={() => handleDeleteApplication(app.id)}>Удалить</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestsPage;