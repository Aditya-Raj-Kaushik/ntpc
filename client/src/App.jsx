import React from 'react';
import Dashboard from './components/Dashboard/dashboard';
import Login from './components/Login/login';
import Register from './components/Register/register';
import Overview from './components/Overview/overview'; 
import Request from './components/Request/request';
import Receipt from './components/Receipt/receipt';
import Issue from './components/Issue/Issue';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './authContext';
import ProtectedRoute from './ProtectedRoute';

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
    element: (
      <ProtectedRoute allowedRoles={['admin', 'user']}>
        <Dashboard />
      </ProtectedRoute>
    ) 
  },
  {
    path: '/overview',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'user']}>
        <Overview />
      </ProtectedRoute>
    ) 
  },
  {
    path: '/request',
    element: (
      <ProtectedRoute allowedRoles={['user']}>
        <Request />
      </ProtectedRoute>
    ) 
  },
  {
    path: '/receipt',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <Receipt />
      </ProtectedRoute>
    ) 
  },
  {
    path: '/issue',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <Issue />
      </ProtectedRoute>
    ) 
  }
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
