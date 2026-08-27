import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Table Builder',
    description: 'ساخت جدول دلخواه با درگ و اکسپورت به Word, Excel, CSV',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fa" dir="ltr">
        <body className="font-sans text-gray-400">{children}</body>
        </html>
    );
}
