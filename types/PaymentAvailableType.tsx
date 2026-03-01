export type PaymentType = 'BANK' | 'WALLET' | 'QRIS'

export interface PaymentAvailableData {
    id: number
    name: string
    accountNumber: string
    accountName: string
    image: string
    description: string
    type: PaymentType
    isActive: boolean
    createdAt: string
    updatedAt: string
    _count?: { payments: number }
}

export interface PaymentAvailableFormData {
    name: string
    accountNumber: string
    accountName: string
    image: string
    description: string
    type: PaymentType
    isActive: boolean
}
