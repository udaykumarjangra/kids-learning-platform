import { Router, Response } from 'express'
import { IRequest } from '../app'
import LeaderboardService from '../service/leaderboard.service'

const leaderboardRouter = Router()

leaderboardRouter.get('/', async (req: IRequest, res: Response) => {
  try {
  
    const rankings = await LeaderboardService.getRankings()
    res.json(rankings)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }
})  
export default leaderboardRouter
