'use client';

import {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';

interface EditableTextProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    inputClassName?: string;
    align?: 'right' | 'center';
    dir?: 'rtl' | 'ltr';
}

export default function EditableText({
                                         value,
                                         onChange,
                                         className = '',
                                         inputClassName = '',
                                         align = 'right',
                                         dir = 'rtl',
                                     }: EditableTextProps) {
    const {t} = useTranslation();
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

    function startEdit() {
        setDraft(value);
        setEditing(true);
    }

    return (
        <div
            onDoubleClick={startEdit}
            className={`flex h-full w-full flex-1 min-w-0 items-center ${
                align === 'center' ? 'justify-center' : ''
            } cursor-default select-none`}
        >
            {editing ? (
                <input
                    ref={inputRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={commit}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') commit();
                        if (e.key === 'Escape') cancel();
                    }}
                    style={{direction: dir}}
                    className={`w-full min-w-0 rounded border border-indigo-500 bg-slate-950 px-1.5 py-0.5 shadow-[0_0_0_2px_rgba(99,102,241,0.25)] outline-none ${inputClassName}`}
                />
            ) : (
                <span
                    title={t('editableText.editHint')}
                    className={`block w-full min-w-0 truncate ${
                        align === 'center' ? 'text-center' : ''
                    } ${className}`}
                >
          {value || '\u00A0'}
        </span>
            )}
        </div>
    );
}