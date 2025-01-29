import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { UserContext, useUser } from '../context/authContext'
import { useContext } from 'react'
import NavbarWithAvatar from '../components/Navbar'

const ProtectedRoute = () => {
  const { user } = useUser()
  const { isFirstTimeUser } = useContext(UserContext)
  const location = useLocation()
  if (!user) {
    // or you can redirect to a different page and show a message
    return <Navigate to="/login" />
  } else if (
    !user.emailVerified &&
    !location.pathname.includes('userNotVerified')
  ) {
    return <Navigate to="/app/userNotVerified" />
  }
  // Check if the user is a first-time user, and if so, redirect to UserDetails page
  else if (
    user.emailVerified &&
    isFirstTimeUser &&
    !location.pathname.includes('registrationForm')
  ) {
    return <Navigate to="/app/registrationForm" />
  } else if (
    !isFirstTimeUser &&
    location.pathname.includes('registrationForm')
  ) {
    return <Navigate to="/app/dashboard" />
  }
  return (
    <>
      <NavbarWithAvatar>
        <Outlet />
      </NavbarWithAvatar>
    </>
  )
}

export default ProtectedRoute
