import { BaseDocument, CashierStatus } from '../types'

export interface Cashier extends BaseDocument {
  uid: string
  storeId: string
  phone: string
  employeeId: string
  salary: number
  hireDate: Date | FirebaseFirestore.Timestamp
  status: CashierStatus
}

export interface CreateCashierInput {
  uid: string
  storeId: string
  phone: string
  employeeId: string
  salary: number
  hireDate: Date
}

export interface UpdateCashierInput {
  phone?: string
  salary?: number
  status?: CashierStatus
}
