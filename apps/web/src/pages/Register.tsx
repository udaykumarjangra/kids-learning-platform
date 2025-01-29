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
import '../css/loginRegister.css'
import { Formik } from 'formik'
import registerSchema from '../schemas/registerSchema'
import { Link } from 'react-router-dom'

interface RegisterFormValues {
  email: string
  password: string
  confirmPassword: string
}

function Register() {
  const [loading, setLoading] = useState(false)
  const context = useContext(UserContext)

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      setLoading(true)
      await context.register(values.email, values.password)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container fluid className="container-full-right">
      <Row className="justify-content-md-center" style={{ width: '80%' }}>
        <Col className="form-container">
          <h3 className="text-center mb-4">Welcome!</h3>
          <p className="text-center mb-4">Enter your details to register</p>
          <Formik
            initialValues={{ email: '', password: '', confirmPassword: '' }}
            validationSchema={registerSchema}
            onSubmit={handleRegister}
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

                <Form.Group controlId="formConfirmPassword" className="mt-3">
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Confirm Password"
                  >
                    <Form.Control
                      type="password"
                      className="input-custom"
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        touched.confirmPassword && !!errors.confirmPassword
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>

                <Button
                  className="mt-4 w-100 button-custom"
                  variant="custom"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register'}
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
            <Link style={{ textDecoration: 'none' }} to="/login">
              Already have an account? Login
            </Link>
          </Container>
        </Col>
      </Row>
    </Container>
  )
}

export default Register
