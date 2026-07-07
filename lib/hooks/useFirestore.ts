'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  collection,
  query,
  where,
  onSnapshot,
  QueryConstraint,
  DocumentData,
  Query,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

interface UseFirestoreOptions {
  filters?: Array<{ field: string; operator: any; value: any }>
  limit?: number
}

export function useFirestore<T extends DocumentData>(
  collectionName: string,
  options?: UseFirestoreOptions
) {
  const [data, setData] = useState<(T & { id: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const constraints: QueryConstraint[] = []

      // Add filters
      if (options?.filters) {
        options.filters.forEach((filter) => {
          constraints.push(where(filter.field, filter.operator, filter.value))
        })
      }

      const q = query(collection(db, collectionName), ...constraints)

      // Set up real-time listener
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const documents = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as (T & { id: string })[]

          setData(documents)
          setLoading(false)
        },
        (err) => {
          console.error(`Error fetching ${collectionName}:`, err)
          setError(err.message)
          setLoading(false)
        }
      )

      return () => unsubscribe()
    } catch (err) {
      console.error(`Error setting up listener for ${collectionName}:`, err)
      setError(String(err))
      setLoading(false)
    }
  }, [collectionName, options])

  return { data, loading, error }
}
