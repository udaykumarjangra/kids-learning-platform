import { useCallback, useContext, useEffect, useState } from 'react'
import { Button, Container, Spinner, Table } from 'react-bootstrap'
import { UserContext } from '../context/authContext'
import axios, { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import Loader from '../components/Spinner'
import { useNavigate } from 'react-router-dom'

export interface QuizHistoryItem {
  _id: string
  courseId: {
    _id: string
    name: string
    subjectId: {
      _id: string
      name: string
    }
  }
  pointsEarned: number
  coinsEarned: number
  isPassed: boolean
  state: string
  totalQuestions: number
  correctQuestions: number
  createdAt: string
}

function QuizHistory() {
  const context = useContext(UserContext)
  const [history, setHistory] = useState<QuizHistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const navigate = useNavigate()
  const downloadFile = async (link: RequestInfo, fileName: string) => {
    try {
      const response = await fetch(link)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(new Blob([blob]))
      const anchorElement = document.createElement('a')
      anchorElement.href = url
      anchorElement.setAttribute('download', fileName)
      anchorElement.target = '_blank'
      document.body.appendChild(anchorElement)

      anchorElement.click()
      anchorElement?.parentNode?.removeChild(anchorElement)
    } catch (error) {
      console.error(error)
    }
  }

  const downloadQuizHistoryPDF = useCallback(async () => {
    try {
      setDownloadLoading(true)
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}quiz/generatePDF`,
        {
          headers: {
            Authorization: `Bearer ${await context.user?.getIdToken()}`,
          },
        }
      )
      console.log(response)
      const link = `${import.meta.env.VITE_API_URL}pdfs/${response.data}`
      await downloadFile(link, response.data)
    } catch (err) {
      console.log(err)
      if (err instanceof Error) {
        toast.error('Error in generating PDF' + err.message)
      }
    } finally {
      setDownloadLoading(false)
    }
  }, [context.user])

  const fetchQuizHistory = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}quiz/getUserQuizHistory`,
        {
          headers: {
            Authorization: `Bearer ${await context.user?.getIdToken()}`,
          },
        }
      )
      setHistory(
        Array.isArray(response.data.quizzes) ? response.data.quizzes : []
      )
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error)
        toast.error(error.response.data.message)
      } else {
        console.error(error)
        toast.error('Error fetching quiz history')
      }
    } finally {
      setLoading(false)
    }
  }, [context.user])

  useEffect(() => {
    fetchQuizHistory()
  }, [fetchQuizHistory])

  return (
    <Container fluid className="mt-4">
      <Container
        fluid
        className="mt-4"
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <Container fluid>
          <h2>{`Quiz History`}</h2>
        </Container>

        {!loading && (
          <Button
            type="submit"
            className={
              history.length === 0 || downloadLoading ? '' : 'button-custom'
            }
            variant={'custom'}
            disabled={history.length === 0}
            onClick={() => {
              downloadQuizHistoryPDF()
            }}
            style={{
              width: '30%',
            }}
          >
            {downloadLoading ? <Spinner /> : 'Download Report'}
          </Button>
        )}
      </Container>
      {loading && <Loader />}
      {!loading && history.length > 0 ? (
        <>
          <Table hover responsive>
            <thead>
              <tr>
                <th>SN</th>
                <th>Course Name</th>
                <th>Subject Name</th>
                <th>Status</th>
                <th>Quiz Taken Date</th>
                <th>Total Questions</th>
                <th>Correct Answers</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr
                  key={item._id}
                  onClick={() =>
                    navigate(`/app/course/quiz/summary/${item._id}`)
                  }
                  style={{ cursor: 'pointer' }}
                >
                  <td>{index + 1}</td>
                  <td>{item.courseId.name}</td>
                  <td>{item.courseId.subjectId.name}</td>
                  <td style={{ color: item.isPassed ? 'green' : 'red' }}>
                    <strong>{item.isPassed ? 'Pass' : 'Fail'}</strong>
                  </td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                  <td>{item.totalQuestions}</td>
                  <td>{item.correctQuestions}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      ) : (
        <div>No quizzes found</div>
      )}
    </Container>
  )
}

export default QuizHistory
