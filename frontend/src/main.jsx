import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx';
import Auth from './pages/Auth.jsx';
import UserDetail from './pages/userDetail.jsx';
import BoxingRing from './pages/BoxingRing.jsx';
import FuneralPopup from './components/FuneralPopup.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

const router = createBrowserRouter([
  {
    path: "/", // Home route
    element: <App />, // Render the App component
    children: [
            {
                index: true,
                element: <Home/>,
            },
            {
                path: "/auth",
                element: <Auth/>,
            },
            {
                path: "/userDetail",
                element: <UserDetail/>,
            },
            {
                path: "/boxingRing",
                element: <BoxingRing/>,
            },
            {
                path: "/funeralPopup",
                element: <FuneralPopup/>,
            },
        ],
    },
    {
        path: "*",
        element: <NotFoundPage/>,
    },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
