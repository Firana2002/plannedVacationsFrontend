import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployeeVacationDay, updateEmployeeVacationDay } from '@/api/EmployeeVacationDays';
import './EditVacationPage.css';

const EditVacationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vacationData, setVacationData] = useState({
    startDate: '',
    endDate: '',
    vacationTypeId: ''
  });

  useEffect(() => {
    const fetchVacationData = async () => {
      try {
        const data = await getEmployeeVacationDay(id);
        setVacationData({
          startDate: data.startDate,
          endDate: data.endDate,
          vacationTypeId: data.vacationTypeId
        });
      } catch (error) {
        setError('Ошибка при загрузке данных отпуска: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVacationData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEmployeeVacationDay(id, vacationData);
      navigate('/vacation-days');
    } catch (error) {
      setError('Ошибка при обновлении отпуска: ' + error.message);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="edit-vacation-container">
      <h2>Редактирование отпуска</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Дата начала:</label>
          <input
            type="date"
            value={vacationData.startDate}
            onChange={(e) => setVacationData(prev => ({ ...prev, startDate: e.target.value }))}
            required
          />
        </div>
        <div className="form-group">
          <label>Дата окончания:</label>
          <input
            type="date"
            value={vacationData.endDate}
            onChange={(e) => setVacationData(prev => ({ ...prev, endDate: e.target.value }))}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit">Сохранить</button>
          <button type="button" onClick={() => navigate('/vacation-days')}>Отмена</button>
        </div>
      </form>
    </div>
  );
};

export default EditVacationPage; 