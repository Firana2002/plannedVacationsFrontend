import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  format, startOfYear, endOfYear, eachMonthOfInterval,
  startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth,
  isSameDay, parseISO 
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { getEmployeeVacationDays, deleteEmployeeVacationDay } from '@/api/EmployeeVacationDays';
import "./EmployeeVacationDaysPage.css";

const EmployeeVacationDaysPage = () => {
  const userData = useSelector((state) => state.user.userData);
  const [vacationDays, setVacationDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const [selectedVacation, setSelectedVacation] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vacationToDelete, setVacationToDelete] = useState(null);
  const timeoutRef = useRef();
  const navigate = useNavigate();

  const selectedYear = searchParams.get('year') || new Date().getFullYear();
  const isManager = userData?.roleId === 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEmployeeVacationDays();
        const filteredData = data.filter(vacation => {
          const startDate = parseISO(vacation.startDate);
          const endDate = parseISO(vacation.endDate);
          return startDate.getFullYear() === parseInt(selectedYear) || 
                 endDate.getFullYear() === parseInt(selectedYear);
        });
        setVacationDays(filteredData);
      } catch (error) {
        setError(error.message || "Произошла ошибка при загрузке отпусков");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedYear]);

  const handleMouseEnter = (vacation, e) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setSelectedVacation(vacation);
      setTooltipPos({ x: e.clientX, y: e.clientY });
      setShowTooltip(true);
    }, 50);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
      setSelectedVacation(null);
    }, 50);
  };

  // Новые обработчики для tooltip
  const handleTooltipMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setShowTooltip(true);
  };

  const handleTooltipMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    setShowTooltip(false);
    setSelectedVacation(null);
  };

  const calculateDaysCount = (startDate, endDate) => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleAddVacationDaysClick = () => {
    navigate('/create-vacation');
  };

  const handleEditVacation = (vacation) => {
    navigate(`/edit-vacation/${vacation.employeeVacationDaysId}`);
  };

  const handleDeleteConfirmation = (vacation) => {
    setVacationToDelete(vacation);
    setShowDeleteModal(true);
  };

  const handleDeleteVacation = async () => {
    try {
      await deleteEmployeeVacationDay(vacationToDelete.employeeVacationDaysId);
      setVacationDays(prev => prev.filter(v => v.employeeVacationDaysId !== vacationToDelete.employeeVacationDaysId));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

  const getEmployeeColor = (employee) => {
    if (!employee) return '#cccccc';
    const seed = employee.id || `${employee.firstName}${employee.lastName}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    const s = 60 + (hash >> 8 & 0x1F);
    const l = 40 + (hash >> 13 & 0x0F);
    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  const filteredVacationDays = vacationDays.filter(day => {
    const searchLower = searchTerm.toLowerCase();
    return (
      day.employee?.firstName?.toLowerCase().includes(searchLower) ||
      day.employee?.lastName?.toLowerCase().includes(searchLower)
    );
  });

  const processVacations = (vacations) => {
    const processed = {};
    vacations.forEach(vacation => {
      const start = parseISO(vacation.startDate);
      const end = parseISO(vacation.endDate);
      const days = eachDayOfInterval({ start, end });
      days.forEach(day => {
        const monthKey = format(day, 'yyyy-MM');
        const dayKey = format(day, 'yyyy-MM-dd');
        if (!processed[monthKey]) processed[monthKey] = {};
        if (!processed[monthKey][dayKey]) processed[monthKey][dayKey] = [];
        processed[monthKey][dayKey].push({
          ...vacation,
          color: getEmployeeColor(vacation.employee)
        });
      });
    });
    return processed;
  };

  const generateYearCalendar = (year) => {
    const start = startOfYear(new Date(year, 0, 1));
    const end = endOfYear(start);
    return eachMonthOfInterval({ start, end });
  };

  const renderMonth = (monthDate) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const monthKey = format(monthDate, 'yyyy-MM');
    const processedVacations = processVacations(filteredVacationDays);

    return (
      <div key={monthKey} className="calendar-month">
        <h3>{format(monthDate, 'LLLL yyyy', { locale: ru })}</h3>
        <div className="calendar-grid">
          {daysInMonth.map(day => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const vacations = processedVacations[monthKey]?.[dayKey] || [];
            
            return (
              <div 
                key={dayKey}
                className={`calendar-day ${!isSameMonth(day, monthDate) ? 'calendar-day--outside' : ''}`}
              >
                <div className="day-number">{format(day, 'd')}</div>
                <div className="vacation-blocks">
                  {vacations.map((vacation, idx) => {
                    const isStart = isSameDay(day, parseISO(vacation.startDate));
                    const isEnd = isSameDay(day, parseISO(vacation.endDate));
                    
                    return (
                      <div
                        key={idx}
                        className="vacation-block"
                        style={{ 
                          backgroundColor: vacation.color,
                          borderRadius: isStart && isEnd ? '4px' :
                            isStart ? '4px 0 0 4px' :
                            isEnd ? '0 4px 4px 0' : '0'
                        }}
                        onMouseEnter={(e) => handleMouseEnter(vacation, e)}
                        onMouseLeave={handleMouseLeave}
                        onMouseMove={(e) => setTooltipPos({ x: e.clientX, y: e.clientY })}
                      >
                        {isStart && (
                          <span className="vacation-label">
                            {vacation.employee.firstName} {vacation.employee.lastName} {vacation.vacationType.name}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Tooltip с обработчиками onMouseEnter/onMouseLeave
  const renderTooltip = () => {
    if (!showTooltip || !selectedVacation) return null;
    const start = format(parseISO(selectedVacation.startDate), 'dd.MM.yyyy');
    const end = format(parseISO(selectedVacation.endDate), 'dd.MM.yyyy');
    
    return (
      <div 
        className={`vacation-tooltip ${showTooltip ? 'show' : ''}`}
        style={{
          left: `${tooltipPos.x + 15}px`,
          top: `${tooltipPos.y + 15}px`,
          position: 'fixed',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 1000,
          minWidth: '220px'
        }}
        onMouseEnter={handleTooltipMouseEnter}
        onMouseLeave={handleTooltipMouseLeave}
      >
        <div className="tooltip-header" style={{ backgroundColor: selectedVacation.color, padding: '6px', borderRadius: '4px 4px 0 0', color: '#fff', fontWeight: 600 }}>
          {selectedVacation.employee.firstName} {selectedVacation.employee.lastName}
          {isManager && (
            <div className="tooltip-actions" style={{ float: 'right' }}>
              <button 
                className="edit-btn"
                onClick={() => handleEditVacation(selectedVacation)}
                style={{ marginRight: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontSize: '16px' }}
                title="Редактировать"
              >
                ✏️
              </button>
              <button 
                className="delete-btn"
                onClick={() => handleDeleteConfirmation(selectedVacation)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontSize: '16px' }}
                title="Удалить"
              >
                🗑️
              </button>
            </div>
          )}
        </div>
        <div className="tooltip-body" style={{ padding: '8px 0' }}>
          <p>Тип отпуска: {selectedVacation.vacationType.name}</p>
          <p>Период: {start} - {end}</p>
          <p>Всего дней: {calculateDaysCount(selectedVacation.startDate, selectedVacation.endDate)}</p>
        </div>
      </div>
    );
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="vacation-calendar-container">
      <div className="header-controls">
        <h2>{selectedYear} год - График отпусков</h2>
        <div className="controls-wrapper">
          <input
            type="text"
            placeholder="Поиск по сотруднику..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {isManager && (
            <button 
              className="add-vacation-btn"
              onClick={handleAddVacationDaysClick}
            >
              + Добавить отпуск
            </button>
          )}
        </div>
      </div>

      <div className="calendar-view">
        {generateYearCalendar(selectedYear).map(monthDate => renderMonth(monthDate))}
      </div>

      {renderTooltip()}

      {showDeleteModal && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <h3>Подтверждение удаления</h3>
            <p>Вы уверены, что хотите удалить отпуск сотрудника {vacationToDelete?.employee?.firstName}?</p>
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Отмена
              </button>
              <button 
                className="confirm-delete-btn"
                onClick={handleDeleteVacation}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeVacationDaysPage;
