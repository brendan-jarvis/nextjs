export function SpectrumRule({
  color,
  className = "",
}: {
  color: string;
  className?: string;
}) {
  return (
    <div
      className={`mt-auto h-1 w-full shrink-0 ${className}`}
      style={{ background: color }}
      aria-hidden="true"
    />
  );
}
