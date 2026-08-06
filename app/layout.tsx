import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CGONYC — Future Made Physical",
  description: "Moda autoral, estátuas e objetos decorativos criados pela CGONYC.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
