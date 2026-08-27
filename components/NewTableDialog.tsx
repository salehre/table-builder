'use client';

import {Icon} from '@iconify/react';
import {useTranslation} from 'react-i18next';

interface NewTableDialogProps {
    rowsInput: number | '';
    colsInput: number | '';
    fileName: string;
    setRowsInput: (v: number | '') => void;
    setColsInput: (v: number | '') => void;
    setFileName: (v: string) => void;
    onCreate: () => void;
    onClose: () => void;
    canCancel: boolean;
}

export default function NewTableDialog({
                                           rowsInput,
                                           colsInput,
                                           fileName,
                                           setRowsInput,
                                           setColsInput,
                                           setFileName,
                                           onCreate,
                                           onClose,
                                           canCancel,
                                       }: NewTableDialogProps) {
    const {t} = useTranslation();
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute left-4 top-4 text-slate-500 hover:text-slate-300"
                    title={t('newTable.close')}
                >
                    <Icon icon="ant-design:close-outlined" width="18" height="18"/>
                </button>
                <h2 className="mb-1 text-xl font-bold text-slate-100">{t('newTable.title')}</h2>
                <p className="mb-6 text-sm text-slate-400">
                    {t('newTable.description')}
                </p>

                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-300">
                            {t('newTable.rowsLabel')}
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={200}
                            placeholder={t('newTable.countPlaceholder')}
                            value={rowsInput}
                            onChange={(e) =>
                                setRowsInput(e.target.value === '' ? '' : Number(e.target.value))
                            }
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-300">
                            {t('newTable.colsLabel')}
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={50}
                            placeholder={t('newTable.countPlaceholder')}
                            value={colsInput}
                            onChange={(e) =>
                                setColsInput(e.target.value === '' ? '' : Number(e.target.value))
                            }
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="mb-1 block text-sm font-medium text-slate-300">
                        {t('newTable.fileNameLabel')}
                    </label>
                    <input
                        type="text"
                        value={fileName}
                        placeholder={t('newTable.defaultFileName')}
                        onChange={(e) => setFileName(e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none"
                    />
                </div>

                <div className="flex gap-3">
                    {canCancel && (
                        <button
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-slate-700 px-4 py-2.5 font-medium text-slate-300 hover:bg-slate-800"
                        >
                            {t('common.cancel')}
                        </button>
                    )}
                    <button
                        onClick={onCreate}
                        className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-500"
                    >
                        {t('newTable.create')}
                    </button>
                </div>
            </div>
        </div>
    );
}