import { useCallback, useContext, useEffect, useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import { UserContext } from '../context/authContext'
import axios from 'axios'
import Loader from '../components/Spinner'
import '../css/markdown.css'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Course } from './Course'
import QuizForm from '../components/QuizForm'
import '../css/quiz.css'

export interface UserQuizQuestion {
  questionId: string
  userAnswer: string
  isCorrect: boolean
}

export interface UserQuiz {
  _id: string
  userId: string
  courseId: string
  pointsEarned: number
  coinsEarned: number
  isPassed: boolean
  state: string
  questions: UserQuizQuestion[]
  totalQuestions: number
  correctQuestions: number
}

export interface Question {
  _id: string
  questionType: string
  questionStatement: string
  questionOptions: string[]
}

export interface QuizQuery {
  quiz: UserQuiz
  questions: Question[]
  course: Course
}

function Quiz() {
  const context = useContext(UserContext)
  const [quiz, setQuiz] = useState<QuizQuery>()
  const [quizAnswers, setQuizAnswers] = useState<UserQuizQuestion[]>()
  const [loading, setLoading] = useState(false)
  const [startQuiz, setStartQuiz] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()
  const getQuiz = useCallback(async () => {
    try {
      setLoading(true)
      if (id) {
        const quizData = await axios.post(
          import.meta.env.VITE_API_URL + 'quiz/create',
          {
            courseId: id,
          },
          {
            headers: {
              Authorization: `Bearer ${await context.user?.getIdToken()}`,
            },
          }
        )
        setQuiz(quizData?.data)
        setQuizAnswers(quizData.data.quiz.questions)
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

  const submitQuiz = useCallback(
    async (timeTaken: number) => {
      try {
        setLoading(true)
        if (id) {
          const quizData = await axios.post(
            import.meta.env.VITE_API_URL + 'quiz/submit',
            {
              courseId: id,
              quizAnswers,
              userQuizId: quiz?.quiz._id,
              timeTaken,
            },
            {
              headers: {
                Authorization: `Bearer ${await context.user?.getIdToken()}`,
              },
            }
          )
          setQuizAnswers(quizData.data.questions)
          setStartQuiz(false)
          await context.updateUserDetails()
          navigate(`/app/course/quiz/summary/${quizData.data._id}`)
          toast.success('Quiz submitted successfully')
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
    },
    [id, quizAnswers, context.user, navigate]
  )

  useEffect(() => {
    if (id) {
      getQuiz()
    } else {
      toast.error('Invalid course id')
      navigate('/app/dashboard')
    }
  }, [getQuiz, id, navigate])

  return (
    <>
      {loading && <Loader />}
      {!loading && quiz && (
        <>
          <Container fluid className="mt-4">
            {!startQuiz && (
              <Container fluid>
                <h2>{`Welcome to Level ${quiz.course.level} Quiz`}</h2>
                <div style={{ fontSize: '20px' }}>
                  <div>
                    Total Questions: {quiz.quiz.totalQuestions}
                    <br />
                    Quiz Duration:{' '}
                    {`${Math.floor((quiz.quiz.totalQuestions * 60) / 60)}:${(quiz.quiz.totalQuestions * 60) % 60 < 10 ? '0' : ''}${(quiz.quiz.totalQuestions * 60) % 60}`}
                  </div>
                  <br />
                  <Button
                    type="submit"
                    className="button-custom"
                    variant="custom"
                    onClick={() => {
                      setStartQuiz(true)
                    }}
                    style={{
                      width: '30%',
                    }}
                  >
                    Start Quiz
                  </Button>
                </div>
              </Container>
            )}

            {startQuiz && (
              <QuizForm
                quiz={quiz}
                quizAnswers={quizAnswers}
                setQuizAnswers={setQuizAnswers}
                submitQuiz={submitQuiz}
              />
            )}
          </Container>
        </>
      )}
    </>
  )
}

export default Quiz
