import { Button, Container, Form } from 'react-bootstrap'
import { QuizQuery, UserQuizQuestion } from '../pages/Quiz'
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'

export interface QuizFormProps {
  quiz: QuizQuery
  setQuizAnswers: React.Dispatch<
    React.SetStateAction<UserQuizQuestion[] | undefined>
  >
  quizAnswers: UserQuizQuestion[] | undefined
  submitQuiz: (timeTaken: number) => Promise<void>
}

const QuizForm = ({
  quiz,
  quizAnswers,
  setQuizAnswers,
  submitQuiz,
}: QuizFormProps) => {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const totalTime = quiz.questions.length * 60

  const [timeLeft, setTimeLeft] = useState(totalTime)

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
  }

  const handleNext = () => {
    if (questionIndex < quiz.questions.length - 1) {
      const currentIndex = questionIndex
      if (answer && quizAnswers) {
        const copy = quizAnswers
        copy[questionIndex].userAnswer = answer
        setQuizAnswers(copy)
        setAnswer(quizAnswers ? quizAnswers[currentIndex + 1].userAnswer : '')
      }
      setQuestionIndex(questionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (questionIndex > 0) {
      const currentIndex = questionIndex
      setQuestionIndex(questionIndex - 1)
      setAnswer(quizAnswers ? quizAnswers[currentIndex - 1].userAnswer : '')
    }
  }

  const handleSubmit = useCallback(() => {
    if (quizAnswers && answer) {
      const copy = quizAnswers
      copy[questionIndex].userAnswer = answer
      setQuizAnswers(copy)
    }
    submitQuiz(totalTime - timeLeft)
  }, [answer, questionIndex, quizAnswers, setQuizAnswers, submitQuiz])

  useEffect(() => {
    if (timeLeft === 0) {
      toast.success('Test submitted successfully')
      handleSubmit()
    }
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => clearInterval(timerId)
  }, [timeLeft, handleSubmit])

  return (
    <>
      <Container fluid>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h1>Question {questionIndex + 1}</h1>
          <h3>Time Left: {formatTime(timeLeft)}</h3>
        </div>
      </Container>
      <Container fluid>
        <h2 className="mt-4">
          {quiz.questions[questionIndex].questionStatement}
        </h2>
        <div
          style={{
            height: '270px',
            paddingTop:
              quiz.questions[questionIndex].questionType === 'blank'
                ? '20px'
                : '0',
          }}
        >
          {quiz.questions[questionIndex].questionType === 'mcq' &&
            quiz.questions[questionIndex].questionOptions.map(
              (option, index) => (
                <div key={index}>
                  <Button
                    type="submit"
                    className={`quiz-button w-100 ${
                      option === answer ? 'selected' : ''
                    }`}
                    variant="custom"
                    onClick={() => setAnswer(option)}
                  >
                    <span>{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Button>
                </div>
              )
            )}

          {quiz.questions[questionIndex].questionType === 'blank' && (
            <Form.Control
              type="text"
              className="input-custom"
              style={{ height: '60px' }}
              placeholder="Type your answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value.trim())}
            />
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            type="submit"
            className="button-custom"
            variant="custom"
            disabled={questionIndex === 0}
            onClick={handlePrevious}
            style={{
              width: '20%',
            }}
          >
            Previous
          </Button>

          {answer !== '' && (
            <Button
              type="submit"
              className="button-custom"
              variant="custom"
              onClick={() => setAnswer('')}
              style={{
                width: '20%',
              }}
            >
              Clear Choice
            </Button>
          )}

          <Button
            type="submit"
            className="button-custom"
            variant="custom"
            onClick={
              questionIndex === quiz.questions.length - 1
                ? handleSubmit
                : handleNext
            }
            style={{
              width: '20%',
            }}
          >
            {questionIndex === quiz.questions.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </div>
      </Container>
    </>
  )
}

export default QuizForm
