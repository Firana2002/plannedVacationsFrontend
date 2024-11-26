import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';

export default function CalendarPage() {
  const months = Array.from({ length: 12 }, (_, index) => dayjs().month(index));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {months.map((month) => (
          <div key={month.format('MMMM')} style={{ margin: '10px' }}>
            <DateCalendar value={month} />
          </div>
        ))}
      </div>
    </LocalizationProvider>
  );
}
