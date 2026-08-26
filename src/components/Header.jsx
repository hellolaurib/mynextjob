import { NavLink } from 'react-router-dom';
import { USER } from '../data/jobs';

const navLinkClass = ({ isActive }) =>
  `rounded-[7px] px-3 py-2 text-[14.5px] transition-colors duration-150 ${
    isActive ? 'font-[650] text-ink' : 'font-[450] text-ink-3 hover:bg-fill'
  }`;

export default function Header() {
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border bg-white/92 backdrop-blur-[8px]">
      <div className="mx-auto flex h-full max-w-[1200px] items-center gap-9 px-8">
        <NavLink to="/" className="flex items-center gap-2.5">
          <span className="relative block size-[22px] shrink-0 rounded-[6px] bg-ink">
            <span className="absolute left-[5px] top-[5px] block size-3 rounded-[3px] bg-accent" />
          </span>
          <span className="text-[19px] font-bold tracking-[-0.02em] text-ink">Turno</span>
        </NavLink>
        <nav className="flex flex-1 items-center gap-1">
          <NavLink to="/empleos" className={navLinkClass}>
            Buscar empleos
          </NavLink>
          <NavLink to="/postulaciones" className={navLinkClass}>
            Mis postulaciones
          </NavLink>
        </nav>
        <div className="flex items-center gap-2.5">
          <span className="text-sm text-ink-3">{USER.nombre}</span>
          <span className="flex size-[34px] items-center justify-center rounded-full bg-[#eee7e9] text-[13px] font-bold text-ink-3">
            {USER.iniciales}
          </span>
        </div>
      </div>
    </header>
  );
}
