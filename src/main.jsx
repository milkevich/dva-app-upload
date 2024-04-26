import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import ApplicantsProtected from './pages/ApplicantsProtected.jsx';
import App from './App.jsx';
import ApplyScreen from './pages/ApplyScreen.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='/apply' element={<ApplyScreen />} />
      <Route path='/admin' element={<ApplicantsProtected />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
