import { Router, Response } from 'express'
import { IRequest } from '../app'
import CourseService from '../service/course.service'
import mongoose from 'mongoose'

const courseRouter = Router()

courseRouter.get('/', async (req: IRequest, res: Response) => {
  try {
    let courses
    const subjectId = req.query.subjectId
    const courseId = req.query.courseId
    if (subjectId && mongoose.Types.ObjectId.isValid(subjectId as string)) {
      const objectId = new mongoose.Types.ObjectId(subjectId as string)
      courses = await CourseService.getCoursesBySubjectId(
        objectId,
        req.user.uid
      )
    } else if (
      courseId &&
      mongoose.Types.ObjectId.isValid(courseId as string)
    ) {
      const objectId = new mongoose.Types.ObjectId(courseId as string)
      courses = await CourseService.getCourseById(objectId, req.user.uid)
    } else {
      courses = await CourseService.getAllCourses(req.user.uid)
    }
    res.json(courses)
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err.message })
  }
})

courseRouter.put('/complete', async (req: IRequest, res: Response) => {
  try {
    const courseId = req.body.courseId as string
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error('Invalid Course Id')
    }
    const objectId = new mongoose.Types.ObjectId(courseId)
    const course = await CourseService.markAsRead(objectId, req.user.uid)
    res.json(course)
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err.message })
  }
})

courseRouter.put('/unlock', async (req: IRequest, res: Response) => {
  try {
    const courseId = req.body.courseId as string
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error('Invalid Course Id')
    }
    const objectId = new mongoose.Types.ObjectId(courseId)
    await CourseService.buyCourse(objectId, req.user.uid)

    res.status(200).json("purchased successfully")
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err.message })
  }
})

export default courseRouter
