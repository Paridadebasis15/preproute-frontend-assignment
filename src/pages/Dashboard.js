import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteTestApi, getTestsApi } from '../api/testApi';
import EmptyState from '../components/EmptyState';
import SkeletonCard from '../components/SkeletonCard';
import { ROUTES } from '../constants/routes';
import { getApiErrorMessage, unwrapData } from '../utils/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const fetchTests = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const response = await getTestsApi();
      setTests(unwrapData(response) || []);
    } catch (err) { setError(getApiErrorMessage(err, 'Unable to fetch tests')); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchTests(); }, [fetchTests]);

  const filteredTests = tests.filter((test) => `${test.name} ${test.subject} ${test.status}`.toLowerCase().includes(query.toLowerCase()));
  const removeTest = async (id) => {
    if (!window.confirm('Delete this test?')) return;
    try { await deleteTestApi(id); fetchTests(); } catch (err) { setError(getApiErrorMessage(err, 'Delete failed')); }
  };

  return <div className="page-fade">
    <div className="page-header-row"><div><p className="breadcrumb-text">Dashboard / Tests</p><h2>Test Dashboard</h2></div><button className="btn btn-primary" onClick={() => navigate(ROUTES.CREATE_TEST)}>Create New Test</button></div>
    <div className="toolbar-card"><input className="form-control" placeholder="Search tests by name, subject or status" value={query} onChange={(e) => setQuery(e.target.value)} /><button className="btn btn-outline-primary" onClick={fetchTests}>Refresh</button></div>
    {error && <div className="alert alert-danger">{error}</div>}
    {loading ? <SkeletonCard count={4} /> : filteredTests.length === 0 ? <EmptyState title="No tests available" description="Create a test to start the evaluation flow." /> : <div className="test-card-grid">
      {filteredTests.map((test) => <article className="dashboard-test-card" key={test.id}>
        <div className="d-flex justify-content-between align-items-start"><div><span className={`status-badge ${test.status === 'live' ? 'live' : 'draft'}`}>{test.status || 'draft'}</span><h5>{test.name || 'Untitled Test'}</h5><p>{test.subject?.name || test.subject || 'Subject not available'}</p></div><i className="bi bi-file-earmark-text card-icon" /></div>
        <div className="test-card-meta"><span><i className="bi bi-calendar3" /> {test.created_at ? new Date(test.created_at).toLocaleDateString() : 'Today'}</span><span><i className="bi bi-list-check" /> {test.total_questions || 0} Qs</span><span><i className="bi bi-award" /> {test.total_marks || 0} Marks</span></div>
        <div className="card-actions"><button className="btn btn-sm btn-light" onClick={() => navigate(`/tests/${test.id}/preview`)}>View</button><button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/tests/${test.id}/edit`)}>Edit</button><button className="btn btn-sm btn-outline-danger" onClick={() => removeTest(test.id)}>Delete</button></div>
      </article>)}
    </div>}
  </div>;
}
