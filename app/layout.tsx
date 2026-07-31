export const metadata = {
  title: 'Hızlı Notlar',
  description: 'Basit ve hızlı not alma uygulaması',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
