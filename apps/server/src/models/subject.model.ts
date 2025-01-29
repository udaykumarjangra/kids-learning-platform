import mongoose from 'mongoose'

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    maxLevels: {
      type: Number,
      required: true,
    },
    logoUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    _userLevel: {
      type: Number,
    },
  },
  { timestamps: true }
)

subjectSchema.virtual('userLevel').get(function () {
  return this._userLevel
})

subjectSchema.set('toJSON', { virtuals: true })
subjectSchema.set('toObject', { virtuals: true })

const SubjectModel = mongoose.model('subjects', subjectSchema)
export default SubjectModel
