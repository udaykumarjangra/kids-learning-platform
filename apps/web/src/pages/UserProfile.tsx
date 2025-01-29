import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../context/authContext'
import userProfileSchema from '../schemas/userProfileSchema'
import { Formik } from 'formik'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import FloatingLabel from 'react-bootstrap/FloatingLabel'

const UserProfile = () => {
  const [formUser, setFormUser] = useState<UserDetails | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const { user, userDetails } = useContext(UserContext)
  const { updateUser } = useContext(UserContext)

  interface UserDetails {
    firstName: string
    lastName: string
    age: number
  }

  useEffect(() => {
    if (user && userDetails) {
      setFormUser(userDetails)
    }
  }, [user, userDetails])

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  const handleSave = async (values: UserDetails) => {
    if (formUser) {
      try {
        await updateUser(values.firstName, values.lastName, values.age)
        setIsEditing(!isEditing)
      } catch (error) {
        console.error('Error updating user data:', error)
      }
    }
  }

  const getInitials = () => {
    if (userDetails) {
      return userDetails.firstName[0] + userDetails.lastName[0]
    } else {
      return 'NU'
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <Container fluid className="container-full-right">
      <Row className="justify-content-md-center" style={{ width: '80%' }}>
        <Col className="form-container">
          <h3 className="text-center">User Profile</h3>
          <Container
            className="mb-4"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#fbd1a2',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                textTransform: 'uppercase',
              }}
            >
              {getInitials()}
            </div>

            <p style={{ marginBottom: '0', marginLeft: '5px' }}>
              {user?.email}
            </p>
          </Container>
          <Button
            className="w-100 button-custom mb-4"
            variant="custom"
            onClick={handleEditToggle}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>

          <Formik
            initialValues={{
              firstName: formUser?.firstName || '',
              lastName: formUser?.lastName || '',
              age: formUser?.age || 0,
            }}
            validationSchema={userProfileSchema}
            onSubmit={handleSave}
            enableReinitialize
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
                  <FloatingLabel
                    controlId="floatingFirstName"
                    label="First Name"
                  >
                    <Form.Control
                      type="text"
                      name="firstName"
                      className="input-custom"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.firstName && !!errors.firstName}
                      disabled={!isEditing}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.firstName}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>

                <Form.Group controlId="formLastName" className="mt-3">
                  <FloatingLabel controlId="floatingLastName" label="Last Name">
                    <Form.Control
                      type="text"
                      name="lastName"
                      className="input-custom"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.lastName && !!errors.lastName}
                      disabled={!isEditing}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.lastName}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>

                <Form.Group controlId="formAge" className="mt-3">
                  <FloatingLabel controlId="floatingAge" label="Age">
                    <Form.Control
                      type="number"
                      name="age"
                      className="input-custom"
                      value={values.age}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.age && !!errors.age}
                      disabled={!isEditing}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.age}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                {isEditing && (
                  <Button
                    className="mt-4 w-100 button-custom"
                    variant="custom"
                    type="submit"
                  >
                    Save Changes
                  </Button>
                )}
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  )
}

export default UserProfile
