import { useContext, useState } from 'react'
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  FloatingLabel,
} from 'react-bootstrap'
import { UserContext } from '../context/authContext'
import { Formik } from 'formik'
import '../css/loginRegister.css'
import loginSchema from '../schemas/loginSchema'
import { Link } from 'react-router-dom'

// Define the types for form values
interface LoginFormValues {
  email: string
  password: string
}

function Login() {
  const [loading, setLoading] = useState(false)
  const context = useContext(UserContext)

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true)
    await context.login(values.email, values.password)
    setLoading(false)
  }

  return (
    <Container fluid className="container-full-right">
      <Row className="justify-content-md-center" style={{ width: '80%' }}>
        <Col className="form-container">
          <h3 className="text-center">Welcome Back!</h3>
          <p className="text-center mb-4">Enter your details to log in</p>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={(values) => handleLogin(values)}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              errors,
              touched,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Email Address"
                  >
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      name="email"
                      className="input-custom"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.email && !!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mt-3">
                  <FloatingLabel controlId="floatingInput" label="Password">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      name="password"
                      className="input-custom"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.password && !!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>

                <Button
                  type="submit"
                  className="mt-4 w-100 button-custom"
                  variant="custom"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </Form>
            )}
          </Formik>
          <Container
            fluid
            className="mt-3"
            style={{
              textAlign: 'center',
              display: 'flex',
              padding: '0',
              justifyContent: 'space-between',
            }}
          >
            <Link style={{ textDecoration: 'none' }} to="/forgot-password">
              Forgot your Password?
            </Link>
            <Link style={{ textDecoration: 'none' }} to="/register">
              Register Now
            </Link>
          </Container>
        </Col>
      </Row>
    </Container>
  )
}

export default Login
