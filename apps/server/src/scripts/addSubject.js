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

const SubjectModel = mongoose.model('subjects', subjectSchema)

const addSubject = async () => {
  const mongouri = ''
  await mongoose.connect(mongouri)
  try {
    const name = 'Maths'
    const id = 2
    const description =
      'Learn addition, subtraction, multiplication, division and more.'
    const maxLevels = 5
    const logoUrl =
      'https://firebasestorage.googleapis.com/v0/b/versatile-innovations.appspot.com/o/subjects-logo%2Fmathematics.png?alt=media&token=61725326-014f-4f8c-b197-6786f4020b4e'
    const subject = new SubjectModel({
      name,
      id,
      description,
      maxLevels,
      logoUrl,
    })
    await subject.save()
    console.log(subject)
  } catch (err) {
    console.error(err)
  }
}

addSubject()
