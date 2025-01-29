import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../context/authContext'
import { Container } from 'react-bootstrap'
import '../css/loginRegisterContainer.css'
import background from '../assets/landingLeft.jpg'

const LoginRegisterContainer = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <Container
      fluid
      className="container-full"
      style={{ padding: '0px', margin: '0px' }}
    >
      <Container
        className="left-side"
        style={{ height: '100%', position: 'relative' }}
      >
        <Container
          style={{
            backgroundImage: `url(${background})`,
            height: '100%',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: -100,
            position: 'absolute',
            filter: 'blur(1px)',
          }}
        >
          <Container
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: '1',
            }}
          ></Container>
        </Container>
        <h1 className="text-center text-white">Kids Learning Platform</h1>
      </Container>
      <Container fluid className="right-side">
        {children}
      </Container>
    </Container>
  )
}

const NonProtectedRoutes = () => {
  const location = useLocation()
  const { user } = useUser()
  if (user) {
    return <Navigate to="/app/dashboard" />
  }
  if (
    location.pathname.includes('/login') ||
    location.pathname.includes('/register') ||
    location.pathname.includes('/forgot-password')
  ) {
    return (
      <LoginRegisterContainer>
        <Outlet />
      </LoginRegisterContainer>
    )
  }
  return <Navigate to="/login" />
}

export default NonProtectedRoutes
