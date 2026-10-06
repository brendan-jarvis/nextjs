export function SpectrumRule({ className = "" }: { className?: string }) {
  const bands = ["#EA6E4B", "#FAF26F", "#ABE3D2", "#D653A9", "#CDA8E2", "#3A1E66"];
  return (
    <div className={`flex h-1 ${className}`} aria-hidden="true">
      {bands.map((hex) => (
        <span key={hex} className="flex-1" style={{ background: hex }} />
      ))}
    </div>
  );
}
