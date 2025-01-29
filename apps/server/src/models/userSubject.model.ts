import mongoose from 'mongoose'

const userSubjectSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Types.ObjectId,
      ref: 'subjects',
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    userLevel: {
      type: Number,
      required: true,
      default: 1,
    },
    levelsPurchased: {
      type: [mongoose.Types.ObjectId],
      ref: 'courses',
      default: [],
    },
  },
  { timestamps: true }
)

const UserSubjectModel = mongoose.model('userSubjects', userSubjectSchema)
export default UserSubjectModel
