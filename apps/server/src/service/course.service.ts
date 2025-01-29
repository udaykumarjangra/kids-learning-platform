import mongoose from 'mongoose'
import CourseModel from '../models/course.model'
import UserCourseModel from '../models/userCourse.model'
import UserService from './user.service'
import UserSubjectModel from '../models/userSubject.model'
import PurchaseHistoryModel from '../models/purchaseHistory.model'
import redis from '../redis'
import UserModel from '../models/user.model'

class CourseService {
  static async getCoursesBySubjectId(
    subjectId: mongoose.Types.ObjectId,
    userId: string
  ) {
    try {
      const user = await UserService.getUser(userId)
      const courses = await CourseModel.find({ subjectId })
      if (!courses) {
        throw new Error('course not found')
      }

      const coursesWithVirtual = await Promise.all(
        courses.map(async (course) => {
          let userCourse = await UserCourseModel.findOne({
            courseId: course._id,
            userId: user._id,
          })

          if (!userCourse) {
            const newCourse = await UserCourseModel.create([
              {
                courseId: course._id,
                userId: user._id,
                isCompleted: false,
                isUnlocked: course.isPayable ? false : true,
              },
            ])
            userCourse = newCourse[0]
          }

          const courseObj = course.toObject({ virtuals: true }) // Get an object with virtuals
          courseObj._isCompleted = userCourse.isCompleted
          courseObj._isUnlocked = userCourse.isUnlocked
          return courseObj
        })
      )

      return coursesWithVirtual
    } catch (err) {
      throw new Error(err.message)
    }
  }
  static async getAllCourses(userId: string) {
    try {
      const courses = await CourseModel.find({})
      const user = await UserService.getUser(userId)
      if (!courses) {
        throw new Error('course not found')
      }

      courses.map(async (course) => {
        let userCourse = await UserCourseModel.findOne({
          courseId: course._id,
          userId: user._id,
        })

        if (!userCourse) {
          const newCourse = await UserCourseModel.create([
            { courseId: course._id, userId: user._id, isCompleted: false },
          ])
          userCourse = newCourse[0]
        }
        course._isCompleted = userCourse.isCompleted
      })

      return courses
    } catch (err) {
      throw new Error(err.message)
    }
  }

  static async getCourseById(
    courseId: mongoose.Types.ObjectId,
    userId: string
  ) {
    try {
      const user = await UserService.getUser(userId)
      const course = await CourseModel.findById(courseId)
      if (!course) {
        throw new Error('course not found')
      }
      let userCourse = await UserCourseModel.findOne({
        courseId: course._id,
        userId: user._id,
      })
      if (!userCourse) {
        const newCourse = await UserCourseModel.create([
          {
            courseId: course._id,
            userId: user._id,
            isCompleted: false,
            isUnlocked: course.isPayable ? false : true,
          },
        ])
        userCourse = newCourse[0]
      }

      const courseObj = course.toObject({ virtuals: true }) // Get an object with virtuals
      courseObj._isCompleted = userCourse.isCompleted
      courseObj._isUnlocked = userCourse.isUnlocked
      return courseObj
    } catch (err) {
      throw new Error(err.message)
    }
  }

  static async markAsRead(courseId: mongoose.Types.ObjectId, userId: string) {
    try {
      const user = await UserService.getUser(userId)
      const course = await CourseModel.findById(courseId)
      if (!course) {
        throw new Error('course not found')
      }
      const userCourse = await UserCourseModel.findOne({
        courseId: course._id,
        userId: user._id,
      })
      if (!userCourse) {
        throw new Error('User course not found')
      }
      userCourse.isCompleted = true

      const userSubject = await UserSubjectModel.findOne({
        subjectId: course.subjectId,
        userId: user._id,
      })
      if (!userSubject) {
        throw new Error('User subject not found')
      }

      userSubject.userLevel = course.level + 1
      await userCourse.save()
      await userSubject.save()

      return await CourseService.getCourseById(course._id, userId)
    } catch (err) {
      throw new Error(err.message)
    }
  }

  static async buyCourse(courseId: mongoose.Types.ObjectId, userId: string) {
    try {
      await redis.del(userId);
      const user = await UserModel.findOne({ fireBaseId: userId })
      const course = await CourseModel.findById(courseId)
      if (!course) {
        throw new Error('course not found')
      }
      const userCourse = await UserCourseModel.findOne({
        courseId: course._id,
        userId: user._id,
      })
      if (!userCourse) {
        throw new Error('User course not found')
      }

      if (userCourse.isUnlocked) {
        throw new Error('Course already unlocked')
      }

      if (user.coins < course.price) {
        throw new Error('Insufficient coins')
      }
      user.coins = user.coins - course.price
      userCourse.isUnlocked = true
      await userCourse.save()
      await user.save()

      await PurchaseHistoryModel.create({
        userId: user._id,
        price: course.price,
        courseId: course._id,
        status: 'COMPLETED',
        type: "COURSE"
      });

      await redis.del(user.fireBaseId)

    } catch (err) {
      throw new Error(err.message)
    }
  }
}

export default CourseService
