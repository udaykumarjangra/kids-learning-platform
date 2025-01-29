import mongoose from 'mongoose'

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    fireBaseId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    points: {
      type: Number,
      required: true,
      default: 0,
    },
    coins: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
)

// Create and export the User model
const UserModel = mongoose.model('User', userSchema)
export default UserModel
