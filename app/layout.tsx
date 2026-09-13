import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Y / X — Producer, Production Designer, Writer", description: "A personal portfolio for film, photography, graphic design and illustration." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
