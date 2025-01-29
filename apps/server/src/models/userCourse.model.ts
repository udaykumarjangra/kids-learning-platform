import mongoose from 'mongoose'

const userCourseSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Types.ObjectId,
      ref: 'courses',
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    isUnlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const UserCourseModel = mongoose.model('userCourse', userCourseSchema)
export default UserCourseModel
