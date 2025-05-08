import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
//import Brama from "./components/auth/Brama";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kursy Internetowe",
  description: "Platforma kursów online",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className={inter.className}>
      <head/>
      <body className="bg-gray-100 text-gray-900">
        
        <main>{children}</main>
        
        <footer className="bg-gray-900 text-white py-4">
        <div className="container mx-auto flex flex-wrap justify-center items-center space-x-2">
            <div>  <Link href="/regulamin">
    <span className="underline hover:text-white">Regulamin</span>
  </Link></div>
          </div>
          <div className="container mx-auto flex flex-wrap justify-center items-center space-x-2">
            <div>Michał Dańko</div>
            <div>|</div>
            <div>Artur Grodel</div>
            <div>|</div>
            <div>Filip Kłos</div>
            <div>|</div>
            <div>Andrzej Posim</div>
          </div>
          <div className="container mx-auto flex flex-wrap justify-center items-center space-x-2">
            <div><Link href="/polityka-prywatnosci">
    <span className="underline hover:text-white">Politykę prywatności</span>
  </Link></div>
          </div>
        </footer>
      </body>
    </html>
  );
}
