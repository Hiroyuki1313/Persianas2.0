import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import './DatePicker.css';

interface DatePickerProps {
  label: string;
  value: string; // ISO format YYYY-MM-DD
  onChange: (value: string) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parse initial value or default to today
  const selectedDate = value ? new Date(value + 'T00:00:00') : new Date();
  const [viewDate, setViewDate] = useState(new Date(selectedDate));

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysOfWeek = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  useEffect(() => {
    if (isOpen && containerRef.current) {
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const isoDate = newDate.toISOString().split('T')[0];
    onChange(isoDate);
    setIsOpen(false);
  };

  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty slots for the first week
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate.getDate() === day && 
                         selectedDate.getMonth() === month && 
                         selectedDate.getFullYear() === year;
      
      const isToday = new Date().getDate() === day && 
                      new Date().getMonth() === month && 
                      new Date().getFullYear() === year;

      days.push(
        <button
          key={day}
          type="button"
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => handleDateSelect(day)}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  return (
    <div className="datepicker-container" ref={containerRef}>
      <label className="input-label">{label}</label>
      <div 
        className={`datepicker-input ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="current-value">
          {value ? new Date(value + 'T00:00:00').toLocaleDateString('es-MX', { 
            day: '2-digit', month: 'long', year: 'numeric' 
          }) : 'Seleccionar fecha...'}
        </span>
        <CalendarIcon size={18} className="calendar-icon" />
      </div>

      {isOpen && (
        <div className="calendar-popover">
          <header className="calendar-header">
            <button type="button" onClick={handlePrevMonth} className="nav-btn">
              <ChevronLeft size={20} />
            </button>
            <span className="month-year">
              {months[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button type="button" onClick={handleNextMonth} className="nav-btn">
              <ChevronRight size={20} />
            </button>
          </header>

          <div className="calendar-grid">
            {daysOfWeek.map((day, index) => (
              <div key={`${day}-${index}`} className="day-name">{day}</div>
            ))}
            {renderCalendar()}
          </div>
        </div>
      )}
    </div>
  );
};
