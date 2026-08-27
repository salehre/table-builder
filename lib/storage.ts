export interface StoredTable {
    id: string;
    name: string;
    cells: string[][];
    colWidths: number[];
    rowHeights: number[];
    colNames: string[];
    rowNames: string[];
    updatedAt: number;
}

const STORAGE_KEY = 'table-builder:tables';

export function loadTables(): StoredTable[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function saveTables(tables: StoredTable[]) {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tables));
    } catch {
        // quota exceeded / privacy mode — ignore silently
    }
}

export function createTableId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}