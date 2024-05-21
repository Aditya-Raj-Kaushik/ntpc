import Dashboard from './components/Dashboard/dashboard';
import Login from './components/Login/login';
import Register from './components/Register/register';
import Overview from './components/Overview/overview'; 
import Transaction from './components/Transaction/transaction';
import Receipt from './components/Receipt/receipt';

import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login /> 
  },
  {
    path: '/register',
    element: <Register /> 
  },
  {
    path: '/dashboard',
    element: <Dashboard /> 
  },
  {
    path: '/overview',
    element: <Overview /> 
  },
  {
    path: '/transaction',
    element: <Transaction /> 
  },
  {
    path: '/receipt',
    element: <Receipt /> 
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
