import { useCallback, useContext, useEffect, useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import { UserContext } from '../context/authContext'
import axios from 'axios'
import Loader from '../components/Spinner'
import ReactMarkdown from 'react-markdown'
import '../css/markdown.css'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export interface Course {
  _id: string
  name: string
  subjectId: string
  level: number
  isPayable: boolean
  price: number
  description: string
  content: string
  _isCompleted: boolean
  _isUnlocked: boolean
}

function Course() {
  const context = useContext(UserContext)
  const [course, setCourse] = useState<Course>()
  const [loading, setLoading] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()

  const getButtonState = (course: Course) => {
    return {
      text: 'Take Quiz',
      disabled: false,
      variant: 'custom',
      onClick: () => {
        navigate(`/app/course/quiz/${course._id}`)
      },
    }
  }

  const getCourse = useCallback(async () => {
    try {
      setLoading(true)
      if (id) {
        const course = await axios.get(
          import.meta.env.VITE_API_URL + 'course?courseId=' + id,
          {
            headers: {
              Authorization: `Bearer ${await context.user?.getIdToken()}`,
            },
          }
        )
        console.log(course)
        setCourse(course?.data)
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
  }, [context.user, navigate, id])

  useEffect(() => {
    if (id) {
      getCourse()
    } else {
      toast.error('Invalid course id')
      navigate('/app/dashboard')
    }
  }, [getCourse, id, navigate])

  return (
    <>
      {loading && <Loader />}
      {!loading && course && (
        <>
          <Container
            fluid
            className="mt-4"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Container fluid>
              <h2>{`Welcome to Level ${course.level}: ${course.name}`}</h2>
            </Container>

            <Button
              type="submit"
              className={getButtonState(course).disabled ? '' : 'button-custom'}
              variant={getButtonState(course).variant}
              disabled={getButtonState(course).disabled}
              onClick={getButtonState(course).onClick}
              style={{
                width: '30%',
              }}
            >
              {getButtonState(course).text}
            </Button>
          </Container>
          <Container fluid className="markdownContent">
            <ReactMarkdown>{course.content}</ReactMarkdown>
          </Container>
        </>
      )}
    </>
  )
}

export default Course
