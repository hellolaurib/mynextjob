import { useNavigate, useParams, Link } from 'react-router-dom';
import { JOBS } from '../data/jobs';
import CompanyLogo from '../components/CompanyLogo';
import { useApp } from '../state/AppContext';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = JOBS.find((j) => j.id === id);
  const { hasApplied, isSaved, applyToJob, toggleSaved } = useApp();

  if (!job) {
    return (
      <div className="mx-auto max-w-[1200px] px-8 py-20 text-center">
        <p className="text-ink-3">No encontramos esa vacante.</p>
        <Link to="/empleos" className="mt-3 inline-block text-sm font-semibold text-accent-ink">
          Volver a resultados
        </Link>
      </div>
    );
  }

  const applied = hasApplied(job.id);
  const saved = isSaved(job.id);
  const cumplidos = job.requisitosDetalle.filter((r) => r.cumplido).length;

  return (
    <div className="mx-auto max-w-[1200px] px-8 pb-20 pt-6">
      <button onClick={() => navigate(-1)} className="mb-5 text-sm text-ink-3 transition-colors hover:text-ink">
        ← Volver a resultados
      </button>

      <div className="grid gap-7 lg:grid-cols-[1fr_372px]">
        <div className="rounded-[14px] border border-border bg-white p-6 sm:p-9 sm:pt-9">
          <div className="mb-7 flex items-start gap-4">
            <CompanyLogo name={job.empresa} size={52} radius={12} />
            <div>
              <h1 className="text-[24px] font-bold leading-tight tracking-[-0.025em] text-ink sm:text-[28px]">
                {job.titulo}
              </h1>
              <p className="mt-1 text-[14.5px] text-ink-3">
                {job.empresa} · {job.zona} · Publicado {job.publicadoHace}
              </p>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-border bg-border sm:grid-cols-4">
            {[
              ['Turno', job.turnoHorario],
              ['Jornada', job.jornada],
              ['Traslado', `${job.trasladoMin} min desde tu zona`],
              ['Contrato', job.contrato],
            ].map(([label, value]) => (
              <div key={label} className="bg-surface-2 px-4 py-3.5">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-4">{label}</p>
                <p className="mt-1 text-[14.5px] font-semibold text-ink">{value}</p>
              </div>
            ))}
          </div>

          <section className="mb-8">
            <h2 className="mb-2.5 text-[17px] font-bold text-ink">Sobre el puesto</h2>
            <p className="text-[15px] leading-[1.62] text-ink-2">{job.sobreElPuesto}</p>
          </section>

          <section className="mb-8">
            <h2 className="mb-2.5 text-[17px] font-bold text-ink">Responsabilidades</h2>
            <ul className="flex flex-col gap-2 pl-[18px] text-[15px] leading-[1.55] text-ink-2">
              {job.responsabilidades.map((r) => (
                <li key={r} className="list-disc marker:text-ink-4">
                  {r}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-2.5 text-[17px] font-bold text-ink">Requisitos</h2>
            <div className="flex flex-col gap-2">
              {job.requisitosDetalle.map((r) => (
                <div
                  key={r.label}
                  className={`flex items-center gap-[11px] rounded-[9px] border px-3.5 py-[11px] ${
                    r.cumplido ? 'border-divider bg-surface-2' : 'border-accent-border bg-accent-bg-2'
                  }`}
                >
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                      r.cumplido ? 'bg-positive/15 text-positive' : 'bg-accent-border text-accent-ink'
                    }`}
                  >
                    {r.cumplido ? '✓' : '!'}
                  </span>
                  <span className="flex-1 text-[14.5px] text-ink-2">{r.label}</span>
                  <span className={`text-[12.5px] font-semibold ${r.cumplido ? 'text-positive' : 'text-accent-ink'}`}>
                    {r.cumplido ? 'Lo cumples' : 'Falta en tu perfil'}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-2.5 text-[17px] font-bold text-ink">Prestaciones</h2>
            <div className="flex flex-wrap gap-2">
              {job.prestaciones.map((p) => (
                <span key={p} className="rounded-[7px] bg-fill-2 px-3 py-[7px] text-[13.5px] text-ink-2">
                  {p}
                </span>
              ))}
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-3.5 lg:sticky lg:top-[92px] lg:h-fit">
          {!applied ? (
            <div className="rounded-[14px] border border-border bg-white p-6">
              <div className="flex items-center gap-3.5 border-b border-divider pb-4">
                <span
                  className="relative flex size-[60px] shrink-0 items-center justify-center rounded-full"
                  style={{ background: `conic-gradient(#E08FA3 0% ${job.match}%, #F1EDEE ${job.match}% 100%)` }}
                >
                  <span className="flex size-[47px] items-center justify-center rounded-full bg-white text-[15px] font-bold text-ink">
                    {job.match}
                  </span>
                </span>
                <div>
                  <p className="text-[15px] font-bold text-ink">{job.matchLabel}</p>
                  <p className="text-[13px] text-ink-3">
                    Cumples {cumplidos} de {job.requisitosDetalle.length} requisitos clave.
                  </p>
                </div>
              </div>

              <p className="mt-4 text-[22px] font-bold tracking-[-0.02em] text-ink">{job.salario}</p>
              <p className="text-[13.5px] text-ink-3">Pago quincenal · Contrato directo</p>

              <button
                onClick={() => applyToJob(job)}
                className="mt-4 w-full rounded-[10px] bg-ink py-3.5 text-[15px] font-[650] text-white transition-opacity hover:opacity-90"
              >
                Postular con mi perfil
              </button>
              <button
                onClick={() => toggleSaved(job.id)}
                className="mt-2.5 w-full rounded-[10px] border border-border-strong py-3 text-[14.5px] font-medium text-ink transition-colors hover:border-ink"
              >
                {saved ? 'Vacante guardada ✓' : 'Guardar vacante'}
              </button>
              <p className="mt-3 text-[12.5px] text-ink-4">
                Se envía tu perfil de Turno. La empresa responde en 3 días en promedio.
              </p>
            </div>
          ) : (
            <div className="rounded-[14px] border border-accent-border bg-accent-bg-2 p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-accent text-[18px] font-bold text-ink">
                ✓
              </span>
              <h3 className="mt-3 text-[18px] font-bold text-ink">Postulación enviada</h3>
              <p className="mt-1 text-sm text-accent-text-soft">
                {job.empresa} recibió tu perfil. Te avisamos por WhatsApp cuando lo revisen.
              </p>
              <button
                onClick={() => navigate('/postulaciones')}
                className="mt-4 w-full rounded-[10px] bg-ink py-3.5 text-[15px] font-[650] text-white transition-opacity hover:opacity-90"
              >
                Ver mis postulaciones
              </button>
            </div>
          )}

          <div className="rounded-[14px] border border-border bg-white p-[22px]">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-4">Sobre la empresa</p>
            <p className="mt-2 text-[15px] font-[650] text-ink">{job.empresa}</p>
            <dl className="mt-3 flex flex-col gap-2">
              {[
                ['Sector', job.empresaInfo.sector],
                ['Empleados', job.empresaInfo.empleados],
                ['Responde en', job.empresaInfo.respondeEn],
                ['Vacantes activas', job.empresaInfo.vacantesActivas],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-[13.5px]">
                  <dt className="text-ink-3">{k}</dt>
                  <dd className="font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
