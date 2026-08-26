import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { JOBS, USER, FILTER_COUNTS } from '../data/jobs';
import MatchPill from '../components/MatchPill';
import CompanyLogo from '../components/CompanyLogo';

const TURNOS = ['Nocturno', 'Matutino', 'Vespertino', 'Rol 12x12'];
const TRASLADOS = [20, 30, 45];
const JORNADAS = ['Tiempo completo', 'Medio tiempo', 'Por proyecto'];
const REQUISITOS = ['Sin experiencia', 'Con certificación', 'Con licencia'];

function toList(param) {
  return param ? param.split(',').filter(Boolean) : [];
}

function CheckRow({ label, count, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={`flex size-4 shrink-0 items-center justify-center rounded-[4px] border-[1.5px] transition-colors ${
          checked ? 'border-ink bg-ink' : 'border-[#cbcfd7] bg-white'
        }`}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="flex-1 text-sm text-ink-2">{label}</span>
      <span className="text-[12.5px] text-[#a0a5b0]">{count}</span>
    </label>
  );
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [zona, setZona] = useState(searchParams.get('zona') || USER.zonaBase);

  const turno = toList(searchParams.get('turno')) || [];
  const requisito = toList(searchParams.get('requisito'));
  const jornada = toList(searchParams.get('jornada') || 'Tiempo completo');
  const traslado = toList(searchParams.get('traslado') || '30').map(Number);
  const matchMin = Number(searchParams.get('matchMin') || 60);
  const orden = searchParams.get('orden') || 'match';

  function updateParams(patch) {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
        next.delete(key);
      } else if (Array.isArray(value)) {
        next.set(key, value.join(','));
      } else {
        next.set(key, String(value));
      }
    });
    setSearchParams(next, { replace: true });
  }

  function toggleInGroup(param, current, value) {
    const set = new Set(current);
    set.has(value) ? set.delete(value) : set.add(value);
    updateParams({ [param]: Array.from(set) });
  }

  const results = useMemo(() => {
    let list = JOBS.filter((job) => {
      if (turno.length && !turno.includes(job.turno)) return false;
      if (traslado.length && job.trasladoMin > Math.max(...traslado)) return false;
      if (jornada.length && !jornada.includes(job.jornada)) return false;
      if (requisito.length && !requisito.some((r) => job.requisitos.includes(r))) return false;
      if (job.match < matchMin) return false;
      if (query.trim() && !job.titulo.toLowerCase().includes(query.trim().toLowerCase())) return false;
      return true;
    });

    if (orden === 'recientes') list = [...list].sort((a, b) => a.diasAgo - b.diasAgo);
    else if (orden === 'salario') list = [...list].sort((a, b) => b.salarioMensual - a.salarioMensual);
    else list = [...list].sort((a, b) => b.match - a.match);

    return list;
  }, [turno, traslado, jornada, requisito, matchMin, orden, query]);

  const filterGroups = [
    { key: 'turno', title: 'Turno', options: TURNOS, current: turno, counts: FILTER_COUNTS.turno },
    {
      key: 'traslado',
      title: 'Tiempo de traslado',
      options: TRASLADOS,
      current: traslado.map(String),
      counts: FILTER_COUNTS.traslado,
      labelFn: (v) => `Hasta ${v} min`,
    },
    { key: 'jornada', title: 'Jornada', options: JORNADAS, current: jornada, counts: FILTER_COUNTS.jornada },
    {
      key: 'requisito',
      title: 'Requisitos',
      options: REQUISITOS,
      current: requisito,
      counts: FILTER_COUNTS.requisitos,
    },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-8 pb-20 pt-7">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateParams({ q: query, zona });
        }}
        className="mb-6 flex flex-col gap-2 rounded-[11px] border border-border-strong bg-white p-[7px] sm:flex-row sm:items-center"
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
          className="w-full shrink-0 rounded-lg border-none bg-transparent px-3 py-2 text-[14.5px] text-ink outline-none placeholder:text-ink-4 sm:w-[230px]"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-ink px-[22px] py-3 text-[14.5px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          Buscar
        </button>
      </form>

      <div className="grid gap-7 lg:grid-cols-[264px_1fr]">
        <aside className="sticky top-[92px] h-fit rounded-xl border border-border bg-white p-5">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-ink">Filtros</h3>
            <button
              onClick={() =>
                setSearchParams(
                  (prev) => {
                    const p = new URLSearchParams(prev);
                    ['turno', 'traslado', 'jornada', 'requisito', 'matchMin'].forEach((k) => p.delete(k));
                    return p;
                  },
                  { replace: true },
                )
              }
              className="text-[13px] text-accent-ink"
            >
              Limpiar
            </button>
          </div>
          {filterGroups.map((group) => (
            <div key={group.key} className="mb-[18px] border-b border-divider pb-[18px] last:mb-0 last:border-b-0 last:pb-0">
              <p className="mb-1 font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-4">{group.title}</p>
              {group.options.map((opt) => {
                const label = group.labelFn ? group.labelFn(opt) : opt;
                const checked = group.current.includes(String(opt));
                return (
                  <CheckRow
                    key={opt}
                    label={label}
                    count={group.counts[opt]}
                    checked={checked}
                    onChange={() => toggleInGroup(group.key, group.current, String(opt))}
                  />
                );
              })}
            </div>
          ))}
          <div>
            <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-4">
              Compatibilidad mínima
            </p>
            <input
              type="range"
              min={60}
              max={100}
              value={matchMin}
              onChange={(e) => updateParams({ matchMin: e.target.value })}
              className="w-full accent-accent"
            />
            <div className="mt-1 flex justify-between text-[12.5px] text-ink-4">
              <span>60%</span>
              <span>100%</span>
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-3">
              <span className="font-[650] text-ink">{results.length} vacantes</span> cerca de{' '}
              {zona.split(',')[0]}
            </p>
            <div className="flex gap-[3px] rounded-lg bg-[#edeef1] p-[3px]">
              {[
                ['match', 'Compatibilidad'],
                ['recientes', 'Más recientes'],
                ['salario', 'Salario'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => updateParams({ orden: value })}
                  className={`rounded-md px-3 py-1.5 text-[13px] transition-colors ${
                    orden === value ? 'bg-white font-[650] text-ink' : 'text-ink-3'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {results.map((job) => (
              <Link
                key={job.id}
                to={`/empleos/${job.id}`}
                className="grid grid-cols-[44px_1fr_auto] items-start gap-4 rounded-xl border border-border bg-white p-5 transition-all duration-150 hover:border-ink hover:shadow-[0_10px_30px_-22px_rgba(20,22,28,0.55)]"
              >
                <CompanyLogo name={job.empresa} />
                <div>
                  <h3 className="text-[17px] font-[650] leading-snug tracking-[-0.012em] text-ink">{job.titulo}</h3>
                  <p className="mb-3 mt-0.5 text-[13.5px] text-ink-3">
                    {job.empresa} · {job.zona} · publicada {job.publicadoHace}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {job.tags.map((tag) => (
                      <span key={tag} className="rounded-md bg-fill-2 px-[9px] py-1 text-[12.5px] text-ink-3">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3.5">
                    {job.matchReasons.map((reason) => (
                      <span key={reason} className="flex items-center gap-1.5 text-[12.5px] text-accent-ink">
                        <span className="size-[5px] rounded-full bg-accent" />
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2.5">
                  <MatchPill match={job.match} />
                  <p className="whitespace-nowrap text-[14.5px] font-[650] text-ink">{job.salario}</p>
                  <p className="text-[12.5px] text-ink-4">{job.jornada}</p>
                </div>
              </Link>
            ))}
            {results.length === 0 && (
              <div className="rounded-xl border border-border bg-white p-10 text-center">
                <p className="text-[15px] text-ink-2">
                  Ninguna vacante con {matchMin}%+ de compatibilidad. Prueba ampliar el traslado a 45 min.
                </p>
                <button
                  onClick={() => updateParams({ matchMin: 60, traslado: ['45'] })}
                  className="mt-4 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Ampliar búsqueda
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
