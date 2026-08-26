import { matchTierClasses } from '../data/jobs';

export default function MatchPill({ match }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[13px] font-bold ${matchTierClasses(match)}`}
    >
      {match}%
    </span>
  );
}
