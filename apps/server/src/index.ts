import app from './app'
import config from './config'
import mongoose from 'mongoose'
import admin, { ServiceAccount } from 'firebase-admin'
import { readFileSync } from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const serviceAccountPath = path.resolve(__dirname, '../firebase-admin.json')
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
})

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}`)
})

mongoose
  .connect(config.mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err))
