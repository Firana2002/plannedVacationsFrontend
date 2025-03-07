import React from 'react';
import './style.css';

function VacationScheduleTable() {
  const vacationData = [
    { part: '1 часть', dates: '12 сентября - 18 сентября', days: 6 },
    { part: '2 часть', dates: '12 сентября - 18 сентября', days: 6 },
    { part: '3 часть', dates: '12 сентября - 18 сентября', days: 6 },
  ];

  return (
    <div className="overflow-x-auto vacation-table-container">
      <table className="min-w-full bg-white border border-gray-300 vacation-table">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b" />
            <th className="py-2 px-4 border-b vacation-days-heading">Дни отпуска</th>
            <th className="py-2 px-4 border-b vacation-days-heading">Кол в дн</th>
          </tr>
        </thead>
        <tbody>
          {vacationData.map((vacation, index) => (
            <tr key={index} className="hover:bg-gray-100 vacation-details-row">
              <td className="py-2 px-4 border-b vacation-details-row1">
                <p className="vacation-part-label-style">{vacation.part}</p>
              </td>
              <td className="py-2 px-4 border-b vacation-details-row1">
                <p className="vacation-info-style">{vacation.dates}</p>
              </td>
              <td className="py-2 px-4 border-b vacation-details-row1">
                <p className="vacation-info-style">{vacation.days}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VacationScheduleTable;
