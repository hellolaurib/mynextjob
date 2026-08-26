import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AppContext = createContext(null);

const APPLICATIONS_KEY = 'turno.applications';
const SAVED_KEY = 'turno.savedJobIds';

const SEED_APPLICATIONS = [];

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }) {
  const [applications, setApplications] = useState(() => readJson(APPLICATIONS_KEY, SEED_APPLICATIONS));
  const [savedJobIds, setSavedJobIds] = useState(() => readJson(SAVED_KEY, []));
  const [lastAppliedJobId, setLastAppliedJobId] = useState(null);

  useEffect(() => {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(SAVED_KEY, JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  const value = useMemo(
    () => ({
      applications,
      savedJobIds,
      lastAppliedJobId,
      hasApplied: (jobId) => applications.some((a) => a.jobId === jobId),
      isSaved: (jobId) => savedJobIds.includes(jobId),
      applyToJob: (job) => {
        setApplications((prev) => {
          if (prev.some((a) => a.jobId === job.id)) return prev;
          return [
            { jobId: job.id, titulo: job.titulo, empresa: job.empresa, fecha: 'hoy', estado: 'Enviada' },
            ...prev,
          ];
        });
        setLastAppliedJobId(job.id);
      },
      toggleSaved: (jobId) => {
        setSavedJobIds((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]));
      },
      updateStatus: (jobId, estado) => {
        setApplications((prev) => prev.map((a) => (a.jobId === jobId ? { ...a, estado } : a)));
      },
    }),
    [applications, savedJobIds, lastAppliedJobId],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
