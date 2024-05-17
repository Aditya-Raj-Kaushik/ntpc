import Dashboard  from './components/Dashboard/dashboard';
import Login from './components/Login/login';
import Register from './components/Register/register';

import{
  createBrowserRouter,
  RouterProvider
}from 'react-router-dom'

const router = createBrowserRouter([
  {
    path:'/',
    element: <div> <Login/></div>
  },
  {
    path:'/register',
    element: <div> <Register/></div>
  },
  {
    path:'/page',
    element: <div> <Dashboard/></div>
  },
])

function App() {
  return (
    <>
      <div>
        <RouterProvider router={router}/>
      </div>
    </>
  );
}

export default App;