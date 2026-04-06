import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

const Calendar = () => {
  const { agendamentos } = useData();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = (e) => {
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = (e) => {
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const dayClick = (d) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
    // Armazenando temporariamente para redirecionar o filtro da agenda
    localStorage.setItem('agenda_filtro_data', selected.toLocaleDateString('pt-BR'));
    navigate('/agenda');
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
    const dateStr = `${d.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`;
    const hasAgendamentos = agendamentos.some(a => a.dataStr === dateStr);

    days.push(
      <div 
        key={d} 
        className={`calendar-day ${isToday ? 'today' : ''}`}
        onClick={() => dayClick(d)}
        style={{ position: 'relative' }}
      >
        {d}
        {hasAgendamentos && (
          <div style={{
            position: 'absolute',
            bottom: '4px',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: isToday ? 'white' : 'var(--primary-color)'
          }}></div>
        )}
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
        <button onClick={prevMonth} type="button"><ChevronLeft size={18} /></button>
        <h3>{monthNames[month]} {year}</h3>
        <button onClick={nextMonth} type="button"><ChevronRight size={18} /></button>
      </div>
      <div className="calendar-weekdays">
        <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
      </div>
      <div className="calendar-grid">
        {days}
      </div>

      <style>{`
        .calendar-container {
          background: rgba(0,0,0,0.1);
          border-radius: 12px;
          padding: 12px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .calendar-header h3 {
          margin: 0;
          font-size: 14px;
          color: white;
          font-weight: bold;
        }
        .calendar-header button {
          background: rgba(255,255,255,0.05);
          border: none;
          color: var(--primary-color);
          cursor: pointer;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-size: 9px;
          color: #888;
          text-transform: uppercase;
          margin-bottom: 6px;
          font-weight: bold;
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }
        .calendar-day {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #ccc;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .calendar-day.today {
          background: var(--primary-color);
          color: white;
          font-weight: bold;
          box-shadow: 0 4px 10px rgba(var(--primary-rgb), 0.3);
        }
        .calendar-day:not(.empty):hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }
        .calendar-day.empty {
          cursor: default;
        }
      `}</style>
    </div>
  );
};

export default Calendar;
