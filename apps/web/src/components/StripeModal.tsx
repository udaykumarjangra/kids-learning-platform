import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import axios from 'axios'
import { useContext, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { UserContext } from '../context/authContext'

interface StripeModalProps {
  show: boolean
  handleClose: () => void
  publishableKey: string
  clientSecret: string
  amount: number
}

const StripeModal = (props: StripeModalProps) => {
  const stripe = useStripe()
  const [loading, setLoading] = useState(false)
  const elements = useElements()
  const context = useContext(UserContext)

  const handleSubmit = async () => {
    try {
      const cardElement = elements?.getElement(CardElement)
      if (stripe && cardElement) {
        setLoading(true)
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          props.clientSecret,
          {
            payment_method: {
              card: cardElement,
            },
          }
        )
        if (error) {
          toast.error(error.message)
        }

        if (!error && paymentIntent) {
          const response = await axios.post(
            import.meta.env.VITE_API_URL + 'purchases/complete-purchase',
            {
              paymentIntentId: paymentIntent.id,
            },
            {
              headers: {
                Authorization: `Bearer ${await context.user?.getIdToken()}`,
              },
            }
          )

          if (response.data) {
            toast.success('Payment successful')
            await context.updateUserDetails()
            props.handleClose()
          }
        }
        setLoading(false)
      }
    } catch (e) {
      console.error(e)
      if (e instanceof Error) {
        toast.error(e.message)
      }
      setLoading(false)
    }
  }

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Pay ${props.amount}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mt-2">
          <CardElement
            options={{
              style: {
                base: {
                  color: '#32325d',
                  fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                  fontSmoothing: 'antialiased',
                  fontSize: '20px',
                  padding: '20px 0px',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#fa755a',
                  iconColor: '#fa755a',
                },
              },
            }}
          />
        </div>
        <div
          className="mt-4"
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Button
            type="submit"
            className="mt-2 button-custom"
            style={{
              width: '50%',
            }}
            variant="custom"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? 'Processing...' : 'Pay'}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default StripeModal
