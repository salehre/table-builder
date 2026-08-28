'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';

interface TableSizeFieldProps {
    icon: string;
    value: number;
    onChange: (value: number) => void;
    title?: string;
    min?: number;
    max?: number;
    size?: 'sm' | 'md';
}

export default function TableSizeField({
                                           icon,
                                           value,
                                           onChange,
                                           title,
                                           min = 1,
                                           max = 200,
                                           size = 'sm',
                                       }: TableSizeFieldProps) {
    const isMd = size === 'md';
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(String(value));
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [editing]);

    function startEdit(e: React.MouseEvent) {
        e.stopPropagation();
        setDraft(String(value));
        setEditing(true);
    }

    function commit() {
        const n = Math.round(Number(draft));
        if (!Number.isNaN(n) && n > 0) {
            onChange(Math.max(min, Math.min(max, n)));
        }
        setEditing(false);
    }

    function cancel() {
        setDraft(String(value));
        setEditing(false);
    }

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className={`flex items-center rounded-md bg-gradient-to-b from-slate-800/80 to-slate-900/80 text-slate-400 shadow-inner shadow-black/30 ${
                isMd ? 'gap-1.5 px-2.5 py-1.5 text-sm' : 'gap-1 px-1.5 py-0.5 text-[11px]'
            }`}
        >
            <Icon
                icon={icon}
                width={isMd ? '18' : '12'}
                height={isMd ? '18' : '12'}
                className="shrink-0 text-slate-500"
            />
            {editing ? (
                <input
                    ref={inputRef}
                    type="number"
                    min={min}
                    max={max}
                    value={draft}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={commit}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') commit();
                        if (e.key === 'Escape') cancel();
                    }}
                    className={`rounded border border-indigo-500 bg-slate-950 text-slate-100 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                        isMd ? 'w-14 px-1.5 py-0.5 text-sm' : 'w-10 px-1 py-0 text-[11px]'
                    }`}
                />
            ) : (
                <button
                    type="button"
                    onClick={startEdit}
                    title={title}
                    className="min-w-[1rem] text-start hover:text-slate-200"
                >
                    {value}
                </button>
            )}
        </div>
    );
}