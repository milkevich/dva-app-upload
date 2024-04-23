import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import ApplicantsProtected from './ApplicantsProtected.jsx';
import App from './App.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/apply/' element={<App />}>
      <Route element={''}>
        <Route element={<Protected />}>
          <Route path='/apply/admin-42dc7584fn93sh3' element={<ApplicantsProtected />} />
        </Route>
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </React.StrictMode>,
)
