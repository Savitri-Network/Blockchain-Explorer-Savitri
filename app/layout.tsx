import type { Metadata } from "next";
import { Manrope } from "next/font/google"
import Header from "@/components/Header/Header";
import '@/styles/global.scss';
import Footer from "@/components/Footer/Footer";
import WalletProvider, { WalletContext } from "@/context/wallet";

const manrope = Manrope({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Savitri Explorer",
  description: "Savitri Explorer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <WalletProvider>
          <Header />
          <div >
            {children}
          </div>
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
