import Dashboard from "./Dashboard/dashboard";
import Login from "./login";
import Register from "./register";


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
    path:'/dashboard',
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
