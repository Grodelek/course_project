import logoImg from '@/assets/logo3.png';
import Navigation from '../navigation/navigation';

export default function Header() {
  return (
        <header class="flex fixed top-0 w-1/1">

            <div class="bg-white rounded-full ml-20">
                <img src={logoImg.src} alt="Logo strony" width="100" height="100"/>
            </div>
            <div class="mr-20 flex w-1/1">
                <Navigation />
            </div>
            <div>

            </div>
        </header>
  );
}
