import { lazy } from 'react';

const LoginPage = lazy(() => import('../components/LoginPage'));
const Main = lazy(() => import('../pages/Main'));
const Emails = lazy(() => import('../components/Emails'));
const ViewEmail = lazy(() => import('../components/ViewEmail'));
const CalendarPage = lazy(() => import('../pages/CalendarPage'));
const AttachmentView = lazy(() => import('../components/attachment/AttachmentView'));

const routes = {
    login: {
        path: '/login',
        element: LoginPage
    },
    main: {
        path: '/',
        element: Main,
        protected: true // Indicates this route is protected
    },
    emails: {
        path: '/emails',
        element: Emails
    },
    invalid: {
        path: '/*',
        element: Emails
    },
    view: {
        path: '/view',
        element: ViewEmail
    },
    calendar: {
        path: '/calendar',
        element: CalendarPage
    }, 
    attachment: {
        path: '/attachment',
        element: AttachmentView
    }
}

export { routes };
