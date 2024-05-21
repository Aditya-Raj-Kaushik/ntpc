import Dashboard from './components/Dashboard/dashboard';
import Login from './components/Login/login';
import Register from './components/Register/register';
import Overview from './components/Overview/overview'; // Ensure proper case

import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login /> // Simplified JSX
  },
  {
    path: '/register',
    element: <Register /> // Simplified JSX
  },
  {
    path: '/dashboard',
    element: <Dashboard /> // Simplified JSX
  },
  {
    path: '/overview',
    element: <Overview /> // Corrected case and simplified JSX
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
