import mongoose, { Types } from "mongoose"
import QuestionsModel from "../models/questions.model"
import UserService from "./user.service"
import UserQuizzesModel from "../models/userQuizzes.model";
import CourseService from "./course.service";
import SubjectService from "./subject.service";
import CourseModel from "../models/course.model";
import redis from "../redis";

export interface UserQuizQuestion {
  questionId: string
  userAnswer: string
  isCorrect: boolean
}

export interface ICourse {
  _id: string;
  name: string;

}

export interface ISubject {
  _id: string;
  name: string

}
export interface IQuizHistory {
  _id: mongoose.Types.ObjectId;

  pointsEarned: number;
  coinsEarned: number;
  isPassed: boolean;
  state: string;
  totalQuestions: number;
  correctQuestions: number;
  createdAt: string;

}

export interface QuestionsAggregationResult {
  question: {
    questionType: string
    questionStatement: string
    questionOptions: string[]
    questionAnswer: string
  }
}

class QuizService {

  static async getQuizResult(quizId: string) {
    try {
      const cachedQuizResult = await redis.get(quizId)

      if (cachedQuizResult) {
        return JSON.parse(cachedQuizResult)
      }

      const objQuizId = new Types.ObjectId(quizId)
      const quiz = await UserQuizzesModel.findOne({
        _id: objQuizId,
      }).populate('courseId').populate('questions.questionId').exec()

      if (!quiz) {
        throw new Error('Quiz result not found ' + quizId)
      }

      await redis.set(quizId, JSON.stringify(quiz))

      return quiz
    } catch (err) {
      throw new Error(err.message)
    }
  }

  static async getUserQuizzes(userId: mongoose.Types.ObjectId) {
    try {
      const quizzes = await UserQuizzesModel.find({ userId }).populate<{
        courseId: Omit<ICourse, 'subjectId'> & { subjectId: ISubject }
      }>({
        path: 'courseId',
        populate: {
          path: 'subjectId',
        },
      })
        .exec();
      return quizzes;
    } catch (error) {
      throw new Error(`Unable to retrieve quizzes for user: ${error.message}`);
    }
  }

  static async createNewQuiz(userId: string, courseId: string) {
    try {
      const user = await UserService.getUser(userId)

      if (!user) {
        throw new Error('User not found')
      }

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        throw new Error('Invalid course ID')
      }
      const course = await CourseService.getCourseById(new mongoose.Types.ObjectId(courseId), userId);
      if (!course) {
        throw new Error('Course not found')
      }

      if (!course._isUnlocked) {
        throw new Error('Course not unlocked')
      }

      await UserQuizzesModel.updateMany({
        userId: user._id,
        courseId: new mongoose.Types.ObjectId(courseId),
        state: 'In-Progress'
      }, {
        state: 'Abandoned'
      })


      const questions = await QuestionsModel.aggregate(
        [
          {
            $match:
            {
              courseId: new mongoose.Types.ObjectId(
                courseId
              )
            }
          },
          {
            $sample:
            {
              size: 5
            }
          },
          {
            $project:
            {
              _id: "$_id",
              questionType: "$questionType",
              questionStatement: "$questionStatement",
              questionOptions: "$questionOptions"
            }
          }
        ]
      );

      const quiz = new UserQuizzesModel({
        userId: user._id,
        courseId: new mongoose.Types.ObjectId(courseId),
        pointsEarned: 0,
        coinsEarned: 0,
        isPassed: false,
        state: 'In-Progress',
        questions: questions.map(question => ({
          questionId: question._id,
          userAnswer: '',
          isCorrect: false
        })),
        totalQuestions: questions.length,
        correctQuestions: 0,
        timeTaken: 0,
      })

      await quiz.save()

      const response = {
        quiz,
        questions,
        course
      }

      return response;
    } catch (err) {
      throw new Error(err.message)
    }
  }

  static async submitQuiz(userId: string, userQuizId: string, quizAnswers: UserQuizQuestion[], timeTaken: number) {
    try {
      const user = await UserService.getUser(userId)

      if (!user) {
        throw new Error('User not found')
      }

      const quiz = await UserQuizzesModel.findById(userQuizId)

      if (!quiz) {
        throw new Error('Quiz not found')
      }

      if (quiz.state === 'Completed') {
        throw new Error('Quiz already completed')
      }

      const questions: QuestionsAggregationResult[] = await UserQuizzesModel.aggregate(
        [
          {
            $match:
            {
              _id: new mongoose.Types.ObjectId(userQuizId)
            }
          },
          {
            $project:
            {
              questions: "$questions"
            }
          },
          {
            $unwind:
            {
              path: "$questions"
            }
          },
          {
            $lookup:
            {
              from: "questions",
              localField: "questions.questionId",
              foreignField: "_id",
              as: "question"
            }
          },
          {
            $unwind:
            {
              path: "$question"
            }
          }
        ]
      ).exec();

      let correctQuestions = 0;

      for (let i = 0; i < quizAnswers.length; i++) {
        if (quizAnswers[i].userAnswer.toLowerCase() === questions[i].question.questionAnswer.toLowerCase()) {
          quiz.questions[i].isCorrect = true
          correctQuestions++
        }
        quiz.questions[i].userAnswer = quizAnswers[i].userAnswer
      }

      quiz.markModified('questions')
      quiz.correctQuestions = correctQuestions
      quiz.isPassed = quiz.correctQuestions >= quiz.totalQuestions / 2
      quiz.state = 'Completed'
      quiz.timeTaken = timeTaken

      // Calculate points and coins earned and also update user level
      quiz.pointsEarned = correctQuestions * 100;
      let pointsEarned = quiz.pointsEarned;

      let coinsEarned = 0;
      const oldQuizWithHighestPoints = await UserQuizzesModel.findOne({
        userId: user._id,
        courseId: quiz.courseId,
        _id: { $ne: quiz._id },
      }).sort({ createdAt: -1, pointsEarned: -1 }).exec()

      const mongoUser = await UserService.getUser(userId)
      if (quiz.isPassed) {
        const course = await CourseModel.findById(quiz.courseId);
        const objSubjectId = new Types.ObjectId(String(course.subjectId))
        quiz.coinsEarned = correctQuestions;
        coinsEarned = quiz.coinsEarned;
        if (oldQuizWithHighestPoints) {
          if (oldQuizWithHighestPoints.coinsEarned < quiz.coinsEarned) {
            coinsEarned = quiz.coinsEarned - oldQuizWithHighestPoints.coinsEarned;
          }
        }

        if ((oldQuizWithHighestPoints && !oldQuizWithHighestPoints.isPassed) || (!oldQuizWithHighestPoints)) {

          await SubjectService.updateUserLevel(mongoUser._id, objSubjectId, 1);

        }

        console.log('oldQuizWithHighestPoints', oldQuizWithHighestPoints)

        if (oldQuizWithHighestPoints && oldQuizWithHighestPoints.pointsEarned < quiz.pointsEarned) {
          pointsEarned = quiz.pointsEarned - oldQuizWithHighestPoints.pointsEarned;
        }
      }

      await quiz.save()
      await UserService.updateUserPointsAndCoins(mongoUser._id, pointsEarned, coinsEarned);
      await redis.del(mongoUser.fireBaseId)
      return quiz
    } catch (err) {
      throw new Error(err.message)
    }
  }
}

export default QuizService
