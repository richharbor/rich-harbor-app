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
import { getPartnerDetailsbyId } from "@/services/Role/partnerServices"
import useAuthStore from "@/helpers/authStore"
import App from "next/app"
import ApplicationDialog from "./ApplicationDialog"
import { set } from "zod"

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

interface Booking {
  id: number;
  sellId: number;
  buyerId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  sell: Sell;
  buyer: Buyer;
}


export default function BookingTable() {
  const [bookings, setBookings] = useState<Booking[] | []>([])
  const [open, setOpen] = useState(false);
  const franchiseId = useAuthStore((state) => state.user?.franchiseId);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);

  // const handleCloseDeal = (id: number) => {
  //   alert(`Deal closed for booking ID: ${id}`)
  // }

  // const handleDiscard = (id: number) => {
  //   const updated = data.filter((item) => item.id !== id)
  //   setData(updated)
  // }

  useEffect(() => {
    fetchAllBookings();
  }, [])

  const fetchAllBookings = async () => {
    try {
      const response = await getAllbookings();
      console.log("Bookings data:", response);

      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }
  const fetchPartnersDetailbyId = async (userId: number, fid?: number) => {
    setIsFetching(true);
    try {
      const response = await getPartnerDetailsbyId({
        userId: userId,
        franchiseId: fid || franchiseId!,
      });

      // const formatted: PartnerRow[] = data.applications.map((app: any) => ({
      //   id: app.user.id,
      //   userId: app.userId,
      //   name:
      //     app.formData?.step2?.name ||
      //     app.formData?.step1?.fullName ||
      //     `${app.user?.firstName || ""} ${app.user?.lastName || ""}`.trim(),
      //   email: app.user?.email,
      //   state: app.formData?.step2?.state || "N/A",
      //   role: app.requestedRole.name,
      //   registrationStep: app.currentStep || 0,
      //   status: app.status,
      //   createdAt: app.createdAt,
      //   application: app,
      // }));
      setUserDetails(response.applications);
      // setPartners(formatted);
    } catch (err) {
      console.error("Error fetching partners", err);
      // toast.error("Failed to fetch partners");
    } finally {
      setIsFetching(false);
    }
  };

  const handleSellerDetail = (userId: number) => {
     setOpen(true);
    fetchPartnersDetailbyId(userId);
   
    
  }
  const handleBuyerDetail = (userId: number) => {
    setOpen(true);
    fetchPartnersDetailbyId(userId);
    
  }

  useEffect(() => {
    console.log("Bookings state updated:", bookings);
  }, [bookings])

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
                <TableHead>Available Quantity</TableHead>
                <TableHead>Require Quantity</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((row) => (
                <TableRow key={row.id}>
                  <TableCell onClick={() => handleSellerDetail(row.sell.seller.id)}>{row.sell.seller.firstName} {row.sell.seller.lastName}</TableCell>
                  <TableCell className="cursor-pointer" onClick={() => handleBuyerDetail(row.buyerId)}>{row.buyer.firstName} {row.buyer.lastName}</TableCell>
                  <TableCell>{row.sell.share.name}</TableCell>
                  <TableCell>₹{row.sell.sellingPrice}</TableCell>
                  <TableCell>₹{row.sell.actualPrice}</TableCell>
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
              {bookings.length === 0 && (
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

      <ApplicationDialog isFetching={isFetching} open={open} onClose={setOpen} data={userDetails} />
    </div>
  )
}
