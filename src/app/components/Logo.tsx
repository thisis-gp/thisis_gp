// The mark: a red tile with a G whose bar points at the middle, like a cursor landing on the problem.
export function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg className="logo" width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" className="logo-tile" />
      <path className="logo-g" d="M28.6 12.6 A11.5 11.5 0 1 0 30.5 25 V20.5 H20.5" />
    </svg>
  );
}
