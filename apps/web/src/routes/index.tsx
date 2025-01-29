import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './protectedRoute.tsx'
import Login from '../pages/Login.tsx'
import NonProtectedRoutes from './nonProtectedRoutes.tsx'
import Dashboard from '../pages/Dashboard.tsx'
import Register from '../pages/Register.tsx'
import VerificationPage from '../pages/VerificationPage.tsx'
import UserDetailsForm from '../pages/UserDetailsForm.tsx'
import ForgotPassword from '../pages/ForgotPassword.tsx'
import Verify from '../pages/Verify.tsx'
import Subject from '../pages/Subject.tsx'
import UserProfile from '../pages/UserProfile.tsx'
import Course from '../pages/Course.tsx'
import Quiz from '../pages/Quiz.tsx'
import QuizSummary from '../pages/QuizSummary.tsx'
import BuyCoins from '../pages/BuyCoins.tsx'
import PurchaseHistory from '../pages/PurchaseHistory.tsx'
import QuizHistory from '../pages/QuizHistory.tsx'
import Leaderboard from '../pages/LeaderBoard.tsx'

const router = createBrowserRouter([
  {
    path: '/verify',
    element: <Verify />,
  },
  {
    path: '/',
    element: <NonProtectedRoutes />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />,
      },
    ],
  },
  {
    path: '/app',
    element: <ProtectedRoute />,
    children: [
      {
        path: 'userNotVerified',
        element: <VerificationPage />,
      },
      {
        path: 'registrationForm',
        element: <UserDetailsForm />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'subject/:id',
        element: <Subject />,
      },
      {
        path: 'course/:id',
        element: <Course />,
      },
      {
        path: 'course/quiz/:id',
        element: <Quiz />,
      },
      {
        path: 'profile',
        element: <UserProfile />,
      },
      {
        path: 'course/quiz/summary/:id',
        element: <QuizSummary />,
      },
      {
        path: 'buyCoins',
        element: <BuyCoins />,
      },
      {
        path:'purchase/history',
        element: <PurchaseHistory/>
      },
      {
        path:'quiz/history',
        element: <QuizHistory/>
      },
      {
        path:'leaderboard',
        element: <Leaderboard/>
      }
    ],
  },
  {
    path: '*',
    element: <div>NOT FOUND</div>,
  },
])

export default router
