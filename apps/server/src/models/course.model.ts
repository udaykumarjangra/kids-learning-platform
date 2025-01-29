import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subjectId: {
      type: mongoose.Types.ObjectId,
      ref: 'subjects',
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    isPayable: {
      type: Boolean,
      required: true,
      default: false,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    _isCompleted: {
      type: Boolean,
    },
    _isUnlocked: {
      type: Boolean,
    },
  },
  { timestamps: true }
)

courseSchema.virtual('isCompleted').get(function () {
  return this._isCompleted
})

courseSchema.virtual('isUnlocked').get(function () {
  return this._isUnlocked
})

courseSchema.set('toJSON', { virtuals: true })
courseSchema.set('toObject', { virtuals: true })

const CourseModel = mongoose.model('course', courseSchema)
export default CourseModel
