// App.js
import React from 'react';
import { Suspense, lazy } from 'react';
import { Navigate, Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import { routes } from "./routes/routes";
import SuspenseLoader from './components/common/SuspenseLoader';
import DataProvider from './context/DataProvider';
import { EmailProvider } from './context/EmailContext';
import { EventProvider } from './context/EventsContext'; 
import { LoginResultProvider } from './context/LoginResultContext'; // Import LoginResultProvider

const ErrorComponent = lazy(() => import('./components/common/ErrorComponent'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path={routes.login.path} element={<routes.login.element />} />
      <Route path={routes.main.path} element={<routes.main.element />} />
      <Route path={routes.main.path} element={<Navigate to={`${routes.emails.path}/inbox`} />} />
      <Route path={routes.calendar.path} element={<routes.calendar.element />} />
      <Route path={routes.attachment.path} element={<routes.attachment.element />} />
      <Route path={routes.main.path} element={<routes.main.element />} >
        <Route path={`${routes.emails.path}/:type`} element={<routes.emails.element />} errorElement={<ErrorComponent />} />
        <Route path={routes.view.path} element={<routes.view.element />} errorElement={<ErrorComponent />} />
      </Route>
      
      <Route path={routes.invalid.path} element={<Navigate to={`${routes.emails.path}/inbox`} />} />
    </Route>
  )
)

function App() {
  return (
    <Suspense fallback={<SuspenseLoader />}>
      <DataProvider>
        <EmailProvider >
          <EventProvider> 
            <LoginResultProvider> {/* Include LoginResultProvider */}
              <RouterProvider router={router} />
            </LoginResultProvider>
          </EventProvider>
        </EmailProvider>
      </DataProvider>
    </Suspense>
  );
}

export default App;
