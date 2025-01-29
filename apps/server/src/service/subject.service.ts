import mongoose, { Types } from 'mongoose'
import SubjectModel from '../models/subject.model'
import UserSubjectModel from '../models/userSubject.model'
import UserService from './user.service'
import redis from '../redis'
import UserModel from '../models/user.model'

class SubjectService {
  static async getSubjects(userId: string) {
    try {
      const user = await UserService.getUser(userId)
      const subjects = await SubjectModel.find({})

      const subjectsWithVirtuals = await Promise.all(
        subjects.map(async (subject) => {
          let userSubject = await UserSubjectModel.findOne({
            subjectId: subject._id,
            userId: user._id,
          })

          if (!userSubject) {
            const newSubject = await UserSubjectModel.create([
              {
                subjectId: subject._id,
                userId: user._id,
                userLevel: 1,
                levelsPurchased: [],
              },
            ])
            userSubject = newSubject[0]
          }
          const subjectObj = subject.toObject({ virtuals: true }) // Get an object with virtuals
          subjectObj._userLevel = userSubject.userLevel
          return subjectObj
        })
      )

      return subjectsWithVirtuals
    } catch (err) {
      throw new Error(err.message)
    }
  }

  static async getSubject(id: number, userId: string) {
    try {
      const subject = await SubjectModel.findOne({ id })
      const user = await UserService.getUser(userId)
      if (!subject) {
        throw new Error('Subject not found')
      }

      let userSubject = await UserSubjectModel.findOne({
        subjectId: subject._id,
        userId: user._id,
      })

      if (!userSubject) {
        const newSubject = await UserSubjectModel.create([
          {
            subjectId: subject._id,
            userId: user._id,
            userLevel: 1,
            levelsPurchased: [],
          },
        ])
        userSubject = newSubject[0]
      }
      const subjectObj = subject.toObject({ virtuals: true }) // Get an object with virtuals
      subjectObj._userLevel = userSubject.userLevel
      return subjectObj
    } catch (err) {
      throw new Error(err.message)
    }
  }

  static async getSubjectById(id: mongoose.Types.ObjectId, userId: string) {
    try {
      const subject = await SubjectModel.findById(id)
      const user = await UserService.getUser(userId)
      if (!subject) {
        throw new Error('Subject not found')
      }

      let userSubject = await UserSubjectModel.findOne({
        subjectId: subject._id,
        userId: user._id,
      })

      if (!userSubject) {
        const newSubject = await UserSubjectModel.create([
          {
            subjectId: subject._id,
            userId: user._id,
            userLevel: 1,
            levelsPurchased: [],
          },
        ])
        userSubject = newSubject[0]
      }
      const subjectObj = subject.toObject({ virtuals: true }) // Get an object with virtuals
      subjectObj._userLevel = userSubject.userLevel
      return subjectObj
    } catch (err) {
      throw new Error(err.message)
    }
  }

  // A method to update User Level
  static async updateUserLevel(userId: Types.ObjectId, subjectId: Types.ObjectId, levelIncrement: number) {
    try {
      const user = await UserModel.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }
      // Find the user subject entry
      const userSubject = await UserSubjectModel.findOne({
        userId: userId,
        subjectId: subjectId
      });

      if (!userSubject) {
        throw new Error('User subject entry not found');
      }
      // Update the user level
      userSubject.userLevel += levelIncrement;

      // Save the updated user subject entry
      await userSubject.save();
      await redis.del(user.fireBaseId);
      return userSubject; // Return the updated user subject
    } catch (error) {
      throw new Error(`Error updating user level: ${error.message}`);
    }
  }
}

export default SubjectService
