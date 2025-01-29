import { useCallback, useContext, useEffect, useState } from 'react'
import { Accordion, Button, Col, Container, Modal, Row } from 'react-bootstrap'
import { UserContext } from '../context/authContext'
import axios, { AxiosError } from 'axios'
import Loader from '../components/Spinner'
import { SubjectCardProps } from '../components/SubjectCards'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Course } from './Course'

function Subject() {
  const context = useContext(UserContext)
  const [subject, setSubject] = useState<SubjectCardProps>()
  const [courses, setCourses] = useState<Course[]>()
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmBuyCoinsModalOpen, setIsConfirmBuyCoinsModalOpen] =
    useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const { id } = useParams()
  const navigate = useNavigate()

  const getButtonState = (course: Course) => {
    if (
      (course.level <= (subject?._userLevel ?? 1) || course._isCompleted) &&
      course._isUnlocked
    ) {
      return {
        text: 'Go to Course',
        quizButtonText: 'Start Quiz',
        quizButtonOnClick: () => {
          navigate(`/app/course/quiz/${course._id}`)
        },
        disabled: false,
        onClick: () => {
          navigate(`/app/course/${course._id}`)
        },
      }
    } else if (
      course.level === (subject?._userLevel ?? 1) &&
      !course._isUnlocked
    )
      return {
        text: 'Buy Course for ' + course.price + ' coins',
        disabled: false,
        onClick: () => {
          setSelectedCourse(course)
          if (
            context.userDetails &&
            context.userDetails?.coins < course.price
          ) {
            setIsConfirmBuyCoinsModalOpen(true)
          } else {
            setIsModalOpen(true)
          }
        },
      }
    else {
      return {
        text: 'Locked',
        disabled: true,
      }
    }
  }

  const getCourses = useCallback(async () => {
    try {
      setLoading(true)
      if (subject?._id) {
        const courses = await axios.get(
          import.meta.env.VITE_API_URL + 'course?subjectId=' + subject._id,
          {
            headers: {
              Authorization: `Bearer ${await context.user?.getIdToken()}`,
            },
          }
        )
        console.log(courses)
        setCourses(courses?.data)
      }
    } catch (err) {
      console.error(err)
      if (err instanceof Error) {
        toast.error(err.message)
      }
      navigate('/app/dashboard')
    } finally {
      setLoading(false)
    }
  }, [subject, context.user, navigate])

  const handlePurchaseCourse = useCallback(async () => {
    if (!selectedCourse) return

    try {
      setLoading(true)

      await axios.put(
        import.meta.env.VITE_API_URL + 'course/unlock',
        { courseId: selectedCourse._id },
        {
          headers: {
            Authorization: `Bearer ${await context.user?.getIdToken()}`,
          },
        }
      )

      toast.success('Course purchased successfully!')
      setIsModalOpen(false)
      await context.updateUserDetails()
      getCourses()
    } catch (err) {
      console.error(err)
      if (err instanceof AxiosError) {
        const errorMessage = err.response?.data?.message
        if (errorMessage === 'Insufficient coins') {
          toast.error("You don't have enough coins to purchase this course.")
          setIsModalOpen(false)
          setIsConfirmBuyCoinsModalOpen(true) // Show buy coins confirmation modal
        } else {
          toast.error(err.message)
        }
      }
    } finally {
      setLoading(false)
    }
  }, [selectedCourse, context.user, getCourses])

  const getSubject = useCallback(async () => {
    try {
      setLoading(true)
      if (!id) {
        throw new Error('Invalid subject Id')
      }
      const subject = await axios.get(
        import.meta.env.VITE_API_URL + 'subject/' + id,
        {
          headers: {
            Authorization: `Bearer ${await context.user?.getIdToken()}`,
          },
        }
      )
      console.log(subject.data)
      setSubject(subject.data)
    } catch (err) {
      console.error(err)
      if (err instanceof Error) {
        toast.error(err.message)
      }
      navigate('/app/dashboard')
    } finally {
      setLoading(false)
    }
  }, [context.user, id, navigate])

  useEffect(() => {
    getSubject()
  }, [getSubject])

  useEffect(() => {
    getCourses()
  }, [subject, getCourses])

  return (
    <>
      {loading && <Loader />}
      {!loading && subject && (
        <>
          <Container fluid className="mt-4">
            <Row className="justify-content-md-center">
              <h1>{`Welcome to ${subject?.name}`}</h1>
            </Row>
            <Row className="justify-content-md-center">
              <p>Current Level: {subject?._userLevel}</p>
            </Row>
          </Container>
          <Container fluid>
            <Accordion
              defaultActiveKey={(subject?._userLevel - 1).toString() ?? '0'}
            >
              {!loading &&
                courses?.map((course, index) => (
                  <Accordion.Item key={index} eventKey={index.toString()}>
                    <Accordion.Header>
                      Level {index + 1}: {course.name}{' '}
                      {course._isCompleted && (
                        <span
                          style={{
                            backgroundColor: 'green',
                            color: 'white',
                            padding: '5px 10px',
                            marginLeft: '10px',
                            borderRadius: '5px',
                          }}
                        >
                          Done
                        </span>
                      )}
                      {!course._isUnlocked && course.isPayable && (
                        <span
                          style={{
                            backgroundColor: 'lightblue',
                            color: 'white',
                            padding: '5px 10px',
                            marginLeft: '10px',
                            borderRadius: '5px',
                          }}
                        >
                          Paid
                        </span>
                      )}
                    </Accordion.Header>
                    <Accordion.Body>
                      {course.description}
                      <Row
                        fluid
                        style={{ display: 'flex', margin: '0', padding: '0' }}
                      >
                        <Col>
                          <Button
                            className="mt-4 w-100 button-custom"
                            variant="custom"
                            type="submit"
                            disabled={
                              getButtonState(course).disabled || !context.user
                            }
                            onClick={getButtonState(course).onClick}
                          >
                            {getButtonState(course).text}
                          </Button>
                        </Col>

                        {!getButtonState(course).disabled &&
                          course._isUnlocked && (
                            <Col>
                              <Button
                                className="mt-4 w-100 button-custom"
                                variant="custom"
                                onClick={
                                  getButtonState(course).quizButtonOnClick
                                }
                              >
                                {getButtonState(course).quizButtonText}
                              </Button>
                            </Col>
                          )}
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
            </Accordion>
          </Container>

          <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Purchase</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Do you want to buy this course for {selectedCourse?.price} coins?
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="mt-2 w-100 button-custom"
                variant="custom"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="mt-2 w-100 button-custom"
                variant="custom"
                onClick={handlePurchaseCourse}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Yes'}
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={isConfirmBuyCoinsModalOpen}
            onHide={() => setIsConfirmBuyCoinsModalOpen(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Insufficient Coins</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              You don't have enough coins to purchase this course. Would you
              like to buy more coins?
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="mt-2 w-100 button-custom"
                variant="custom"
                onClick={() => setIsConfirmBuyCoinsModalOpen(false)}
              >
                No
              </Button>
              <Button
                type="submit"
                className="mt-2 w-100 button-custom"
                variant="custom"
                onClick={() => {
                  setIsConfirmBuyCoinsModalOpen(false)
                  navigate('/app/buyCoins')
                }}
              >
                Yes
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  )
}

export default Subject
