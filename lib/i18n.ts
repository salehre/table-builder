import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fa: {
    translation: {
      header: {
        brand: 'جد',
        title: 'سازنده جدول',
        subtitle: 'مدیریت و اکسپورت جدول',
        switchLanguage: 'تغییر زبان',
      },
      export: {
        button: 'خروجی گرفتن',
        word: 'خروجی Word',
        excel: 'خروجی Excel',
        sql: 'خروجی SQL',
        sqlTitle: 'فایل SQL شامل CREATE TABLE و INSERT',
        deleteTable: 'حذف جدول',
      },
      sidebar: {
        fileNameLabel: 'نام فایل خروجی',
        editTable: 'ویرایش جدول',
        addRow: 'افزودن ردیف',
        addColumn: 'افزودن ستون',
        tipResizeCol: 'برای تغییر اندازه ستون لبه‌ی راست هر ستون رو بگیر و drag کن تا اندازه‌ش عوض بشه.',
        tipResizeRow: 'برای تغییر اندازه ردیف پایین هر ردیف رو بگیر و drag کن تا اندازه‌ش عوض بشه.',
        tipMove: 'برای جابجایی ستون و ردیف ایکون ⠿ رو بگیر و بکش تا جابجا بشه.',
        tipRename: 'برای تغییر اسم ستون، ردیف و سلول روش دوبار کلیک کن و اسمشو عوض کن.',
      },
      table: {
        columnPrefix: 'ستون',
        rowPrefix: 'ردیف',
        moveColumn: 'جابجایی ستون',
        moveRow: 'جابجایی ردیف',
        removeColumn: 'حذف ستون',
        removeRow: 'حذف ردیف',
      },
      emptyState: {
        message: 'هنوز جدولی نساختی. برای شروع، اندازه‌ی جدول رو مشخص کن و یه جدول جدید بساز.',
        createButton: 'ساخت جدول',
      },
      newTable: {
        title: 'جدول جدید',
        description: 'تعداد ردیف و ستون دلخواه رو وارد کن و جدول رو بساز',
        rowsLabel: 'تعداد ردیف',
        colsLabel: 'تعداد ستون',
        countPlaceholder: 'مثلاً ۴',
        fileNameLabel: 'نام فایل خروجی',
        fileNamePlaceholder: 'مثلاً فروش-فروردین',
        close: 'بستن',
        create: 'ساخت جدول',
      },
      confirm: {
        word: {
          title: 'خروجی Word',
          description: 'جدول فعلی به‌صورت فایل Word دانلود می‌شه. مطمئنی می‌خوای ادامه بدی؟',
          confirmLabel: 'بله، دانلود کن',
        },
        excel: {
          title: 'خروجی Excel',
          description: 'جدول فعلی به‌صورت فایل Excel دانلود می‌شه. مطمئنی می‌خوای ادامه بدی؟',
          confirmLabel: 'بله، دانلود کن',
        },
        sql: {
          title: 'خروجی SQL',
          description: 'یه اسکریپت SQL شامل CREATE TABLE و INSERT از روی جدول فعلی ساخته و دانلود می‌شه. مطمئنی می‌خوای ادامه بدی؟',
          confirmLabel: 'بله، دانلود کن',
        },
        delete: {
          title: 'حذف جدول',
          description: 'با این کار جدول فعلی و تمام داده‌هاش برای همیشه پاک می‌شه و به صفحه‌ی شروع برمی‌گردی. این عمل قابل بازگشت نیست.',
          confirmLabel: 'بله، حذف کن',
        },
      },
      common: {
        cancel: 'انصراف',
      },
      editableText: {
        editHint: 'برای ویرایش دابل‌کلیک کن',
      },
    },
  },
  en: {
    translation: {
      header: {
        brand: 'TB',
        title: 'Table Builder',
        subtitle: 'Manage and export your table',
        switchLanguage: 'Switch language',
      },
      export: {
        button: 'Export',
        word: 'Export Word',
        excel: 'Export Excel',
        sql: 'Export SQL',
        sqlTitle: 'SQL file with CREATE TABLE and INSERT',
        deleteTable: 'Delete table',
      },
      sidebar: {
        fileNameLabel: 'Output file name',
        editTable: 'Edit table',
        addRow: 'Add row',
        addColumn: 'Add column',
        tipResizeCol: 'To resize a column, grab its right edge and drag it.',
        tipResizeRow: 'To resize a row, grab its bottom edge and drag it.',
        tipMove: 'To move a column or row, grab the ⠿ icon and drag it.',
        tipRename: 'Double-click a column, row, or cell name to rename it.',
      },
      table: {
        columnPrefix: 'Col',
        rowPrefix: 'Row',
        moveColumn: 'Move column',
        moveRow: 'Move row',
        removeColumn: 'Remove column',
        removeRow: 'Remove row',
      },
      emptyState: {
        message: "You haven't created a table yet. Set a size to get started.",
        createButton: 'Create table',
      },
      newTable: {
        title: 'New table',
        description: 'Enter the number of rows and columns and create the table',
        rowsLabel: 'Rows',
        colsLabel: 'Columns',
        countPlaceholder: 'e.g. 4',
        fileNameLabel: 'Output file name',
        fileNamePlaceholder: 'e.g. march-sales',
        close: 'Close',
        create: 'Create table',
      },
      confirm: {
        word: {
          title: 'Export Word',
          description: 'The current table will be downloaded as a Word file. Are you sure you want to continue?',
          confirmLabel: 'Yes, download',
        },
        excel: {
          title: 'Export Excel',
          description: 'The current table will be downloaded as an Excel file. Are you sure you want to continue?',
          confirmLabel: 'Yes, download',
        },
        sql: {
          title: 'Export SQL',
          description: 'A SQL script with CREATE TABLE and INSERT statements will be generated from the current table. Are you sure you want to continue?',
          confirmLabel: 'Yes, download',
        },
        delete: {
          title: 'Delete table',
          description: 'This permanently deletes the current table and all its data, and takes you back to the start screen. This action cannot be undone.',
          confirmLabel: 'Yes, delete',
        },
      },
      common: {
        cancel: 'Cancel',
      },
      editableText: {
        editHint: 'Double-click to edit',
      },
    },
  },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: 'fa',
    fallbackLng: 'fa',
    interpolation: { escapeValue: false },
  });
}

export default i18n;