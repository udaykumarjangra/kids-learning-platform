import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import UserModel from '../models/user.model'
import { Types } from 'mongoose'
import redis from '../redis'

export interface ICreateUserDetails {
  firstName: string
  lastName: string
  age: number
}

export interface IUpdateUserDetails {
  firstName: string
  lastName: string
  age: number
}

class UserService {
  static async getUser(userId: string) {
    try {

      const cachedUser = await redis.get(userId)

      if (cachedUser) {
        return JSON.parse(cachedUser)
      }
      const user = await UserModel.findOne({
        fireBaseId: userId,
      })

      if (!user) {
        throw new Error('User not found ' + userId)
      }

      await redis.set(userId, JSON.stringify(user))

      return user
    } catch (err) {
      throw new Error(err.message)
    }
  }

  static async userExist(userId: string) {
    try {
      const cachedUser = await redis.get(userId)
      if (cachedUser) {
        return true
      }
      const userExist = await UserModel.findOne({
        fireBaseId: userId,
      }).countDocuments()
      if (userExist) {
        return true
      }

      return false
    } catch (err) {
      throw new Error(err.message)
    }
  }

  // Function to update points and coins for a user
  static async updateUserPointsAndCoins(userId: Types.ObjectId, points: number, coins?: number) {
    try {
      const updateData: { $inc: { points: number; coins?: number } } = { $inc: { points: points } };
      // Check if coins are provided and add to the update data
      if (coins !== undefined) {
        updateData.$inc.coins = coins;
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
      );
      await redis.set(updatedUser.fireBaseId, JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      throw new Error(`Error updating user points and coins: ${error.message}`);
    }
  }

  static async createUser(user: DecodedIdToken, details: ICreateUserDetails) {
    try {

      const userExist = await UserModel.findOne({
        fireBaseId: user.uid,
      })

      if (userExist) {
        throw new Error('User already exists')
      }

      const createdUser = new UserModel({
        fireBaseId: user.uid,
        email: user.email,
        firstName: details.firstName,
        lastName: details.lastName,
        age: details.age,
      })
      await createdUser.save()

      return createdUser
    } catch (err) {
      throw new Error(err.message)
    }
  }
  static async updateUser(user: DecodedIdToken, details: IUpdateUserDetails) {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { fireBaseId: user.uid },
        {
          email: user.email,
          firstName: details.firstName,
          lastName: details.lastName,
          age: details.age,
        },
        { new: true, runValidators: true }
      )

      if (!updatedUser) {
        throw new Error('User not found')
      }

      await redis.del(updatedUser.fireBaseId)

      return updatedUser
    } catch (err) {
      throw new Error(err.message)
    }
  }

  static async addCoins(userId: string, coins: number) {
    try {
      const user = await UserModel.findOneAndUpdate(
        { fireBaseId: userId },
        {
          $inc: { coins: coins },
        },
        { new: true }
      )

      if (!user) {
        throw new Error('User not found')
      }

      await redis.del(user.fireBaseId)

      return user
    } catch (err) {
      throw new Error(err.message)
    }
  }

  static async getAllUsersRanking() {
    try {
      const users = await UserModel.aggregate(
        [
          {
            $lookup:
            {
              from: "userquizzes",
              localField: "_id",
              foreignField: "userId",
              as: "quizzes"
            }
          },
          {
            $unwind:
            {
              path: "$quizzes",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $group:
            {
              _id: "$_id",
              totalTimeTaken: {
                $sum: "$quizzes.timeTaken"
              },
              email: {
                $first: "$email"
              },
              firstName: {
                $first: "$firstName"
              },
              lastName: {
                $first: "$lastName"
              },
              age: {
                $first: "$age"
              },
              points: {
                $first: "$points"
              }
            }
          },
          {
            $sort:
            {
              points: -1,
              totalTimeTaken: 1
            }
          }
        ]
      );

      if (users.length === 0) {
        throw new Error('No User Found')
      }

      return users
    } catch (err) {
      throw new Error(err.message)
    }
  }
}

export default UserService
