import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchBulkQuestionsApi } from '../api/questionApi';
import { getTestByIdApi, publishTestApi } from '../api/testApi';
import ErrorAlert from '../components/ErrorAlert';
import PageLoader from '../components/PageLoader';
import TestSummaryCard from '../components/TestSummaryCard';
import { LIVE_UNTIL_OPTIONS } from '../constants/options';
import { useTestFlow } from '../context/TestContext';
import { getApiErrorMessage, unwrapData } from '../utils/api';

export default function PreviewPublish() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeTest, questions, dispatch } = useTestFlow();
  const [test, setTest] = useState(activeTest);
  const [questionList, setQuestionList] = useState(questions);
  const [mode, setMode] = useState('now');
  const [liveUntil, setLiveUntil] = useState('custom');
  const [loading, setLoading] = useState(!activeTest);
  const [publishing, setPublishing] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => { (async () => {
    if (activeTest) return;
    setLoading(true);
    try {
      const data = unwrapData(await getTestByIdApi(id)); setTest(data); dispatch({ type: 'SET_TEST', payload: data });
      if (Array.isArray(data?.questions) && data.questions.length) setQuestionList(unwrapData(await fetchBulkQuestionsApi(data.questions)) || []);
    } catch (err) { setApiError(getApiErrorMessage(err, 'Unable to load preview')); }
    finally { setLoading(false); }
  })(); }, [id, activeTest, dispatch]);

  const publishNow = async () => {
    setPublishing(true); setApiError('');
    try { await publishTestApi(id); dispatch({ type: 'RESET_TEST_FLOW' }); navigate('/dashboard'); }
    catch (err) { setApiError(getApiErrorMessage(err, 'Publish failed')); }
    finally { setPublishing(false); }
  };

  if (loading) return <PageLoader label="Loading preview..." />;
  return <div className="preview-page page-fade"><p className="breadcrumb-text">Test creation</p><div className="d-flex align-items-center gap-2 mb-3"><strong>Test created</strong><span className="pill success">All {test?.total_questions || questionList.length || 0} Questions done</span></div><TestSummaryCard test={test} onEdit={() => navigate(`/tests/${id}/edit`)} />
    <ErrorAlert message={apiError} />
    <div className="publish-tabs"><button className={mode === 'now' ? 'active' : ''} onClick={() => setMode('now')}>Publish Now</button><button className={mode === 'schedule' ? 'active' : ''} onClick={() => setMode('schedule')}>Schedule Publish</button></div>
    {mode === 'schedule' && <div className="schedule-row"><input className="form-control" type="date" /><input className="form-control" type="time" /></div>}
    <h6 className="mt-4">Live Until</h6><p className="text-muted small">Choose how long this test should remain available on the platform.</p><div className="live-options">{LIVE_UNTIL_OPTIONS.map((o) => <label key={o.value}><input type="radio" checked={liveUntil === o.value} onChange={() => setLiveUntil(o.value)} /> {o.label}</label>)}</div>
    {liveUntil === 'custom' && <div className="schedule-row"><input className="form-control" type="date" /><input className="form-control" type="time" /></div>}
    <div className="question-preview-list">{questionList.map((q, i) => <details key={i}><summary>Question {i + 1}: {q.question}</summary><ol><li>{q.option1}</li><li>{q.option2}</li><li>{q.option3}</li><li>{q.option4}</li></ol><p><strong>Answer:</strong> {q.correct_option}</p></details>)}</div>
    <div className="form-actions"><button className="btn btn-light" onClick={() => navigate(`/tests/${id}/questions`)}>Cancel</button><button className="btn btn-primary" onClick={publishNow} disabled={publishing}>{publishing ? 'Publishing...' : 'Confirm'}</button></div></div>;
}
