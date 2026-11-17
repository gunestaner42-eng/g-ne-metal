
import "./globals.css";

export const metadata = {
  title: "Güneş Metal",
  description: "Güneş Metal - Metal ve Endüstriyel Malzemeler",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
