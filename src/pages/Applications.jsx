import { useState } from 'react';
import { Link } from 'react-router-dom';
import { JOBS } from '../data/jobs';
import CompanyLogo from '../components/CompanyLogo';
import { useApp } from '../state/AppContext';

const STATUS = {
  Entrevista: { filled: 3, badgeBg: '#17181C', badgeText: '#FFFFFF', segment: '#17181C' },
  'En revisión': { filled: 2, badgeBg: '#FCEDF1', badgeText: '#A24261', segment: '#E08FA3' },
  Enviada: { filled: 1, badgeBg: '#FCEDF1', badgeText: '#A24261', segment: '#E08FA3' },
  'Sin respuesta': { filled: 1, badgeBg: '#F7F3F4', badgeText: '#8A8F9C', segment: '#C9CDD5' },
  Cerrada: { filled: 4, badgeBg: '#F7F3F4', badgeText: '#8A8F9C', segment: '#C9CDD5' },
};

const STATUS_OPTIONS = Object.keys(STATUS);
const TABS = ['Activas', 'Archivadas', 'Guardadas'];

function Pipeline({ estado }) {
  const cfg = STATUS[estado];
  return (
    <div className="flex flex-1 gap-[5px]">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="h-1 flex-1 rounded-full"
          style={{ background: i < cfg.filled ? cfg.segment : '#F2ECEE' }}
        />
      ))}
    </div>
  );
}

export default function Applications() {
  const [tab, setTab] = useState('Activas');
  const { applications, savedJobIds, lastAppliedJobId, toggleSaved, updateStatus } = useApp();

  const activas = applications.filter((a) => a.estado !== 'Cerrada');
  const archivadas = applications.filter((a) => a.estado === 'Cerrada');
  const pendientes = applications.filter((a) => a.estado === 'Entrevista' || a.estado === 'En revisión').length;
  const savedJobs = savedJobIds.map((id) => JOBS.find((j) => j.id === id)).filter(Boolean);

  const rows = tab === 'Activas' ? activas : tab === 'Archivadas' ? archivadas : [];

  return (
    <div className="mx-auto max-w-[1000px] px-8 pb-20 pt-10">
      <h1 className="text-[26px] font-bold tracking-[-0.02em] text-ink sm:text-[30px]">Mis postulaciones</h1>
      <p className="mt-1.5 text-[15px] text-ink-3">
        {applications.length === 0
          ? 'Aún no has marcado ninguna postulación.'
          : `${activas.length} activas · ${pendientes} con respuesta pendiente de tu parte`}
      </p>

      <div className="mt-6 mb-5 inline-flex gap-[3px] rounded-lg bg-[#edeef1] p-[3px]">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-4 py-1.5 text-[13.5px] transition-colors ${
              tab === t ? 'bg-white font-[650] text-ink' : 'text-ink-3'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab !== 'Guardadas' ? (
        <div className="overflow-hidden rounded-[13px] border border-border bg-white">
          {rows.map((app) => {
            const cfg = STATUS[app.estado];
            const isNew = app.jobId === lastAppliedJobId;
            const job = JOBS.find((j) => j.id === app.jobId);
            return (
              <div
                key={app.jobId}
                className={`grid grid-cols-[40px_1fr] items-center gap-3 border-b border-divider p-[18px] transition-colors last:border-b-0 hover:bg-surface-2 sm:grid-cols-[40px_1fr_180px_150px] sm:gap-[18px] ${
                  isNew ? 'bg-accent-bg-2' : ''
                }`}
              >
                <CompanyLogo name={app.empresa} size={40} radius={9} />
                <Link to={job ? `/empleos/${job.id}` : '#'}>
                  <p className="text-[15.5px] font-[650] text-ink">{app.titulo}</p>
                  <p className="text-[13px] text-ink-4">
                    {app.empresa} · Postulaste {app.fecha}
                  </p>
                </Link>
                <div className="col-span-2 mt-2 sm:col-span-1 sm:mt-0">
                  <Pipeline estado={app.estado} />
                </div>
                <select
                  value={app.estado}
                  onChange={(e) => updateStatus(app.jobId, e.target.value)}
                  className="w-fit cursor-pointer rounded-full border-none px-[11px] py-[5px] text-[12.5px] font-[650] outline-none"
                  style={{ background: cfg.badgeBg, color: cfg.badgeText }}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
          {rows.length === 0 && (
            <p className="p-10 text-center text-sm text-ink-3">
              {applications.length === 0 ? (
                <>
                  Cuando postules a una vacante desde su página de detalle, aparecerá aquí.{' '}
                  <Link to="/empleos" className="font-semibold text-accent-ink">
                    Buscar empleos →
                  </Link>
                </>
              ) : (
                `No tienes postulaciones ${tab === 'Archivadas' ? 'archivadas' : 'activas'} todavía.`
              )}
            </p>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[13px] border border-border bg-white">
          {savedJobs.map((job) => (
            <div key={job.id} className="flex items-center gap-4 border-b border-divider p-[18px] last:border-b-0">
              <CompanyLogo name={job.empresa} size={40} radius={9} />
              <Link to={`/empleos/${job.id}`} className="flex-1">
                <p className="text-[15.5px] font-[650] text-ink">{job.titulo}</p>
                <p className="text-[13px] text-ink-4">
                  {job.empresa} · {job.zona}
                </p>
              </Link>
              <button onClick={() => toggleSaved(job.id)} className="shrink-0 text-[13px] text-accent-ink">
                Quitar
              </button>
            </div>
          ))}
          {savedJobs.length === 0 && (
            <p className="p-10 text-center text-sm text-ink-3">
              Aún no guardas ninguna vacante.{' '}
              <Link to="/empleos" className="font-semibold text-accent-ink">
                Buscar empleos →
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
