'use client';

interface NewTableDialogProps {
  rowsInput: number;
  colsInput: number;
  fileName: string;
  setRowsInput: (v: number) => void;
  setColsInput: (v: number) => void;
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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h2 className="mb-1 text-xl font-bold text-slate-100">جدول جدید</h2>
        <p className="mb-6 text-sm text-slate-400">
          تعداد ردیف و ستون دلخواه رو وارد کن و جدول رو بساز
        </p>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">
              تعداد ردیف
            </label>
            <input
              type="number"
              min={1}
              max={200}
              value={rowsInput}
              onChange={(e) => setRowsInput(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">
              تعداد ستون
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={colsInput}
              onChange={(e) => setColsInput(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-slate-300">
            نام فایل خروجی
          </label>
          <input
            type="text"
            value={fileName}
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
              انصراف
            </button>
          )}
          <button
            onClick={onCreate}
            className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-500"
          >
            ساخت جدول
          </button>
        </div>
      </div>
    </div>
  );
}