import { useNavigate, useParams, Link } from 'react-router-dom';
import { JOBS } from '../data/jobs';
import CompanyLogo from '../components/CompanyLogo';
import { useApp } from '../state/AppContext';

function RequisitoRow({ label, cumplido }) {
  if (cumplido === null) {
    return (
      <div className="flex items-center gap-[11px] rounded-[9px] border border-divider bg-surface-2 px-3.5 py-[11px]">
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-fill text-[12px] font-bold text-ink-4">
          ?
        </span>
        <span className="flex-1 text-[14.5px] text-ink-2">{label}</span>
        <span className="text-[12.5px] font-semibold text-ink-4">No lo sabemos aún</span>
      </div>
    );
  }
  return (
    <div
      className={`flex items-center gap-[11px] rounded-[9px] border px-3.5 py-[11px] ${
        cumplido ? 'border-divider bg-surface-2' : 'border-accent-border bg-accent-bg-2'
      }`}
    >
      <span
        className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
          cumplido ? 'bg-positive/15 text-positive' : 'bg-accent-border text-accent-ink'
        }`}
      >
        {cumplido ? '✓' : '!'}
      </span>
      <span className="flex-1 text-[14.5px] text-ink-2">{label}</span>
      <span className={`text-[12.5px] font-semibold ${cumplido ? 'text-positive' : 'text-accent-ink'}`}>
        {cumplido ? 'Lo cumples' : 'Revisa antes de aplicar'}
      </span>
    </div>
  );
}

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
  const cumplidos = job.requisitosDetalle.filter((r) => r.cumplido === true).length;
  const conocidos = job.requisitosDetalle.filter((r) => r.cumplido !== null).length;

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
              ['Modalidad', job.modalidad],
              ['Jornada', job.jornada],
              ['Salario', job.salario],
              ['Fuente', job.fuente],
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

          <section>
            <h2 className="mb-2.5 text-[17px] font-bold text-ink">Requisitos vs. tu perfil</h2>
            <p className="mb-3 text-[13px] text-ink-4">
              Comparado por Claude contra tu experiencia real. "No lo sabemos aún" significa que la publicación no
              lo aclara — revísalo en el sitio original.
            </p>
            <div className="flex flex-col gap-2">
              {job.requisitosDetalle.map((r) => (
                <RequisitoRow key={r.label} label={r.label} cumplido={r.cumplido} />
              ))}
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-3.5 lg:sticky lg:top-[92px] lg:h-fit">
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
                  Cumples {cumplidos} de {conocidos} requisitos que sí conocemos.
                </p>
              </div>
            </div>

            <p className="mt-4 text-[22px] font-bold tracking-[-0.02em] text-ink">{job.salario}</p>
            <p className="text-[13.5px] text-ink-3">{job.contrato}</p>

            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => applyToJob(job)}
              className="mt-4 block w-full rounded-[10px] bg-ink py-3.5 text-center text-[15px] font-[650] text-white transition-opacity hover:opacity-90"
            >
              Postularme en el sitio real ↗
            </a>
            <button
              onClick={() => toggleSaved(job.id)}
              className="mt-2.5 w-full rounded-[10px] border border-border-strong py-3 text-[14.5px] font-medium text-ink transition-colors hover:border-ink"
            >
              {saved ? 'Vacante guardada ✓' : 'Guardar vacante'}
            </button>
            <p className="mt-3 text-[12.5px] text-ink-4">
              Abre la publicación real de {job.empresa}. Aplicas ahí directamente — aquí solo queda el registro de
              que ya postulaste.
            </p>
          </div>

          {applied && (
            <div className="rounded-[14px] border border-accent-border bg-accent-bg-2 p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-accent text-[18px] font-bold text-ink">
                ✓
              </span>
              <h3 className="mt-3 text-[18px] font-bold text-ink">Marcada como postulada</h3>
              <p className="mt-1 text-sm text-accent-text-soft">
                Quedó registrada en Mis postulaciones con fecha de hoy.
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
            <p className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-4">Sobre la fuente</p>
            <p className="mt-2 text-[15px] font-[650] text-ink">{job.empresa}</p>
            <p className="mt-1 text-[13.5px] text-ink-3">
              Encontrada en {job.fuente}. Verifica siempre los datos y aplica desde la publicación original.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
