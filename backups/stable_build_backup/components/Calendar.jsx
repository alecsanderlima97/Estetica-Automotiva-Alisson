import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const numDays = daysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }
  for (let d = 1; d <= numDays; d++) {
    const isToday = d === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
    days.push(
      <div key={d} className={`calendar-day ${isToday ? 'today' : ''}`}>
        {d}
      </div>
    );
  }

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevMonth}><ChevronLeft size={18} /></button>
        <h3>{monthNames[month]} {year}</h3>
        <button onClick={nextMonth}><ChevronRight size={18} /></button>
      </div>
      <div className="calendar-weekdays">
        <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
      </div>
      <div className="calendar-grid">
        {days}
      </div>

      <style>{`
        .calendar-container {
          background: rgba(0,0,0,0.2);
          border-radius: 12px;
          padding: 16px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .calendar-header h3 {
          margin: 0;
          font-size: 16px;
          color: white;
        }
        .calendar-header button {
          background: transparent;
          border: none;
          color: var(--primary-color);
          cursor: pointer;
        }
        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-size: 10px;
          color: #666;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }
        .calendar-day {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          color: #ccc;
          border-radius: 6px;
          border: 1px solid transparent;
        }
        .calendar-day.today {
          background: var(--primary-color);
          color: white;
          font-weight: bold;
        }
        .calendar-day:not(.empty):hover {
          background: rgba(255,255,255,0.05);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Calendar;
