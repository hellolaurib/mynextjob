import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { JOBS, USER, initials } from '../data/jobs';
import MatchPill from '../components/MatchPill';

const CHIPS = [
  { label: '100% remoto', param: 'modalidad', value: '100% remoto' },
  { label: 'Colombia remoto', param: 'modalidad', value: 'Colombia remoto' },
  { label: 'Figma', param: 'stack', value: 'Figma' },
  { label: 'Shopify', param: 'stack', value: 'Shopify' },
];

const ANIMO = [
  {
    header: 'Estoy abierta y receptiva a un trabajo maravilloso.',
    subheader: 'Uso mis talentos de una forma positiva y satisfactoria, y la vida me apoya en cada paso.',
  },
  {
    header: 'El trabajo correcto me está buscando a mí también.',
    subheader: 'En el momento perfecto, de la forma perfecta, nos vamos a encontrar. Confío en el proceso de la vida.',
  },
  {
    header: 'Merezco un trabajo que ame y que me ame.',
    subheader: 'Libero toda duda y toda prisa. Lo que es para mí no se me va a escapar.',
  },
  {
    header: 'Cada puerta que se cierra me acerca a la correcta.',
    subheader: 'Confío en que la vida siempre está trabajando a mi favor, aunque hoy no lo vea completo.',
  },
  {
    header: 'Soy suficiente, exactamente como soy ahora.',
    subheader: 'Mi experiencia, mi criterio y mi forma de ver el diseño ya tienen un lugar esperándolas.',
  },
  {
    header: 'Elijo pensamientos que me hacen sentir en paz con este proceso.',
    subheader: 'Un paso a la vez. No tengo que resolver todo hoy — solo el siguiente paso.',
  },
  {
    header: 'La abundancia se mueve libremente hacia mí.',
    subheader: 'Nuevas y buenas oportunidades se abren para mí ahora, de maneras que ni siquiera imagino todavía.',
  },
  {
    header: 'Me libero de la ansiedad y elijo confiar.',
    subheader: 'Estoy a salvo. La vida me ama y me sostiene, incluso en los días de espera.',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [animo] = useState(() => ANIMO[Math.floor(Math.random() * ANIMO.length)]);

  function goSearch(extraParams = {}) {
    const params = new URLSearchParams({ q: query, ...extraParams });
    navigate(`/empleos?${params.toString()}`);
  }

  const recomendadas = [...JOBS].sort((a, b) => b.match - a.match);

  return (
    <>
      <section className="border-b border-border bg-white px-8 pb-16 pt-[72px]">
        <div className="mx-auto grid max-w-[1200px] items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.09em] text-accent-ink">
              Tu búsqueda de empleo · UX/UI Design
            </p>
            <h1 className="balance max-w-2xl text-[32px] font-bold leading-[1.15] tracking-[-0.03em] text-ink sm:text-[44px] sm:leading-[1.1]">
              {animo.header}
            </h1>
            <p className="balance mt-5 max-w-[520px] text-base leading-[1.55] text-ink-3 sm:text-[17px]">
              {animo.subheader}
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                goSearch();
              }}
              className="mt-7 flex max-w-[560px] flex-col gap-2 rounded-xl border border-border-strong bg-white p-2 shadow-[0_8px_28px_-18px_rgba(20,22,28,0.4)] sm:flex-row sm:items-center"
            >
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 rounded-lg border-none bg-transparent px-3 py-2 text-[14.5px] text-ink outline-none placeholder:text-ink-4"
                placeholder="Puesto, empresa o palabra clave"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-ink px-[22px] py-3 text-[14.5px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                Buscar
              </button>
            </form>

            <div className="mt-[18px] flex flex-wrap gap-2">
              {CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => goSearch({ [chip.param]: chip.value })}
                  className="rounded-full border border-border px-[13px] py-[6px] text-[13px] text-ink-3 transition-colors hover:border-ink hover:text-ink"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-accent-border bg-accent-bg-2 p-[26px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.09em] text-accent-ink">Tu perfil</p>
            <dl className="mt-5 flex flex-col">
              {[
                ['Rol objetivo', USER.rolObjetivo],
                ['Ubicación', USER.ubicacion],
                ['Modalidad', USER.modalidad.join(' · ')],
                ['Disponibilidad', USER.disponibilidad],
                ['Stack', USER.stack.join(' · ')],
              ].map(([k, v], i, arr) => (
                <div
                  key={k}
                  className={`flex items-center justify-between gap-4 py-[10px] ${
                    i < arr.length - 1 ? 'border-b border-accent-border' : ''
                  }`}
                >
                  <dt className="shrink-0 text-[13.5px] text-accent-text-soft">{k}</dt>
                  <dd className="text-right text-[14.5px] font-semibold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <button
              onClick={() => goSearch()}
              className="mt-5 w-full rounded-[9px] bg-accent py-3 text-[14.5px] font-bold text-ink transition-colors hover:bg-accent-hover"
            >
              Ver las {JOBS.length} vacantes curadas
            </button>
            <p className="mt-3 text-[12.5px] text-accent-text-soft-2">
              Curado a mano por Claude — no es un feed automático. Pídele que busque más cuando quieras.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-8 pb-20 pt-14">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[20px] font-bold tracking-[-0.02em] text-ink sm:text-[23px]">
            Recomendadas para ti
          </h2>
          <Link to="/empleos" className="text-sm font-semibold text-accent-ink">
            Ver las {JOBS.length} →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recomendadas.map((job) => (
            <Link
              key={job.id}
              to={`/empleos/${job.id}`}
              className="flex flex-col gap-3.5 rounded-xl border border-border bg-white p-5 transition-colors hover:border-ink"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-[38px] items-center justify-center rounded-[9px] bg-fill text-[13px] font-bold text-ink-3">
                  {initials(job.empresa)}
                </span>
                <MatchPill match={job.match} />
              </div>
              <div>
                <h3 className="text-[16.5px] font-[650] leading-snug text-ink">{job.titulo}</h3>
                <p className="mt-1 text-[13.5px] text-ink-3">
                  {job.empresa} · {job.zona}
                </p>
              </div>
              <div className="mt-auto flex flex-wrap gap-1.5">
                {job.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="rounded-md bg-fill-2 px-2 py-1 text-xs text-ink-3">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm font-semibold text-ink">{job.salario}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
