import { Router, Response } from 'express'
import { IRequest } from '../app'
import PurchaseService from '../service/purchase.service'
import UserService from '../service/user.service'

const purchaseRouter = Router()

purchaseRouter.get('/', async (_: IRequest, res: Response) => {
  try {
    const coinsPlans = await PurchaseService.getCoinsPlans()
    res.json(coinsPlans)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }
})

purchaseRouter.get('/getHistory', async (req: IRequest, res: Response) => {
  try {
    const userId = req.user.uid
    const user = await UserService.getUser(userId as string)
    const history = await PurchaseService.getUserPurchaseHistory(String(user._id))
    res.json({ history, exists: true })
  } catch (err) {
    console.log(err)
    res.status(404).json({ message: err.message })
  }
})

purchaseRouter.post('/create-payment-intent', async (req: IRequest, res: Response) => {
  try {
    const { amount, planId } = req.body
    if (!amount) {
      throw new Error('Amount is required')
    }

    if (!planId) {
      throw new Error('Plan id is required')
    }
    const paymentIntentData = await PurchaseService.createPaymentIntent(parseFloat(amount), req.user.uid, planId)
    res.json(paymentIntentData)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }
})

purchaseRouter.post('/complete-purchase', async (req: IRequest, res: Response) => {
  try {
    const { paymentIntentId } = req.body
    if (!paymentIntentId) {
      throw new Error('Payment intent id is required')
    }

    const purchase = await PurchaseService.completePurchase(req.user.uid, paymentIntentId)
    res.json(purchase)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }
})


export default purchaseRouter
