import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployees } from '@/api/employees';
import './EmployeesPage.css';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const loadEmployees = async () => {
      try {
        const data = await getEmployees();
        if (isMounted) setEmployees(data);
      } catch (err) {
        console.error('Error loading employees:', err);
        if (isMounted) setError(err.message || 'Ошибка загрузки данных');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    loadEmployees();
    return () => { isMounted = false };
  }, []);

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.lastName} ${employee.firstName} ${employee.middleName || ''}`.toLowerCase();
    return fullName.includes(searchTerm);
  });

  if (loading) return <div className="loading-state">Загрузка...</div>;
  if (error) return <div className="error-state">Ошибка: {error}</div>;

  return (
    <div className="vacation-requests-container">
      <div className="vacation-requests-section">
            <div className="employees-page">
              <div className="header-controls">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Поиск сотрудника..."
                  onChange={handleSearch}
                />
                 
                  
              </div>

              <table className="employees-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>ФИО</th>
                    <th>Должность</th>
                    <th>Отдел</th>
                    <th>Роль</th>
                    <th>Дни отпуска</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map(employee => (
                    <tr 
                      key={employee.employeeId} 
                      onClick={() => navigate(`/employees/${employee.employeeId}`)}
                    >
                      <td>{employee.employeeId}</td>
                      <td>{`${employee.lastName} ${employee.firstName} ${employee.middleName || ''}`}</td>
                      <td>{employee.position?.name || '-'}</td>
                      <td>{employee.department?.name || '-'}</td>
                      <td>
                        <span className={`role-badge role-badge--${employee.role?.nameRole.toLowerCase()}`}>
                          {employee.role?.nameRole}
                        </span>
                      </td>
                      <td>{employee.accumulatedVacationDays}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
     
  );
};

export default EmployeesPage;
