import mongoose from 'mongoose'

const questionsSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Types.ObjectId,
      ref: 'course',
      required: true,
    },
    questionType: {
      type: String,
      enum: ['mcq', 'blank'],
      required: true,
    },
    questionStatement: {
      type: String,
      required: true,
    },
    questionOptions: {
      type: [String],
      required: true,
      default: [],
    },
    questionAnswer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)


questionsSchema.set('toJSON', { virtuals: true })
questionsSchema.set('toObject', { virtuals: true })

const QuestionsModel = mongoose.model('questions', questionsSchema)
export default QuestionsModel
