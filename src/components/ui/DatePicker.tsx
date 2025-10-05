'use client';

import React, { useState } from 'react';
import { Input } from './Input';
import { formatDate } from '@/utils/dateUtils';

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePicker({
  value,
  onChange,
  placeholder = '选择日期',
  label,
  error,
  disabled = false,
  fullWidth = false,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [inputValue, setInputValue] = useState(value ? formatDate(value) : '');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = event.target.value;
    setInputValue(dateString);

    if (dateString) {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        // 检查日期范围
        if (minDate && date < minDate) return;
        if (maxDate && date > maxDate) return;

        onChange(date);
      }
    } else {
      onChange(undefined);
    }
  };

  // 格式化日期为 HTML input[type="date"] 格式
  const formatForInput = (date?: Date): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const minDateString = minDate ? formatForInput(minDate) : undefined;
  const maxDateString = maxDate ? formatForInput(maxDate) : undefined;

  return (
    <Input
      type="date"
      value={formatForInput(value)}
      onChange={handleInputChange}
      placeholder={placeholder}
      label={label}
      error={error}
      disabled={disabled}
      fullWidth={fullWidth}
      min={minDateString}
      max={maxDateString}
      leftIcon={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      }
    />
  );
}
