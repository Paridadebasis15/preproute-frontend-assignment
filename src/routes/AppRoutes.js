import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PageLoader from '../components/PageLoader';
import { ROUTES } from '../constants/routes';
import AppLayout from '../layouts/AppLayout';
import ProtectedRoute from './ProtectedRoute';

const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const CreateTest = lazy(() => import('../pages/CreateTest'));
const Questions = lazy(() => import('../pages/Questions'));
const PreviewPublish = lazy(() => import('../pages/PreviewPublish'));
const Tracking = lazy(() => import('../pages/Tracking'));

export default function AppRoutes() {
  return <Suspense fallback={<PageLoader label="Preparing workspace..." />}>
    <Routes>
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.CREATE_TEST} element={<CreateTest />} />
          <Route path={ROUTES.EDIT_TEST} element={<CreateTest />} />
          <Route path={ROUTES.QUESTIONS} element={<Questions />} />
          <Route path={ROUTES.PREVIEW} element={<PreviewPublish />} />
          <Route path={ROUTES.TRACKING} element={<Tracking />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  </Suspense>;
}
