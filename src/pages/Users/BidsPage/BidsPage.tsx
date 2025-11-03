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
import useAuthStore from "@/helpers/authStore"
import { getPartnerDetailsbyId } from "@/services/Role/partnerServices"
import ApplicationDialog from "../Bookings/ApplicationDialog"
import Loading from "@/app/loading"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { CircleQuestionMark } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
  const [loading, setLoading] = useState(false);
  const [bids, setBids] = useState<Bids[] | []>([])
  const [details, setDetails] = useState<Bids | null>(null);
  const [open, setOpen] = useState(false);
  const franchiseId = useAuthStore((state) => state.user?.franchiseId);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [userProfile, setUserProfile] = useState<string>("");


  // const handleCloseDeal = (id: number) => {
  //   alert(`Deal closed for booking ID: ${id}`)
  // }

  // const handleDiscard = (id: number) => {
  //   const updated = data.filter((item) => item.id !== id)
  //   setData(updated)
  // }

  useEffect(() => {
    fetchAllBids();
  }, [])

  const fetchAllBids = async () => {
    setLoading(true);
    try {
      const response = await getAllBids();
      setBids(response.data);
    } catch (error) {
      console.error("Error fetching bids:", error);
    } finally {
      setLoading(false);
    }
  }

  const fetchPartnersDetailbyId = async (userId: number, fid?: number) => {
    setIsFetching(true);
    try {
      const response = await getPartnerDetailsbyId({
        userId: userId,
        franchiseId: fid || franchiseId!,
      });
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
    setUserProfile("Seller");
    fetchPartnersDetailbyId(userId);


  }
  const handleBuyerDetail = (userId: number) => {
    setOpen(true);
    setUserProfile("Buyer");
    fetchPartnersDetailbyId(userId);
  }


  if (loading) {
    return (
      <div className="h-[calc(100vh-4.7rem)] flex flex-col relative overflow-hidden rounded-md">
        <Loading areaOnly={true} />
      </div>
    );
  }


  return (
    <div className="p-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Bids Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>All recent bids records.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Seller Name</TableHead>
                <TableHead>Buyer Name</TableHead>
                <TableHead>Stock Name</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead>Actual Price</TableHead>
                <TableHead>Bid Price</TableHead>
                <TableHead>Share in Stock</TableHead>
                <TableHead>Available Quantity</TableHead>
                <TableHead>Require Quantity</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bids.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="cursor-pointer hover:underline" onClick={() => handleSellerDetail(row.sell.seller.id)}>{row.sell.seller.firstName} {row.sell.seller.lastName}</TableCell>
                  <TableCell className="cursor-pointer hover:underline" onClick={() => handleBuyerDetail(row.buyerId)}>{row.bidder.firstName} {row.bidder.lastName}</TableCell>
                  <TableCell>{row.sell.share.name}</TableCell>
                  <TableCell>₹{row.sell.sellingPrice}</TableCell>
                  <TableCell>₹{row.sell.actualPrice}</TableCell>
                  <TableCell>₹{row.bidPrice}</TableCell>
                  <TableCell onClick={() => setDetails(row)}>{row.sell.shareInStock ? 'Yes' : 'No'}
                    {!row.sell.shareInStock && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-flex relative top-0.5 items-center ml-2">
                            <CircleQuestionMark className="h-4 w-4" />
                          </span>
                        </TooltipTrigger>

                        <TooltipContent>
                          End seller details
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </TableCell>
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

      <ApplicationDialog userProfile={userProfile} isFetching={isFetching} open={open} onClose={setOpen} data={userDetails} />


      {/* End seller detail dialog */}
      <Dialog
        open={details !== null}
        onOpenChange={(open) => {
          if (!open) setDetails(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>End Seller Details</DialogTitle>
          </DialogHeader>

          {details && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>{details.sell.endSellerName || "N/A"}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Profile:</span>
                <span>{details.sell.endSellerProfile || "N/A"}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Location:</span>
                <span>{details.sell.endSellerLocation || "N/A"}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
