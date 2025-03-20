import React, { useState, useEffect } from 'react';
import './EmployeesPage.css';
import { useNavigate } from 'react-router-dom';

import { getEmployees } from '@/api/employees';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([])
  useEffect(() => {
    const fetchData = async () => {
        const vacationTypesData = await getEmployees();
        setEmployees(vacationTypesData);
    };
    fetchData();
}, []);

  const [searchTerm, setSearchTerm] = useState('');

  // const filteredEmployees = employees.filter((employee) =>
  //   employee.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const navigate = useNavigate();

  const handleAddVacationClick = () => {
    navigate('/add-vacation'); // Переход на страницу добавления отпуска
  };

  return (
      <div className="main-content">
        <div className="dashboard">
          <div className="content-area">
            <h1>Сотрудники</h1>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Поиск по имени..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="add-vacation-btn" onClick={handleAddVacationClick}>
                Добавить отпуск
              </button>
            </div>
            <table className="employees-table">
            <thead>
              <tr>
                <th>ФИО</th>
                <th>Должность</th>
                <th>Отдел</th>
                {/* <th>Тег</th>
                <th>Дней Накоплено</th> */}
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.firstName}</td>
                  <td>{employee.position?.name}</td>
                  <td>{employee.department?.name}</td>
                  {/* <td>{employee.tag}</td>
                  <td>{employee.daysAccumulated}</td> */}

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
