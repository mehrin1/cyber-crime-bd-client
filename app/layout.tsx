import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import { SafeBotLauncher } from "@/components/features/chat/SafeBot";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <div className="min-h-[calc(100svh-300px)]">
          {children}
        </div>
        <Footer />
        <SafeBotLauncher />
        </body>
    </html>
  );
}
