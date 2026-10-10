import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'GM Agro | Operations ERP',description:'Sales, field operations and quality — one connected workflow.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
