import mongoose from 'mongoose'


const coinsPlansSchema = new mongoose.Schema(
  {
    coins: {
      type: Number,
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
)


coinsPlansSchema.set('toJSON', { virtuals: true })
coinsPlansSchema.set('toObject', { virtuals: true })

const CoinsPlansModel = mongoose.model('coinsPlans', coinsPlansSchema)
export default CoinsPlansModel
