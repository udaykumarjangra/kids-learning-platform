import { useCallback, useContext, useEffect, useState } from 'react'
import { Container, Table } from 'react-bootstrap'
import { UserContext } from '../context/authContext'
import axios, { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import Loader from '../components/Spinner'
import { Course } from './Course'

export interface PurchaseHistory {
  _id: string
  createdAt: string
  price: number
  status: string
  type: string
  coinPlanId?: CoinPlan
  courseId?: Course
}

export interface CoinPlan {
  _id: string
  planName: string
  coins: number
}

function PurchaseHistory() {
  const context = useContext(UserContext)
  const [history, setHistory] = useState<PurchaseHistory[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch purchase history
  const fetchPurchaseHistory = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}purchases/getHistory`,
        {
          headers: {
            Authorization: `Bearer ${await context.user?.getIdToken()}`,
          },
        }
      )
      setHistory(
        Array.isArray(response.data.history) ? response.data.history : []
      )
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error)
        toast.error(error.response.data.message)
      } else {
        console.error(error)
        toast.error('Error fetching purchase history')
      }
    } finally {
      setLoading(false)
    }
  }, [context.user])

  const getRowDetails = (item: PurchaseHistory) => {
    if (item.type === 'COURSE') {
      return {
        type: `Course Purchase: ${item.courseId?.name}`,
        coins: item.price,
        date: new Date(item.createdAt).toLocaleString(),
        color: 'red',
      }
    } else {
      return {
        type: `Coin Purchase: ${item.coinPlanId?.planName}`,
        coins: item.coinPlanId?.coins,
        date: new Date(item.createdAt).toLocaleString(),
        amount: `$${item.price ? item.price.toFixed(2) : '0.00'}`,
        color: 'green',
      }
    }
  }

  useEffect(() => {
    fetchPurchaseHistory()
  }, [fetchPurchaseHistory])

  return (
    <Container fluid className="mt-4">
      <h3
        style={{
          fontSize: '1.8rem',
          fontWeight: '600',
          marginBottom: '20px',
        }}
      >
        Purchase History
      </h3>
      {loading && <Loader />}{' '}
      {!loading && history.length > 0 ? (
        <>
          <Table hover responsive>
            <thead>
              <tr>
                <th>SN</th>
                <th>Type</th>
                <th>Coins</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{getRowDetails(item).type}</td>{' '}
                  <td>
                    <span
                      style={{ color: item.type === 'COIN' ? 'green' : 'red' }}
                    >
                      <strong>
                        {item.type === 'COIN' ? '+' : '-'}
                        <i
                          className="bi bi-coin"
                          style={{ marginLeft: '5px' }}
                        ></i>{' '}
                        {getRowDetails(item).coins}
                      </strong>
                    </span>
                  </td>
                  <td>{getRowDetails(item).date}</td>{' '}
                  <td>{getRowDetails(item).amount}</td>{' '}
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      ) : (
        <div>No purchases found</div>
      )}
    </Container>
  )
}

export default PurchaseHistory
