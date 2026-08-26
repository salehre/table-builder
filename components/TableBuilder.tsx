'use client';

import { useEffect, useRef, useState } from 'react';
import { exportToWord, exportToExcel, exportToSQL } from '@/lib/export';
import EditableText from './EditableText';
import NewTableDialog from './NewTableDialog';
import ConfirmDialog from './ConfirmDialog';
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
  const [direction, setDirection] = useState<'rtl' | 'ltr'>('rtl');
  const exportMenuRef = useRef<HTMLDivElement>(null);

  const [cells, setCells] = useState<string[][]>([]);
  const [colWidths, setColWidths] = useState<number[]>([]);
  const [rowHeights, setRowHeights] = useState<number[]>([]);
  const [colNames, setColNames] = useState<string[]>([]);
  const [rowNames, setRowNames] = useState<string[]>([]);

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
    const r = Math.max(1, Math.min(200, Number(rowsInput) || 0));
    const c = Math.max(1, Math.min(50, Number(colsInput) || 0));
    const newCells: string[][] = Array.from({ length: r }, () =>
      Array.from({ length: c }, () => '')
    );
    setCells(newCells);
    setColWidths(Array.from({ length: c }, () => DEFAULT_COL_WIDTH));
    setRowHeights(Array.from({ length: r }, () => DEFAULT_ROW_HEIGHT));
    setColNames(Array.from({ length: c }, (_, i) => `ستون ${i + 1}`));
    setRowNames(Array.from({ length: r }, (_, i) => `ردیف ${i + 1}`));
    setFileName(newTableFileName.trim() || 'جدول-من');
    setInitialized(true);
    setShowNewTableDialog(false);
  }

  function openNewTableDialog() {
    setRowsInput('');
    setColsInput('');
    setNewTableFileName('');
    setShowNewTableDialog(true);
  }

  function deleteTable() {
    setCells([]);
    setColWidths([]);
    setRowHeights([]);
    setColNames([]);
    setRowNames([]);
    setInitialized(false);
  }

  const confirmDialogContent = {
    word: {
      title: 'خروجی Word',
      description: 'جدول فعلی به‌صورت فایل Word دانلود می‌شه. مطمئنی می‌خوای ادامه بدی؟',
      confirmLabel: 'بله، دانلود کن',
      danger: false,
      action: () =>
        exportToWord(fileName, cells, colWidths, colNames, rowNames, rowHeights),
    },
    excel: {
      title: 'خروجی Excel',
      description: 'جدول فعلی به‌صورت فایل Excel دانلود می‌شه. مطمئنی می‌خوای ادامه بدی؟',
      confirmLabel: 'بله، دانلود کن',
      danger: false,
      action: () =>
        exportToExcel(fileName, cells, colWidths, colNames, rowNames, rowHeights),
    },
    sql: {
      title: 'خروجی SQL',
      description:
        'یه اسکریپت SQL شامل CREATE TABLE و INSERT از روی جدول فعلی ساخته و دانلود می‌شه. مطمئنی می‌خوای ادامه بدی؟',
      confirmLabel: 'بله، دانلود کن',
      danger: false,
      action: () => exportToSQL(fileName, cells, colNames, rowNames),
    },
    delete: {
      title: 'حذف جدول',
      description:
        'با این کار جدول فعلی و تمام داده‌هاش برای همیشه پاک می‌شه و به صفحه‌ی شروع برمی‌گردی. این عمل قابل بازگشت نیست.',
      confirmLabel: 'بله، حذف کن',
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
    setColNames((prev) => [...prev, `ستون ${prev.length + 1}`]);
  }

  function addRow() {
    setCells((prev) => [...prev, Array.from({ length: colWidths.length }, () => '')]);
    setRowHeights((prev) => [...prev, DEFAULT_ROW_HEIGHT]);
    setRowNames((prev) => [...prev, `ردیف ${prev.length + 1}`]);
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
      {/* هدر بالای صفحه */}
      <header className="flex shrink-0 items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-5 py-3 shadow-lg shadow-black/30">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            جد
          </span>
          <div>
            <h1 className="text-lg font-bold text-slate-100">سازنده جدول</h1>
            <p className="mt-0.5 text-xs text-slate-500">مدیریت و اکسپورت جدول</p>
          </div>
          <button
            onClick={() => setDirection((d) => (d === 'rtl' ? 'ltr' : 'rtl'))}
            className="mr-2 flex items-center gap-1.5 rounded-full border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800"
            title="تغییر جهت صفحه و جدول"
          >
            ⇄ {direction === 'rtl' ? 'راست‌به‌چپ' : 'چپ‌به‌راست'}
          </button>
        </div>
        {initialized && (
          <div className="flex items-center gap-2">
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setShowExportMenu((v) => !v)}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-500"
              >
                خروجی گرفتن
                <Icon
                  icon="mingcute:down-line"
                  width="14"
                  height="14"
                  className={`transition-transform ${showExportMenu ? 'rotate-180' : ''}`}
                />
              </button>
              {showExportMenu && (
                <div
                  className={`absolute top-full z-20 mt-2 w-44 overflow-hidden rounded-lg border border-slate-800 bg-slate-900 py-1 shadow-xl shadow-black/40 ${direction === 'rtl' ? 'right-0' : 'left-0'
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
                    خروجی Word
                  </button>
                  <button
                    onClick={() => {
                      setConfirmAction('excel');
                      setShowExportMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-right text-xs font-medium text-slate-200 hover:bg-slate-800"
                  >
                    <span className="h-2 w-2 rounded-full bg-[#0F7937]" />
                    خروجی Excel
                  </button>
                  <button
                    onClick={() => {
                      setConfirmAction('sql');
                      setShowExportMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-right text-xs font-medium text-slate-200 hover:bg-slate-800"
                    title="فایل SQL شامل CREATE TABLE و INSERT"
                  >
                    <span className="h-2 w-2 rounded-full bg-[#d6771d]" />
                    خروجی SQL
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => setConfirmAction('delete')}
              className="rounded-lg border border-red-800 px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-950"
            >
              حذف جدول
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
                نام فایل خروجی
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          )}

          {initialized && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-slate-400">ویرایش جدول</span>
              <button
                onClick={addRow}
                className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-700"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
                  <Icon icon="material-symbols:add-row-below-outline-rounded" width="24" height="24" /></span>
                افزودن ردیف
              </button>
              <button
                onClick={addColumn}
                className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-700"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
                  <Icon icon="flowbite:add-column-after-outline" width="24" height="24" /></span>
                افزودن ستون
              </button>
            </div>
          )}

          <div className="mt-auto flex flex-col gap-3">
            <div className="rounded-lg border border-slate-800 bg-slate-800/50 p-3 text-[11px] leading-5 text-slate-400">
              لبه‌ی راست هر ستون یا پایین هر ردیف رو بگیر و بکش تا اندازه‌ش عوض بشه.
              آیکون ⠿ رو بگیر و بکش تا جابجا بشه. روی نام ردیف/ستون کلیک کن تا ویرایشش
              کنی.
            </div>
          </div>
        </aside>

        {/* محتوای اصلی */}
        <main className="flex-1 overflow-auto p-6">
          {initialized && (
            <div
              className="overflow-auto rounded-lg border border-slate-800 bg-slate-900 p-4"
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
                            title="جابجایی ستون"
                          >
                            <Icon icon="charm:grab-vertical" width="14" height="14" />
                          </span>
                          <EditableText
                            value={colNames[ci] ?? ''}
                            onChange={(v) => updateColName(ci, v)}
                            align="center"
                            className="flex-1 text-xs font-medium text-slate-200"
                            inputClassName="flex-1 text-center text-xs font-medium text-white"
                          />
                          <button
                            onClick={() => removeColumn(ci)}
                            className="text-slate-600 hover:text-red-400"
                            title="حذف ستون"
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
                            title="جابجایی ردیف"
                          >
                            <Icon icon="charm:grab-horizontal" width="14" height="14" />
                          </span>
                          <EditableText
                            value={rowNames[ri] ?? ''}
                            onChange={(v) => updateRowName(ri, v)}
                            className="flex-1 text-xs font-medium text-slate-200"
                            inputClassName="flex-1 text-xs font-medium text-white"
                          />
                          <button
                            onClick={() => removeRow(ri)}
                            className="text-slate-600 hover:text-red-400"
                            title="حذف ردیف"
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
                  هنوز جدولی نساختی. برای شروع، اندازه‌ی جدول رو مشخص کن و یه جدول جدید بساز.
                </p>
                <button
                  onClick={openNewTableDialog}
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-500"
                >
                   ساخت جدول
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
    </div>
  );
}