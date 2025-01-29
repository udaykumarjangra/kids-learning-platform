import { memo, useCallback, useContext, useEffect, useState } from 'react'
import {
  Container,
  Row,
  Col,
  Form,
  FloatingLabel,
  Button,
} from 'react-bootstrap'
import { UserContext } from '../context/authContext'
import '../css/loginRegister.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Loader from '../components/Spinner'
import { Formik } from 'formik'
import resetPasswordSchema from '../schemas/resetPasswordSchema'
import { confirmPasswordReset } from 'firebase/auth'
import { firebaseAuth } from '../firebase'
import { toast } from 'react-toastify'
import { FirebaseError } from 'firebase/app'

interface IResetPasswordFormValues {
  password: string
  confirmPassword: string
}

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)
  const { verifyResetCode } = useContext(UserContext)
  const navigate = useNavigate()
  const code = searchParams.get('oobCode')

  const handleVerification = useCallback(async () => {
    setLoading(true)
    if (!code) {
      toast.error('No verify code provided')
      navigate('/login')
    } else {
      try {
        await verifyResetCode(code)
        setVerified(true)
      } catch {
        navigate('/login')
        setLoading(false)
      }
      setLoading(false)
    }
  }, [code, verifyResetCode, navigate])

  useEffect(() => {
    handleVerification()
  }, [handleVerification])

  const handleChangePassword = async (values: IResetPasswordFormValues) => {
    if (code) {
      try {
        setLoading(true)
        await confirmPasswordReset(firebaseAuth, code, values.password)
        toast.success('Password reset successfully! Login to continue')
        navigate('/login')
        setLoading(false)
      } catch (error) {
        if (error instanceof FirebaseError) {
          if (error.code === 'auth/expired-action-code') {
            toast.error('The code is expired. Please request a new one.')
            navigate('/login')
          }
          if (error.code === 'auth/invalid-action-code') {
            toast.error('Invalid code provided')
            navigate('/login')
          }
        } else {
          toast.error('An error occurred. Please try again later.')
        }
        console.log(error)
        navigate('/login')
        setLoading(false)
      }
    }
  }

  return (
    <Container fluid className="container-full-right">
      <Row className="justify-content-md-center" style={{ width: '80%' }}>
        <Col className="form-container">
          {loading && <Loader />}
          {!loading && verified && (
            <>
              <h3 className="text-center">Reset Password</h3>
              <Formik
                initialValues={{ email: '', password: '', confirmPassword: '' }}
                validationSchema={resetPasswordSchema}
                onSubmit={handleChangePassword}
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

                    <Form.Group
                      controlId="formConfirmPassword"
                      className="mt-3"
                    >
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Confirm Password"
                      >
                        <Form.Control
                          type="password"
                          placeholder="Confirm Password"
                          name="confirmPassword"
                          className="input-custom"
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
                      {loading ? 'Loading..' : 'Reset'}
                    </Button>
                  </Form>
                )}
              </Formik>
            </>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default memo(ResetPassword)
