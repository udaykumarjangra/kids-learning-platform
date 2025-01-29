import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = JSON.parse(atob(import.meta.env.VITE_FIREBASE_CONFIG))

export const firebaseApp = initializeApp(firebaseConfig)
export const firebaseAuth = getAuth(firebaseApp)
export const storage = getStorage(firebaseApp)
export const subjectLogoFolder = 'subjects-logo'