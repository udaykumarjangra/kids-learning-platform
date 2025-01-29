import { Router, Response } from 'express'
import { IRequest } from '../app'
import QuizService from '../service/quiz.service'
import UserService from '../service/user.service'
import FileService from '../service/file.service'

const quizRouter = Router()

quizRouter.get('/getQuizResult', async (req: IRequest, res: Response) => {
  try {
    const quizId = req.query._id
    const quizResult = await QuizService.getQuizResult(quizId as string)
    res.json({ quizResult, exists: true })
  } catch (err) {
    console.log(err)
    res.status(404).json({ message: 'Quiz Result not found' })
  }
})

quizRouter.get('/getUserQuizHistory', async (req: IRequest, res: Response) => {
  try {
    const userId = req.user.uid;
    const user = await UserService.getUser(userId as string);
    const quizzes = await QuizService.getUserQuizzes(user._id);
    res.json({ quizzes, exists: true });
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: err.message });
  }
});

quizRouter.post('/create', async (req: IRequest, res: Response) => {
  try {
    const { courseId } = req.body
    const response = await QuizService.createNewQuiz(req.user.uid, courseId)
    res.json(response)
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message })
  }
})

quizRouter.post('/submit', async (req: IRequest, res: Response) => {
  try {
    const userQuizId = req.body.userQuizId
    const quizAnswers = req.body.quizAnswers
    if (!userQuizId || !quizAnswers || !req.body.timeTaken) {
      throw new Error('Invalid payload')
    }
    const timeTaken = parseInt(req.body.timeTaken)
    const response = await QuizService.submitQuiz(req.user.uid, userQuizId, quizAnswers, timeTaken)
    res.json(response)
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message })
  }
})


quizRouter.get('/generatePDF', async (req: IRequest, res: Response) => {
  try {
    const user = req.user.uid
    const pdfPath = await FileService.generatePDF(user);

    res.json(pdfPath);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message })
  }
})


export default quizRouter
