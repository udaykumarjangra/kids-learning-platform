import mongoose from 'mongoose'

const userQuizzesQuestionsSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Types.ObjectId,
      ref: 'questions',
      required: true,
    },
    userAnswer: {
      type: String,
      required: false,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: false }
)

const userQuizzesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    courseId: {
      type: mongoose.Types.ObjectId,
      ref: 'course',
      required: true,
    },
    pointsEarned: {
      type: Number,
      required: true,
    },
    coinsEarned: {
      type: Number,
      required: true,
    },
    isPassed: {
      type: Boolean,
      required: true,
      default: false,
    },
    state: {
      type: String,
      enum: ['Completed', 'In-Progress', 'Abandoned'],
    },
    questions: {
      type: [userQuizzesQuestionsSchema],
      required: true,
      default: [],
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctQuestions: {
      type: Number,
      required: true,
    },
    timeTaken: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)


userQuizzesSchema.set('toJSON', { virtuals: true })
userQuizzesSchema.set('toObject', { virtuals: true })

const UserQuizzesModel = mongoose.model('userQuizzes', userQuizzesSchema)
export default UserQuizzesModel
