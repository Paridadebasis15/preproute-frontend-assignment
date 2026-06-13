import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import ErrorAlert from '../components/ErrorAlert';
import Logo from '../components/Logo';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../utils/api';

const schema = yup.object({
  userId: yup.string().required('User ID is required'),
  password: yup.string().required('Password is required'),
});

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { userId: 'vedant-admin', password: 'vedant123' },
  });

  const onSubmit = async (values) => {
    try {
      await login(values);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError('root', { message: getApiErrorMessage(err, 'Invalid credentials') });
    }
  };

  return <main className="login-page">
    <section className="login-illustration"><div className="desk-illustration"><div className="lamp" /><div className="character" /><div className="desk" /></div></section>
    <section className="login-panel">
      <div className="login-card">
        <Logo />
        <h1>Login</h1>
        <p>Use your company provided Login credentials</p>
        <ErrorAlert message={errors?.root?.message || error} />
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <label>User ID</label>
          <input className={`form-control ${errors.userId ? 'is-invalid' : ''}`} placeholder="Enter User ID" {...register('userId')} />
          <div className="invalid-feedback d-block">{errors.userId?.message}</div>
          <label className="mt-3">Password</label>
          <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} placeholder="Enter Password" {...register('password')} />
          <div className="invalid-feedback d-block">{errors.password?.message}</div>
          <button className="forgot-link" type="button">Forgot password?</button>
          <button className="btn btn-primary w-100 login-btn" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
      </div>
    </section>
  </main>;
}
