import { useCallback, useContext, useEffect, useState } from 'react'
import { Container, ListGroup } from 'react-bootstrap'
import { UserContext } from '../context/authContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import Loader from '../components/Spinner'

export interface UserQuizQuestion {
  questionStatement: string
  userAnswer: string
  questionAnswer: string
  isCorrect: boolean
}
export interface UserQuiz {
  _id: string
  userId: string
  courseId: string
  pointsEarned: number
  coinsEarned: number
  isPassed: boolean
  questions: {
    isCorrect: boolean
    userAnswer: string
    questionId: UserQuizQuestion
  }[]
  totalQuestions: number
  correctQuestions: number
  timeTaken: number
}

function QuizSummary() {
  const context = useContext(UserContext)
  const [quizResult, setQuizResult] = useState<UserQuiz | null>(null)
  const [loading, setLoading] = useState(false)
  const { id } = useParams()

  const getQuizResult = useCallback(async () => {
    try {
      setLoading(true)
      const resultData = await axios.get(
        `${import.meta.env.VITE_API_URL}quiz/getQuizResult`,
        {
          params: { _id: id },
          headers: {
            Authorization: `Bearer ${await context.user?.getIdToken()}`,
          },
        }
      )
      setQuizResult(resultData.data.quizResult)
    } catch (err) {
      console.error(err)
      if (err instanceof Error) {
        toast.error(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [context.user, id])

  useEffect(() => {
    if (id) {
      getQuizResult()
    } else {
      toast.error('Invalid User ID or user not logged in')
    }
  }, [id, context.user, getQuizResult])

  return (
    <Container fluid className="mt-4">
      {loading ? (
        <Loader />
      ) : (
        quizResult && (
          <div>
            <h1 className="mb-4">Quiz Summary</h1>
            <div style={{ fontSize: '20px' }}>
              <strong>Correct Answers:</strong> {quizResult.correctQuestions}
              <br />
              <strong>Total Questions:</strong> {quizResult.totalQuestions}
              <br />
              <strong>Points Earned:</strong> {quizResult.pointsEarned}
              <br />
              <strong>Coins Earned:</strong> {quizResult.coinsEarned}
              <br />
              <strong>Time Taken</strong>{' '}
              {`${Math.floor(quizResult.timeTaken / 60)}:${quizResult.timeTaken % 60 < 10 ? '0' : ''}${quizResult.timeTaken % 60}`}
              <br />
              <strong>
                Quiz Result:{' '}
                <span style={{ color: quizResult.isPassed ? 'green' : 'red' }}>
                  {' '}
                  {quizResult.isPassed ? 'Passed' : 'Failed'}
                </span>
              </strong>
            </div>

            <div className="mt-4">
              <h3>Your question attempts</h3>
              <ListGroup variant="flush" style={{ marginLeft: '0px' }}>
                {quizResult.questions.map((question, index) => (
                  <ListGroup.Item key={index} style={{ paddingLeft: '0px' }}>
                    <strong>Question:</strong>{' '}
                    {question.questionId.questionStatement}
                    <br />
                    <strong>Correct Answer:</strong>{' '}
                    {question.questionId.questionAnswer}
                    <br />
                    <span
                      style={{ color: question.isCorrect ? 'green' : 'red' }}
                    >
                      <strong>Your Answer:</strong>{' '}
                      {question.userAnswer === ''
                        ? 'Not Attempted'
                        : question.userAnswer}
                    </span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </div>
        )
      )}
    </Container>
  )
}

export default QuizSummary
