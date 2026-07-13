// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   GoogleAuthProvider,
//   signInWithCredential,
//   updateProfile,
//   User as FirebaseUser,
// } from 'firebase/auth'
// import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
// import { auth, db } from '../firebase/config'
// import { User, UserRole } from './types'

// // Convert Firebase User to our User type
// async function convertFirebaseUser(firebaseUser: FirebaseUser, role?: UserRole): Promise<User> {
//   // Try to get existing user document for role
//   const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
//   const userData = userDoc.data()

//   return {
//     uid: firebaseUser.uid,
//     id: firebaseUser.uid,
//     email: firebaseUser.email || '',
//     displayName: firebaseUser.displayName,
//     name: firebaseUser.displayName,
//     photoURL: firebaseUser.photoURL,
//     role: (userData?.role as UserRole) || role || 'customer',
//     storeId: userData?.storeId || null,
//     createdAt: userData?.createdAt || Date.now(),
//     updatedAt: userData?.updatedAt || Date.now(),
//     emailVerified: firebaseUser.emailVerified,
//   }
// }

// // Sign up with email and password
// export async function signUpWithEmail(
//   email: string,
//   password: string,
//   displayName: string,
//   role: UserRole
// ): Promise<User> {
//   const userCredential = await createUserWithEmailAndPassword(auth, email, password)
//   const firebaseUser = userCredential.user

//   // Update profile
//   await updateProfile(firebaseUser, { displayName })

//   // Create user document in Firestore
//   const userData: User = {
//     uid: firebaseUser.uid,
//     id: firebaseUser.uid,
//     email: firebaseUser.email || '',
//     displayName,
//     name: displayName,
//     photoURL: null,
//     role,
//     storeId: null,
//     createdAt: Date.now(),
//     updatedAt: Date.now(),
//     emailVerified: false,
//   }

//   await setDoc(doc(db, 'users', firebaseUser.uid), userData)

//   return userData
// }

// // Login with email and password
// export async function loginWithEmail(email: string, password: string): Promise<User> {
//   const userCredential = await signInWithEmailAndPassword(auth, email, password)
//   const user = await convertFirebaseUser(userCredential.user)
//   return user
// }

// // Login with Google
// export async function loginWithGoogle(idToken: string, role: UserRole): Promise<User> {
//   const provider = new GoogleAuthProvider()
//   const credential = GoogleAuthProvider.credential(idToken)
//   const userCredential = await signInWithCredential(auth, credential)
//   const firebaseUser = userCredential.user

//   // Check if user document exists
//   const userDocRef = doc(db, 'users', firebaseUser.uid)
//   const userDocSnap = await getDoc(userDocRef)

//   if (!userDocSnap.exists()) {
//     // Create new user document
//     const userData: User = {
//       uid: firebaseUser.uid,
//       id: firebaseUser.uid,
//       email: firebaseUser.email || '',
//       displayName: firebaseUser.displayName,
//       name: firebaseUser.displayName,
//       photoURL: firebaseUser.photoURL,
//       role,
//       storeId: null,
//       createdAt: Date.now(),
//       updatedAt: Date.now(),
//       emailVerified: firebaseUser.emailVerified,
//     }
//     await setDoc(userDocRef, userData)
//     return userData
//   }

//   return convertFirebaseUser(firebaseUser)
// }

// // Logout
// export async function logout(): Promise<void> {
//   await signOut(auth)
// }

// // Update user role
// export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
//   await updateDoc(doc(db, 'users', uid), { role, updatedAt: Date.now() })
// }

// // Get current user from Firestore
// export async function getCurrentUser(): Promise<User | null> {
//   if (!auth.currentUser) return null
//   return convertFirebaseUser(auth.currentUser)
// }

// // Handle Firebase auth errors
// export function getAuthErrorMessage(errorCode: string): string {
//   const errorMessages: Record<string, string> = {
//     'auth/email-already-in-use': 'This email is already registered',
//     'auth/invalid-email': 'Invalid email address',
//     'auth/weak-password': 'Password must be at least 6 characters',
//     'auth/user-not-found': 'User account not found',
//     'auth/wrong-password': 'Invalid password',
//     'auth/too-many-requests': 'Too many login attempts. Please try again later',
//     'auth/account-exists-with-different-credential': 'An account with this email already exists',
//     'auth/cancelled-popup-request': 'Popup request cancelled',
//     'auth/popup-blocked': 'Popup window was blocked by the browser',
//     'auth/popup-closed-by-user': 'Popup window closed by the user',
//     'auth/operation-not-supported-in-this-environment': 'Operation not supported in this environment',
//     'auth/internal-error': 'An internal error occurred',
//     'auth/network-request-failed': 'Network error occurred',
//   }
//   return errorMessages[errorCode] || 'An authentication error occurred'
// }


import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithCredential,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import { User, UserRole } from './types'

async function ensureCustomerProfile(user: User): Promise<void> {
  if (user.role !== 'customer') return

  const customerRef = doc(db, 'customers', user.uid)
  const customerSnap = await getDoc(customerRef)
  const now = new Date()

  if (customerSnap.exists()) {
    await updateDoc(customerRef, {
      name: user.name || user.displayName || '',
      email: user.email,
      updatedAt: now,
    })
    return
  }

  await setDoc(customerRef, {
    id: user.uid,
    uid: user.uid,
    name: user.name || user.displayName || '',
    email: user.email,
    phone: '',
    walletBalance: 0,
    totalSpent: 0,
    transactionCount: 0,
    status: 'active',
    createdAt: now,
    updatedAt: now,
  })
}

// Convert Firebase User to our User type
async function convertFirebaseUser(firebaseUser: FirebaseUser, role?: UserRole): Promise<User> {
  // Try to get existing user document for role — tolerate the doc not
  // existing yet (e.g. right after signup, before setDoc has completed)
  // or a transient permission error, and fall back to auth-only defaults
  // instead of throwing.
  let userData: any = undefined
  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
    userData = userDoc.data()
  } catch (err) {
    console.warn('Could not fetch user profile yet, falling back to auth defaults:', err)
  }

  return {
    uid: firebaseUser.uid,
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName,
    name: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    role: (userData?.role as UserRole) || role || 'customer',
    storeId: userData?.storeId || null,
    createdAt: userData?.createdAt || Date.now(),
    updatedAt: userData?.updatedAt || Date.now(),
    emailVerified: firebaseUser.emailVerified,
  }
}

// Sign up with email and password
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string,
  role: UserRole
): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const firebaseUser = userCredential.user

  // Update profile
  await updateProfile(firebaseUser, { displayName })

  // Create user document in Firestore
  const userData: User = {
    uid: firebaseUser.uid,
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName,
    name: displayName,
    photoURL: null,
    role,
    storeId: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    emailVerified: false,
  }

  await setDoc(doc(db, 'users', firebaseUser.uid), userData)
  await ensureCustomerProfile(userData)

  return userData
}

// Login with email and password
export async function loginWithEmail(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  const user = await convertFirebaseUser(userCredential.user)
  await ensureCustomerProfile(user)
  return user
}

// Login with Google
export async function loginWithGoogle(idToken: string, role: UserRole): Promise<User> {
  const provider = new GoogleAuthProvider()
  const credential = GoogleAuthProvider.credential(idToken)
  const userCredential = await signInWithCredential(auth, credential)
  const firebaseUser = userCredential.user

  // Check if user document exists
  const userDocRef = doc(db, 'users', firebaseUser.uid)
  const userDocSnap = await getDoc(userDocRef)

  if (!userDocSnap.exists()) {
    // Create new user document
    const userData: User = {
      uid: firebaseUser.uid,
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName,
      name: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      role,
      storeId: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      emailVerified: firebaseUser.emailVerified,
    }
    await setDoc(userDocRef, userData)
    await ensureCustomerProfile(userData)
    return userData
  }

  const user = await convertFirebaseUser(firebaseUser)
  await ensureCustomerProfile(user)
  return user
}

// Logout
export async function logout(): Promise<void> {
  await signOut(auth)
}

// Update user role
export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
  await updateDoc(doc(db, 'users', uid), { role, updatedAt: Date.now() })
}

// Get current user from Firestore
export async function getCurrentUser(): Promise<User | null> {
  if (!auth.currentUser) return null
  return convertFirebaseUser(auth.currentUser)
}

// Handle Firebase auth errors
export function getAuthErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'This email is already registered',
    'auth/invalid-email': 'Invalid email address',
    'auth/weak-password': 'Password must be at least 6 characters',
    'auth/user-not-found': 'User account not found',
    'auth/wrong-password': 'Invalid password',
    'auth/too-many-requests': 'Too many login attempts. Please try again later',
    'auth/account-exists-with-different-credential': 'An account with this email already exists',
    'auth/cancelled-popup-request': 'Popup request cancelled',
    'auth/popup-blocked': 'Popup window was blocked by the browser',
    'auth/popup-closed-by-user': 'Popup window closed by the user',
    'auth/operation-not-supported-in-this-environment': 'Operation not supported in this environment',
    'auth/internal-error': 'An internal error occurred',
    'auth/network-request-failed': 'Network error occurred',
  }
  return errorMessages[errorCode] || 'An authentication error occurred'
}
