'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast, Toaster } from 'sonner';
import '@/lib/i18n';
import { exportToWord, exportToExcel, exportToSQL } from '@/lib/export';
import { loadTables, saveTables, createTableId, StoredTable } from '@/lib/storage';
import EditableText from './EditableText';
import NewTableDialog from './NewTableDialog';
import ConfirmDialog from './ConfirmDialog';
import TableSizeField from './Tablesizefield';
import { Icon } from '@iconify/react';

const DEFAULT_COL_WIDTH = 130;
const DEFAULT_ROW_HEIGHT = 40;
const MIN_COL_WIDTH = 50;
const MIN_ROW_HEIGHT = 28;

function reorder<T>(arr: T[], from: number, to: number): T[] {
    const copy = [...arr];
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item);
    return copy;
}

export default function TableBuilder() {
    const { t, i18n } = useTranslation();
    const direction = i18n.language === 'fa' ? 'rtl' : 'ltr';

    function toggleLanguage() {
        i18n.changeLanguage(direction === 'rtl' ? 'en' : 'fa');
    }

    useEffect(() => {
        document.documentElement.lang = i18n.language;
        document.documentElement.dir = direction;
    }, [i18n.language, direction]);

    const [initialized, setInitialized] = useState(false);
    const [rowsInput, setRowsInput] = useState<number | ''>(4);
    const [colsInput, setColsInput] = useState<number | ''>(4);
    const [fileName, setFileName] = useState('جدول-من');
    const [newTableFileName, setNewTableFileName] = useState('');
    const [showNewTableDialog, setShowNewTableDialog] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [confirmAction, setConfirmAction] = useState<
        'word' | 'excel' | 'sql' | 'delete' | null
    >(null);
    const exportMenuRef = useRef<HTMLDivElement>(null);

    const [cells, setCells] = useState<string[][]>([]);
    const [colWidths, setColWidths] = useState<number[]>([]);
    const [rowHeights, setRowHeights] = useState<number[]>([]);
    const [colNames, setColNames] = useState<string[]>([]);
    const [rowNames, setRowNames] = useState<string[]>([]);

    const [tables, setTables] = useState<StoredTable[]>([]);
    const [currentTableId, setCurrentTableId] = useState<string | null>(null);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    useEffect(() => {
        setTables(loadTables());
    }, []);

    useEffect(() => {
        if (!initialized || !currentTableId) return;
        setTables((prev) => {
            if (!prev.some((tb) => tb.id === currentTableId)) return prev;
            const updated = prev.map((tb) =>
                tb.id === currentTableId
                    ? { ...tb, name: fileName, cells, colWidths, rowHeights, colNames, rowNames, updatedAt: Date.now() }
                    : tb
            );
            saveTables(updated);
            return updated;
        });
    }, [cells, colWidths, rowHeights, colNames, rowNames, fileName, initialized, currentTableId]);

    const dragColIndex = useRef<number | null>(null);
    const dragRowIndex = useRef<number | null>(null);
    const [dragOverCol, setDragOverCol] = useState<number | null>(null);
    const [dragOverRow, setDragOverRow] = useState<number | null>(null);

    const resizingRef = useRef<{
        type: 'col' | 'row';
        index: number;
        startPos: number;
        startSize: number;
    } | null>(null);

    useEffect(() => {
        if (!showExportMenu) return;
        function handleOutsideClick(e: MouseEvent) {
            if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
                setShowExportMenu(false);
            }
        }
        window.addEventListener('mousedown', handleOutsideClick);
        return () => window.removeEventListener('mousedown', handleOutsideClick);
    }, [showExportMenu]);

    function createTable() {
        if (!newTableFileName.trim()) {
            toast.error(t('toast.tableNameRequired'));
            return;
        }
        const r = Math.max(1, Math.min(200, Number(rowsInput) || 0));
        const c = Math.max(1, Math.min(50, Number(colsInput) || 0));
        const newCells: string[][] = Array.from({ length: r }, () =>
            Array.from({ length: c }, () => '')
        );
        const newColWidths = Array.from({ length: c }, () => DEFAULT_COL_WIDTH);
        const newRowHeights = Array.from({ length: r }, () => DEFAULT_ROW_HEIGHT);
        const newColNames = Array.from({ length: c }, (_, i) => `${t('table.columnPrefix')} ${i + 1}`);
        const newRowNames = Array.from({ length: r }, (_, i) => `${t('table.rowPrefix')} ${i + 1}`);
        const name = newTableFileName.trim();
        const id = createTableId();

        setTables((prev) => {
            const updated = [
                ...prev,
                {
                    id,
                    name,
                    cells: newCells,
                    colWidths: newColWidths,
                    rowHeights: newRowHeights,
                    colNames: newColNames,
                    rowNames: newRowNames,
                    updatedAt: Date.now(),
                },
            ];
            saveTables(updated);
            return updated;
        });

        setCells(newCells);
        setColWidths(newColWidths);
        setRowHeights(newRowHeights);
        setColNames(newColNames);
        setRowNames(newRowNames);
        setFileName(name);
        setCurrentTableId(id);
        setInitialized(true);
        setShowNewTableDialog(false);
        toast.success(t('toast.tableCreated', { name }));
    }

    function openTable(id: string) {
        const tb = tables.find((t) => t.id === id);
        if (!tb) return;
        setCurrentTableId(id);
        setCells(tb.cells);
        setColWidths(tb.colWidths);
        setRowHeights(tb.rowHeights);
        setColNames(tb.colNames);
        setRowNames(tb.rowNames);
        setFileName(tb.name);
        setInitialized(true);
    }

    function openNewTableDialog() {
        setRowsInput('');
        setColsInput('');
        setNewTableFileName('');
        setShowNewTableDialog(true);
    }

    function deleteTableById(id: string) {
        setTables((prev) => {
            const updated = prev.filter((tb) => tb.id !== id);
            saveTables(updated);
            return updated;
        });
        if (id === currentTableId) {
            setCurrentTableId(null);
            setCells([]);
            setColWidths([]);
            setRowHeights([]);
            setColNames([]);
            setRowNames([]);
            setInitialized(false);
        }
    }

    function deleteTable() {
        if (currentTableId) deleteTableById(currentTableId);
    }

    // --- تنظیم دستی تعداد ردیف/ستون یک جدول (چه بازِ فعلی باشه چه نباشه) ---
    function setTableRowCount(id: string, desiredRows: number) {
        const r = Math.max(1, Math.min(200, Math.round(desiredRows) || 1));

        if (id === currentTableId) {
            const current = cells.length;
            if (r === current) return;
            if (r > current) {
                const addCount = r - current;
                setCells((prev) => [
                    ...prev,
                    ...Array.from({ length: addCount }, () =>
                        Array.from({ length: colWidths.length }, () => '')
                    ),
                ]);
                setRowHeights((prev) => [
                    ...prev,
                    ...Array.from({ length: addCount }, () => DEFAULT_ROW_HEIGHT),
                ]);
                setRowNames((prev) => [
                    ...prev,
                    ...Array.from(
                        { length: addCount },
                        (_, i) => `${t('table.rowPrefix')} ${current + i + 1}`
                    ),
                ]);
            } else {
                setCells((prev) => prev.slice(0, r));
                setRowHeights((prev) => prev.slice(0, r));
                setRowNames((prev) => prev.slice(0, r));
            }
            return;
        }

        setTables((prev) => {
            const tb = prev.find((tbl) => tbl.id === id);
            if (!tb) return prev;
            const current = tb.rowNames.length;
            if (r === current) return prev;

            let newCells: string[][];
            let newRowHeights: number[];
            let newRowNames: string[];

            if (r > current) {
                const addCount = r - current;
                newCells = [
                    ...tb.cells,
                    ...Array.from({ length: addCount }, () =>
                        Array.from({ length: tb.colWidths.length }, () => '')
                    ),
                ];
                newRowHeights = [
                    ...tb.rowHeights,
                    ...Array.from({ length: addCount }, () => DEFAULT_ROW_HEIGHT),
                ];
                newRowNames = [
                    ...tb.rowNames,
                    ...Array.from(
                        { length: addCount },
                        (_, i) => `${t('table.rowPrefix')} ${current + i + 1}`
                    ),
                ];
            } else {
                newCells = tb.cells.slice(0, r);
                newRowHeights = tb.rowHeights.slice(0, r);
                newRowNames = tb.rowNames.slice(0, r);
            }

            const updated = prev.map((tbl) =>
                tbl.id === id
                    ? {
                        ...tbl,
                        cells: newCells,
                        rowHeights: newRowHeights,
                        rowNames: newRowNames,
                        updatedAt: Date.now(),
                    }
                    : tbl
            );
            saveTables(updated);
            return updated;
        });
    }

    function setTableColCount(id: string, desiredCols: number) {
        const c = Math.max(1, Math.min(50, Math.round(desiredCols) || 1));

        if (id === currentTableId) {
            const current = colWidths.length;
            if (c === current) return;
            if (c > current) {
                const addCount = c - current;
                setCells((prev) =>
                    prev.map((row) => [...row, ...Array.from({ length: addCount }, () => '')])
                );
                setColWidths((prev) => [
                    ...prev,
                    ...Array.from({ length: addCount }, () => DEFAULT_COL_WIDTH),
                ]);
                setColNames((prev) => [
                    ...prev,
                    ...Array.from(
                        { length: addCount },
                        (_, i) => `${t('table.columnPrefix')} ${current + i + 1}`
                    ),
                ]);
            } else {
                setCells((prev) => prev.map((row) => row.slice(0, c)));
                setColWidths((prev) => prev.slice(0, c));
                setColNames((prev) => prev.slice(0, c));
            }
            return;
        }

        setTables((prev) => {
            const tb = prev.find((tbl) => tbl.id === id);
            if (!tb) return prev;
            const current = tb.colWidths.length;
            if (c === current) return prev;

            let newCells: string[][];
            let newColWidths: number[];
            let newColNames: string[];

            if (c > current) {
                const addCount = c - current;
                newCells = tb.cells.map((row) => [
                    ...row,
                    ...Array.from({ length: addCount }, () => ''),
                ]);
                newColWidths = [
                    ...tb.colWidths,
                    ...Array.from({ length: addCount }, () => DEFAULT_COL_WIDTH),
                ];
                newColNames = [
                    ...tb.colNames,
                    ...Array.from(
                        { length: addCount },
                        (_, i) => `${t('table.columnPrefix')} ${current + i + 1}`
                    ),
                ];
            } else {
                newCells = tb.cells.map((row) => row.slice(0, c));
                newColWidths = tb.colWidths.slice(0, c);
                newColNames = tb.colNames.slice(0, c);
            }

            const updated = prev.map((tbl) =>
                tbl.id === id
                    ? {
                        ...tbl,
                        cells: newCells,
                        colWidths: newColWidths,
                        colNames: newColNames,
                        updatedAt: Date.now(),
                    }
                    : tbl
            );
            saveTables(updated);
            return updated;
        });
    }

    const confirmDialogContent = {
        word: {
            title: t('confirm.word.title'),
            description: t('confirm.word.description'),
            confirmLabel: t('confirm.word.confirmLabel'),
            danger: false,
            action: async () => {
                try {
                    await exportToWord(fileName, cells, colWidths, colNames, rowNames, rowHeights);
                    toast.success(t('toast.exportSuccess', { format: t('export.word') }));
                } catch {
                    toast.error(t('toast.exportError'));
                }
            },
        },
        excel: {
            title: t('confirm.excel.title'),
            description: t('confirm.excel.description'),
            confirmLabel: t('confirm.excel.confirmLabel'),
            danger: false,
            action: async () => {
                try {
                    await exportToExcel(fileName, cells, colWidths, colNames, rowNames, rowHeights);
                    toast.success(t('toast.exportSuccess', { format: t('export.excel') }));
                } catch {
                    toast.error(t('toast.exportError'));
                }
            },
        },
        sql: {
            title: t('confirm.sql.title'),
            description: t('confirm.sql.description'),
            confirmLabel: t('confirm.sql.confirmLabel'),
            danger: false,
            action: async () => {
                try {
                    await exportToSQL(fileName, cells, colNames, rowNames, t('table.rowPrefix'), t('table.columnPrefix'));
                    toast.success(t('toast.exportSuccess', { format: t('export.sql') }));
                } catch {
                    toast.error(t('toast.exportError'));
                }
            },
        },
        delete: {
            title: t('confirm.delete.title'),
            description: t('confirm.delete.description'),
            confirmLabel: t('confirm.delete.confirmLabel'),
            danger: true,
            action: deleteTable,
        },
    } as const;

    function runConfirmedAction() {
        if (!confirmAction) return;
        confirmDialogContent[confirmAction].action();
        setConfirmAction(null);
    }

    function updateCell(r: number, c: number, value: string) {
        setCells((prev) => {
            const next = prev.map((row) => [...row]);
            next[r][c] = value;
            return next;
        });
    }

    function updateColName(index: number, value: string) {
        setColNames((prev) => {
            const next = [...prev];
            next[index] = value;
            return next;
        });
    }

    function updateRowName(index: number, value: string) {
        setRowNames((prev) => {
            const next = [...prev];
            next[index] = value;
            return next;
        });
    }

    function addColumn() {
        setCells((prev) => prev.map((row) => [...row, '']));
        setColWidths((prev) => [...prev, DEFAULT_COL_WIDTH]);
        setColNames((prev) => [...prev, `${t('table.columnPrefix')} ${prev.length + 1}`]);
    }

    function addRow() {
        setCells((prev) => [...prev, Array.from({ length: colWidths.length }, () => '')]);
        setRowHeights((prev) => [...prev, DEFAULT_ROW_HEIGHT]);
        setRowNames((prev) => [...prev, `${t('table.rowPrefix')} ${prev.length + 1}`]);
    }

    function removeColumn(index: number) {
        if (colWidths.length <= 1) return;
        setCells((prev) => prev.map((row) => row.filter((_, ci) => ci !== index)));
        setColWidths((prev) => prev.filter((_, ci) => ci !== index));
        setColNames((prev) => prev.filter((_, ci) => ci !== index));
    }

    function removeRow(index: number) {
        if (rowHeights.length <= 1) return;
        setCells((prev) => prev.filter((_, ri) => ri !== index));
        setRowHeights((prev) => prev.filter((_, ri) => ri !== index));
        setRowNames((prev) => prev.filter((_, ri) => ri !== index));
    }

    // --- تغییر اندازه با درگ ---
    function startColResize(e: React.MouseEvent, index: number) {
        e.preventDefault();
        e.stopPropagation();
        resizingRef.current = {
            type: 'col',
            index,
            startPos: e.clientX,
            startSize: colWidths[index],
        };
        window.addEventListener('mousemove', onResizeMove);
        window.addEventListener('mouseup', onResizeEnd);
    }

    function startRowResize(e: React.MouseEvent, index: number) {
        e.preventDefault();
        e.stopPropagation();
        resizingRef.current = {
            type: 'row',
            index,
            startPos: e.clientY,
            startSize: rowHeights[index],
        };
        window.addEventListener('mousemove', onResizeMove);
        window.addEventListener('mouseup', onResizeEnd);
    }

    function onResizeMove(e: MouseEvent) {
        const state = resizingRef.current;
        if (!state) return;
        if (state.type === 'col') {
            const rawDelta = e.clientX - state.startPos;
            const delta = direction === 'rtl' ? -rawDelta : rawDelta;
            const newWidth = Math.max(MIN_COL_WIDTH, state.startSize + delta);
            setColWidths((prev) => {
                const next = [...prev];
                next[state.index] = newWidth;
                return next;
            });
        } else {
            const delta = e.clientY - state.startPos;
            const newHeight = Math.max(MIN_ROW_HEIGHT, state.startSize + delta);
            setRowHeights((prev) => {
                const next = [...prev];
                next[state.index] = newHeight;
                return next;
            });
        }
    }

    function onResizeEnd() {
        resizingRef.current = null;
        window.removeEventListener('mousemove', onResizeMove);
        window.removeEventListener('mouseup', onResizeEnd);
    }

    // --- جابجایی ستون‌ها با درگ ---
    function handleColDragStart(index: number) {
        dragColIndex.current = index;
    }
    function handleColDragOver(e: React.DragEvent, index: number) {
        e.preventDefault();
        setDragOverCol(index);
    }
    function handleColDrop(index: number) {
        const from = dragColIndex.current;
        if (from === null || from === index) {
            dragColIndex.current = null;
            setDragOverCol(null);
            return;
        }
        setCells((prev) => prev.map((row) => reorder(row, from, index)));
        setColWidths((prev) => reorder(prev, from, index));
        setColNames((prev) => reorder(prev, from, index));
        dragColIndex.current = null;
        setDragOverCol(null);
    }

    // --- جابجایی ردیف‌ها با درگ ---
    function handleRowDragStart(index: number) {
        dragRowIndex.current = index;
    }
    function handleRowDragOver(e: React.DragEvent, index: number) {
        e.preventDefault();
        setDragOverRow(index);
    }
    function handleRowDrop(index: number) {
        const from = dragRowIndex.current;
        if (from === null || from === index) {
            dragRowIndex.current = null;
            setDragOverRow(null);
            return;
        }
        setCells((prev) => reorder(prev, from, index));
        setRowHeights((prev) => reorder(prev, from, index));
        setRowNames((prev) => reorder(prev, from, index));
        dragRowIndex.current = null;
        setDragOverRow(null);
    }

    return (
        <div
            className="flex h-screen flex-col gap-4 overflow-hidden bg-slate-950 p-4"
            dir={direction}
        >
            <Toaster richColors position={direction === 'rtl' ? 'bottom-left' : 'bottom-right'} dir={direction} />
            {/* هدر بالای صفحه */}
            <header className="flex shrink-0 items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-5 py-3 shadow-lg shadow-black/30">
                <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-600">
            <img src="/Logo.png" alt={t('header.title')} className="h-full w-full object-cover" />
          </span>
                    <div>
                        <h1 className="text-lg font-bold text-slate-100">{t('header.title')}</h1>
                        <p className="mt-0.5 text-xs text-slate-500">{t('header.subtitle')}</p>
                    </div>
                    <button
                        onClick={toggleLanguage}
                        className="mr-2 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-100"
                        title={t('header.switchLanguage')}
                    >
                        <Icon
                            icon={direction === 'rtl' ? 'emojione-monotone:flag-for-united-states' : 'emojione-monotone:flag-for-armenia'}
                            width={21}
                            height={21}
                        />
                    </button>
                </div>
                {initialized && (
                    <div className="flex items-center gap-2">
                        <div className="relative" ref={exportMenuRef}>
                            <button
                                onClick={() => setShowExportMenu((v) => !v)}
                                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-500"
                            >
                                {t('export.button')}
                                <Icon
                                    icon="mingcute:down-line"
                                    width="14"
                                    height="14"
                                    className={`transition-transform ${showExportMenu ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {showExportMenu && (
                                <div
                                    className={`absolute top-full z-20 mt-2 flex w-44 flex-col gap-1 overflow-hidden rounded-lg border border-slate-800 bg-slate-900 py-1.5 shadow-xl shadow-black/40 ${direction === 'rtl' ? 'right-0' : 'left-0'
                                    }`}
                                >
                                    <button
                                        onClick={() => {
                                            setConfirmAction('word');
                                            setShowExportMenu(false);
                                        }}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-right text-xs font-medium text-slate-200 hover:bg-slate-800"
                                    >
                                        <span className="h-2 w-2 rounded-full bg-[#2461CA]" />
                                        {t('export.word')}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setConfirmAction('excel');
                                            setShowExportMenu(false);
                                        }}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-right text-xs font-medium text-slate-200 hover:bg-slate-800"
                                    >
                                        <span className="h-2 w-2 rounded-full bg-[#0F7937]" />
                                        {t('export.excel')}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setConfirmAction('sql');
                                            setShowExportMenu(false);
                                        }}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-right text-xs font-medium text-slate-200 hover:bg-slate-800"
                                        title={t('export.sqlTitle')}
                                    >
                                        <span className="h-2 w-2 rounded-full bg-[#d6771d]" />
                                        {t('export.sql')}
                                    </button>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setConfirmAction('delete')}
                            className="rounded-lg border border-red-800 px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-950"
                        >
                            {t('export.deleteTable')}
                        </button>
                    </div>
                )}
            </header>

            <div className="flex flex-1 gap-4 overflow-hidden">
                {/* سایدبار */}
                <aside className="flex h-full w-72 shrink-0 flex-col gap-5 overflow-hidden rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/30">

                    {initialized && (
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-400">
                                {t('sidebar.fileNameLabel')}
                            </label>
                            <input
                                type="text"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                            />
                        </div>
                    )}

                    {initialized && currentTableId && (
                        <div className="flex items-center gap-1.5">
                            <TableSizeField
                                icon="material-symbols:add-row-below-outline-rounded"
                                value={cells.length}
                                onChange={(n) => setTableRowCount(currentTableId, n)}
                                title={t('sidebar.rowsCount')}
                                min={1}
                                max={200}
                            />
                            <TableSizeField
                                icon="flowbite:add-column-after-outline"
                                value={colWidths.length}
                                onChange={(n) => setTableColCount(currentTableId, n)}
                                title={t('sidebar.colsCount')}
                                min={1}
                                max={50}
                            />
                        </div>
                    )}

                    {initialized && (
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-medium text-slate-400">{t('sidebar.editTable')}</span>
                            <button
                                onClick={addRow}
                                className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-700"
                            >
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
                  <Icon icon="material-symbols:add-row-below-outline-rounded" width="24" height="24" /></span>
                                {t('sidebar.addRow')}
                            </button>
                            <button
                                onClick={addColumn}
                                className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-700"
                            >
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
                  <Icon icon="flowbite:add-column-after-outline" width="24" height="24" /></span>
                                {t('sidebar.addColumn')}
                            </button>
                        </div>
                    )}

                    {tables.length > 0 && (
                        <div className="flex min-h-0 flex-1 flex-col gap-2">
                            <span className="text-xs font-medium text-slate-400">{t('sidebar.savedTables')}</span>
                            <div className="flex flex-col gap-1 overflow-y-auto">
                                {tables
                                    .slice()
                                    .sort((a, b) => b.updatedAt - a.updatedAt)
                                    .map((tb) => (
                                        <div
                                            key={tb.id}
                                            onClick={() => openTable(tb.id)}
                                            title={tb.name}
                                            className={`flex cursor-pointer flex-col gap-1.5 rounded-lg px-3 py-2 text-start text-sm ${tb.id === currentTableId
                                                ? 'bg-indigo-600/20 text-indigo-300'
                                                : 'text-slate-300 hover:bg-slate-800'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Icon icon="boxicons:table-rows-merge" width="18" height="18" className="shrink-0" />
                                                <span className="flex-1 truncate">{tb.name}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeleteTargetId(tb.id);
                                                    }}
                                                    title={t('sidebar.deleteTable')}
                                                    className="shrink-0 text-slate-600 hover:text-red-400"
                                                >
                                                    <Icon icon="ant-design:delete-outlined" width="15" height="15" />
                                                </button>
                                            </div>
                                            {tb.id !== currentTableId && (
                                                <div className="flex items-center gap-1.5 ps-6">
                                                    <TableSizeField
                                                        icon="material-symbols:add-row-below-outline-rounded"
                                                        value={tb.rowNames.length}
                                                        onChange={(n) => setTableRowCount(tb.id, n)}
                                                        title={t('sidebar.rowsCount')}
                                                        min={1}
                                                        max={200}
                                                    />
                                                    <TableSizeField
                                                        icon="flowbite:add-column-after-outline"
                                                        value={tb.colWidths.length}
                                                        onChange={(n) => setTableColCount(tb.id, n)}
                                                        title={t('sidebar.colsCount')}
                                                        min={1}
                                                        max={50}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-auto flex flex-col gap-3">
                        <div className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-800/50 p-3 text-[11px] leading-5 text-slate-400">
                            <div className="flex items-start gap-1.5">
                                <Icon icon="carbon:dot-mark" width="14" height="14" className="mt-0.5 shrink-0 text-indigo-400" />
                                <span>{t('sidebar.tipResizeCol')}</span>
                            </div>
                            <div className="flex items-start gap-1.5">
                                <Icon icon="carbon:dot-mark" width="14" height="14" className="mt-0.5 shrink-0 text-indigo-400" />
                                <span>{t('sidebar.tipResizeRow')}</span>
                            </div>
                            <div className="flex items-start gap-1.5">
                                <Icon icon="carbon:dot-mark" width="14" height="14" className="mt-0.5 shrink-0 text-indigo-400" />
                                <span>{t('sidebar.tipMove')}</span>
                            </div>
                            <div className="flex items-start gap-1.5">
                                <Icon icon="carbon:dot-mark" width="14" height="14" className="mt-0.5 shrink-0 text-indigo-400" />
                                <span>{t('sidebar.tipRename')}</span>
                            </div>
                        </div>
                        <button
                            onClick={openNewTableDialog}
                            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
                        >
                            <Icon icon="mdi:plus" width="16" height="16" />
                            {t('sidebar.newTable')}
                        </button>
                    </div>
                </aside>

                {/* محتوای اصلی */}
                <main className="flex-1 overflow-hidden p-6">
                    {initialized && (
                        <div
                            className="h-full overflow-auto rounded-lg border border-slate-800 bg-slate-900 p-4"
                            dir={direction}
                        >
                            <table className="border-separate" style={{ borderSpacing: 0 }}>
                                <colgroup>
                                    <col style={{ width: 130 }} />
                                    {colWidths.map((w, i) => (
                                        <col key={i} style={{ width: w }} />
                                    ))}
                                </colgroup>
                                <thead>
                                <tr>
                                    <th className="border border-slate-700 bg-slate-800" />
                                    {colWidths.map((w, ci) => (
                                        <th
                                            key={ci}
                                            onDragOver={(e) => handleColDragOver(e, ci)}
                                            onDrop={() => handleColDrop(ci)}
                                            className={`relative border border-slate-700 bg-slate-800 p-0 text-xs font-medium text-slate-300 ${dragOverCol === ci ? 'bg-indigo-900/50' : ''
                                            }`}
                                        >
                                            <div className="flex h-9 items-center justify-between gap-1 px-1.5">
                          <span
                              draggable
                              onDragStart={() => handleColDragStart(ci)}
                              className="cursor-grab select-none text-slate-500 active:cursor-grabbing"
                              title={t('table.moveColumn')}
                          >
                            <Icon icon="charm:grab-vertical" width="14" height="14" />
                          </span>
                                                <EditableText
                                                    value={colNames[ci] ?? ''}
                                                    onChange={(v) => updateColName(ci, v)}
                                                    align="center"
                                                    dir={direction}
                                                    className="flex-1 text-xs font-medium text-slate-200"
                                                    inputClassName="flex-1 text-center text-xs font-medium text-white"
                                                />
                                                <button
                                                    onClick={() => removeColumn(ci)}
                                                    className="text-slate-600 hover:text-red-400"
                                                    title={t('table.removeColumn')}
                                                >
                                                    <Icon icon="ant-design:close-outlined" width="14" height="14" />
                                                </button>
                                            </div>
                                            <div
                                                onMouseDown={(e) => startColResize(e, ci)}
                                                className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize hover:bg-indigo-500"
                                            />
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {cells.map((row, ri) => (
                                    <tr key={ri}>
                                        <td
                                            onDragOver={(e) => handleRowDragOver(e, ri)}
                                            onDrop={() => handleRowDrop(ri)}
                                            className={`relative border border-slate-700 bg-slate-800 p-0 text-xs text-slate-300 ${dragOverRow === ri ? 'bg-indigo-900/50' : ''
                                            }`}
                                            style={{ height: rowHeights[ri] }}
                                        >
                                            <div className="flex h-full items-center gap-1 px-1.5">
                          <span
                              draggable
                              onDragStart={() => handleRowDragStart(ri)}
                              className="cursor-grab select-none text-slate-500 active:cursor-grabbing"
                              title={t('table.moveRow')}
                          >
                            <Icon icon="charm:grab-horizontal" width="14" height="14" />
                          </span>
                                                <EditableText
                                                    value={rowNames[ri] ?? ''}
                                                    onChange={(v) => updateRowName(ri, v)}
                                                    dir={direction}
                                                    className="flex-1 text-xs font-medium text-slate-200"
                                                    inputClassName="flex-1 text-xs font-medium text-white"
                                                />
                                                <button
                                                    onClick={() => removeRow(ri)}
                                                    className="text-slate-600 hover:text-red-400"
                                                    title={t('table.removeRow')}
                                                >
                                                    <Icon icon="ant-design:close-outlined" width="14" height="14" />
                                                </button>
                                            </div>
                                            <div
                                                onMouseDown={(e) => startRowResize(e, ri)}
                                                className="absolute bottom-0 left-0 h-1.5 w-full cursor-row-resize hover:bg-indigo-500"
                                            />
                                        </td>
                                        {row.map((value, ci) => (
                                            <td
                                                key={ci}
                                                className="border border-slate-700 p-0"
                                                style={{ height: rowHeights[ri] }}
                                            >
                                                <div className="flex h-full items-center justify-center px-2">
                                                    <EditableText
                                                        value={value}
                                                        onChange={(v) => updateCell(ri, ci, v)}
                                                        align="center"
                                                        dir={direction}
                                                        className="text-sm text-slate-100"
                                                        inputClassName="text-sm text-slate-100 text-center"
                                                    />
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {!initialized && (
                        <div className="flex h-full items-center justify-center">
                            <div className="flex flex-col items-center gap-4 rounded-lg border border-slate-800 bg-slate-900 px-10 py-8 text-center shadow-lg">
                                <p className="text-sm leading-6 text-slate-400">
                                    {t('emptyState.message')}
                                </p>
                                <button
                                    onClick={openNewTableDialog}
                                    className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-500"
                                >
                                    {t('emptyState.createButton')}
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {showNewTableDialog && (
                <NewTableDialog
                    rowsInput={rowsInput}
                    colsInput={colsInput}
                    fileName={newTableFileName}
                    setRowsInput={setRowsInput}
                    setColsInput={setColsInput}
                    setFileName={setNewTableFileName}
                    onCreate={createTable}
                    onClose={() => setShowNewTableDialog(false)}
                    canCancel={initialized}
                />
            )}

            {confirmAction && (
                <ConfirmDialog
                    title={confirmDialogContent[confirmAction].title}
                    description={confirmDialogContent[confirmAction].description}
                    confirmLabel={confirmDialogContent[confirmAction].confirmLabel}
                    danger={confirmDialogContent[confirmAction].danger}
                    onConfirm={runConfirmedAction}
                    onClose={() => setConfirmAction(null)}
                />
            )}

            {deleteTargetId && (
                <ConfirmDialog
                    title={t('confirm.deleteFromList.title')}
                    description={t('confirm.deleteFromList.description')}
                    confirmLabel={t('confirm.deleteFromList.confirmLabel')}
                    danger
                    onConfirm={() => {
                        deleteTableById(deleteTargetId);
                        setDeleteTargetId(null);
                    }}
                    onClose={() => setDeleteTargetId(null)}
                />
            )}
        </div>
    );
}