import express, { Request } from 'express'
import cors from 'cors'
import authMiddleware from './middlewares/firebase'
import authRouter from './routes/auth.router'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import subjectRouter from './routes/subject.router'
import courseRouter from './routes/course.router'
import quizRouter from './routes/quiz.router'
import purchaseRouter from './routes/purchase.router'
import leaderboardrouter from './routes/leaderboard.router'
const app = express()

export interface IRequest extends Request {
  user: DecodedIdToken
}
app.use(express.json())
app.use(cors())
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/pdfs', express.static('assets/summary'))
app.use(authMiddleware)
app.use('/auth', authRouter)
app.use('/subject', subjectRouter)
app.use('/course', courseRouter)
app.use('/quiz', quizRouter)
app.use('/purchases', purchaseRouter)
app.use('/leaderboard',leaderboardrouter)

export default app
