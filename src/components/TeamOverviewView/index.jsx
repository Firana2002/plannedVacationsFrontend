import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import SearchInput from '../SearchInput';
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
    <>
      <SearchInput />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Сотрудник, должность</TableCell>
              <TableCell>Отдел</TableCell>
              <TableCell align="center">Дней Накоплено</TableCell>
              <TableCell>Роль</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee, index) => (
              <TableRow key={index}>
                <TableCell>{employee.nameEmployees} ({employee.position})</TableCell>
                <TableCell>{employee.department.nameDepartments}</TableCell>
                {/* <TableCell align="center">{employee.daysAccumulated}</TableCell> */}
                {/* <TableCell>{employee.role}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default EmployeeTable;
