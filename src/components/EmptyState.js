export default function EmptyState({ title = 'No data found', description = 'Create a new item to get started.' }) {
  return <div className="empty-state"><i className="bi bi-inbox" /><h5>{title}</h5><p>{description}</p></div>;
}
