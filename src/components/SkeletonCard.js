export default function SkeletonCard({ count = 3 }) {
  return <>{Array.from({ length: count }).map((_, index) => <div className="skeleton-card" key={index} />)}</>;
}
