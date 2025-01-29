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
import * as Yup from 'yup'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

interface IResetPassword {
  email: string
}

function ForgotPassword() {
  const [loading, setLoading] = useState(false)
  const context = useContext(UserContext)
  const navigate = useNavigate()

  const handleForgotPassword = async (values: IResetPassword) => {
    setLoading(true)
    try {
      await context.resetPassword(values.email)
      navigate('/login')
    } catch (error) {
      console.error('Error sending reset link: ', error)
    }
    setLoading(false)
  }

  return (
    <Container fluid className="container-full-right">
      <Row className="justify-content-md-center" style={{ width: '80%' }}>
        <Col className="form-container">
          <h3 className="text-center mb-4">Forgot Password</h3>
          <Formik
            initialValues={{ email: '' }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            })}
            onSubmit={handleForgotPassword}
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
                      className="input-custom"
                      placeholder="Enter email"
                      name="email"
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

                <Button
                  className="mt-4 w-100 button-custom"
                  variant="custom"
                  type="submit"
                  disabled={loading}
                >
                  Send reset link!
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

export default ForgotPassword
