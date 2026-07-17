import { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  markedDates?: string[];
}

export function Calendar({ selectedDate, onSelect, markedDates = [] }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "E";
    let startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-semibold text-xs text-zinc-400 dark:text-zinc-500 uppercase py-2">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const dateStr = format(day, 'yyyy-MM-dd');
        const isSelected = isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);
        
        const hasJournal = markedDates.includes(dateStr);
        const isDayToday = isToday(day);

        days.push(
          <div
            key={day.toString()}
            onClick={() => onSelect(cloneDay)}
            className={`
              relative flex items-center justify-center h-10 w-10 mx-auto rounded-full cursor-pointer transition-all
              ${!isCurrentMonth ? 'text-zinc-300 dark:text-zinc-700' : isSelected ? 'bg-teal-600 dark:bg-teal-700 text-white shadow-md' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}
              ${isDayToday && !isSelected ? 'border border-teal-200 dark:border-teal-900/50 text-teal-700 dark:text-teal-400' : ''}
            `}
          >
            <span className="text-sm font-medium">{formattedDate}</span>
            {hasJournal && (
              <span 
                className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-teal-500 dark:bg-teal-400'}`} 
              />
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-y-2" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 shadow-sm">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}
