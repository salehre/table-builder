import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import {
  Document,
  Packer,
  Table,
  TableRow,
  TableCell,
  Paragraph,
  WidthType,
  BorderStyle,
  HeightRule,
} from 'docx';

const pxToDxa = (px: number) => Math.round(px * 15);
const DEFAULT_ROW_HEIGHT_FALLBACK = 40;

const NAME_COL_WIDTH = 130;
const HEADER_ROW_HEIGHT = 36;

function buildFullGrid(
  cells: string[][],
  colNames: string[],
  rowNames: string[]
): string[][] {
  const headerRow = ['', ...colNames];
  const body = cells.map((row, ri) => [rowNames[ri] || '', ...row]);
  return [headerRow, ...body];
}

export function exportToWord(
  fileName: string,
  cellsInput: string[][],
  colWidthsInput: number[],
  colNames: string[] = [],
  rowNames: string[] = [],
  rowHeightsInput: number[] = []
) {
  const cells = buildFullGrid(cellsInput, colNames, rowNames);
  const colWidths = [NAME_COL_WIDTH, ...colWidthsInput];
  const rowHeights = [HEADER_ROW_HEIGHT, ...rowHeightsInput];

  const borders = {
    top: { style: BorderStyle.SINGLE, size: 2, color: 'CCCCCC' },
    bottom: { style: BorderStyle.SINGLE, size: 2, color: 'CCCCCC' },
    left: { style: BorderStyle.SINGLE, size: 2, color: 'CCCCCC' },
    right: { style: BorderStyle.SINGLE, size: 2, color: 'CCCCCC' },
  };

const rows = cells.map((row, rowIndex) => {
  return new TableRow({
    height: {
      value: pxToDxa(rowHeights[rowIndex] || DEFAULT_ROW_HEIGHT_FALLBACK),
      rule: 'atLeast',
    },
    children: row.map((cellText, colIndex) => {
        return new TableCell({
          width: {
            size: pxToDxa(colWidths[colIndex] || 100),
            type: WidthType.DXA,
          },
          borders,
          shading: rowIndex === 0 ? { fill: 'E5E7EB' } : undefined,
          children: [
            new Paragraph({
              text: cellText || '',
              bidirectional: true,
            }),
          ],
        });
      }),
    });
  });

  const table = new Table({
    rows,
    width: {
      size: colWidths.reduce((a, b) => a + pxToDxa(b), 0),
      type: WidthType.DXA,
    },
  });

  const doc = new Document({
    sections: [
      {
        children: [table],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${fileName}.docx`);
  });
}

export function exportToExcel(
  fileName: string,
  cellsInput: string[][],
  colWidthsInput: number[],
  colNames: string[] = [],
  rowNames: string[] = [],
  rowHeightsInput: number[] = []
) {
  const cells = buildFullGrid(cellsInput, colNames, rowNames);
  const colWidths = [NAME_COL_WIDTH, ...colWidthsInput];
  const rowHeights = [HEADER_ROW_HEIGHT, ...rowHeightsInput];
  const worksheet = XLSX.utils.aoa_to_sheet(cells);

  worksheet['!cols'] = colWidths.map((w) => ({ wch: Math.max(6, Math.round(w / 7)) }));
  worksheet['!rows'] = rowHeights.map((h) => ({ hpx: h }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  const arrayBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([arrayBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `${fileName}.xlsx`);
}

// خروجی SQL: یک اسکریپت CREATE TABLE + INSERT برای وارد کردن به هر دیتابیس (MySQL/Postgres/SQLite)
function sanitizeSqlIdentifier(name: string, fallback: string): string {
  const trimmed = (name || '').trim();
  return trimmed ? trimmed.replace(/"/g, '""') : fallback;
}

function sanitizeSqlValue(value: string): string {
  return `'${(value ?? '').replace(/'/g, "''")}'`;
}

export function exportToSQL(
  fileName: string,
  cellsInput: string[][],
  colNames: string[] = [],
  rowNames: string[] = [],
  rowLabel: string = 'ردیف',
  colLabel: string = 'ستون'
) {
  const tableName = sanitizeSqlIdentifier(fileName, 'my_table');
  const columns = [
      rowLabel,
    ...colNames.map((c, i) => sanitizeSqlIdentifier(c, `${colLabel}_${i + 1}`)),
  ];
  const quotedColumns = columns.map((c) => `"${c}"`).join(', ');

  const createStatement = `CREATE TABLE "${tableName}" (\n${columns
    .map((c) => `  "${c}" TEXT`)
    .join(',\n')}\n);`;

  const insertStatements = cellsInput.map((row, ri) => {
    const values = [rowNames[ri] || '', ...row].map(sanitizeSqlValue).join(', ');
    return `INSERT INTO "${tableName}" (${quotedColumns}) VALUES (${values});`;
  });

  const sqlContent = [createStatement, '', ...insertStatements].join('\n');

  const blob = new Blob(['\uFEFF' + sqlContent], {
    type: 'application/sql;charset=utf-8;',
  });
  saveAs(blob, `${fileName}.sql`);
}