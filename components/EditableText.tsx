'use client';

import { useEffect, useRef, useState } from 'react';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  inputClassName?: string;
  align?: 'right' | 'center';
}

export default function EditableText({
  value,
  onChange,
  className = '',
  inputClassName = '',
  align = 'right',
}: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function commit() {
    onChange(draft);
    setEditing(false);
  }

  function cancel() {
    setDraft(value);
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') cancel();
        }}
        style={{ direction: 'rtl' }}
        className={`w-full min-w-0 rounded border border-indigo-500 bg-slate-950 px-1.5 py-0.5 shadow-[0_0_0_2px_rgba(99,102,241,0.25)] outline-none ${inputClassName}`}
      />
    );
  }

  return (
    <span
      onDoubleClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      className={`block w-full min-w-0 cursor-default select-none truncate ${
        align === 'center' ? 'text-center' : ''
      } ${className}`}
      title="برای ویرایش دابل‌کلیک کن"
    >
      {value || '\u00A0'}
    </span>
  );
}