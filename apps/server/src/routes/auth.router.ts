import { Router, Response } from 'express'
import { IRequest } from '../app'
import UserService, {
  ICreateUserDetails,
  IUpdateUserDetails,
} from '../service/user.service'

const authRouter = Router()

authRouter.get('/user', async (req: IRequest, res: Response) => {
  try {
    const userExist = await UserService.userExist(req.user.uid)
    console.log(userExist, 'userExists')
    if (!userExist) {
      res.json({ user: null, exists: false })
      return
    }

    const user = await UserService.getUser(req.user.uid)
    res.json({ user, exists: true })
  } catch (err) {
    console.log(err)
    res.status(404).json({ message: 'User not found' })
  }
})

authRouter.post('/createUser', async (req: IRequest, res: Response) => {
  try {
    console.log(req.body)
    const data = req.body as ICreateUserDetails
    if (!data.firstName || !data.lastName || !data.age) {
      throw new Error('input validation failed')
    }

    const user = await UserService.createUser(req.user, req.body)
    res.json(user)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }
})

authRouter.put('/updateUser', async (req: IRequest, res: Response) => {
  try {
    console.log(req.body)
    const data = req.body as IUpdateUserDetails
    if (!data.firstName || !data.lastName || !data.age) {
      throw new Error('input validation failed')
    }

    const updatedUser = await UserService.updateUser(req.user, req.body)
    res.json(updatedUser)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }
})

export default authRouter
