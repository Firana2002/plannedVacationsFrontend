import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import SearchInput from '../SearchInput'

const EmployeeTable = () => {
  const employees = [
    { name: 'Тарнуева Номина', position: 'Дизайнер', department: 'Отдел 1', daysAccumulated: 10, role: 'Роль 1' },
    { name: 'Тарнуева Номина', position: 'Дизайнер', department: 'Отдел 2', daysAccumulated: 15, role: 'Роль 2' },
    { name: 'Тарнуева Номина', position: 'Дизайнер', department: 'Отдел 3', daysAccumulated: 20, role: 'Роль 3' },
    { name: 'Тарнуева Номина', position: 'Дизайнер', department: 'Отдел 4', daysAccumulated: 5, role: 'Роль 4' },
  ];

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
                <TableCell>{employee.name} ({employee.position})</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell align="center">{employee.daysAccumulated}</TableCell>
                <TableCell>{employee.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default EmployeeTable;
