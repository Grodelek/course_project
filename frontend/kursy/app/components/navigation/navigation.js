import NavLink from "./navlink";

export default function Navigation() {
    return (
      <nav>
        <NavLink href="/autorzy">Autorzy</NavLink>
        <NavLink href="/test">Link 1</NavLink>
        <NavLink href="/test">Link 2</NavLink>
      </nav>
    );
  }