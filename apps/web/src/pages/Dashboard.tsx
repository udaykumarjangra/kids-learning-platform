import { useCallback, useContext, useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import { UserContext } from '../context/authContext'
import axios from 'axios'
import Loader from '../components/Spinner'
import SubjectCards, { SubjectCardProps } from '../components/SubjectCards'

function Dashboard() {
  const context = useContext(UserContext)
  const [subjects, setSubjects] = useState<SubjectCardProps[]>([])
  const [loading, setLoading] = useState(false)

  const getSubjects = useCallback(async () => {
    try {
      setLoading(true)
      const subjects = await axios.get(
        import.meta.env.VITE_API_URL + 'subject',
        {
          headers: {
            Authorization: `Bearer ${await context.user?.getIdToken()}`,
          },
        }
      )
      console.log(subjects.data)
      setSubjects(subjects.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [context.user])

  useEffect(() => {
    getSubjects()
  }, [getSubjects])

  return (
    <>
      <Container fluid className="mt-4">
        <Row className="justify-content-md-center">
          <h1>{`Welcome ${context.userDetails?.fullName}`}</h1>
        </Row>
      </Container>
      <Container fluid>
        <Row>
          {loading && <Loader />}
          {!loading &&
            subjects.map((subject) => (
              <Container>
                <SubjectCards data={subject} />
              </Container>
            ))}
        </Row>
      </Container>
    </>
  )
}

export default Dashboard
