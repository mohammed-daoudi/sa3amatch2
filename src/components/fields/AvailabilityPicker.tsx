import React from 'react';
import { format } from 'date-fns';

interface TimeSlot {
  hour: number;
  isAvailable: boolean;
}

interface AvailabilityDay {
  date: string;
  slots: TimeSlot[];
}

interface AvailabilityPickerProps {
  availability: AvailabilityDay[];
  onSelect: (date: string, hour: number) => void;
  selectedDate?: string;
  selectedHour?: number;
}

const AvailabilityPicker: React.FC<AvailabilityPickerProps> = ({
  availability,
  onSelect,
  selectedDate,
  selectedHour,
}) => {
  const [activeDay, setActiveDay] = React.useState<string>(selectedDate || availability[0]?.date);

  const getDaySlots = () => {
    const day = availability.find((day) => day.date === activeDay);
    return day?.slots || [];
  };

  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'EEE, MMM d');
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    return date.getTime() === today.getTime();
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold mb-2">Select Date & Time</div>

      {/* Date selector */}
      <div className="flex overflow-x-auto py-2 gap-2 pb-4 scrollbar-hide">
        {availability.map((day) => (
          <button
            key={day.date}
            onClick={() => setActiveDay(day.date)}
            className={`flex flex-col items-center min-w-[80px] p-2 rounded-md transition-colors ${
              activeDay === day.date
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <span className="text-xs font-medium">
              {isToday(day.date) ? 'Today' : formatDateDisplay(day.date)}
            </span>
            <span className="text-xs opacity-80 mt-1">
              {format(new Date(day.date), 'MMM d')}
            </span>
          </button>
        ))}
      </div>

      {/* Time slot grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-4">
        {getDaySlots().map((slot) => (
          <button
            key={slot.hour}
            disabled={!slot.isAvailable}
            onClick={() => slot.isAvailable && onSelect(activeDay, slot.hour)}
            className={`py-2 px-3 rounded-md text-center transition-colors ${
              selectedDate === activeDay && selectedHour === slot.hour
                ? 'bg-primary-500 text-white'
                : slot.isAvailable
                ? 'bg-white border border-gray-200 hover:border-primary-500 text-gray-800'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span className="text-sm font-medium">{`${slot.hour}:00`}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AvailabilityPicker;
