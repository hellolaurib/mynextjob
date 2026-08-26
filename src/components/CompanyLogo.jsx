import { initials } from '../data/jobs';

export default function CompanyLogo({ name, size = 44, radius = 10 }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center bg-fill font-bold text-ink-3"
      style={{ width: size, height: size, borderRadius: radius, fontSize: size * 0.32 }}
    >
      {initials(name)}
    </span>
  );
}
