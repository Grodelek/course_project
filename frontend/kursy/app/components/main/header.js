import logoImg from '@/assets/logo3.png';
import Navigation from '../navigation/navigation.js';

export default function Header() {
  return (
        <header className="flex fixed top-0 w-1/1">
            <div className="bg-white rounded-full ml-20">
                <img src={logoImg.src} alt="Logo strony" width="100" height="100"/>
            </div>
            <div className="mr-20 flex w-1/1">
                <Navigation />
            </div>
            <div>

            </div>
        </header>
  );
}
