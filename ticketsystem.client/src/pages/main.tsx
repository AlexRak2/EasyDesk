import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import HomePage from './pages/HomePage.tsx';
import TicketPage from './pages/TicketPage.tsx';
import CreateTicketPage from './pages/CreateTicketPage.tsx';
import UsersPage from './UsersPage.tsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage />
    },
    {
        path: "/Register",
        element: <RegisterPage />
    },
    {
        path: "/Home",
        element: <HomePage />
    }
    ,
    {
        path: "/CreateTicket",
        element: <CreateTicketPage />
    },
    {
        path: "/Ticket",
        element: <TicketPage />
    },
    {
        path: "/Users",
        element: <UsersPage />
    }
]);

createRoot(document.getElementById('root')!).render(

    <RouterProvider router={router} />
)