import { useCallback, useContext, useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import { UserContext } from '../context/authContext'
import axios from 'axios'
import Loader from '../components/Spinner'
import '../css/markdown.css'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import CoinsCard from '../components/CoinsCard'

export interface CoinsPlans {
  _id: string
  coins: number
  price: number
  discount: number
  description: string
  planName: string
}

function BuyCoins() {
  const context = useContext(UserContext)
  const [plans, setPlans] = useState<CoinsPlans[]>()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const getCoinPlans = useCallback(async () => {
    try {
      setLoading(true)
      const plans = await axios.get(
        import.meta.env.VITE_API_URL + 'purchases',
        {
          headers: {
            Authorization: `Bearer ${await context.user?.getIdToken()}`,
          },
        }
      )
      setPlans(plans?.data)
    } catch (err) {
      console.error(err)
      if (err instanceof Error) {
        toast.error(err.message)
      }
      navigate('/app/dashboard')
    } finally {
      setLoading(false)
    }
  }, [context.user, navigate])

  useEffect(() => {
    getCoinPlans()
  }, [getCoinPlans])

  return (
    <>
      {loading && <Loader />}
      {!loading && plans && (
        <>
          <Container fluid className="mt-4">
            <Container fluid>
              <h2>Purchase Coins</h2>
            </Container>

            <Container fluid>
              <Row>
                {plans.map((plan) => (
                  <CoinsCard key={plan._id} {...plan} />
                ))}
              </Row>
            </Container>
          </Container>
        </>
      )}
    </>
  )
}

export default BuyCoins
