import { memo } from 'react'
import '../css/loginRegister.css'
import { Navigate, useSearchParams } from 'react-router-dom'
import VerifyEmail from './VerifyEmail'
import ResetPassword from './ResetPassword'

function Verify() {
  const [searchParams] = useSearchParams()
  if (searchParams.get('mode') === 'resetPassword') {
    return <ResetPassword />
  } else if (searchParams.get('mode') === 'verifyEmail') {
    return <VerifyEmail />
  } else {
    return <Navigate to="/login" />
  }
}
export default memo(Verify)
