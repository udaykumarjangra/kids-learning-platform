import mongoose, { Schema } from 'mongoose';


const PurchaseHistorySchema: Schema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'users', required: true },
    coinPlanId: { type: mongoose.Types.ObjectId, ref: 'coinsPlans', required: false },
    courseId: { type: mongoose.Types.ObjectId, ref: 'course', required: false },
    price: { type: Number, required: true },
    paymentIntentId: { type: String, required: false },
    status: { type: String, default: 'PENDING', enum: ['PENDING', 'COMPLETED'] },
    type: { type: String, default: 'COIN', enum: ['COIN', 'COURSE'] },
  },
  { timestamps: true }
);

const PurchaseHistoryModel = mongoose.model('PurchaseHistory', PurchaseHistorySchema)

export default PurchaseHistoryModel;
