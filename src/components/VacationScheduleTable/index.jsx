import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import './style.css';

function VacationScheduleTable() {
  const vacationData = [
    { part: '1 часть', dates: '12 сентября - 18 сентября', days: 6 },
    { part: '2 часть', dates: '12 сентября - 18 сентября', days: 6 },
    { part: '3 часть', dates: '12 сентября - 18 сентября', days: 6 },
  ];

  return (
    <TableContainer component={Paper} className="vacation-table-container">
      <Table className="vacation-table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell className="vacation-days-heading">Дни отпуска</TableCell>
            <TableCell className="vacation-days-heading">Кол в дн</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vacationData.map((vacation, index) => (
            <TableRow key={index} className="vacation-details-row">
              <TableCell className="vacation-details-row1">
                <p className="vacation-part-label-style">{vacation.part}</p>
              </TableCell>
              <TableCell className="vacation-details-row1">
                <p className="vacation-info-style">{vacation.dates}</p>
              </TableCell>
              <TableCell className="vacation-details-row1">
                <p className="vacation-info-style">{vacation.days}</p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default VacationScheduleTable;
