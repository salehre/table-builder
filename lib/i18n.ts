import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fa: {
    translation: {
      header: {
        support: 'حمایت',
        title: 'سازنده جدول',
        subtitle: 'مدیریت و خروجی جدول',
        switchLanguage: 'تغییر زبان',
      },
      export: {
        button: 'خروجی',
        word: 'خروجی Word',
        excel: 'خروجی Excel',
        sql: 'خروجی SQL',
        sqlTitle: 'فایل SQL شامل CREATE TABLE و INSERT',
        deleteTable: 'حذف جدول',
        wordName: 'Word',
        excelName: 'Excel',
        sqlName: 'SQL',
      },
      sidebar: {
        fileNameLabel: 'نام فایل خروجی',
        editTable: 'ویرایش جدول',
        addRow: 'افزودن ردیف',
        addColumn: 'افزودن ستون',
        savedTables: 'جدول‌های ذخیره‌شده',
        newTable: 'جدول جدید',
        deleteTable: 'حذف جدول',
        rowsCount: 'ردیف',
        colsCount: 'ستون',
        tipResizeCol: 'برای تغییر اندازه ستون، لبه راست آن را بگیرید و بکشید.',
        tipResizeRow: 'برای تغییر اندازه ردیف، لبه پایین آن را بگیرید و بکشید.',
        tipMove: 'برای جابجایی ستون یا ردیف، آیکون ⠿ را بگیرید و بکشید.',
        tipRename: 'برای تغییر نام ستون، ردیف یا سلول، دوبار کلیک کنید.',
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
        message: 'هنوز جدولی ایجاد نکرده‌اید. برای شروع اندازه جدول را مشخص کنید.',
        createButton: 'ساخت جدول',
      },
      newTable: {
        title: 'جدول جدید',
        description: 'تعداد ردیف و ستون را وارد کنید و جدول را بسازید.',
        rowsLabel: 'ردیف',
        colsLabel: 'ستون',
        countPlaceholder: 'مثلاً ۴',
        fileNameLabel: 'نام فایل خروجی',
        fileNamePlaceholder: 'الزامی',
        close: 'بستن',
        create: 'ساخت جدول',
      },
      confirm: {
        word: {
          title: 'خروجی Word',
          description: 'جدول فعلی به‌صورت فایل Word دانلود خواهد شد.',
          confirmLabel: 'دانلود',
        },
        excel: {
          title: 'خروجی Excel',
          description: 'جدول فعلی به‌صورت فایل Excel دانلود خواهد شد.',
          confirmLabel: 'دانلود',
        },
        sql: {
          title: 'خروجی SQL',
          description: 'یک اسکریپت SQL شامل دستورات CREATE TABLE و INSERT از جدول فعلی ایجاد خواهد شد.',
          confirmLabel: 'دانلود',
        },
        delete: {
          title: 'حذف جدول',
          description: 'این کار جدول فعلی و تمام داده‌های آن را برای همیشه حذف می‌کند و شما را به صفحه شروع بازمی‌گرداند.',
          confirmLabel: 'حذف',
        },
        deleteFromList: {
          title: 'حذف جدول',
          description: 'آیا مطمئن هستید که می‌خواهید این جدول را حذف کنید؟ تمام داده‌های آن برای همیشه حذف خواهند شد.',
          confirmLabel: 'حذف',
        },
      },
      common: {
        cancel: 'انصراف',
      },
      editableText: {
        editHint: 'برای ویرایش دوبار کلیک کنید',
      },
      toast: {
        tableCreated: 'جدول «{{name}}» با موفقیت ایجاد شد',
        tableNameRequired: 'برای ایجاد جدول، یک نام وارد کنید',
        exportSuccess: 'خروجی {{format}} با موفقیت دانلود شد',
        exportError: 'هنگام دریافت خروجی مشکلی پیش آمد. لطفاً دوباره تلاش کنید',
      },
    },
  },
  en: {
    translation: {
      header: {
        support: 'Support',
        title: 'Table Builder',
        subtitle: 'Manage and Export your Table',
        switchLanguage: 'Switch language',
      },
      export: {
        button: 'Export',
        word: 'Export Word',
        excel: 'Export Excel',
        sql: 'Export SQL',
        sqlTitle: 'SQL file with CREATE TABLE and INSERT',
        deleteTable: 'Delete table',
        wordName: 'Word',
        excelName: 'Excel',
        sqlName: 'SQL',
      },
      sidebar: {
        fileNameLabel: 'Output File Name',
        editTable: 'Edit Table',
        addRow: 'Add Row',
        addColumn: 'Add Col',
        savedTables: 'Saved Tables',
        newTable: 'New Table',
        deleteTable: 'Delete Table',
        rowsCount: 'Rows',
        colsCount: 'Cols',
        tipResizeCol: 'To resize a column, grab its right edge and drag it.',
        tipResizeRow: 'To resize a row, grab its bottom edge and drag it.',
        tipMove: 'To move a column or row, grab the ⠿ icon and drag it.',
        tipRename: 'Double-click a column, row, or cell name to rename it.',
      },
      table: {
        columnPrefix: 'Col',
        rowPrefix: 'Row',
        moveColumn: 'Move Column',
        moveRow: 'Move Row',
        removeColumn: 'Remove Column',
        removeRow: 'Remove Row',
      },
      emptyState: {
        message: "You haven't created a table yet Set a size to get started",
        createButton: 'Create Table',
      },
      newTable: {
        title: 'New Table',
        description: 'Enter the number of rows and columns and create the table',
        rowsLabel: 'Rows',
        colsLabel: 'Cols',
        countPlaceholder: 'e.g. 4',
        fileNameLabel: 'Output File Name',
        fileNamePlaceholder: 'Required',
        close: 'Close',
        create: 'Create Table',
      },
      confirm: {
        word: {
          title: 'Export Word',
          description: 'The current table will be downloaded as a Word file',
          confirmLabel: 'Download',
        },
        excel: {
          title: 'Export Excel',
          description: 'The current table will be downloaded as an Excel file',
          confirmLabel: 'Download',
        },
        sql: {
          title: 'Export SQL',
          description: 'A SQL script with CREATE TABLE and INSERT statements will be generated from the current table',
          confirmLabel: 'Download',
        },
        delete: {
          title: 'Delete table',
          description: 'This permanently deletes the current table and all its data and takes you back to the start screen.',
          confirmLabel: 'Delete',
        },
        deleteFromList: {
          title: 'Delete table',
          description: 'Are you sure you want to delete this table? All of its data will be permanently removed',
          confirmLabel: 'Delete',
        },
      },
      common: {
        cancel: 'Cancel',
      },
      editableText: {
        editHint: 'Double-click to edit',
      },
      toast: {
        tableCreated: 'Table "{{name}}" was created successfully',
        tableNameRequired: 'Please enter a name to create the table',
        exportSuccess: '{{format}} export downloaded successfully',
        exportError: 'Something went wrong while exporting. Please try again',
      },
    },
  },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
}

export default i18n;