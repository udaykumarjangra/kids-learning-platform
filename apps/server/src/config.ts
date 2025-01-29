import dotenv from 'dotenv'

dotenv.config()

export default {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URI,
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  mailLogin: process.env.EMAIL_SERVICE_LOGIN,
  mailPassword: process.env.EMAIL_SERVICE_PASSWORD,
  redisURL: process.env.REDIS_URL,
}
