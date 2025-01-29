import { Container } from 'react-bootstrap'
import Spinner from 'react-bootstrap/Spinner'
import '../css/loader.css'

function Loader() {
  return (
    <Container className="loader">
      <Spinner animation="border" role="status" />
    </Container>
  )
}

export default Loader
