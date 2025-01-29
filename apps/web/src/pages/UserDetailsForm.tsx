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
import registerFormSchema from '../schemas/registerFormSchema'

interface RegisterFormValues {
  firstName: string
  lastName: string
  age: number
}

function UserDetailsForm() {
  const [loading, setLoading] = useState(false)
  const { createUser } = useContext(UserContext)

  const handleSubmit = async (values: RegisterFormValues) => {
    setLoading(true)

    await createUser(values.firstName, values.lastName, values.age)
    setLoading(false)
  }

  return (
    <Container fluid className="container-full-right">
      <Row className="justify-content-md-center" style={{ width: '60%' }}>
        <Col className="form-container">
          <h3 className="text-center">Welcome Back</h3>
          <p className="text-center mb-4">Enter your details to continue</p>

          <Formik
            initialValues={{ firstName: '', lastName: '', age: 0 }}
            validationSchema={registerFormSchema}
            onSubmit={handleSubmit}
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
                <Form.Group controlId="formFirstName">
                  <FloatingLabel controlId="floatingInput" label="First Name">
                    <Form.Control
                      type="text"
                      placeholder="Enter First Name"
                      name="firstName"
                      className="input-custom"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.firstName && !!errors.firstName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.firstName}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>

                <Form.Group controlId="formLastName" className="mt-3">
                  <FloatingLabel controlId="floatingInput" label="Last Name">
                    <Form.Control
                      type="text"
                      placeholder="Enter Last Name"
                      name="lastName"
                      className="input-custom"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.lastName && !!errors.lastName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.lastName}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>

                <Form.Group controlId="formAge" className="mt-3">
                  <FloatingLabel controlId="floatingInput" label="Age">
                    <Form.Control
                      type="number"
                      placeholder="Enter Age"
                      name="age"
                      className="input-custom"
                      value={values.age}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.age && !!errors.age}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.age}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>

                <Button
                  className="mt-4 w-100 button-custom"
                  variant="custom"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Complete Registration'}
                </Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  )
}

export default UserDetailsForm
