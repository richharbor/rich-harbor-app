'use client'
import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getAllbookings } from "@/services/purchase/bookingService"
import { getAllBids } from "@/services/purchase/bidsService"

interface Share {
  id: number;
  name: string;
  symbol: string | null;
  price: string;
  market_cap: string | null;
  volume: string | null;
  sector: string | null;
  exchange: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Seller {
  id: number;
  firstName: string;
  lastName: string;
}

interface Sell {
  id: number;
  userId: number;
  shareId: number;
  actualPrice: string;
  sellingPrice: string;
  quantityAvailable: number;
  minimumOrderQuatity: number;
  shareInStock: boolean;
  preShareTransfer: boolean;
  fixedPrice: boolean;
  confirmDelivery: boolean;
  deliveryTimeline: string;
  endSellerLocation: string;
  endSellerName: string;
  endSellerProfile: string;
  createdAt: string;
  updatedAt: string;
  share: Share;
  seller: Seller;
}

interface Buyer {
  id: number;
  firstName: string;
  lastName: string;
}

interface Bids {
  id: number;
  sellId: number;
  buyerId: number;
  quantity: number;
  bidPrice: number;
  createdAt: string;
  updatedAt: string;
  sell: Sell;
  bidder: Buyer;
}


export default function BookingTable() {
  const [bids, setBids] = useState<Bids[] | []>([])

  // const handleCloseDeal = (id: number) => {
  //   alert(`Deal closed for booking ID: ${id}`)
  // }

  // const handleDiscard = (id: number) => {
  //   const updated = data.filter((item) => item.id !== id)
  //   setData(updated)
  // }

  useEffect(() =>{
    fetchAllBids();
  },[])

  const fetchAllBids = async () =>{
    try {
      const response = await getAllBids();
      console.log("Bookings data:", response);

      setBids(response.data);
    } catch (error) {
      console.error("Error fetching bids:", error);
    }
  }

  useEffect(() =>{
    console.log("Bookings state updated:", bids);
  },[bids])

  return (
    <div className="p-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Bookings Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>All recent booking records.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Seller Name</TableHead>
                <TableHead>Buyer Name</TableHead>
                <TableHead>Stock Name</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead>Actual Price</TableHead>
                <TableHead>Bid Price</TableHead>
                <TableHead>Available Quantity</TableHead>
                <TableHead>Require Quantity</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bids.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.sell.seller.firstName} {row.sell.seller.lastName}</TableCell>
                  <TableCell>{row.bidder.firstName} {row.bidder.lastName}</TableCell>
                  <TableCell>{row.sell.share.name}</TableCell>
                  <TableCell>₹{row.sell.sellingPrice}</TableCell>
                  <TableCell>₹{row.sell.actualPrice}</TableCell>
                  <TableCell>₹{row.bidPrice}</TableCell>
                  <TableCell>{row.sell.quantityAvailable}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      // onClick={() => handleCloseDeal(row.id)}
                    >
                      Close Deal
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      // onClick={() => handleDiscard(row.id)}
                    >
                      Discard
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {bids.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No bookings available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
