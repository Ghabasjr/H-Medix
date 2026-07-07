'use client'

import { initializeApp, getApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4gkvTgE9cHAq36OglP8DshC85MooWdfY",
  authDomain: "eloni-bd30c.firebaseapp.com",
  projectId: "eloni-bd30c",
  storageBucket: "eloni-bd30c.appspot.com",
  messagingSenderId: "777137816114",
  appId: "1:777137816114:web:4e971733efe899a8ac322b",
}

// Initialize Firebase once, using the existing app if already initialized.
// This must run at module level so that the exported `auth`, `db`, and
// `storage` references are non-null when other modules import them.
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }
export const firebaseApp = app
export default app
