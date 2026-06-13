export default function TestSummaryCard({ test, onEdit }) {
  const topics = Array.isArray(test?.topics) ? test.topics : [];
  return <div className="test-summary-card">
    {onEdit && <button className="icon-button edit-absolute" type="button" onClick={onEdit}><i className="bi bi-pencil" /></button>}
    <div className="d-flex gap-2 align-items-center mb-3"><span className="pill dark">Chapter Wise</span><span className="fw-semibold">📚 Chapter 1</span><span className="pill success">{test?.difficulty || 'Easy'}</span></div>
    <div className="summary-grid">
      <span>Subject</span><strong>{test?.subject?.name || test?.subject || 'English'}</strong>
      <span>Topic</span><strong>{topics.length ? topics.join(', ') : 'Grammar, Writing'}</strong>
      <span>Sub Topic</span><strong>{Array.isArray(test?.sub_topics) ? test.sub_topics.join(', ') : 'Application'}</strong>
    </div>
    <div className="summary-meta"><span><i className="bi bi-clock" /> {test?.total_time || 60} Min</span><span><i className="bi bi-list-check" /> {test?.total_questions || 50} Q's</span><span><i className="bi bi-bar-chart" /> {test?.total_marks || 250} Marks</span></div>
  </div>;
}
