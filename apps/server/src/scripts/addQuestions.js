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

const addSubject = async () => {
  const mongouri = ''
  await mongoose.connect(mongouri)
  try {
    const courseId = new mongoose.Types.ObjectId('671d803805fbc86fe639f011') // replace with actual courseId
    const questions = [
      {
        courseId,
        questionType: 'mcq',
        questionStatement: 'What is 2 + 3?',
        questionOptions: ['4', '5', '6', '3'],
        questionAnswer: '5',
      },
      {
        courseId,
        questionType: 'mcq',
        questionStatement: 'What is 1 + 4?',
        questionOptions: ['6', '4', '5', '3'],
        questionAnswer: '5',
      },
      {
        courseId,
        questionType: 'blank',
        questionStatement: 'What is 3 + 2?',
        questionOptions: [],
        questionAnswer: '5',
      },
      {
        courseId,
        questionType: 'mcq',
        questionStatement: 'What is 1 + 1?',
        questionOptions: ['2', '3', '4', '1'],
        questionAnswer: '2',
      },
      {
        courseId,
        questionType: 'blank',
        questionStatement: 'What is 5 + 1?',
        questionOptions: [],
        questionAnswer: '6',
      },
      {
        courseId,
        questionType: 'mcq',
        questionStatement: 'What is 3 + 4?',
        questionOptions: ['7', '5', '6', '8'],
        questionAnswer: '7',
      },
      {
        courseId,
        questionType: 'blank',
        questionStatement: 'What is 2 + 2?',
        questionOptions: [],
        questionAnswer: '4',
      },
    ]
    const created = await QuestionsModel.create(questions)
    console.log(created)
  } catch (err) {
    console.error(err)
  }
}

addSubject()
