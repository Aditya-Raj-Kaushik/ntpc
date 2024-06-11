import Dashboard from './components/Dashboard/dashboard';
import Login from './components/Login/login';
import Register from './components/Register/register';
import Overview from './components/Overview/overview'; 
import Request from './components/Request/request';
import Receipt from './components/Receipt/receipt';
import Issue from './components/Issue/Issue';

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
    path: '/request',
    element: <Request /> 
  },
  {
    path: '/receipt',
    element: <Receipt /> 
  },{
    path: '/issue',
    element: <Issue /> 
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
