'use client'

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { ServiceResponse, FilterOptions, QueryOptions } from '../types'

function removeUndefinedFields<T extends Record<string, unknown>>(data: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  ) as Partial<T>
}

export class FirestoreService {
  private collectionName: string

  constructor(collectionName: string) {
    this.collectionName = collectionName
  }

  /**
   * Get a single document by ID
   */
  async getById<T extends DocumentData>(id: string): Promise<ServiceResponse<T>> {
    try {
      const docRef = doc(db, this.collectionName, id)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        return { success: false, error: 'Document not found' }
      }

      return {
        success: true,
        data: { ...docSnap.data(), id: docSnap.id } as unknown as T,
      }
    } catch (error) {
      console.error(`Error getting document from ${this.collectionName}:`, error)
      return { success: false, error: String(error) }
    }
  }

  /**
   * Get all documents with optional filtering and ordering
   */
  async getAll<T extends DocumentData>(
    filters?: FilterOptions[],
    options?: QueryOptions
  ): Promise<ServiceResponse<T[]>> {
    try {
      const constraints: QueryConstraint[] = []

      // Add filters
      if (filters && filters.length > 0) {
        filters.forEach((filter) => {
          constraints.push(where(filter.field, filter.operator, filter.value))
        })
      }

      // Add ordering
      if (options?.orderBy) {
        constraints.push(orderBy(options.orderBy, options.orderDirection || 'asc'))
      }

      // Add limit
      if (options?.limit) {
        constraints.push(limit(options.limit))
      }

      const q = query(collection(db, this.collectionName), ...constraints)
      const querySnapshot = await getDocs(q)

      const documents: T[] = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as unknown as T[]

      return { success: true, data: documents }
    } catch (error) {
      console.error(`Error getting documents from ${this.collectionName}:`, error)
      return { success: false, error: String(error) }
    }
  }

  /**
   * Create a new document
   */
  async create<T extends DocumentData>(data: T): Promise<ServiceResponse<T & { id: string }>> {
    try {
      const now = new Date()
      const docData = {
        ...removeUndefinedFields(data),
        createdAt: now,
        updatedAt: now,
      }

      const docRef = await addDoc(collection(db, this.collectionName), docData)

      return {
        success: true,
        data: { ...docData, id: docRef.id } as unknown as T & { id: string },
      }
    } catch (error) {
      console.error(`Error creating document in ${this.collectionName}:`, error)
      return { success: false, error: String(error) }
    }
  }

  /**
   * Update a document
   */
  async update<T extends DocumentData>(id: string, data: Partial<T>): Promise<ServiceResponse<void>> {
    try {
      const docRef = doc(db, this.collectionName, id)
      const updateData = {
        ...removeUndefinedFields(data),
        updatedAt: new Date(),
      }

      await updateDoc(docRef, updateData as any)

      return { success: true }
    } catch (error) {
      console.error(`Error updating document in ${this.collectionName}:`, error)
      return { success: false, error: String(error) }
    }
  }

  /**
   * Soft delete a document (sets status to 'deleted')
   */
  async softDelete(id: string): Promise<ServiceResponse<void>> {
    try {
      const docRef = doc(db, this.collectionName, id)
      await updateDoc(docRef, {
        status: 'deleted',
        updatedAt: new Date(),
      })

      return { success: true }
    } catch (error) {
      console.error(`Error soft deleting document in ${this.collectionName}:`, error)
      return { success: false, error: String(error) }
    }
  }

  /**
   * Hard delete a document (permanent)
   */
  async hardDelete(id: string): Promise<ServiceResponse<void>> {
    try {
      const docRef = doc(db, this.collectionName, id)
      await deleteDoc(docRef)

      return { success: true }
    } catch (error) {
      console.error(`Error hard deleting document in ${this.collectionName}:`, error)
      return { success: false, error: String(error) }
    }
  }
}
