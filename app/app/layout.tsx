export const metadata = {
  title: "Docházkový systém",
  description: "Evidence docházky a dovolené",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
