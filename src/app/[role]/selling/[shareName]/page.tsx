import React from 'react'
import AddStockPage from '@/pages/Users/Selling/AddShare/AddShare'

interface PageProps {
  params: {
    shareName: string
  }
}

const page = ({ params }: PageProps) => {
  const { shareName } = params
  return (
    <AddStockPage shareName = {shareName} />
  )
}

export default page