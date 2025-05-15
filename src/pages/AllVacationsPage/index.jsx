import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserDataSuccess } from '@/redux/userSlice';
import './AllVacationsPage.css';
import { getMyPlannedVacations, getPlannedVacations, updateVacationStatus } from '@/api/plannedVacations';
import Cookies from 'js-cookie';

const AllVacationsPage = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const [filter, setFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [managerComment, setManagerComment] = useState('');
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        let data;
        if (userData?.roleId === 1) {
          data = await getPlannedVacations();
          console.log('Fetched applications with overlaps:', data);
        } else {
          data = await getMyPlannedVacations();
        }
        setApplications(data);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    fetchApplications();
  }, [userData]);

  useEffect(() => {
    if (userData?.roleId === 2) {
      setFilter('my');
    }
  }, [userData]);

  const getStatusText = (statusId) => {
    switch (statusId) {
      case 1: return 'Запланирован';
      case 2: return 'Подтвержден';
      case 3: return 'Отменен';
      case 4: return 'Завершен';
      default: return 'Неизвестно';
    }
  };

  const getStatusClass = (statusId) => {
    switch (statusId) {
      case 1: return 'pending';
      case 2: return 'approved';
      case 3: return 'rejected';
      case 4: return 'completed';
      default: return '';
    }
  };

  const filteredApplications = applications.filter(app => {
    const isMyApplication = app.userId === userData.id;
    
    if (userData?.roleId === 1) {
      switch (filter) {
        case 'my': return isMyApplication;
        case 'approved': return app.vacationStatusId === 2;
        case 'rejected': return app.vacationStatusId === 3;
        default: return true;
      }
    } else {
      if (!isMyApplication) return false;
      switch (filter) {
        case 'approved': return app.vacationStatusId === 2;
        case 'rejected': return app.vacationStatusId === 3;
        default: return true;
      }
    }
  });

  const searchedApplications = filteredApplications.filter(app => {
    const searchString = `${app.employee?.firstName || ''} ${app.employee?.lastName || ''} ${app.employee?.tag || ''} ${app.employee?.department || ''}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const handleStatusUpdate = async (newStatusId) => {
    try {
      await updateVacationStatus(
        selectedApplication.plannedVacationId, 
        newStatusId, 
        managerComment
      );
      setApplications(applications.map(app => 
        app.plannedVacationId === selectedApplication.plannedVacationId ? { 
          ...app, 
          vacationStatusId: newStatusId,
          managerComment: managerComment 
        } : app
      ));
      setSelectedApplication(null);
      setManagerComment('');
    } catch (error) {
      console.error('Не удалось обновить статус отпуска:', error);
    }
  };

  return (
    <div className="vacation-requests-container">
      <div className="vacation-requests-section">
        <div className="vacation-requests-filter">
          <h2>Заявки</h2>
          <div className="vacation-filter-tabs">
            {userData?.roleId === 1 && (
              <button 
                className={`vacation-tab-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                Все заявки
              </button>
            )}
            <button 
              className={`vacation-tab-btn ${filter === 'my' ? 'active' : ''}`}
              onClick={() => setFilter('my')}
              disabled={userData?.roleId === 2}
            >
              Мои заявки
            </button>
            <button 
              className={`vacation-tab-btn ${filter === 'approved' ? 'active' : ''}`}
              onClick={() => setFilter('approved')}
            >
              Одобренные
            </button>
            <button 
              className={`vacation-tab-btn ${filter === 'rejected' ? 'active' : ''}`}
              onClick={() => setFilter('rejected')}
            >
              Отклоненные
            </button>
          </div>
        </div>

        <div className="vacation-requests-search">
          <h2>Поиск</h2>
          <input
            type="text"
            placeholder="Поиск по ФИО, тегу или отделу"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="vacation-search-input"
          />
        </div>

        <div className="vacation-requests-table-container">
          <table className="vacation-requests-table">
            <thead>
              <tr>
                <th style={{width: '9%'}}>id Заявки</th>
                {userData?.roleId === 1 && <th style={{width: '12%'}}>ФИО</th>}
                <th style={{width: userData?.roleId === 1 ? '15%' : '18%'}}>Тип Отпуска</th>
                <th style={{width: userData?.roleId === 1 ? '15%' : '18%'}}>Дата Начала</th>
                <th style={{width: userData?.roleId === 1 ? '15%' : '18%'}}>Дата Окончания</th>
                <th style={{width: userData?.roleId === 1 ? '15%' : '18%'}}>Статус</th>
                {userData?.roleId === 1 && <th style={{width: '15%'}}>Действия</th>}
              </tr>
            </thead>
            <tbody>
              {searchedApplications?.map((app) => (
                <tr key={app.plannedVacationId}>
                  <td>{app.plannedVacationId}</td>
                  {userData?.roleId === 1 && (
                    <td>{app?.employee?.firstName} {app?.employee?.lastName}</td>
                  )}
                  <td>{app?.vacationType.name}</td>
                  <td>{app?.startDate}</td>
                  <td>{app?.endDate}</td>
                  <td>
                    <span className={`vacation-status-badge ${getStatusClass(app?.vacationStatusId)}`}>
                      {getStatusText(app?.vacationStatusId)}
                    </span>
                    {app?.hasOverlapWithSamePosition && (
                      <span className="overlap-warning" title="Есть пересечение с отпуском сотрудника той же должности">
                        ⚠️
                      </span>
                    )}
                  </td>
                  {userData?.roleId === 1 && (
                    <td>
                      <button 
                        className="vacation-view-btn"
                        onClick={() => {
                          setSelectedApplication(app);
                          setManagerComment(app.managerComment);
                        }}
                        disabled={app.vacationStatusId !== 1}
                      >
                        Рассмотреть
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedApplication && (
        <div className="vacation-modal-overlay">
          <div className="vacation-modal">
            <div className="vacation-modal-content">
              <h2>Заявка №{selectedApplication.plannedVacationId}</h2>
              {selectedApplication.hasOverlapWithSamePosition && (
                <div className="vacation-modal-warning">
                  <span className="overlap-warning">⚠️</span>
                  <p>Внимание! У сотрудника есть пересечение с отпуском другого сотрудника той же должности</p>
                </div>
              )}
              <div className="vacation-modal-details">
                <p><strong>ФИО/тег:</strong> 
                  {selectedApplication.employee.firstName} {selectedApplication?.employee?.lastName} 
                  ({selectedApplication.employee.tag || '-'})
                </p>
                <p><strong>Период отпуска:</strong> {selectedApplication.startDate} - {selectedApplication.endDate}</p>
                <p><strong>Тип отпуска:</strong> {selectedApplication.vacationType.name}</p>
                <p><strong>Комментарий сотрудника:</strong> {selectedApplication.comment || '-'}</p>
                
                <div className="vacation-modal-comment">
                  <label htmlFor="comment">Комментарий руководителя:</label>
                  <textarea
                    id="comment"
                    value={managerComment || ''}
                    onChange={(e) => setManagerComment(e.target.value)}
                    placeholder="Введите комментарий..."
                  />
                </div>
              </div>
              <div className="vacation-modal-actions">
                <button 
                  className="vacation-modal-approve-btn"
                  onClick={() => handleStatusUpdate(2)}
                >
                  Одобрить
                </button>
                <button 
                  className="vacation-modal-reject-btn"
                  onClick={() => handleStatusUpdate(3)}
                >
                  Отклонить
                </button>
                <button 
                  className="vacation-modal-close-btn"
                  onClick={() => setSelectedApplication(null)}
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllVacationsPage;