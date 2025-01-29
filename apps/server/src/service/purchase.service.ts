import config from '../config'
import CoinsPlansModel from '../models/coinsPlans.model'
import UserService from './user.service'
import PurchaseHistoryModel from '../models/purchaseHistory.model'
import Stripe from 'stripe'
import EmailService from './email.service'

export interface ICreateUserDetails {
  firstName: string
  lastName: string
  age: number
}

export interface IUpdateUserDetails {
  firstName: string
  lastName: string
  age: number
}

const stripe = new Stripe(config.stripeSecretKey)

class PurchaseService {

  static async getCoinsPlans() {
    try {
      const coinsPlans = await CoinsPlansModel.find({}).sort({ price: 1 })

      if (!coinsPlans) {
        throw new Error('No coins plans found')
      }

      return coinsPlans
    } catch (err) {
      throw new Error(err.message)
    }
  }

  static async getUserPurchaseHistory(userId: string) {
    try {
      const purchaseHistory = await PurchaseHistoryModel.find({ userId }).populate('coinPlanId').populate('courseId');

      if (!purchaseHistory || purchaseHistory.length === 0) {
        throw new Error(`No purchase history found`);
      }



      return purchaseHistory;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async createPaymentIntent(amount: number, userId: string, planId: string) {
    try {
      const user = await UserService.getUser(userId);
      const stripeCustomerId = await PurchaseService.createOrGetStripeCustomer(user.email);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'cad',
        customer: stripeCustomerId,
        payment_method_types: ['card'],
        metadata: {
          planId,
        }
      })

      return {
        clientSecret: paymentIntent.client_secret,
        publishableKey: config.stripePublishableKey,
      }
    } catch (err) {
      throw new Error(err.message)
    }


  }

  static async createOrGetStripeCustomer(email: string) {
    try {
      const existingCustomer = await stripe.customers.list({
        email: email,
        limit: 1,
      })

      if (existingCustomer.data.length > 0) {
        return existingCustomer.data[0].id
      }

      const newCustomer = await stripe.customers.create({
        email: email,
      })

      return newCustomer.id
    } catch (err) {
      throw new Error(err.message)
    }
  }

  static async completePurchase(userId: string, paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

      if (!paymentIntent) {
        throw new Error('Payment intent not found')
      }

      if (paymentIntent.status !== 'succeeded') {
        throw new Error('Payment intent not succeeded')
      }


      const planId = paymentIntent.metadata.planId
      const coinsPlan = await CoinsPlansModel.findById(planId)

      if (!coinsPlan) {
        throw new Error('Coins plan not found')
      }

      const existingIntent = await PurchaseHistoryModel.findOne({ paymentIntentId })

      if (existingIntent) {
        throw new Error('Payment intent already used')
      }

      await UserService.addCoins(userId, coinsPlan.coins)
      const user = await UserService.getUser(userId)
      const purchaseHistory = await PurchaseHistoryModel.create({
        userId: user._id,
        coinPlanId: planId,
        price: coinsPlan.price,
        paymentIntentId,
        status: 'COMPLETED',
        type: "COIN"
      });

      await EmailService.sendEmail(
        user.email,
        `Your Purchase of ${coinsPlan.coins} coins.`,
        user.firstName + " " + user.lastName,
        await purchaseHistory.populate('coinPlanId')
      );
      return true
    } catch (err) {
      throw new Error(err.message)
    }
  }
}

export default PurchaseService
