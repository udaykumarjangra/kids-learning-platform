import { useCallback, useContext, useEffect, useState } from 'react'
import { Container, Table } from 'react-bootstrap'
import { UserContext } from '../context/authContext'
import axios, { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import Loader from '../components/Spinner'

export interface LeaderboardUser {
  email: string
  firstName: string
  lastName: string
  age: number
  points: number
  totalTimeTaken: string
}

function Leaderboard() {
  const context = useContext(UserContext)
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(false)

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}leaderboard`,
        {
          headers: {
            Authorization: `Bearer ${await context.user?.getIdToken()}`,
          },
        }
      )
      setUsers(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error)
        toast.error(error.response.data.message)
      } else {
        console.error(error)
        toast.error('Error fetching leaderboard data')
      }
    } finally {
      setLoading(false)
    }
  }, [context.user])

  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  return (
    <Container fluid className="mt-4">
      <h3
        style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '20px' }}
      >
        Leaderboard
      </h3>
      {loading && <Loader />}
      {!loading && users.length > 0 ? (
        <Table hover responsive>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Age</th>
              <th>Points</th>
              <th>Total Time Taken (s)</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.email}>
                <td>{index + 1}</td>
                <td>{user.email}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.age}</td>
                <td>{user.points}</td>
                <td>{user.totalTimeTaken}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div>No users found</div>
      )}
    </Container>
  )
}

export default Leaderboard
