import "./globals.css";
import Navigation from "./navigation";
import logoImg from '@/assets/logo3.png';


export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className=""
      >
        <header>
        <img src={logoImg.src} alt="Logo strony" width="100" height="100"/>
        <Navigation />
        </header>
        <main>
          <div className="m-10 rounded-xl bg-[#EEEEEE] min-h-9/10">
            {children}
          </div>
        </main>
        
        <footer className="bg-black text-white">
          <div>|</div>
          <div>Michał Dańko</div>
          <div>|</div>
          <div>Artur Grodel</div>
          <div>|</div>
          <div>Filip Kłos</div>
          <div>|</div>
          <div>Andrzej Posim</div>
          <div>|</div>
        </footer>
      </body>
    </html>
  );
}
