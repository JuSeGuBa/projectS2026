import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Este espacio es solo nuestro…",
  description:
    "Un universo creado solo para ti, refleja lo que eres para mi...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body style={{ background: "#070709", minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
