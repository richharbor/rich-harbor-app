export interface User {
  id: string
  name: string
  email: string
  role: 'superadmin' | 'admin'
  partnerId?: string
  status: 'active' | 'pending' | 'blocked'
}

export interface Trade {
  id: string
  shareName: string
  quantity: number
  price: number
  expectedPrice?: number
  type: 'buying' | 'selling'
  direct: boolean
  buyerEntity: 'individual' | 'broker' | 'institution'
  blocking: boolean
  status: 'open' | 'closed'
  createdAt: string
  partnerId?: string
}

export interface Partner {
  id: string
  name: string
  state: string
  aadharCard: string
  panCard: string
  email: string
  mobile: string
  bankName: string
  accountNumber: string
  ifscCode: string
  address: {
    country: string
    state: string
    addressLine1: string
    addressLine2: string
    city: string
    zipCode: string
  }
  documents: {
    cmlCopy?: string
    panCard?: string
    cancelCheque?: string
    signature?: string
    agreement?: string
  }
  registrationStep: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}
