import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { JOBS, USER, initials } from '../data/jobs';
import MatchPill from '../components/MatchPill';

const CHIPS = [
  { label: 'Turno nocturno', param: 'turno', value: 'Nocturno' },
  { label: 'Sin experiencia', param: 'requisito', value: 'Sin experiencia' },
  { label: 'Medio tiempo', param: 'jornada', value: 'Medio tiempo' },
  { label: 'Cerca de mi casa', param: 'traslado', value: '20' },
  { label: 'Con certificación', param: 'requisito', value: 'Con certificación' },
];

const VALUES = [
  {
    n: '01',
    title: 'El turno primero',
    body: 'Filtramos por horario real antes que por título del puesto. Si no puedes de noche, no lo verás.',
  },
  {
    n: '02',
    title: 'Distancia, no ciudad',
    body: 'Calculamos minutos de traslado desde tu zona en transporte público, no kilómetros en línea recta.',
  },
  {
    n: '03',
    title: 'Requisitos claros',
    body: 'Cada vacante muestra qué cumples y qué te falta antes de que gastes tiempo postulando.',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('Auxiliar de almacén');
  const [zona, setZona] = useState('Iztapalapa, CDMX');

  function goSearch(extraParams = {}) {
    const params = new URLSearchParams({ q: query, zona, ...extraParams });
    navigate(`/empleos?${params.toString()}`);
  }

  const recomendadas = [...JOBS].sort((a, b) => b.match - a.match);

  return (
    <>
      <section className="border-b border-border bg-white px-8 pb-16 pt-[72px]">
        <div className="mx-auto grid max-w-[1200px] items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.09em] text-accent-ink">
              Operaciones · Retail · Salud · Servicio
            </p>
            <h1 className="balance max-w-2xl text-[38px] font-bold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[54px] sm:leading-[1.03]">
              Empleos que encajan con tu turno, tu zona y tu experiencia.
            </h1>
            <p className="balance mt-5 max-w-[520px] text-base leading-[1.55] text-ink-3 sm:text-[17px]">
              Dinos cuándo puedes trabajar y hasta dónde te mueves. Ordenamos las vacantes por qué tan bien te
              quedan, no por quién pagó más publicidad.
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
                placeholder="Puesto o palabra clave"
              />
              <span className="hidden h-6 w-px shrink-0 bg-border sm:block" />
              <input
                value={zona}
                onChange={(e) => setZona(e.target.value)}
                className="w-full shrink-0 rounded-lg border-none bg-transparent px-3 py-2 text-[14.5px] text-ink outline-none placeholder:text-ink-4 sm:w-[170px]"
                placeholder="Zona"
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
            <p className="font-mono text-[11px] uppercase tracking-[0.09em] text-accent-ink">
              Tu perfil de disponibilidad
            </p>
            <dl className="mt-5 flex flex-col">
              {[
                ['Turnos que puedo cubrir', USER.turnos.join(', ')],
                ['Traslado máximo', `${USER.trasladoMax} min`],
                ['Zona base', USER.zonaBase],
                ['Certificaciones', USER.certificaciones.join(' · ')],
              ].map(([k, v], i, arr) => (
                <div
                  key={k}
                  className={`flex items-center justify-between py-[10px] ${
                    i < arr.length - 1 ? 'border-b border-accent-border' : ''
                  }`}
                >
                  <dt className="text-[13.5px] text-accent-text-soft">{k}</dt>
                  <dd className="text-right text-[14.5px] font-semibold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <button
              onClick={() => goSearch()}
              className="mt-5 w-full rounded-[9px] bg-accent py-3 text-[14.5px] font-bold text-ink transition-colors hover:bg-accent-hover"
            >
              Ver mis {JOBS.length} coincidencias
            </button>
            <p className="mt-3 text-[12.5px] text-accent-text-soft-2">
              Editable en cualquier momento. Nunca compartimos tu ubicación exacta con la empresa.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-8 pb-20 pt-14">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[20px] font-bold tracking-[-0.02em] text-ink sm:text-[23px]">
            Recomendadas para ti esta semana
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

        <div className="mt-14 grid gap-10 border-t border-divider pt-10 sm:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.n}>
              <p className="font-mono text-[13px] text-accent-ink">{v.n}</p>
              <h4 className="mt-2 text-base font-[650] text-ink">{v.title}</h4>
              <p className="mt-1.5 text-sm leading-[1.55] text-ink-3">{v.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
