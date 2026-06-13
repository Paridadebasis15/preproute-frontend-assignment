import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { TestProvider } from './context/TestContext';
import './styles/main.css';

function App() {
  return <AuthProvider><TestProvider><BrowserRouter><AppRoutes /></BrowserRouter></TestProvider></AuthProvider>;
}
export default App;
