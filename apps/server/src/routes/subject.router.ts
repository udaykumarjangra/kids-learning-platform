import { Router, Response } from 'express'
import { IRequest } from '../app'
import SubjectService from '../service/subject.service'

const subjectRouter = Router()

subjectRouter.get('/', async (req: IRequest, res: Response) => {
  try {
    const subjects = await SubjectService.getSubjects(req.user.uid)
    res.json(subjects)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }
})

subjectRouter.get('/:id', async (req: IRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    if (!id) {
      throw new Error('Invalid Subject Id')
    }
    const subject = await SubjectService.getSubject(id, req.user.uid)
    res.json(subject)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }
})

export default subjectRouter
