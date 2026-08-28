'use client';

import {useTranslation} from 'react-i18next';

interface ConfirmDialogProps {
    title: string;
    description: string;
    confirmLabel: string;
    danger?: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

export default function ConfirmDialog({
                                          title,
                                          description,
                                          confirmLabel,
                                          danger = false,
                                          onConfirm,
                                          onClose,
                                      }: ConfirmDialogProps) {
    const {t} = useTranslation();
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-800 to-slate-900 p-7 shadow-2xl shadow-black/60">
                <h2 className="mb-2 text-lg font-bold text-slate-100">{title}</h2>
                <p className="mb-6 text-sm leading-6 text-slate-400">{description}</p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-lg border border-slate-700 px-4 py-2.5 font-medium text-slate-300 hover:bg-slate-800"
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 rounded-lg px-4 py-2.5 font-medium text-white shadow-md transition hover:-translate-y-px hover:shadow-lg ${
                            danger
                                ? 'bg-gradient-to-b from-red-500 to-red-700 shadow-red-950/50 hover:from-red-400 hover:to-red-600 hover:shadow-red-900/50'
                                : 'bg-gradient-to-b from-indigo-500 to-indigo-700 shadow-indigo-950/50 hover:from-indigo-400 hover:to-indigo-600 hover:shadow-indigo-900/50'
                        }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}