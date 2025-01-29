import { useContext, useState } from 'react'
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap'
import { UserContext } from '../context/authContext'

const VerificationPage = () => {
  const context = useContext(UserContext)
  console.log('verificaiton page')
  // Function to send verification email
  const [loading, setLoading] = useState(false)
  const handleSendVerificationEmail = async () => {
    setLoading(true)
    await context.sendVerificationEmail()
    setLoading(false)
  }

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100 bg-light"
    >
      <Row>
        <Col md={12} className="text-center">
          <h1>Email Not Verified</h1>
          <p>
            Your email {context.user?.email} is not verified. Please verify your
            email to continue
          </p>

          <Button
            onClick={handleSendVerificationEmail}
            disabled={loading}
            className="mx-3 button-custom"
            variant="custom"
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{' '}
                Sending...
              </>
            ) : (
              'Send Verification Email'
            )}
          </Button>
          <Button
            onClick={() => context.logout(true)}
            disabled={loading}
            className="mx-3 button-custom"
            variant="custom"
          >
            Sign Out
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default VerificationPage
