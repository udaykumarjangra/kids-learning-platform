import { memo, useCallback, useContext, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { UserContext } from '../context/authContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Loader from '../components/Spinner'
import { toast } from 'react-toastify'

function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { verifyEmailCode } = useContext(UserContext)

  const handleVerification = useCallback(async () => {
    const code = searchParams.get('oobCode')

    if (!code) {
      toast.error('No verify code provided')
      navigate('/login')
    }

    if (code) {
      await verifyEmailCode(code)
      navigate('/login')
    }
  }, [searchParams, verifyEmailCode, navigate])

  useEffect(() => {
    console.log('useEffect')
    handleVerification()
  }, [handleVerification])

  return (
    <Container className="container-full-right">
      <Loader />
    </Container>
  )
}

export default memo(VerifyEmail)
