import axios from 'axios'
import { useCallback, useContext, useState } from 'react'
import { Button, Card, Col, Image } from 'react-bootstrap'
import { UserContext } from '../context/authContext'
import { toast } from 'react-toastify'
import StripeModal from './StripeModal'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

export interface CoinsCardProps {
  _id: string
  price: number
  coins: number
  description: string
  planName: string
}

interface BuyCoinsInterface {
  clientSecret: string
  publishableKey: string
}

const CoinsCard = (props: CoinsCardProps) => {
  const [loading, setLoading] = useState(false)
  const context = useContext(UserContext)
  const [stripeDetails, setStripeDetails] = useState<BuyCoinsInterface>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const stripe = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  const handleBuyCoins = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.post(
        import.meta.env.VITE_API_URL + 'purchases/create-payment-intent',
        {
          amount: props.price,
          planId: props._id,
        },
        {
          headers: {
            Authorization: `Bearer ${await context.user?.getIdToken()}`,
          },
        }
      )
      setStripeDetails(response?.data)
      setIsModalOpen(true)
    } catch (err) {
      console.error(err)
      if (err instanceof Error) {
        toast.error(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [context.user, props.price, props._id])

  return (
    <Col>
      <Card>
        <Card.Header>{props.planName}</Card.Header>
        <Card.Body className="text-center">
          <Card.Title>
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/versatile-innovations.appspot.com/o/coinsPlans%2Fcoins.png?alt=media&token=d5c17898-d2db-4a70-862c-38d67144c476"
              width="50"
              height="50"
            />{' '}
            ${`${props.price}`}
          </Card.Title>
          <Card.Text className="mt-4">{props.description}</Card.Text>
          <Card.Footer
            style={{ backgroundColor: 'transparent', border: 'none' }}
          >
            <Button
              type="submit"
              className="mt-2 w-100 button-custom"
              variant="custom"
              onClick={handleBuyCoins}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Buy Now'}
            </Button>
          </Card.Footer>
        </Card.Body>
      </Card>
      {stripeDetails?.clientSecret && stripeDetails.publishableKey && (
        <Elements stripe={stripe}>
          <StripeModal
            clientSecret={stripeDetails.clientSecret}
            publishableKey={stripeDetails.publishableKey}
            show={isModalOpen}
            amount={props.price}
            handleClose={() => setIsModalOpen(false)}
          />
        </Elements>
      )}
    </Col>
  )
}

export default CoinsCard
