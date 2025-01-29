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
    },
  },
  { timestamps: true }
)

coinsPlansSchema.set('toJSON', { virtuals: true })
coinsPlansSchema.set('toObject', { virtuals: true })

const CoinsPlansModel = mongoose.model('coinsPlans', coinsPlansSchema)

const addCoinPlans = async () => {
  const mongouri = ''
  await mongoose.connect(mongouri)
  try {
    const plans = [
      {
        coins: 10,
        price: 2.99,
        discount: 0,
        description: 'Get 10 coins for $2.99',
      },
      {
        coins: 50,
        price: 9.99,
        discount: 0,
        description: 'Get 50 coins for $9.99',
      },
      {
        coins: 100,
        price: 19.99,
        discount: 0,
        description: 'Get 100 coins for $19.99',
      },
      {
        coins: 200,
        price: 29.99,
        discount: 0,
        description: 'Get 200 coins for $29.99',
      },
    ]

    const coinsPlans = await CoinsPlansModel.create(plans)
    console.log(coinsPlans)
  } catch (err) {
    console.error(err)
  }
}

addCoinPlans()
