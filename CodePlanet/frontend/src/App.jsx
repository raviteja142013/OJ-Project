// src/App.js
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Problems from './components/Problems';
import Ide from './components/Ide';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import Admin from './components/Admin';
import Manageusers from './components/Manageusers'
import AddProblem from './components/AddProblem';
import AllQuestions from './components/AllQuestions';
import SingleProblem from './components/SingleProblem';
import AllSubmissions from './components/AllSubmissions';

function App() {
  const router=createBrowserRouter(
    [{
     path: '/',
      element: <Home></Home>

    },
    {
    path: '/login',
      element: <Login></Login>

    },
    {
      path: '/signup',
        element: <Signup></Signup>
  
      },
      {
        path: '/problems',
          element: <Problems></Problems>
    
        },
        {
          path: '/ide',
            element: <Ide></Ide>
      
          },
          {
            path: '/leaderboard',
              element: <Leaderboard></Leaderboard>
        
            },
            {
              path: '/profile',
                element: <Profile></Profile>
          
              },
              {
                path:'/admin',
                element: <Admin></Admin>
              },
              {
                path:'/manageusers',
                element:<Manageusers></Manageusers>
              },
              {
                path:"/addproblem",
                element:<AddProblem></AddProblem>
              },
              {
                path:"/allquestions",
                element:<AllQuestions></AllQuestions>,
              },
              {
                path:'/problem/:id',
                element:<SingleProblem></SingleProblem>
              },
              {
                path:"/allsubmissions",
                element:<AllSubmissions></AllSubmissions>
              }
  ]
  )
  return (
    <RouterProvider router={router}>

    </RouterProvider>
  );
}

export default App;
