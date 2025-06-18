'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormLabel } from '@/components/ui/form';

import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

// eslint-disable-next-line react/prop-types
export default function DateTimePicker({ value, onChange, label = 'Select Date & Time (12h)' }) {
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);

  // useEffect(() => {
  //   if (onChange) {
  //     onChange(selectedDate ? selectedDate.toISOString() : null);
  //   }
  // }, [selectedDate]);

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  const handleDateSelect = date => {
    if (date) {
      const newDate = selectedDate ? new Date(selectedDate) : new Date();
      newDate.setFullYear(date.getFullYear());
      newDate.setMonth(date.getMonth());
      newDate.setDate(date.getDate());
      setSelectedDate(newDate);
      onChange?.(newDate.toISOString()); // new add
    }
  };

  const handleTimeChange = (type, val) => {
    if (!selectedDate) return;
    const newDate = new Date(selectedDate);

    if (type === 'hour') {
      let hour = parseInt(val, 10);
      const isPM = newDate.getHours() >= 12;
      if (isPM && hour !== 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;
      newDate.setHours(hour);
    }

    if (type === 'minute') {
      newDate.setMinutes(parseInt(val, 10));
    }

    if (type === 'ampm') {
      let hours = newDate.getHours();
      if (val === 'AM' && hours >= 12) {
        newDate.setHours(hours - 12);
      }
      if (val === 'PM' && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }

    setSelectedDate(newDate);
    onChange?.(newDate.toISOString()); // ✅ update form field
  };

  const clearDateTime = () => {
    setSelectedDate(null);
    onChange?.(null);
  };

  return (
    <div className="space-y-2 w-full">
      <FormLabel>{label}</FormLabel>
      <div className="flex items-start gap-2 w-full">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" type="button" className="w-full justify-between h-[48px]">
              {selectedDate ? (
                format(selectedDate, 'MM/dd/yyyy hh:mm aa')
              ) : (
                <span>MM/DD/YYYY hh:mm aa</span>
              )}
              <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-full max-w-[600px]">
            <div className="sm:flex">
              <div className="flex flex-col">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                />
                <Button
                  variant="destructive"
                  size="sm"
                  type="button"
                  className="mt-2 self-start m-4"
                  onClick={clearDateTime}
                >
                  Clear
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                <ScrollArea className="sm:w-20">
                  <div className="flex sm:flex-col p-2">
                    {Array.from({ length: 12 }, (_, i) => i + 1)
                      .reverse()
                      .map(hour => (
                        <Button
                          key={hour}
                          size="icon"
                          variant={
                            selectedDate && selectedDate.getHours() % 12 === hour % 12
                              ? 'default'
                              : 'ghost'
                          }
                          className="sm:w-full aspect-square"
                          onClick={() => handleTimeChange('hour', hour.toString())}
                          disabled={!selectedDate}
                        >
                          {hour}
                        </Button>
                      ))}
                  </div>
                  <ScrollBar orientation="vertical" className="sm:hidden" />
                </ScrollArea>

                <ScrollArea className="sm:w-20">
                  <div className="flex sm:flex-col p-2">
                    {Array.from({ length: 60 }, (_, i) => i).map(minute => (
                      <Button
                        key={minute}
                        size="icon"
                        variant={
                          selectedDate && selectedDate.getMinutes() === minute ? 'default' : 'ghost'
                        }
                        className="sm:w-full aspect-square"
                        onClick={() => handleTimeChange('minute', minute.toString())}
                        disabled={!selectedDate}
                      >
                        {minute.toString().padStart(2, '0')}
                      </Button>
                    ))}
                  </div>
                  <ScrollBar orientation="vertical" className="sm:hidden" />
                </ScrollArea>

                <ScrollArea className="sm:w-20">
                  <div className="flex sm:flex-col p-2">
                    {['AM', 'PM'].map(ampm => (
                      <Button
                        key={ampm}
                        size="icon"
                        variant={
                          selectedDate &&
                          ((ampm === 'AM' && selectedDate.getHours() < 12) ||
                            (ampm === 'PM' && selectedDate.getHours() >= 12))
                            ? 'default'
                            : 'ghost'
                        }
                        className="sm:w-full aspect-square"
                        onClick={() => handleTimeChange('ampm', ampm)}
                        disabled={!selectedDate}
                      >
                        {ampm}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          type="button"
          className="my-auto h-[48px]"
          onClick={clearDateTime}
        >
          <span className=" text-red-500">Clear</span>
          <X className="w-[38px] h-[38px] text-red-500" />
        </Button>
      </div>
    </div>
  );
}
