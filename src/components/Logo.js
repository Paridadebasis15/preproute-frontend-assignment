export default function Logo({ compact = false }) {
  return <div className="brand-logo"><span className="brand-mark">⌂</span><span>{compact ? 'Preproute' : 'PrepRoute'}</span></div>;
}
