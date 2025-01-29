import { Card } from 'react-bootstrap'

export interface CourseCardProps {
  _id: string
  name: string
  subjectId: string
  level: number
  isPayable: boolean
  price: number
  content: string
}

const CourseCard = ({ data }: { data: CourseCardProps }) => {
  return (
    <Card key={data._id}>
      <Card.Body>
        <Card.Title>{data.name}</Card.Title>
        <Card.Text>
          {data.content} <br />
          Price: {data.price}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default CourseCard
