import React, { useEffect, useState } from 'react';
import { getEmployees } from '@/api/employees';

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Ошибка при получении сотрудников:", error);
      }
    };

    fetchEmployees();
  }, []);

  return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b">Сотрудник, должность</th>
              <th className="py-2 px-4 border-b">Отдел</th>
              <th className="py-2 px-4 border-b text-center">Дней Накоплено</th>
              <th className="py-2 px-4 border-b">Роль</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{employee.nameEmployees} ({employee.position})</td>
                <td className="py-2 px-4 border-b">{employee.department.nameDepartments}</td>
                {/* <td className="py-2 px-4 border-b text-center">{employee.daysAccumulated}</td> */}
                {/* <td className="py-2 px-4 border-b">{employee.role}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
};

export default EmployeeTable;
