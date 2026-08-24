'use client';

import { useRef, useState } from 'react';
import { exportToWord, exportToExcel, exportToCSV } from '@/lib/export';
import EditableText from './EditableText';
import NewTableDialog from './NewTableDialog';

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
  const [rowsInput, setRowsInput] = useState(4);
  const [colsInput, setColsInput] = useState(4);
  const [fileName, setFileName] = useState('جدول-من');
  const [showNewTableDialog, setShowNewTableDialog] = useState(false);

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

  function createTable() {
    const r = Math.max(1, Math.min(200, rowsInput));
    const c = Math.max(1, Math.min(50, colsInput));
    const newCells: string[][] = Array.from({ length: r }, () =>
      Array.from({ length: c }, () => '')
    );
    setCells(newCells);
    setColWidths(Array.from({ length: c }, () => DEFAULT_COL_WIDTH));
    setRowHeights(Array.from({ length: r }, () => DEFAULT_ROW_HEIGHT));
    setColNames(Array.from({ length: c }, (_, i) => `ستون ${i + 1}`));
    setRowNames(Array.from({ length: r }, (_, i) => `ردیف ${i + 1}`));
    setInitialized(true);
    setShowNewTableDialog(false);
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
      const delta = e.clientX - state.startPos;
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
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* سایدبار */}
      <aside className="flex h-screen w-72 shrink-0 flex-col gap-5 overflow-hidden border-l border-slate-800 bg-slate-900 p-5">
        <div>
          <h1 className="text-lg font-bold text-slate-100">سازنده جدول</h1>
          <p className="mt-0.5 text-xs text-slate-500">مدیریت و اکسپورت جدول</p>
        </div>

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

{initialized && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-slate-400">ویرایش جدول</span>
          <button
            onClick={addRow}
            className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700"
          >
            + افزودن ردیف
          </button>
          <button
            onClick={addColumn}
            className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700"
          >
            + افزودن ستون
          </button>
        </div>
        )}

{initialized && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-slate-400">خروجی گرفتن</span>
          <button
            onClick={() => exportToWord(fileName, cells, colWidths, colNames, rowNames)}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            خروجی Word
          </button>
          <button
            onClick={() => exportToExcel(fileName, cells, colWidths, colNames, rowNames)}
            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            خروجی Excel
          </button>
          <button
            onClick={() => exportToCSV(fileName, cells, colNames, rowNames)}
            className="rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-500"
            title="فایل CSV برای ایمپورت در Access و Google Sheets"
          >
            خروجی CSV
          </button>
        </div>
        )}

        <div className="mt-auto flex flex-col gap-3">
          <div className="rounded-lg border border-slate-800 bg-slate-800/50 p-3 text-[11px] leading-5 text-slate-400">
            لبه‌ی راست هر ستون یا پایین هر ردیف رو بگیر و بکش تا اندازه‌ش عوض بشه.
            آیکون ⠿ رو بگیر و بکش تا جابجا بشه. روی نام ردیف/ستون کلیک کن تا ویرایشش
            کنی. فایل CSV مستقیم توی Access و Google Sheets ایمپورت می‌شه.
          </div>
          <button
            onClick={() => setShowNewTableDialog(true)}
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            جدول جدید
          </button>
        </div>
      </aside>

      {/* محتوای اصلی */}
      <main className="flex-1 overflow-auto p-6">
        <div
          className="overflow-auto rounded-xl border border-slate-800 bg-slate-900 p-4"
          dir="ltr"
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
                    className={`relative border border-slate-700 bg-slate-800 p-0 text-xs font-medium text-slate-300 ${
                      dragOverCol === ci ? 'bg-indigo-900/50' : ''
                    }`}
                  >
                    <div className="flex h-9 items-center justify-between gap-1 px-1.5">
                      <span
                        draggable
                        onDragStart={() => handleColDragStart(ci)}
                        onDragOver={(e) => handleColDragOver(e, ci)}
                        onDrop={() => handleColDrop(ci)}
                        className="cursor-grab select-none text-slate-500 active:cursor-grabbing"
                        title="جابجایی ستون"
                      >
                        ⠿
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
                        ×
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
                    className={`relative border border-slate-700 bg-slate-800 p-0 text-xs text-slate-300 ${
                      dragOverRow === ri ? 'bg-indigo-900/50' : ''
                    }`}
                    style={{ height: rowHeights[ri] }}
                  >
                    <div className="flex h-full items-center gap-1 px-1.5">
                      <span
                        draggable
                        onDragStart={() => handleRowDragStart(ri)}
                        onDragOver={(e) => handleRowDragOver(e, ri)}
                        onDrop={() => handleRowDrop(ri)}
                        className="cursor-grab select-none text-slate-500 active:cursor-grabbing"
                        title="جابجایی ردیف"
                      >
                        ⠿
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
                        ×
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
                    <div className="flex h-full items-center px-2">
                      <EditableText
                        value={value}
                        onChange={(v) => updateCell(ri, ci, v)}
                        className="text-sm text-slate-100"
                        inputClassName="text-sm text-slate-100"
                      />
                    </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
        {showNewTableDialog && (
          <NewTableDialog
            rowsInput={rowsInput}
            colsInput={colsInput}
            fileName={fileName}
            setRowsInput={setRowsInput}
            setColsInput={setColsInput}
            setFileName={setFileName}
            onCreate={createTable}
            onClose={() => setShowNewTableDialog(false)}
            canCancel={initialized}
          />
        )}
    </div>
  );
}
